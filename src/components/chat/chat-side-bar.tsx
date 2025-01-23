import React from "react";
import useSWR from "swr";
import {ChatRoomListResponse} from "@/app/api/chat-rooms/route";
import {Button} from "@/components/ui/button";
import {FileText, Plus} from "lucide-react";
import Link from "next/link";

export default function ChatSideBar() {
    const {
        data, mutate
    } = useSWR<ChatRoomListResponse>(
        '/api/chat-rooms',
        (url: string) => fetch(url).then(res => res.json())
    )

    const currentConversation = '1'
    const chatRooms = data?.chatRooms
    const isLeftSidebarOpen = true
    const sources = []

    const handleStartNewChat = async () => {
        await fetch('/api/chat-rooms', {method: 'POST'})
        const oldChatRooms = chatRooms || []
        await mutate({
            chatRooms: [
                ...oldChatRooms,
                {id: `${Math.random()}`, name: 'New Chat', createdAt: new Date(), updatedAt: new Date()}]
        })
    }

    return <div className={`border-r bg-background flex flex-col transition-all duration-300 ease-in-out
          ${isLeftSidebarOpen ? 'w-72' : 'w-0'} relative`}>
        <div className={`absolute inset-0 ${isLeftSidebarOpen ? 'opacity-100' : 'opacity-0'} 
            transition-opacity duration-300 overflow-hidden flex flex-col`}>
            <div className="border-b">
                <div className="p-4 space-y-3">
                    {sources.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium tracking-tight">Sources</h3>
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span>{sources.length} files</span>
                                        <span>{sources.reduce((sum, source) => sum + (source.tokens || 0), 0).toLocaleString()} tokens</span>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => setJsonViewerOpen(true)}
                                        className="h-7">
                                    <FileText className="w-3 h-3 mr-1"/>
                                    JSON
                                </Button>
                            </div>
                            <Button
                                className="w-full"
                                variant="secondary"
                                onClick={() => setIsSourceManagerOpen(true)}
                            >
                                Manage Sources
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="w-full hover:scale-[1.02] transition-transform active:scale-[0.98]"
                            variant="outline"
                            onClick={() => setIsSourceManagerOpen(true)}
                        >
                            <FileText className="w-4 h-4 mr-2"/>
                            Manage Source
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full hover:scale-[1.02] transition-transform active:scale-[0.98] mb-4"
                    onClick={handleStartNewChat}
                >
                    <Plus className="w-3 h-3 mr-2"/>
                    New Chat
                </Button>

                <div className="space-y-1">
                    {chatRooms?.map((chatRoom) => (
                        <Link
                            key={chatRoom.id}
                            className={`block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent
                                ${currentConversation === chatRoom.id ? 'bg-accent' : ''}`}
                            href={`/chat/${chatRoom.id}`}
                        >
                            <div className="font-medium">{chatRoom.name}</div>
                            <div className="text-xs text-muted-foreground">{chatRoom.createdAt.toLocaleString()}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </div>
}

