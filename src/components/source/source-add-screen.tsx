// TODO typesafe the form data
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {Document, Page, pdfjs} from 'react-pdf';
import React, {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Activity, FileText, Loader2, Plus, Trash2, User} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import useSWR from "swr";
import {HealthData, HealthDataCreateResponse, HealthDataListResponse} from "@/app/api/health-data/route";
import DynamicForm from '../form/dynamic-form';
import JSONEditor from '../form/json-editor';
import cuid from "cuid";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import testItems from '@/lib/health-data/parser/test-items.json'
import TextInput from "@/components/form/text-input";
import Select from 'react-select';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface BoundingBox {
    vertices: { x: number, y: number }[]
}

interface Word {
    boundingBox: BoundingBox,
    confidence: number,
    id: number,
    text: string,
}

interface SymptomsData {
    date: string;
    description: string;
}

interface Field {
    key: string;
    label?: string;
    type: string;
    fields?: Field[];
    options?: { value: string; label: string }[];
    defaultValue?: string;
    placeholder?: string;
}

interface AddSourceDialogProps {
    onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    onAddSymptoms: (date: string) => void;
}

interface HealthDataItemProps {
    healthData: HealthData;
    isSelected: boolean;
    onClick: () => void;
    onDelete: (id: string) => void;
}

interface HealthDataPreviewProps {
    healthData: HealthData;
    formData: Record<string, any>;
    setFormData: (data: Record<string, any>) => void;
}

const HealthDataType = {
    FILE: {
        id: 'FILE',
        name: 'File'
    },
    PERSONAL_INFO: {
        id: 'PERSONAL_INFO',
        name: 'Personal Info'
    },
    SYMPTOMS: {
        id: 'SYMPTOMS',
        name: 'Symptoms'
    }
};

const personalInfoFields: Field[] = [
    {key: 'name', label: 'Name', type: 'text'},
    {key: 'birthDate', label: 'Birth Date', type: 'date'},
    {
        key: 'height',
        label: 'Height',
        type: 'compound',
        fields: [
            {key: 'value', type: 'number', placeholder: 'Height'},
            {
                key: 'unit',
                type: 'select',
                options: [
                    {value: 'cm', label: 'cm'},
                    {value: 'ft', label: 'ft'}
                ],
                defaultValue: 'cm'
            }
        ]
    },
    {
        key: 'weight',
        label: 'Weight',
        type: 'compound',
        fields: [
            {key: 'value', type: 'number', placeholder: 'Weight'},
            {
                key: 'unit',
                type: 'select',
                options: [
                    {value: 'kg', label: 'kg'},
                    {value: 'lbs', label: 'lbs'}
                ],
                defaultValue: 'kg'
            }
        ]
    },
    {
        key: 'bloodType',
        label: 'Blood Type',
        type: 'select',
        options: [
            {value: 'A+', label: 'A+'},
            {value: 'A-', label: 'A-'},
            {value: 'B+', label: 'B+'},
            {value: 'B-', label: 'B-'},
            {value: 'O+', label: 'O+'},
            {value: 'O-', label: 'O-'},
            {value: 'AB+', label: 'AB+'},
            {value: 'AB-', label: 'AB-'}
        ]
    },
    {key: 'familyHistory', label: 'Family History', type: 'textarea'}
];

const symptomsFields: Field[] = [
    {key: 'date', label: 'Date', type: 'date'},
    {key: 'description', label: 'Description', type: 'textarea'}
];


