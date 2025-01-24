import React from "react";
import type {ChatMessage as ChatMessageType} from "@/app/api/chat-rooms/[id]/messages/route";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

interface ChatMessageProps {
    message: ChatMessageType
}

export default function ChatMessage(
    {message}: ChatMessageProps
) {
    return <div className={`flex gap-2 ${message.role === 'ASSISTANT' ? 'bg-gray-50' : ''} p-2 rounded`}>
        {message.role === 'ASSISTANT' && (
            <div className="shrink-0 mt-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="12" fill="#0066FF"/>
                    <path d="M7 12H17M17 12L13 8M17 12L13 16" stroke="white" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </div>
        )}
        <div className={`flex-1 ${message.role === 'USER' ? 'text-right' : ''}`}>
            <Markdown className="text-sm text-gray-700"
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
            >
                {message.content}
            </Markdown>
        </div>
    </div>
}
