'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Activity, FileText, Loader2, Plus, Save, Trash2, User} from 'lucide-react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";

// Source type definitions
const SourceType = {
    FILE: 'file',
    PERSONAL_INFO: 'personal_info',
    SYMPTOMS: 'symptoms'
};

// Fixed personal info fields
const personalInfoFields = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'birthDate', label: 'Birth Date', type: 'date' },
    { 
        key: 'height',
        label: 'Height',
        type: 'compound',
        fields: [
            { key: 'value', type: 'number', placeholder: 'Height' },
            { 
                key: 'unit',
                type: 'select',
                options: [
                    { value: 'cm', label: 'cm' },
                    { value: 'ft', label: 'ft' }
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
            { key: 'value', type: 'number', placeholder: 'Weight' },
            { 
                key: 'unit',
                type: 'select',
                options: [
                    { value: 'kg', label: 'kg' },
                    { value: 'lbs', label: 'lbs' }
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
            { value: 'A+', label: 'A+' },
            { value: 'A-', label: 'A-' },
            { value: 'B+', label: 'B+' },
            { value: 'B-', label: 'B-' },
            { value: 'O+', label: 'O+' },
            { value: 'O-', label: 'O-' },
            { value: 'AB+', label: 'AB+' },
            { value: 'AB-', label: 'AB-' }
        ]
    },
    { key: 'familyHistory', label: 'Family History', type: 'textarea' }
];

// Symptoms fields
const symptomsFields = [
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'description', label: 'Description', type: 'textarea' }
];

// Dynamic Form Component
const DynamicForm = ({ fields, data, onChange }) => {
    return (
        <div className="space-y-4">
            {fields.map((field) => (
                <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === 'textarea' ? (
                        <textarea
                            className="w-full p-2 border rounded min-h-[100px]"
                            value={data[field.key] || ''}
                            onChange={(e) => onChange(field.key, e.target.value)}
                        />
                    ) : field.type === 'select' ? (
                        <select
                            className="w-full p-2 border rounded"
                            value={data[field.key] || field.defaultValue || ''}
                            onChange={(e) => onChange(field.key, e.target.value)}
                        >
                            <option value="">Select...</option>
                            {field.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : field.type === 'compound' ? (
                        <div className="flex gap-2">
                            {field.fields.map((subField) => (
                                <div key={subField.key} className="flex-1">
                                    {subField.type === 'select' ? (
                                        <select
                                            className="w-full p-2 border rounded"
                                            value={data[field.key]?.[subField.key] || subField.defaultValue || ''}
                                            onChange={(e) => {
                                                const currentValue = data[field.key] || {};
                                                onChange(field.key, {
                                                    ...currentValue,
                                                    [subField.key]: e.target.value
                                                });
                                            }}
                                        >
                                            {subField.options.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={subField.type}
                                            placeholder={subField.placeholder}
                                            className="w-full p-2 border rounded"
                                            value={data[field.key]?.[subField.key] || ''}
                                            onChange={(e) => {
                                                const currentValue = data[field.key] || {};
                                                onChange(field.key, {
                                                    ...currentValue,
                                                    [subField.key]: e.target.value
                                                });
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <input
                            type={field.type}
                            className="w-full p-2 border rounded"
                            value={data[field.key] || ''}
                            onChange={(e) => onChange(field.key, e.target.value)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// JSON Editor Component with Edit Support
const JSONEditor = ({ data, onSave, isEditable = false }) => {
    const [editableData, setEditableData] = useState(JSON.stringify(data, null, 2));

    const handleSave = () => {
        try {
            const parsedData = JSON.parse(editableData);
            onSave(parsedData);
        } catch (err) {
            console.error('Invalid JSON format');
        }
    };

    if (!isEditable) {
        return (
            <div className="h-full">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Extracted Data</h3>
                </div>
                <pre className="text-sm font-mono bg-muted/30 p-4 rounded h-full whitespace-pre overflow-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Extracted Data</h3>
                <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Update
                </Button>
            </div>
            <textarea
                className="flex-1 font-mono text-sm p-4 border rounded-md whitespace-pre"
                value={editableData}
                onChange={(e) => setEditableData(e.target.value)}
            />
        </div>
    );
};

// Add Source Dialog Component
const AddSourceDialog = ({ onFileUpload, onAddSymptoms }) => {
    const [open, setOpen] = useState(false);

    const handleFileUpload = (e) => {
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
                    <Plus className="w-4 h-4" />
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
                        <FileText className="w-6 h-6 text-gray-500" />
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
                        className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={handleAddSymptoms}
                    >
                        <Activity className="w-6 h-6 text-gray-500" />
                        <div className="flex-1 text-left">
                            <h3 className="font-medium">New Symptoms</h3>
                            <p className="text-sm text-gray-500">Record today's symptoms</p>
                        </div>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Source Item Component
const SourceItem = ({ source, isSelected, onClick, onDelete }) => {
    const getSourceIcon = (type) => {
        switch (type) {
            case SourceType.FILE:
                return <FileText className="h-5 w-5" />;
            case SourceType.PERSONAL_INFO:
                return <User className="h-5 w-5" />;
            case SourceType.SYMPTOMS:
                return <Activity className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
        }
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
                    {getSourceIcon(source.type)}
                </div>
                <span className="truncate">{source.name}</span>
            </div>
            {(source.type === SourceType.FILE || source.type === SourceType.SYMPTOMS) && (
                source.status === 'parsing' ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled
                    >
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(source.id);
                        }}
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                )
            )}
        </div>
    );
};

// Main Preview Component
const SourcePreview = ({ source, formData, setFormData }) => {
    const getFields = () => {
        switch (source.type) {
            case SourceType.PERSONAL_INFO:
                return personalInfoFields;
            case SourceType.SYMPTOMS:
                return symptomsFields;
            default:
                return [];
        }
    };

    const handleFormChange = (key, value) => {
        const newData = { ...formData, [key]: value };
        setFormData(newData);
    };

    const handleJSONSave = (newData) => {
        setFormData(newData);
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Source Preview */}
            <div className="h-[40%] min-h-[300px]">
                <div className="bg-white h-full overflow-y-auto">
                    {(source.type === SourceType.PERSONAL_INFO || source.type === SourceType.SYMPTOMS) ? (
                        <DynamicForm
                            fields={getFields()}
                            data={formData}
                            onChange={handleFormChange}
                        />
                    ) : source.type === SourceType.FILE ? (
                        source.file?.type.includes('image') ? (
                            <img
                                src={URL.createObjectURL(source.file)}
                                alt="Preview"
                                className="max-w-full h-auto"
                            />
                        ) : (
                            <div className="bg-gray-100 p-4 rounded">
                                <p>PDF preview (PDF viewer integration needed)</p>
                            </div>
                        )
                    ) : null}
                </div>
            </div>

            {/* Extracted Data */}
            <div className="flex-1">
                <div className="bg-white p-4 rounded-lg border h-full">
                    <JSONEditor
                        data={formData}
                        onSave={handleJSONSave}
                        isEditable={source.type === SourceType.FILE}
                    />
                </div>
            </div>
        </div>
    );
};

// Main Component
const SourceManager = () => {
    const [sources, setSources] = useState([
        {
            id: 'personal_info',
            type: SourceType.PERSONAL_INFO,
            name: 'Personal Information',
        }
    ]);
    const [selectedSource, setSelectedSource] = useState(sources[0]);
    const [formData, setFormData] = useState({
        // Example JSON data
        personalInfo: {
            name: "John Doe",
            age: 30,
            medicalHistory: {
                conditions: [
                    {
                        name: "Hypertension",
                        diagnosedDate: "2020-03-15",
                        medications: ["Lisinopril", "Amlodipine"]
                    }
                ],
                allergies: ["Penicillin"],
                surgeries: [
                    {
                        procedure: "Appendectomy",
                        date: "2015-06-20",
                        hospital: "General Hospital"
                    }
                ]
            },
            vitals: {
                bloodPressure: "120/80",
                heartRate: 72,
                temperature: 98.6
            }
        }
    });

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const timestamp = Date.now();
        const newSources = files.map((file, index) => ({
            id: `file_${timestamp}_${index}`,  // 각 파일마다 고유한 ID 생성
            type: SourceType.FILE,
            name: file.name,
            file: file,
            status: 'parsing'
        }));

        setSources(prev => [...prev, ...newSources]);

        // 파일 파싱 시뮬레이션
        newSources.forEach(source => {
            setTimeout(() => {
                setSources(prev =>
                    prev.map(s =>
                        s.id === source.id
                            ? { ...s, status: 'completed' }
                            : s
                    )
                );
            }, 2000);
        });
    };

    const handleAddSymptoms = (date) => {
        const newSource = {
            id: 'symptoms_' + Date.now(),
            type: SourceType.SYMPTOMS,
            name: `Symptoms ${date}`,
            date: date
        };
        setSources(prev => [...prev, newSource]);
        setSelectedSource(newSource);
        setFormData({});
    };

    const handleDeleteSource = (sourceId) => {
        setSources(sources.filter(s => s.id !== sourceId));
        if (selectedSource?.id === sourceId) {
            setSelectedSource(sources[0]);
        }
    };

    return (
        <div className="w-full h-screen flex gap-4 p-4">
            {/* Source List */}
            <div className="w-1/3 min-w-[300px] h-full">
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
                            {sources.map((source) => (
                                <SourceItem
                                    key={source.id}
                                    source={source}
                                    isSelected={selectedSource?.id === source.id}
                                    onClick={() => {
                                        setSelectedSource(source);
                                        setFormData({});
                                    }}
                                    onDelete={handleDeleteSource}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Preview Area */}
            <div className="w-2/3 flex-1 h-full">
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex-shrink-0">
                        <CardTitle>{selectedSource?.name || 'Select a source'}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        {selectedSource ? (
                            <SourcePreview
                                source={selectedSource}
                                formData={formData}
                                setFormData={setFormData}
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
};

export default SourceManager;