const AddSourceDialog: React.FC<AddSourceDialogProps> = ({onFileUpload, onAddSymptoms}) => {
    const [open, setOpen] = useState(false);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        onFileUpload(e);
        setOpen(false);
    };

    const handleAddSymptoms = () => {
        const today = new Date().toISOString().split('T')[0];
        onAddSymptoms(today);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex gap-2 items-center">
                    <Plus className="w-4 h-4"/>
                    Add Source
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Source</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 min-w-[300px]">
                    <label
                        htmlFor="file-upload"
                        className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                        <FileText className="w-6 h-6 text-gray-500"/>
                        <div className="flex-1">
                            <h3 className="font-medium">Upload Files</h3>
                            <p className="text-sm text-gray-500">Add images or PDF files</p>
                        </div>
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileUpload}
                    />

                    <button
                        className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 w-full"
                        onClick={handleAddSymptoms}
                    >
                        <Activity className="w-6 h-6 text-gray-500"/>
                        <div className="flex-1 text-left">
                            <h3 className="font-medium">New Symptoms</h3>
                            <p className="text-sm text-gray-500">Record today&#39;s symptoms</p>
                        </div>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const HealthDataItem: React.FC<HealthDataItemProps> = ({healthData, isSelected, onClick, onDelete}) => {
    const getIcon = (type: string) => {
        switch (type) {
            case HealthDataType.FILE.id:
                return <FileText className="h-5 w-5"/>;
            case HealthDataType.PERSONAL_INFO.id:
                return <User className="h-5 w-5"/>;
            case HealthDataType.SYMPTOMS.id:
                return <Activity className="h-5 w-5"/>;
            default:
                return <FileText className="h-5 w-5"/>;
        }
    };

    const getName = (type: string) => {
        if (type === HealthDataType.SYMPTOMS.id && healthData.data) {
            const data = healthData.data as unknown as SymptomsData;
            return `${HealthDataType.SYMPTOMS.name} (${data.date})`;
        }
        if (type === HealthDataType.FILE.id && healthData.data) {
            const data = healthData.data as any;
            return data.fileName || HealthDataType.FILE.name;
        }
        return Object.values(HealthDataType)
            .find((t) => t.id === type)?.name || '';
    };

    return (
        <div
            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all
${isSelected
                ? 'text-primary text-base font-semibold bg-primary/5'
                : 'text-sm hover:bg-gray-50'}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-shrink-0">
                    {getIcon(healthData.type)}
                </div>
                <span className="truncate">{getName(healthData.type)}</span>
            </div>
            <div className="flex items-center gap-1">
                {healthData.status === 'PARSING' && (
                    <Loader2 className="h-5 w-5 animate-spin"/>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(healthData.id);
                    }}
                >
                    <Trash2 className="h-5 w-5"/>
                </Button>
            </div>
        </div>
    );
};

