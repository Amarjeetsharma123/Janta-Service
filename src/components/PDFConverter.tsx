'use client';

import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { Download, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';

type PDFConversionType = 'jpg-to-pdf' | 'png-to-pdf';

interface PDFConverterProps {
    type: PDFConversionType;
}

export function PDFConverter({ type }: PDFConverterProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [pdfGenerated, setPdfGenerated] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [imageDetails, setImageDetails] = useState<{
        format: string;
        size: string;
        dimensions: string;
    } | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const acceptFormat = type === 'jpg-to-pdf' ? 'image/jpeg,image/jpg' : 'image/png';
    const title = type === 'jpg-to-pdf' ? 'Convert JPG to PDF' : 'Convert PNG to PDF';

    const handleImageSelected = useCallback((dataUrl: string) => {
        setImageSrc(dataUrl);
        setPdfGenerated(false);
        setPdfBlob(null);

        const img = new Image();
        img.onload = () => {
            const sizeInBytes = Math.round((dataUrl.length - 22) * 3 / 4);
            const sizeKB = (sizeInBytes / 1024).toFixed(2);
            const sizeMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
            const sizeText = sizeInBytes > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

            setImageDetails({
                format: type === 'jpg-to-pdf' ? 'JPG' : 'PNG',
                size: sizeText,
                dimensions: `${img.width} x ${img.height} px`,
            });
        };
        img.src = dataUrl;
    }, [type]);

    const handleConvert = useCallback(async () => {
        if (!imageSrc) return;

        setIsConverting(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const img = new Image();
        img.onload = () => {
            const pdf = new jsPDF({
                orientation: img.width > img.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [img.width, img.height]
            });

            const format = type === 'jpg-to-pdf' ? 'JPEG' : 'PNG';
            pdf.addImage(imageSrc, format, 0, 0, img.width, img.height);

            const blob = pdf.output('blob');
            setPdfBlob(blob);
            setPdfGenerated(true);
            setIsConverting(false);
        };
        img.src = imageSrc;
    }, [imageSrc, type]);

    const handleDownload = useCallback(() => {
        if (!pdfBlob) return;

        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted-image.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [pdfBlob]);

    const handleReset = useCallback(() => {
        setImageSrc(null);
        setPdfGenerated(false);
        setPdfBlob(null);
        setImageDetails(null);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    {title}
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Upload your {type === 'jpg-to-pdf' ? 'JPG' : 'PNG'} image and convert it to PDF format instantly
                </p>
            </div>

            {!imageSrc ? (
                <ImageUploader onImageSelected={handleImageSelected} accept={acceptFormat} />
            ) : (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
                        <h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Image Preview</h3>
                        <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain" />
                        </div>
                        {imageDetails && (
                            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-neutral-600 dark:text-neutral-400 block">Format:</span>
                                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{imageDetails.format}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-600 dark:text-neutral-400 block">Size:</span>
                                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{imageDetails.size}</span>
                                </div>
                                <div>
                                    <span className="text-neutral-600 dark:text-neutral-400 block">Dimensions:</span>
                                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{imageDetails.dimensions}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 justify-center">
                        {!pdfGenerated ? (
                            <>
                                <button
                                    onClick={handleConvert}
                                    disabled={isConverting}
                                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                                >
                                    {isConverting ? 'Converting...' : 'Convert to PDF'}
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
                                    Download PDF
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

                    {pdfGenerated && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                            <p className="text-green-700 dark:text-green-300 font-medium">
                                ✅ PDF generated successfully! Your file is ready to download.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
