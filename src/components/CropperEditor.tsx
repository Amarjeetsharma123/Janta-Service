'use client';

import React, { useRef, useEffect } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

interface CropperEditorProps {
    imageSrc: string;
    onCrop: (dataUrl: string) => void;
    setCropperRef: (instance: Cropper) => void;
}

export function CropperEditor({ imageSrc, onCrop, setCropperRef }: CropperEditorProps) {
    const imageRef = useRef<HTMLImageElement>(null);
    const cropperInstanceRef = useRef<Cropper | null>(null);

    useEffect(() => {
        if (!imageRef.current) return;

        // Destroy previous instance if exists (though effects should handle cleanup)
        if (cropperInstanceRef.current) {
            cropperInstanceRef.current.destroy();
        }

        const cropper = new Cropper(imageRef.current, {
            aspectRatio: 16 / 9,
            viewMode: 1,
            guides: true,
            minCropBoxHeight: 10,
            minCropBoxWidth: 10,
            background: false,
            responsive: true,
            autoCropArea: 1,
            checkOrientation: false,
            zoomable: true,
            scalable: true,
            rotatable: true,
            crop: () => {
                if (cropper) {
                    onCrop(cropper.getCroppedCanvas()?.toDataURL());
                }
            },
            ready: () => {
                // Set ref once ready
                setCropperRef(cropper);
            }
        });

        cropperInstanceRef.current = cropper;

        return () => {
            cropper.destroy();
            cropperInstanceRef.current = null;
        };
    }, [imageSrc, onCrop, setCropperRef]);

    return (
        <div className="relative w-full h-[500px] bg-neutral-900 rounded-xl overflow-hidden shadow-inner">
            <img
                ref={imageRef}
                src={imageSrc}
                alt="Source"
                className="max-w-full block"
                style={{ opacity: 0 }} // Hide original image until cropper loads
            />
        </div>
    );
}