const HealthDataPreview = ({healthData, formData, setFormData}: HealthDataPreviewProps) => {
    const [numPages, setNumPages] = useState(0);
    const [page, setPage] = useState<number>(1);
    const [focusedItem, setFocusedItem] = useState<string | null>(null);
    const [inputFocusStates, setInputFocusStates] = useState<{ [key: string]: boolean }>({});
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const [showAddFieldModal, setShowAddFieldModal] = useState<boolean>(false);
    const [showAddFieldName, setShowAddFieldName] = useState<{
        value: string;
        label: string;
        isDisabled?: boolean
    } | undefined>(undefined);

    const [userBloodTestResults, setUserBloodTestResults] = useState<{
        test_result: { [key: string]: { value: string, unit: string } }
    } | null>(null);

    const [userBloodTestResultsPage, setUserBloodTestResultsPage] = useState<{
        [key: string]: { page: number }
    } | null>(null);

    const {ocr, dataPerPage: sourceDataPerPage} = (healthData.metadata || {}) as {
        ocr?: any,
        dataPerPage?: any
    };
    const [dataPerPage, setDataPerPage] = useState(sourceDataPerPage)

    const allInputsBlurred = Object.values(inputFocusStates).every((isFocused) => !isFocused);

    const handleFocus = (name: string) => {
        setFocusedItem(name);
        setInputFocusStates((prev) => ({...prev, [name]: true}));
    };

    const handleBlur = (name: string) => {
        if (focusedItem === name) setFocusedItem(null);
        setInputFocusStates((prev) => ({...prev, [name]: false}));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, name: string) => {
        if (event.key === 'Enter') {
            const inputNames = Object.keys(inputRefs.current);
            const currentIndex = inputNames.indexOf(name);
            const nextInput = inputRefs.current[inputNames[currentIndex + 1]];
            if (nextInput) {
                nextInput.focus();
            } else {
                event.currentTarget.blur();
            }

        }
    };

    const getNearestBoundingBox = (a: BoundingBox, b: BoundingBox): number => {
        const aCenter = {
            x: a.vertices.reduce((acc, cur) => acc + cur.x, 0) / a.vertices.length,
            y: a.vertices.reduce((acc, cur) => acc + cur.y, 0) / a.vertices.length,
        }

        const bCenter = {
            x: b.vertices.reduce((acc, cur) => acc + cur.x, 0) / b.vertices.length,
            y: b.vertices.reduce((acc, cur) => acc + cur.y, 0) / b.vertices.length,
        }

        const aDistance = Math.sqrt(Math.pow(aCenter.x, 2) + Math.pow(aCenter.y, 2));
        const bDistance = Math.sqrt(Math.pow(bCenter.x, 2) + Math.pow(bCenter.y, 2));

        return aDistance - bDistance;
    }

    const getFocusedWords = useCallback((page: number, keyword: string): Word[] => {
        if (!keyword) return [];
        if (!ocr) return [];
        const ocrPageData: { words: Word[] } = ocr.pages[page - 1];
        if (!ocrPageData) return [];
        let eFields = ocrPageData.words.filter((word) => word.text === keyword)
        if (eFields.length === 0) {
            eFields = ocrPageData.words.filter((word) => word.text.includes(keyword))
        }
        return eFields.sort((a, b) => getNearestBoundingBox(a.boundingBox, b.boundingBox));
    }, [ocr]);

    const currentPageTestResults = useMemo(() => {
        if (!dataPerPage) return {};

        const {test_result} = dataPerPage[page - 1] as {
            test_result: { [key: string]: { value: string, unit: string } }
        }
        return test_result
    }, [page, dataPerPage]);

    const sortedPageTestResults = useMemo(() => {
        return testItems
            .filter((item) => Object.entries(currentPageTestResults).some(([key, _]) => key === item.name))
            .sort((a, b) => {
                const aFocusedWords = userBloodTestResults?.test_result[a.name] ? getFocusedWords(page, userBloodTestResults?.test_result[a.name].value) : [];
                const bFocusedWords = userBloodTestResults?.test_result[b.name] ? getFocusedWords(page, userBloodTestResults?.test_result[b.name].value) : [];

                // focused words 에 좌표 정보가 없는게 있으면 가장 마지막 인덱스로 보내기
                if (aFocusedWords.length === 0) return 1;
                if (bFocusedWords.length === 0) return -1;

                return getNearestBoundingBox(aFocusedWords[0].boundingBox, bFocusedWords[0].boundingBox);
            })
    }, [getFocusedWords, page, healthData, dataPerPage])

    const getFields = (): Field[] => {
        switch (healthData.type) {
            case HealthDataType.PERSONAL_INFO.id:
                return personalInfoFields;
            case HealthDataType.SYMPTOMS.id:
                return symptomsFields;
            default:
                return [];
        }
    };

    const handleFormChange = (key: string, value: any) => {
        const newData = {...formData, [key]: value};
        setFormData(newData);
    };

    const handleJSONSave = (newData: Record<string, any>) => {
        setFormData(newData);
    };

    const onDocumentLoadSuccess = async ({numPages}: pdfjs.PDFDocumentProxy) => {
        setNumPages(numPages);
        setUserBloodTestResults(JSON.parse(JSON.stringify(healthData.data)));

        if (dataPerPage) {
            const testResultsPage: {
                [key: string]: { page: number }
            } = {}
            for (let i = 0; i < dataPerPage.length; i++) {
                const {test_result} = dataPerPage[i] as {
                    test_result: { [key: string]: { value: string, unit: string } }
                }
                for (const [key,] of Object.entries(test_result)) {
                    testResultsPage[key] = {page: i}
                }
            }
            setUserBloodTestResultsPage(testResultsPage);
        }
    }

    useEffect(() => {
        let focusedWords: Word[];

        if (userBloodTestResultsPage && focusedItem !== null) {
            const resultPage = userBloodTestResultsPage[focusedItem];
            const result = userBloodTestResults?.test_result[focusedItem];
            if (!resultPage || !result) return;
            const {page} = resultPage;
            focusedWords = getFocusedWords(page, result.value);
        } else {
            focusedWords = Object.entries(currentPageTestResults).map(([_, value]) => {
                return getFocusedWords(page, value.value);
            }).flat();
        }

        if (focusedWords && ocr) {
            const ocrPageMetadata = ocr.metadata.pages[page - 1];

            // pdf canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const element: HTMLElement | null = document.querySelector(`div[data-page-number="${page}"]`);
            if (!element) return;

            const pageElement = element.querySelector('canvas');
            if (!pageElement) return;

            canvas.width = pageElement.width;
            canvas.height = pageElement.height;
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = pageElement.style.width;
            canvas.style.height = pageElement.style.height;

            ctx.drawImage(pageElement, 0, 0);

            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;

            const paddingX = 5;
            const paddingY = 5;

            focusedWords.forEach((word) => {
                const {vertices} = word.boundingBox;

                const originalHeight = ocrPageMetadata.height;
                const originalWidth = ocrPageMetadata.width;

                const canvasWidth = pageElement.width;
                const canvasHeight = pageElement.height;

                const scaleX = canvasWidth / originalWidth;
                const scaleY = canvasHeight / originalHeight;

                ctx.beginPath();
                ctx.moveTo(vertices[0].x * scaleX - paddingX, vertices[0].y * scaleY - paddingY);
                ctx.lineTo(vertices[1].x * scaleX + paddingX, vertices[1].y * scaleY - paddingY);
                ctx.lineTo(vertices[2].x * scaleX + paddingX, vertices[2].y * scaleY + paddingY);
                ctx.lineTo(vertices[3].x * scaleX - paddingX, vertices[3].y * scaleY + paddingY);
                ctx.closePath();
                ctx.stroke();
            });

            element.style.position = 'relative';
            element.appendChild(canvas);

            return () => {
                element.removeChild(canvas);
            };
        }

    }, [focusedItem, getFocusedWords, ocr, userBloodTestResults?.test_result, allInputsBlurred, page]);

    useEffect(() => {
        document.querySelector('#test-result')?.scrollTo(0, 0);
        document.querySelector('#pdf')?.scrollTo(0, 0);
    }, [page]);

    return (
        <>
            <div className="flex flex-col gap-4 h-full">
                <div className="h-[40%] min-h-[300px]">
                    <div className="bg-white h-full overflow-y-auto rounded-lg border">
                        {(healthData.type === HealthDataType.PERSONAL_INFO.id || healthData.type === HealthDataType.SYMPTOMS.id) ? (
                            <div className="p-4">
                                <DynamicForm
                                    fields={getFields()}
                                    data={formData}
                                    onChange={handleFormChange}
                                />
                            </div>
                        ) : healthData.type === HealthDataType.FILE.id ? (
                            healthData.fileType?.includes('image') && healthData.filePath ? (
                                <div className="p-4">
                                    <Image
                                        src={healthData.filePath}
                                        alt="Preview"
                                        className="w-full h-auto"
                                        width={800}
                                        height={600}
                                        unoptimized
                                        style={{objectFit: 'contain'}}
                                    />
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-lg relative flex flex-row h-full">
                                    <div id="pdf" className="w-[60%] overflow-y-auto h-full">
                                        <Document file={healthData.filePath}
                                                  className="w-full"
                                                  onLoadSuccess={onDocumentLoadSuccess}>
                                            {Array.from(new Array(numPages), (_, index) => {
                                                return (
                                                    <Page
                                                        className={cn(
                                                            'w-full',
                                                            {hidden: index + 1 !== page}
                                                        )}
                                                        key={`page_${index + 1}`}
                                                        pageNumber={index + 1}
                                                        renderAnnotationLayer={false}
                                                        renderTextLayer={false}
                                                    />
                                                );
                                            })}
                                        </Document>
                                        <div
                                            className="relative w-fit bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white p-2 rounded shadow">
                                            <button
                                                className="px-4 py-2 bg-gray-300 rounded"
                                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={page <= 1}
                                            >
                                                <FaChevronLeft/>
                                            </button>
                                            <span>{page} / {numPages}</span>
                                            <button
                                                className="px-4 py-2 bg-gray-300 rounded"
                                                onClick={() => setPage((prev) => Math.min(prev + 1, numPages))}
                                                disabled={page >= numPages}
                                            >
                                                <FaChevronRight/>
                                            </button>
                                        </div>
                                    </div>
                                    {userBloodTestResults?.test_result && <div
                                        id="test-result"
                                        className="w-[40%] overflow-y-auto p-4">
                                        {sortedPageTestResults.map((item) =>
                                            <TextInput
                                                key={item.name}
                                                name={item.name.replace(/(^\w|_\w)/g, (match) => match.replace('_', '').toUpperCase())}
                                                label={item.description}
                                                value={
                                                    userBloodTestResults && userBloodTestResults.test_result ? userBloodTestResults.test_result[item.name]?.value : ''
                                                }
                                                onChange={(v) => {
                                                    setUserBloodTestResults((prev) => {
                                                        return {
                                                            ...prev,
                                                            test_result: {
                                                                ...prev?.test_result,
                                                                [item.name]: {
                                                                    ...prev?.test_result[item.name],
                                                                    value: v.target.value,
                                                                }
                                                            }
                                                        } as any;
                                                    });
                                                    setFormData({
                                                        ...formData,
                                                        test_result: {
                                                            ...formData?.test_result,
                                                            [item.name]: {
                                                                ...formData?.test_result[item.name],
                                                                value: v.target.value,
                                                            }
                                                        }
                                                    })
                                                }}
                                                onDelete={() => {
                                                    setUserBloodTestResults((prev) => {
                                                        const {test_result} = prev ?? {test_result: {}};
                                                        delete test_result[item.name];
                                                        return {test_result};
                                                    });

                                                    // Delete From FormData
                                                    delete formData.test_result[item.name]
                                                    setFormData(formData)

                                                    // Delete From Metadata
                                                    const data = dataPerPage[page - 1]
                                                    delete data.test_result[item.name]
                                                    setDataPerPage((prev) => {
                                                        return prev.map((d, i) => {
                                                            if (i === page - 1) {
                                                                return data
                                                            }
                                                            return d
                                                        })
                                                    })
                                                }}
                                                onBlur={(v) => handleBlur(item.name)}
                                                onFocus={(v) => handleFocus(item.name)}
                                                onKeyDown={(e) => handleKeyDown(e, item.name)}
                                                ref={(el) => {
                                                    inputRefs.current[item.name] = el;
                                                }}
                                            />)}

                                        {healthData &&
                                            <div className="mt-4 w-full">
                                                <button
                                                    className="w-full py-2 bg-blue-500 text-white rounded"
                                                    onClick={() => {
                                                        setShowAddFieldName(undefined);
                                                        setShowAddFieldModal(true);
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        }
                                    </div>}
                                </div>
                            )
                        ) : null}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="bg-white rounded-lg border h-full flex flex-col gap-4">
                        <div className="flex-1 min-h-0 p-4">
                            <JSONEditor
                                data={formData}
                                onSave={handleJSONSave}
                                isEditable={healthData.type === HealthDataType.FILE.id && healthData.status === 'COMPLETED'}
                            />
                        </div>
                        {healthData.type === HealthDataType.FILE.id && formData.parsingLogs && (
                            <div className="border-t">
                                <div className="p-4">
                                    <h3 className="text-sm font-medium mb-2">Processing Log</h3>
                                    <div
                                        className="h-[160px] bg-gray-50 p-3 rounded-lg text-sm font-mono overflow-y-auto">
                                        {(formData.parsingLogs as string[]).map((log, index) => (
                                            <div key={index} className="mb-1">
                                                {log}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showAddFieldModal && <div
                className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
                {/* Input modal for adding, searchable dropdown to select a field, with confirm and cancel buttons */}
                <div className="bg-white p-4 rounded-lg flex flex-col w-[50vw]">
                    <p className="mb-4 font-bold">
                        Please select a field to add
                    </p>
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isDisabled={false}
                        isLoading={false}
                        isClearable={true}
                        isRtl={false}
                        isSearchable={true}
                        name="field"
                        options={testItems.map((bloodTestItem) => (
                            {
                                value: bloodTestItem.name,
                                label: `${bloodTestItem.name} (${bloodTestItem.description})`,
                                isDisabled: Object.entries(userBloodTestResults?.test_result ?? {}).filter(([_, value]) => value).map(([key, _]) => key).includes(bloodTestItem.name),
                            }
                        ))}
                        value={showAddFieldName}
                        onChange={(selectedOption) => {
                            if (selectedOption) {
                                setShowAddFieldName(selectedOption);
                            } else {
                                setShowAddFieldName(undefined);
                            }
                        }}
                    />
                    <div className="flex flex-row gap-2 mt-4">
                        <p className={
                            cn(
                                'bg-blue-500 text-white py-2 px-4 rounded',
                                'hover:bg-blue-600',
                                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                            )
                        }
                           onClick={() => {
                               if (showAddFieldName) {
                                   const value = showAddFieldName.value

                                   setUserBloodTestResultsPage((prev) => {
                                       return {
                                           ...prev,
                                           [value]: {page: page - 1}
                                       }
                                   })

                                   setUserBloodTestResults((prev) => {
                                       return {
                                           test_result: {
                                               ...prev?.test_result,
                                               [value]: {
                                                   value: '',
                                                   unit: '',
                                               }
                                           }
                                       } as any;
                                   });

                                   setDataPerPage(
                                       dataPerPage.map((d, i) => {
                                           if (i === page - 1) {
                                               return {
                                                   ...d,
                                                   test_result: {
                                                       ...d.test_result,
                                                       [value]: {
                                                           value: '',
                                                           unit: '',
                                                       }
                                                   }
                                               }
                                           }
                                           return d
                                       })
                                   )

                                   setFormData(
                                       {
                                           ...formData,
                                           test_result: {
                                               ...formData?.test_result,
                                               [value]: {
                                                   value: '',
                                                   unit: '',
                                               }
                                           }
                                       }
                                   )

                               }
                               setShowAddFieldModal(false);
                           }}
                        >Add
                        </p>
                        <p className={
                            cn(
                                'bg-gray-300 text-black py-2 px-4 rounded',
                                'hover:bg-gray-400',
                                'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50',
                            )
                        }
                           onClick={() => setShowAddFieldModal(false)}
                        >Cancel</p>
                    </div>
                </div>
            </div>
            }
        </>
    );
};

export default function SourceAddScreen() {
    const [selectedHealthData, setSelectedHealthData] = useState<HealthData>();
    const [formData, setFormData] = useState<Record<string, any>>({});

    const {data, mutate: healthDataMutate} = useSWR<HealthDataListResponse>('/api/health-data', async (url: string) => {
        const response = await fetch(url);
        return await response.json();
    });
    const healthDataList = useMemo(() => data?.healthDataList || [], [data]);

    useEffect(() => {
        if (healthDataList.length > 0 && selectedHealthData === undefined) {
            setSelectedHealthData(healthDataList[0]);
            setFormData(JSON.parse(JSON.stringify(healthDataList[0].data)));
        }
    }, [healthDataList, selectedHealthData]);

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const oldHealthDataList = [...healthDataList];
        let newHealthDataList = [...oldHealthDataList];
        const uploadPromises = [];

        // Create temporary entries for all files first
        const tempEntries = files.map(file => ({
            id: cuid(),
            type: HealthDataType.FILE.id,
            data: {} as Record<string, any>,
            status: 'PARSING',
            filePath: null,
            fileType: null,
            createdAt: new Date(),
            updatedAt: new Date()
        } as HealthData));

        // Add all temporary entries to the list first
        newHealthDataList = [...newHealthDataList, ...tempEntries];
        await healthDataMutate({healthDataList: newHealthDataList}, {revalidate: false});

        // Process all files in parallel
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const tempEntry = tempEntries[i];

            const formData = new FormData();
            formData.append('file', file);
            formData.append('id', tempEntry.id);
            formData.append('type', tempEntry.type);
            formData.append('data', JSON.stringify(tempEntry.data));

            const uploadPromise = fetch(`/api/health-data`, {method: 'POST', body: formData})
                .then(async response => {
                    const newSource: HealthDataCreateResponse = await response.json();
                    // Update the list with the actual data
                    newHealthDataList = newHealthDataList.map(item =>
                        item.id === tempEntry.id ? newSource : item
                    );
                    await healthDataMutate({healthDataList: newHealthDataList}, {revalidate: false});
                    return newSource;
                });

            uploadPromises.push(uploadPromise);
        }

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);

        // Select the first uploaded file
        if (results.length > 0) {
            setSelectedHealthData(results[0]);
            setFormData(results[0].data as Record<string, any>);
        }

        // Final update of the list
        await healthDataMutate({healthDataList: newHealthDataList});
    };

    const handleAddSymptoms = async (date: string) => {
        const now = new Date();
        const body = {
            id: cuid(),
            type: HealthDataType.SYMPTOMS.id,
            data: {
                date,
                description: ''
            } as Record<string, any>,
            status: 'COMPLETED',
            filePath: null,
            fileType: null,
            createdAt: now,
            updatedAt: now
        } as HealthData;

        try {
            const response = await fetch(`/api/health-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText || 'Empty response');
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            let newSource;
            try {
                newSource = text ? JSON.parse(text) : body;
            } catch (e) {
                console.error('Failed to parse response:', e);
                newSource = body;
            }

            setSelectedHealthData(newSource);
            setFormData(newSource.data as Record<string, any>);
            await healthDataMutate({healthDataList: [...healthDataList, newSource]});
        } catch (error) {
            console.error('Failed to add symptoms:', error);
            // Add the data anyway for better UX
            setSelectedHealthData(body);
            setFormData(body.data as Record<string, any>);
            await healthDataMutate({healthDataList: [...healthDataList, body]});
        }
    };

    const handleDeleteSource = async (id: string) => {
        await fetch(`/api/health-data/${id}`, {method: 'DELETE'});

        const newSources = healthDataList.filter(s => s.id !== id);
        await healthDataMutate({healthDataList: newSources});

        if (selectedHealthData?.id === id) {
            if (newSources.length > 0) {
                setSelectedHealthData(newSources[0]);
                setFormData(JSON.parse(JSON.stringify(newSources[0].data)));
            } else {
                setSelectedHealthData(undefined);
                setFormData({})
            }
        }
    };

    const onChangeFormData = async (data: Record<string, any>) => {
        if (selectedHealthData) {
            setFormData(data);
            await fetch(`/api/health-data/${selectedHealthData.id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({data: data})
            });
            await healthDataMutate({
                healthDataList: healthDataList.map(s =>
                    s.id === selectedHealthData.id
                        ? {...s, data: data}
                        : s
                )
            });
        }
    }

    return (
        <div className="w-full h-screen flex gap-4 p-4">
            <div className="w-1/3 max-w-[500px] h-full">
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex-shrink-0">
                        <CardTitle>Sources</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-4">
                        <AddSourceDialog
                            onFileUpload={handleFileUpload}
                            onAddSymptoms={handleAddSymptoms}
                        />

                        <div className="space-y-2">
                            {healthDataList.map((healthData) => (
                                <HealthDataItem
                                    key={healthData.id}
                                    healthData={healthData}
                                    isSelected={selectedHealthData?.id === healthData.id}
                                    onClick={() => {
                                        setSelectedHealthData(healthData);
                                        setFormData(JSON.parse(JSON.stringify(healthData.data)));
                                    }}
                                    onDelete={handleDeleteSource}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="w-2/3 flex-1 h-full">
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex-shrink-0">
                        <CardTitle>
                            {selectedHealthData ? (
                                selectedHealthData.type === HealthDataType.FILE.id ? formData.fileName || 'Untitled File' :
                                    HealthDataType[selectedHealthData.type as keyof typeof HealthDataType]?.name || 'Unknown'
                            ) : 'Select a source'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        {selectedHealthData ? (
                            <HealthDataPreview
                                key={selectedHealthData.id}
                                healthData={selectedHealthData}
                                formData={formData}
                                setFormData={onChangeFormData}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Select a source from the list
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
;
