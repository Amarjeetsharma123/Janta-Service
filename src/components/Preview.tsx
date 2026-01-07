'use client';

import React from 'react';
import Image from 'next/image';

interface PreviewProps {
    imageSrc: string | null;
}

export function Preview({ imageSrc }: PreviewProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                    Result Preview
                </h2>
                {imageSrc && (
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                        Live Updated
                    </span>
                )}
            </div>

            <div className="aspect-square w-full rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center overflow-hidden relative">
                {imageSrc ? (
                    // Use img tag for blob/data URLs to avoid Next.js Image loader issues with dynamic blobs
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageSrc}
                        alt="Preview"
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="text-center p-6 text-neutral-400">
                        <p className="text-sm">Crop an image to see the preview here</p>
                    </div>
                )}
            </div>

            {imageSrc && (
                <a
                    href={imageSrc}
                    download="cropped-product-image.png"
                    className="block w-full text-center py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    Download Result
                </a>
            )}
        </div>
    );
}
