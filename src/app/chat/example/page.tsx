"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AssistantSelector } from "@/components/chat/AssistantSelector";
import { AssistantAddButton } from "@/components/chat/AssistantAddButton";

// Sample data - in a real app, this would come from an API or database
const sampleAssistants = [
  { id: "general", name: "General Assistant" },
  { id: "health", name: "Health Coach" },
  { id: "productivity", name: "Productivity Assistant" },
];

export default function ChatExamplePage() {
  const [currentAssistantId, setCurrentAssistantId] = React.useState("general");

  const handleAssistantChange = (assistantId: string) => {
    setCurrentAssistantId(assistantId);
    // In a real app, you would load the assistant's configuration and history here
    console.log(`Switched to assistant: ${assistantId}`);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Chat</h1>
          <div className="flex flex-col gap-2 w-64">
            <AssistantAddButton />
            <AssistantSelector
              assistants={sampleAssistants}
              currentAssistantId={currentAssistantId}
              onAssistantChange={handleAssistantChange}
            />
          </div>
        </div>
        
        <div className="flex-1 border rounded-lg p-6 bg-white dark:bg-zinc-900">
          <div className="text-center text-zinc-500 py-12">
            <p>Chat interface would go here.</p>
            <p className="mt-2">Currently using: {sampleAssistants.find(a => a.id === currentAssistantId)?.name}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 