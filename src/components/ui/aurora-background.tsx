"use client";
import {cn} from "@/lib/utils";
import React, {ReactNode} from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
}

export const AuroraBackground = ({
                                     className,
                                     children,
                                     showRadialGradient = true,
                                     ...props
                                 }: AuroraBackgroundProps) => {
    return (
        <main>
            <div
                className={cn(
                    "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-950 text-slate-950 transition-bg",
                    className
                )}
                {...props}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className={cn(
                            `
            [--white-gradient:repeating-linear-gradient(100deg,var(--zinc-100)_0%,var(--zinc-100)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--zinc-100)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--zinc-950)_0%,var(--zinc-950)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--zinc-950)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--zinc-900)_10%,var(--zinc-800)_15%,var(--zinc-700)_20%,var(--zinc-600)_25%,var(--zinc-500)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[20px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-70 will-change-transform`,
                            showRadialGradient &&
                            `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
                        )}
                    ></div>
                </div>
                {children}
            </div>
        </main>
    );
};
