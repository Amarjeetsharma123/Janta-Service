'use client';

import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { Download, RefreshCw } from 'lucide-react';

export function ImageCompressor() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [compressedImage, setCompressedImage] = useState<string | null>(null);
    const [quality, setQuality] = useState(80);
    const [originalSize, setOriginalSize] = useState('');
    const [compressedSize, setCompressedSize] = useState('');
    const [isCompressing, setIsCompressing] = useState(false);

    const handleImageSelected = useCallback((dataUrl: string) => {
        setImageSrc(dataUrl);
        setCompressedImage(null);

        const sizeInBytes = Math.round((dataUrl.length - 22) * 3 / 4);
        const sizeKB = (sizeInBytes / 1024).toFixed(2);
        const sizeMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        const sizeText = sizeInBytes > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
        setOriginalSize(sizeText);
    }, []);

    const handleCompress = useCallback(async () => {
        if (!imageSrc) return;

        setIsCompressing(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            const compressed = canvas.toDataURL('image/jpeg', quality / 100);

            const compressedBytes = Math.round((compressed.length - 22) * 3 / 4);
            const compressedKB = (compressedBytes / 1024).toFixed(2);
            const compressedMB = (compressedBytes / (1024 * 1024)).toFixed(2);
            const compressedText = compressedBytes > 1024 * 1024 ? `${compressedMB} MB` : `${compressedKB} KB`;

            setCompressedImage(compressed);
            setCompressedSize(compressedText);
            setIsCompressing(false);
        };
        img.src = imageSrc;
    }, [imageSrc, quality]);

    const handleDownload = useCallback(() => {
        if (!compressedImage) return;

        const link = document.createElement('a');
        link.href = compressedImage;
        link.download = `compressed-image-q${quality}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [compressedImage, quality]);

    const handleReset = useCallback(() => {
        setImageSrc(null);
        setCompressedImage(null);
        setQuality(80);
        setOriginalSize('');
        setCompressedSize('');
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Compress Image
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Reduce image file size while maintaining quality
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
                                Original Size: <span className="font-medium text-neutral-900 dark:text-neutral-100">{originalSize}</span>
                            </p>
                        </div>

                        {compressedImage && (
                            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                                <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Compressed Image</h3>
                                <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={compressedImage} alt="Compressed" className="max-w-full max-h-full object-contain" />
                                </div>
                                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                                    Compressed Size: <span className="font-medium text-green-600 dark:text-green-400">{compressedSize}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {!compressedImage && (
                        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                            <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Compression Options</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Quality
                                        </label>
                                        <span className="text-sm font-bold text-primary">{quality}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality}
                                        onChange={(e) => setQuality(parseInt(e.target.value))}
                                        className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                        Lower quality = smaller file size
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        {!compressedImage ? (
                            <>
                                <button
                                    onClick={handleCompress}
                                    disabled={isCompressing}
                                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                                >
                                    {isCompressing ? 'Compressing...' : 'Compress Image'}
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
                                    Download Compressed Image
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Compress Another
                                </button>
                            </>
                        )}
                    </div>

                    {compressedImage && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                            <p className="text-green-700 dark:text-green-300 font-medium">
                                ✅ Image compressed successfully!
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
