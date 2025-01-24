'use client';

import React, {useMemo, useState} from "react";
import useSWR from "swr";
import {ChatRoom, ChatRoomListResponse} from "@/app/api/chat-rooms/route";
import {Button} from "@/components/ui/button";
import {Files, FileText, MessageCircle} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {HealthDataListResponse} from "@/app/api/health-data/route";

interface ChatSideBarProps {
    isLeftSidebarOpen: boolean;
    chatRoomId: string;
}

export default function ChatSideBar({
                                        chatRoomId,
                                        isLeftSidebarOpen
                                    }: ChatSideBarProps) {
    const router = useRouter()
    const [, setJsonViewerOpen] = useState(false);

    const {data: chatRoomData, mutate: chatRoomMutate} = useSWR<ChatRoomListResponse>(
        '/api/chat-rooms',
        (url: string) => fetch(url).then(res => res.json())
    )

    const {data: healthDataListResponse} = useSWR<HealthDataListResponse>(
        '/api/health-data',
        (url: string) => fetch(url).then(res => res.json())
    )

    const healthDataList = useMemo(() => healthDataListResponse?.healthDataList || [], [healthDataListResponse])
    const chatRooms = useMemo(() => chatRoomData?.chatRooms || [], [chatRoomData])

    const handleStartNewChat = async () => {
        const chatRoomResponse = await fetch('/api/chat-rooms', {method: 'POST'})
        const newChatRoom: ChatRoom = await chatRoomResponse.json();
        const oldChatRooms = chatRooms || []
        await chatRoomMutate({chatRooms: [newChatRoom, ...oldChatRooms]})
    }

    return <div className={`border-r bg-gray-50 flex flex-col transition-all duration-300 ease-in-out
          ${isLeftSidebarOpen ? 'w-72' : 'w-16'} relative`}>
        <div className={`absolute inset-0 ${isLeftSidebarOpen ? 'opacity-100' : 'opacity-0'} 
            transition-opacity duration-300 overflow-hidden flex flex-col`}>
            <div className="border-b bg-white">
                <div className="p-4 space-y-3">
                    {healthDataList.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium tracking-tight">Sources</h3>
                                    <div className="flex gap-3 text-xs text-gray-500">
                                        <span>{healthDataList.length} files</span>
                                        <span>{healthDataList.reduce((sum, source) => sum + (source.tokens || 0), 0).toLocaleString()} tokens</span>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => setJsonViewerOpen(true)}
                                        className="h-7 hover:bg-gray-100">
                                    <FileText className="w-3 h-3"/>
                                </Button>
                            </div>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => router.push('/source/add')}
                            >
                                <Files className="w-3 h-3 mr-2"/>
                                Manage Sources
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => router.push('/source/add')}
                        >
                            <Files className="w-3 h-3 mr-2"/>
                            Manage Sources
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleStartNewChat}
                >
                    <MessageCircle className="w-3 h-3 mr-2"/>
                    New Chat
                </Button>

                <div className="space-y-1">
                    {chatRooms?.map((chatRoom) => (
                        <Link
                            key={chatRoom.id}
                            className={`block w-full text-left p-2.5 rounded-md text-sm hover:bg-gray-100 transition-colors
                                ${chatRoomId === chatRoom.id ? 'bg-gray-100' : ''}`}
                            href={`/chat/${chatRoom.id}`}
                        >
                            <div className="font-medium truncate">{chatRoom.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{chatRoom.createdAt.toLocaleString()}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        {!isLeftSidebarOpen && (
            <div className="flex flex-col items-center pt-4 gap-4">
                <Button variant="ghost" size="icon">
                    <Files className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="icon">
                    <MessageCircle className="h-4 w-4"/>
                </Button>
            </div>
        )}
    </div>
}

