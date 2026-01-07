'use client';

import React from 'react';
import {
    ZoomIn,
    ZoomOut,
    RotateCw,
    RotateCcw,
    RefreshCcw,
    Square,
    Maximize
} from 'lucide-react';
import clsx from 'clsx';

interface ControlPanelProps {
    onZoom: (ratio: number) => void;
    onRotate: (degree: number) => void;
    onAspectRatio: (ratio: number | undefined) => void;
    onReset: () => void;
    activeRatio: number | undefined;
}

export function ControlPanel({
    onZoom,
    onRotate,
    onAspectRatio,
    onReset,
    activeRatio
}: ControlPanelProps) {

    const AspectRatioButton = ({ ratio, label, icon: Icon }: { ratio: number | undefined, label: string, icon: any }) => (
        <button
            onClick={() => onAspectRatio(ratio)}
            className={clsx(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                activeRatio === ratio
                    ? "bg-primary text-primary-foreground"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            )}
            title={label}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mr-2">Aspect Ratio</span>
                <AspectRatioButton ratio={1} label="1:1" icon={Square} />
                <AspectRatioButton ratio={4 / 3} label="4:3" icon={Maximize} /> {/* Using Maximize as placeholder for 4:3 */}
                <AspectRatioButton ratio={undefined} label="Free" icon={Maximize} />
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mr-2">Tools</span>

                <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                    <button
                        onClick={() => onZoom(0.1)}
                        className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                    <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
                    <button
                        onClick={() => onZoom(-0.1)}
                        className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                    <button
                        onClick={() => onRotate(-90)}
                        className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
                        title="Rotate Left"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700" />
                    <button
                        onClick={() => onRotate(90)}
                        className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors"
                        title="Rotate Right"
                    >
                        <RotateCw className="w-5 h-5" />
                    </button>
                </div>

                <button
                    onClick={onReset}
                    className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Reset"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
