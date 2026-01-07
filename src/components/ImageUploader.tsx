'use client';

import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

interface ImageUploaderProps {
    onImageSelected: (dataUrl: string) => void;
    accept?: string;
}

export function ImageUploader({ onImageSelected, accept }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    }, []);

    const processFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    onImageSelected(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className={clsx(
                "relative group cursor-pointer flex flex-col items-center justify-center w-full h-full min-h-[400px] rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out",
                isDragging
                    ? "border-primary bg-primary/5 scale-[0.99]"
                    : "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('imageInput')?.click()}
        >
            <input
                type="file"
                id="imageInput"
                className="hidden"
                accept={accept || "image/*"}
                onChange={handleFileChange}
            />

            <div className="flex flex-col items-center space-y-4 text-center p-6">
                <div className={clsx(
                    "p-4 rounded-full transition-colors",
                    isDragging ? "bg-primary/10 text-primary" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                )}>
                    <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <p className="font-semibold text-neutral-700 dark:text-neutral-200">
                        Click or drag image to upload
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                </div>
            </div>
        </div>
    );
}
