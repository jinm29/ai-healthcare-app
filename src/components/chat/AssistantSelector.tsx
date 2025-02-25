import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Assistant {
  id: string;
  name: string;
}

interface AssistantSelectorProps {
  assistants: Assistant[];
  currentAssistantId: string;
  onAssistantChange: (assistantId: string) => void;
}

export function AssistantSelector({
  assistants,
  currentAssistantId,
  onAssistantChange,
}: AssistantSelectorProps) {
  return (
    <Select value={currentAssistantId} onValueChange={onAssistantChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an assistant" />
      </SelectTrigger>
      <SelectContent>
        {assistants.map((assistant) => (
          <SelectItem key={assistant.id} value={assistant.id}>
            {assistant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 