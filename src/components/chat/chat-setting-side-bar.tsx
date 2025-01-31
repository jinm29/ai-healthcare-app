'use client';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import React, {useEffect, useMemo, useState} from "react";
import useSWR from "swr";
import {AssistantMode, AssistantModeListResponse} from "@/app/api/assistant-modes/route";
import {ChatRoomGetResponse} from "@/app/api/chat-rooms/[id]/route";
import {AssistantModePatchRequest} from "@/app/api/assistant-modes/[id]/route";

interface ChatSettingSideBarProps {
    isRightSidebarOpen: boolean;
    chatRoomId: string;
    settings: {
        company: string;
        model: string;
        apiKey: string;
        apiEndpoint: string;
        showApiKey: boolean;
    };
    onSettingsChange: (settings: {
        company: string;
        model: string;
        apiKey: string;
        apiEndpoint: string;
        showApiKey: boolean;
    }) => void;
}

export default function ChatSettingSideBar(
    {isRightSidebarOpen, chatRoomId, settings, onSettingsChange}: ChatSettingSideBarProps
) {
    const [selectedAssistantMode, setSelectedAssistantMode] = useState<AssistantMode>();
    const [localModels, setLocalModels] = useState<Array<{name: string}>>([]);

    const {
        data: chatRoomData,
        mutate: chatRoomMutate
    } = useSWR<ChatRoomGetResponse>(`/api/chat-rooms/${chatRoomId}`, async (url: string) => {
        const response = await fetch(url);
        return response.json();
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('chatSettings');
        if (savedSettings) {
            onSettingsChange(JSON.parse(savedSettings));
        }
    }, []);

    // Initialize assistant mode from localStorage or chatRoomData
    useEffect(() => {
        if (!chatRoomData?.chatRoom.assistantMode) return;

        const savedSystemPrompt = localStorage.getItem('systemPrompt');
        if (savedSystemPrompt) {
            // If we have a saved system prompt, use it
            const updatedMode = {
                ...chatRoomData.chatRoom.assistantMode,
                systemPrompt: savedSystemPrompt
            };
            setSelectedAssistantMode(updatedMode);
            onChangeAssistantMode(updatedMode.id, {systemPrompt: savedSystemPrompt});
        } else {
            // If no saved prompt, use the current one and save it
            setSelectedAssistantMode(chatRoomData.chatRoom.assistantMode);
            localStorage.setItem('systemPrompt', chatRoomData.chatRoom.assistantMode.systemPrompt);
        }
    }, [chatRoomData?.chatRoom.assistantMode?.id]);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chatSettings', JSON.stringify(settings));
    }, [settings]);

    // Save system prompt to localStorage whenever it changes
    useEffect(() => {
        if (selectedAssistantMode?.systemPrompt) {
            localStorage.setItem('systemPrompt', selectedAssistantMode.systemPrompt);
        }
    }, [selectedAssistantMode?.systemPrompt]);

    const {
        data: assistantModesData,
        mutate: assistantModesMutate
    } = useSWR<AssistantModeListResponse>('/api/assistant-modes', async (url: string) => {
        const response = await fetch(url);
        return response.json();
    })
    const assistantModes = useMemo(() => assistantModesData?.assistantModes || [], [assistantModesData]);

    // Fetch local models when Local LLM is selected
    useEffect(() => {
        const fetchLocalModels = async () => {
            if (settings.company === 'local' && settings.apiEndpoint) {
                try {
                    const response = await fetch(`${settings.apiEndpoint}/api/tags`);
                    if (response.ok) {
                        const data = await response.json();
                        const models = data.models || [];
                        setLocalModels(models);
                        
                        // If we have models and current model is not in the list, set the first model
                        if (models.length > 0 && !models.some((m: {name: string}) => m.name === settings.model)) {
                            onSettingsChange({
                                ...settings,
                                model: models[0].name
                            });
                        }
                    } else {
                        console.error('Failed to fetch local models');
                        setLocalModels([]);
                    }
                } catch (error) {
                    console.error('Error fetching local models:', error);
                    setLocalModels([]);
                }
            }
        };

        fetchLocalModels();
    }, [settings.company, settings.apiEndpoint]);

    const onChangeChatRoom = async (assistantModeId: string) => {
        if (chatRoomData === undefined) return;
        const response = await fetch(`/api/chat-rooms/${chatRoomId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({assistantModeId})
        });
        const data = await response.json();

        // Get the saved system prompt
        const savedSystemPrompt = localStorage.getItem('systemPrompt');
        const updatedAssistantMode = {
            ...data.chatRoom.assistantMode,
            systemPrompt: savedSystemPrompt || data.chatRoom.assistantMode.systemPrompt
        };

        await chatRoomMutate({
            ...chatRoomData,
            chatRoom: {
                ...chatRoomData.chatRoom,
                assistantMode: updatedAssistantMode
            }
        });
        setSelectedAssistantMode(updatedAssistantMode);

        // If there's no saved prompt, save the current one
        if (!savedSystemPrompt) {
            localStorage.setItem('systemPrompt', updatedAssistantMode.systemPrompt);
        }
    }

    const onChangeAssistantMode = async (assistantModeId: string, body: AssistantModePatchRequest) => {
        const response = await fetch(`/api/assistant-modes/${assistantModeId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        const data = await response.json();

        await assistantModesMutate({
            ...assistantModesData,
            assistantModes: assistantModesData?.assistantModes.map((assistantMode) => {
                if (assistantMode.id === assistantModeId) {
                    return data.assistantMode;
                }
                return assistantMode;
            }) || []
        })
    }

    return <div className={`border-l bg-gray-50 flex flex-col transition-all duration-300 ease-in-out
          ${isRightSidebarOpen ? 'w-80' : 'w-0'} relative`}>
        <div className={`absolute inset-0 ${isRightSidebarOpen ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-300 overflow-y-auto`}>
            <div className="p-4 space-y-4">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium">Model Settings</h4>
                    <div className="space-y-2">
                        <Select value={settings.company}
                                onValueChange={(value) => {
                                    const defaultModels = {
                                        'openai': 'gpt4',
                                        'anthropic': 'claude3',
                                        'google': 'gemini-pro',
                                        'local': 'llama2'
                                    };
                                    const defaultEndpoints = {
                                        'openai': '',
                                        'anthropic': '',
                                        'google': '',
                                        'local': 'http://localhost:11434'  // Default Ollama endpoint
                                    };
                                    onSettingsChange({
                                        ...settings,
                                        company: value,
                                        model: defaultModels[value as keyof typeof defaultModels],
                                        apiEndpoint: defaultEndpoints[value as keyof typeof defaultEndpoints]
                                    });
                                }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select company"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="openai">OpenAI</SelectItem>
                                <SelectItem value="anthropic">Anthropic</SelectItem>
                                <SelectItem value="google">Google</SelectItem>
                                <SelectItem value="local">Local LLM</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={settings.model}
                                onValueChange={(value) => onSettingsChange({...settings, model: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select model"/>
                            </SelectTrigger>
                            <SelectContent>
                                {settings.company === 'openai' && (
                                    <>
                                        <SelectItem value="gpt4">GPT-4</SelectItem>
                                        <SelectItem value="gpt4-turbo">GPT-4 Turbo</SelectItem>
                                        <SelectItem value="gpt3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                    </>
                                )}
                                {settings.company === 'anthropic' && (
                                    <>
                                        <SelectItem value="claude3-opus">Claude 3 Opus</SelectItem>
                                        <SelectItem value="claude3-sonnet">Claude 3 Sonnet</SelectItem>
                                        <SelectItem value="claude3-haiku">Claude 3 Haiku</SelectItem>
                                    </>
                                )}
                                {settings.company === 'google' && (
                                    <>
                                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                                        <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                                    </>
                                )}
                                {settings.company === 'local' && localModels.length > 0 ? (
                                    <>
                                        {localModels.map((model) => (
                                            <SelectItem key={model.name} value={model.name}>
                                                {model.name}
                                            </SelectItem>
                                        ))}
                                    </>
                                ) : settings.company === 'local' ? (
                                    <div className="p-2 text-sm text-gray-500">No local models found</div>
                                ) : null}
                            </SelectContent>
                        </Select>
                        {settings.company === 'local' && (
                            <Input
                                type="text"
                                placeholder="API endpoint (default: http://localhost:11434)"
                                value={settings.apiEndpoint}
                                onChange={(e) => onSettingsChange({...settings, apiEndpoint: e.target.value})}
                            />
                        )}
                        {settings.company !== 'local' && (
                            <div className="relative">
                                <Input
                                    type={settings.showApiKey ? "text" : "password"}
                                    placeholder="Enter API key"
                                    value={settings.apiKey}
                                    onChange={(e) => onSettingsChange({...settings, apiKey: e.target.value})}
                                />
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                                    onClick={() => onSettingsChange({...settings, showApiKey: !settings.showApiKey})}
                                >
                                    {settings.showApiKey ? "Hide" : "Show"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">System Prompt</label>
                    <Textarea
                        value={selectedAssistantMode?.systemPrompt || ''}
                        onChange={async (e) => {
                            if (selectedAssistantMode) {
                                setSelectedAssistantMode({...selectedAssistantMode, systemPrompt: e.target.value});
                                await onChangeAssistantMode(selectedAssistantMode.id, {systemPrompt: e.target.value});
                            }
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
                                onClick={async () => {
                                    await onChangeChatRoom(assistantMode.id);
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
