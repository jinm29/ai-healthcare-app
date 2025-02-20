import React from 'react';
import {NavLinks} from "@/components/ui/nav-links";

export function Footer() {
    return (
        <footer className="fixed bottom-0 w-full py-4 bg-zinc-900/40 dark:bg-zinc-800/40 backdrop-blur-sm">
            <div className="container mx-auto flex justify-center space-x-6">
                <NavLinks/>
            </div>
        </footer>
    );
} 