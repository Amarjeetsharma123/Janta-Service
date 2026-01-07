'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { Download, RefreshCw } from 'lucide-react';

export function ImageResizer() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [resizedImage, setResizedImage] = useState<string | null>(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [isResizing, setIsResizing] = useState(false);

    const handleImageSelected = useCallback((dataUrl: string) => {
        setImageSrc(dataUrl);
        setResizedImage(null);

        const img = new Image();
        img.onload = () => {
            setOriginalDimensions({ width: img.width, height: img.height });
            setWidth(img.width.toString());
            setHeight(img.height.toString());
        };
        img.src = dataUrl;
    }, []);

    const aspectRatio = originalDimensions.width / originalDimensions.height;

    const handleWidthChange = (value: string) => {
        setWidth(value);
        if (maintainAspectRatio && value && originalDimensions.width) {
            const newHeight = Math.round(parseInt(value) / aspectRatio);
            setHeight(newHeight.toString());
        }
    };

    const handleHeightChange = (value: string) => {
        setHeight(value);
        if (maintainAspectRatio && value && originalDimensions.height) {
            const newWidth = Math.round(parseInt(value) * aspectRatio);
            setWidth(newWidth.toString());
        }
    };

    const handleResize = useCallback(async () => {
        if (!imageSrc || !width || !height) return;

        setIsResizing(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = parseInt(width);
            canvas.height = parseInt(height);
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            ctx.drawImage(img, 0, 0, parseInt(width), parseInt(height));
            const resized = canvas.toDataURL('image/png', 0.95);
            setResizedImage(resized);
            setIsResizing(false);
        };
        img.src = imageSrc;
    }, [imageSrc, width, height]);

    const handleDownload = useCallback(() => {
        if (!resizedImage) return;

        const link = document.createElement('a');
        link.href = resizedImage;
        link.download = `resized-image-${width}x${height}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [resizedImage, width, height]);

    const handleReset = useCallback(() => {
        setImageSrc(null);
        setResizedImage(null);
        setWidth('');
        setHeight('');
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Resize Image
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Upload and resize your image to custom dimensions
                </p>
            </div>

            {!imageSrc ? (
                <ImageUploader onImageSelected={handleImageSelected} />
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                            <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Original Image</h3>
                            <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageSrc} alt="Original" className="max-w-full max-h-full object-contain" />
                            </div>
                            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                Original: {originalDimensions.width} x {originalDimensions.height} px
                            </p>
                        </div>

                        {resizedImage && (
                            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                                <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Resized Image</h3>
                                <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={resizedImage} alt="Resized" className="max-w-full max-h-full object-contain" />
                                </div>
                                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                    Resized: {width} x {height} px
                                </p>
                            </div>
                        )}
                    </div>

                    {!resizedImage && (
                        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                            <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Resize Options</h3>

                            <label className="flex items-center gap-2 mb-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={maintainAspectRatio}
                                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                    className="w-4 h-4 accent-primary"
                                />
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Maintain Aspect Ratio
                                </span>
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Width (px)
                                    </label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={(e) => handleWidthChange(e.target.value)}
                                        min="1"
                                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                        Height (px)
                                    </label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => handleHeightChange(e.target.value)}
                                        min="1"
                                        className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        {!resizedImage ? (
                            <>
                                <button
                                    onClick={handleResize}
                                    disabled={isResizing || !width || !height}
                                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                                >
                                    {isResizing ? 'Resizing...' : 'Resize Image'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Upload New
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleDownload}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Resized Image
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Resize Another
                                </button>
                            </>
                        )}
                    </div>

                    {resizedImage && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                            <p className="text-green-700 dark:text-green-300 font-medium">
                                ✅ Image resized successfully!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
