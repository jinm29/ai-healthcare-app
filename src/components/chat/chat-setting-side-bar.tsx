'use client';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import React, {useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import {AssistantMode, AssistantModeListResponse} from "@/app/api/assistant-modes/route";

interface ChatSettingSideBarProps {
    isRightSidebarOpen: boolean;
    chatRoomId: string;
}

export default function ChatSettingSideBar(
    {isRightSidebarOpen}: ChatSettingSideBarProps
) {
    const [settings, setSettings] = useState({model: 'gpt4', apiKey: ''});
    const [selectedAssistantMode, setSelectedAssistantMode] = useState<AssistantMode>();

    const {data: assistantModesData} = useSWR<AssistantModeListResponse>('/api/assistant-modes', async (url: string) => {
        const response = await fetch(url);
        return response.json();
    })
    const assistantModes = useMemo(() => assistantModesData?.assistantModes || [], [assistantModesData]);

    useEffect(() => {
        if (selectedAssistantMode === undefined && assistantModes.length > 0) {
            setSelectedAssistantMode(assistantModes[0]);
        }
    }, [assistantModes, selectedAssistantMode]);

    return <div className={`border-l bg-gray-50 flex flex-col transition-all duration-300 ease-in-out
          ${isRightSidebarOpen ? 'w-80' : 'w-0'} relative`}>
        <div className={`absolute inset-0 ${isRightSidebarOpen ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-300 overflow-y-auto`}>
            <div className="p-4 space-y-4">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Model Settings</h4>
                    <div className="space-y-2">
                        <Select value={settings.model}
                                onValueChange={(value) => setSettings({...settings, model: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select model"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gpt4">GPT-4</SelectItem>
                                <SelectItem value="claude3">Claude 3</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="password"
                            placeholder="Enter API key"
                            value={settings.apiKey}
                            onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">System Prompt</label>
                    <Textarea
                        value={selectedAssistantMode?.systemPrompt || ''}
                        onChange={(e) => {
                            if (selectedAssistantMode) setSelectedAssistantMode({
                                ...selectedAssistantMode,
                                systemPrompt: e.target.value
                            });
                        }}
                        rows={6}
                        className="resize-none"
                    />
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Assistant Mode</h4>
                    <div className="space-y-2">
                        {assistantModes.map((assistantMode) => (
                            <button
                                key={assistantMode.id}
                                className={`w-full p-3 rounded-lg text-left border transition-colors
                        ${selectedAssistantMode?.id === assistantMode.id ? 'bg-white border-gray-300' :
                                    'border-transparent hover:bg-gray-100'}`}
                                onClick={() => {
                                    setSelectedAssistantMode(assistantMode);
                                }}
                            >
                                <div className="text-sm font-medium">{assistantMode.name}</div>
                                <div className="text-xs text-gray-500">{assistantMode.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
}
