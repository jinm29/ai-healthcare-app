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
}

export default function ChatSettingSideBar(
    {isRightSidebarOpen, chatRoomId}: ChatSettingSideBarProps
) {
    const [settings, setSettings] = useState({
        company: 'openai',
        model: 'gpt4',
        apiKey: '',
        apiEndpoint: '',
        showApiKey: false
    });
    const [selectedAssistantMode, setSelectedAssistantMode] = useState<AssistantMode>();

    const {
        data: chatRoomData,
        mutate: chatRoomMutate
    } = useSWR<ChatRoomGetResponse>(`/api/chat-rooms/${chatRoomId}`, async (url: string) => {
        const response = await fetch(url);
        return response.json();
    })
    useEffect(() => {
        if (selectedAssistantMode === undefined && chatRoomData) {
            setSelectedAssistantMode(chatRoomData.chatRoom.assistantMode);
        }
    }, [chatRoomData, selectedAssistantMode]);

    const {
        data: assistantModesData,
        mutate: assistantModesMutate
    } = useSWR<AssistantModeListResponse>('/api/assistant-modes', async (url: string) => {
        const response = await fetch(url);
        return response.json();
    })
    const assistantModes = useMemo(() => assistantModesData?.assistantModes || [], [assistantModesData]);

    const onChangeChatRoom = async (assistantModeId: string) => {
        if (chatRoomData === undefined) return;
        const response = await fetch(`/api/chat-rooms/${chatRoomId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({assistantModeId})
        });
        const data = await response.json();
        await chatRoomMutate({
            ...chatRoomData,
            chatRoom: {
                ...chatRoomData.chatRoom,
                assistantMode: data.chatRoom.assistantMode
            }
        })
        setSelectedAssistantMode(data.chatRoom.assistantMode);
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
                                    setSettings({...settings, company: value, model: defaultModels[value as keyof typeof defaultModels]})
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
                                onValueChange={(value) => setSettings({...settings, model: value})}>
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
                                {settings.company === 'local' && (
                                    <>
                                        <SelectItem value="llama2">Llama 2</SelectItem>
                                        <SelectItem value="llama2-70b">Llama 2 70B</SelectItem>
                                        <SelectItem value="mistral-7b">Mistral 7B</SelectItem>
                                        <SelectItem value="mixtral-8x7b">Mixtral 8x7B</SelectItem>
                                        <SelectItem value="phi2">Phi-2</SelectItem>
                                        <SelectItem value="openchat">OpenChat</SelectItem>
                                        <SelectItem value="neural-chat">Neural Chat</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                        <Input
                            type="text"
                            placeholder="Enter API endpoint"
                            value={settings.apiEndpoint}
                            onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                        />
                        <div className="relative">
                            <Input
                                type={settings.showApiKey ? "text" : "password"}
                                placeholder="Enter API key"
                                value={settings.apiKey}
                                onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                                onClick={() => setSettings({...settings, showApiKey: !settings.showApiKey})}
                            >
                                {settings.showApiKey ? "Hide" : "Show"}
                            </button>
                        </div>
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
