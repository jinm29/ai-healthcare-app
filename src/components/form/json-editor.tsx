import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Save} from "lucide-react";

interface JSONEditorProps {
    data: Record<string, unknown>;
    onSave: (data: Record<string, unknown>) => void;
    isEditable?: boolean;
}

export default function JSONEditor({data, onSave, isEditable = false}: JSONEditorProps) {
    const [editableData, setEditableData] = useState(JSON.stringify(data, null, 2));

    const handleSave = () => {
        try {
            const parsedData = JSON.parse(editableData);
            onSave(parsedData);
        } catch (err) {
            console.error('Invalid JSON format', err);
        }
    };

    if (!isEditable) {
        return (
            <div className="h-full">
                <pre className="text-sm font-mono bg-muted/30 p-4 rounded h-full whitespace-pre overflow-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-end mb-2">
                <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2"/>
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
}
