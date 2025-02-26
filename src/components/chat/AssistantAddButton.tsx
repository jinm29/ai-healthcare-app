"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function AssistantAddButton() {
  return (
    <Link href="/assistant-modes/add">
      <Button variant="outline" size="sm" className="gap-2 w-full">
        <Plus className="h-4 w-4" />
        Add Assistant
      </Button>
    </Link>
  );
} 