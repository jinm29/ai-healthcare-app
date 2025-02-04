import React from "react";
import type {ChatMessage as ChatMessageType} from "@/app/api/chat-rooms/[id]/messages/route";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import Image from 'next/image'
import {cn} from "@/lib/utils";

interface ChatMessageProps {
    message: ChatMessageType
}

export default function ChatMessage(
    {message}: ChatMessageProps
) {
    return <div className={`flex gap-2 ${message.role === 'ASSISTANT' ? 'bg-gray-50' : ''} p-2 rounded`}>
        {message.role === 'ASSISTANT' && (
            <div className="shrink-0 mt-1">
                <Image
                    src="/favicon.ico"
                    alt="Assistant"
                    width={24}
                    height={24}
                    className="rounded-full"
                />
            </div>
        )}
        <div className={`flex-1 ${message.role === 'USER' ? 'text-right' : ''}`}>
            <Markdown className={cn(
                'text-sm',
                message.role === 'USER' ? undefined : 'prose'
            )}
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
            >
                {message.content}
            </Markdown>
        </div>
    </div>
}
