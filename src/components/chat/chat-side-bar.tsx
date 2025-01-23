import React from "react";
import useSWR from "swr";
import {ChatRoomListResponse} from "@/app/api/chat-rooms/route";
import {Button} from "@/components/ui/button";
import {FileText, Plus} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function ChatSideBar() {
    const router = useRouter()

    const {data: chatRoomData, mutate: chatRoomMutate} = useSWR<ChatRoomListResponse>(
        '/api/chat-rooms',
        (url: string) => fetch(url).then(res => res.json())
    )

    const {data: sourceData, mutate: sourceMutate} = useSWR<ChatRoomListResponse>(
        '/api/sources',
        (url: string) => fetch(url).then(res => res.json())
    )

    const currentConversation = '1'
    const chatRooms = chatRoomData?.chatRooms
    const isLeftSidebarOpen = true
    const sources = []

    const handleStartNewChat = async () => {
        await fetch('/api/chat-rooms', {method: 'POST'})
        const oldChatRooms = chatRooms || []
        await chatRoomMutate({
            chatRooms: [
                ...oldChatRooms,
                {id: `${Math.random()}`, name: 'New Chat', createdAt: new Date(), updatedAt: new Date()}]
        })
    }

    return <div className={`border-r bg-gray-50 flex flex-col transition-all duration-300 ease-in-out
          ${isLeftSidebarOpen ? 'w-72' : 'w-0'} relative`}>
        <div className={`absolute inset-0 ${isLeftSidebarOpen ? 'opacity-100' : 'opacity-0'} 
            transition-opacity duration-300 overflow-hidden flex flex-col`}>
            <div className="border-b bg-white">
                <div className="p-4 space-y-4">
                    {sources.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium">Sources</h3>
                                    <div className="flex gap-3 text-xs text-gray-500">
                                        <span>{sources.length} files</span>
                                        <span>{sources.reduce((sum, source) => sum + (source.tokens || 0), 0).toLocaleString()} tokens</span>
                                    </div>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => setJsonViewerOpen(true)}
                                        className="h-7">
                                    <FileText className="w-3 h-3 mr-1"/>
                                    JSON
                                </Button>
                            </div>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setIsSourceManagerOpen(true)}
                            >
                                Manage Sources
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-2 border-dashed border-blue-200"
                            variant="ghost"
                            onClick={() => {
                                router.push('/source/add')
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2"/>
                            Add Source
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-4"
                    onClick={handleStartNewChat}
                >
                    <Plus className="w-3 h-3 mr-2"/>
                    New Chat
                </Button>

                <div className="space-y-1">
                    {chatRooms?.map((chatRoom) => (
                        <Link
                            key={chatRoom.id}
                            className={`w-full text-left p-2 rounded text-sm hover:bg-gray-100
                      ${currentConversation === chatRoom.id ? 'bg-gray-100' : ''}`}
                            href={`/chat/${chatRoom.id}`}
                        >
                            <div className="font-medium">{chatRoom.name}</div>
                            <div className="text-xs text-gray-500">{chatRoom.createdAt.toLocaleString()}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    </div>
}

