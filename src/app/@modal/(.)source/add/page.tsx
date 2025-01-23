'use client';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import React from "react";
import SourceAddScreen from "@/components/source/source-add-screen";
import {useRouter} from "next/navigation";

export default function SourceAddModal() {
    const router = useRouter()
    return <Dialog open={true} onOpenChange={() => router.back()}>
        <DialogContent className="max-w-4xl h-screen">
            <DialogHeader>
                <DialogTitle>
                    Source Manager
                </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-4">
                <SourceAddScreen/>
            </div>
        </DialogContent>
    </Dialog>
}
