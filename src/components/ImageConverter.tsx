'use client';

import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { Download, RefreshCw } from 'lucide-react';

type ConversionType = 'jpg-to-png' | 'png-to-jpg';

interface ImageConverterProps {
    type: ConversionType;
}

export function ImageConverter({ type }: ImageConverterProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [convertedImage, setConvertedImage] = useState<string | null>(null);
    const [imageDetails, setImageDetails] = useState<{
        format: string;
        size: string;
        dimensions: string;
    } | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const acceptFormat = type === 'jpg-to-png' ? 'image/jpeg,image/jpg' : 'image/png';
    const outputFormat = type === 'jpg-to-png' ? 'PNG' : 'JPG';
    const title = type === 'jpg-to-png' ? 'Convert JPG to PNG' : 'Convert PNG to JPG';

    const handleImageSelected = useCallback((dataUrl: string) => {
        setImageSrc(dataUrl);
        setConvertedImage(null);

        // Get image details
        const img = new Image();
        img.onload = () => {
            // Calculate size from data URL
            const sizeInBytes = Math.round((dataUrl.length - 22) * 3 / 4);
            const sizeKB = (sizeInBytes / 1024).toFixed(2);
            const sizeMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
            const sizeText = sizeInBytes > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

            setImageDetails({
                format: type === 'jpg-to-png' ? 'JPG' : 'PNG',
                size: sizeText,
                dimensions: `${img.width} x ${img.height} px`,
            });
        };
        img.src = dataUrl;
    }, [type]);

    const handleConvert = useCallback(async () => {
        if (!imageSrc) return;

        setIsConverting(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            if (type === 'png-to-jpg') {
                // Fill white background for JPG
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            const outputMimeType = type === 'jpg-to-png' ? 'image/png' : 'image/jpeg';
            const quality = type === 'png-to-jpg' ? 0.95 : undefined;
            const converted = canvas.toDataURL(outputMimeType, quality);

            setConvertedImage(converted);
            setIsConverting(false);
        };
        img.src = imageSrc;
    }, [imageSrc, type]);

    const handleDownload = useCallback(() => {
        if (!convertedImage) return;

        const link = document.createElement('a');
        link.href = convertedImage;
        link.download = `converted-image.${type === 'jpg-to-png' ? 'png' : 'jpg'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [convertedImage, type]);

    const handleReset = useCallback(() => {
        setImageSrc(null);
        setConvertedImage(null);
        setImageDetails(null);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {title}
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Upload your {type === 'jpg-to-png' ? 'JPG' : 'PNG'} image and convert it to {outputFormat} format instantly
                </p>
            </div>

            {!imageSrc ? (
                <ImageUploader onImageSelected={handleImageSelected} accept={acceptFormat} />
            ) : (
                <div className="space-y-6">
                    {/* Preview Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                            <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Original Image</h3>
                            <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imageSrc} alt="Original" className="max-w-full max-h-full object-contain" />
                            </div>
                            {imageDetails && (
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Format:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{imageDetails.format}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Size:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{imageDetails.size}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-600 dark:text-neutral-400">Dimensions:</span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{imageDetails.dimensions}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {convertedImage && (
                            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                                <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Converted Image ({outputFormat})</h3>
                                <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={convertedImage} alt="Converted" className="max-w-full max-h-full object-contain" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                        {!convertedImage ? (
                            <>
                                <button
                                    onClick={handleConvert}
                                    disabled={isConverting}
                                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isConverting ? 'Converting...' : `Convert to ${outputFormat}`}
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
                                    Download {outputFormat}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Convert Another
                                </button>
                            </>
                        )}
                    </div>

                    {convertedImage && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                            <p className="text-green-700 dark:text-green-300 font-medium">
                                ✅ Conversion successful! Your image is ready to download.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
