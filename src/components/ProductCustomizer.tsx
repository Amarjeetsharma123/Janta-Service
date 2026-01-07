'use client';

import React, { useState } from 'react';
import { Heart, MoveHorizontal, MoveVertical } from 'lucide-react';
import Image from 'next/image';

type Unit = 'inches' | 'cm' | 'feet';

interface PaperType {
    id: string;
    name: string;
    price: number;
}

interface ProductCustomizerProps {
    croppedImage?: string | null;
}

const paperTypes: PaperType[] = [
    { id: 'standard', name: 'Standard Paper', price: 365.32 },
    { id: 'premium', name: 'Premium Paper', price: 456.88 },
    { id: 'canvas', name: 'Canvas Paper', price: 411.10 },
    { id: 'peel', name: 'Peel and Stick', price: 484.35 },
];

export function ProductCustomizer({ croppedImage }: ProductCustomizerProps) {
    const [unit, setUnit] = useState<Unit>('cm');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState('standard');
    const [customization, setCustomization] = useState('');

    const handleNumericInput = (value: string) => {
        return value.replace(/[^0-9.]/g, '');
    };

    const getUnitLabel = () => {
        switch (unit) {
            case 'inches': return 'in';
            case 'cm': return 'cm';
            case 'feet': return 'ft';
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-xl">
            {/* Dimensions Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-800">
                    Enter Dimensions (W X H)
                </h3>

                {/* Unit Selector */}
                <div className="flex gap-6">
                    {(['inches', 'cm', 'feet'] as Unit[]).map((u) => (
                        <label key={u} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="unit"
                                value={u}
                                checked={unit === u}
                                onChange={(e) => setUnit(e.target.value as Unit)}
                                className="w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span className="text-sm font-medium text-neutral-700 capitalize">
                                {u}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Dimension Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <MoveHorizontal className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Width"
                            value={width}
                            onChange={(e) => setWidth(handleNumericInput(e.target.value))}
                            className="w-full pl-11 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                            {getUnitLabel()}
                        </span>
                    </div>

                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <MoveVertical className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Height"
                            value={height}
                            onChange={(e) => setHeight(handleNumericInput(e.target.value))}
                            className="w-full pl-11 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                            {getUnitLabel()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Preview Toggle */}
            <div className="flex items-center justify-between py-4 px-5 bg-neutral-50 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">
                    Preview Wallpaper
                </span>
                <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showPreview ? 'bg-blue-600' : 'bg-neutral-300'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showPreview ? 'translate-x-6' : 'translate-x-1'
                            }`}
                    />
                </button>
            </div>

            {/* Preview Image */}
            {showPreview && croppedImage && (
                <div className="rounded-lg overflow-hidden border-2 border-neutral-200 bg-neutral-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={croppedImage}
                        alt="Preview"
                        className="w-full h-64 object-contain"
                    />
                </div>
            )}

            {/* Paper Type Selection */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-neutral-800">Paper Type:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paperTypes.map((paper) => (
                        <label
                            key={paper.id}
                            className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPaper === paper.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="paper"
                                value={paper.id}
                                checked={selectedPaper === paper.id}
                                onChange={(e) => setSelectedPaper(e.target.value)}
                                className="w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <div className="ml-3 flex-1">
                                <div className="text-sm font-medium text-neutral-800">
                                    {paper.name}
                                </div>
                                <div className="text-sm text-neutral-600">
                                    Rs. {paper.price.toFixed(2)} / sq.ft
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Customization Input */}
            <div className="space-y-2">
                <textarea
                    placeholder="Add your Customization. If any..."
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-neutral-400"
                />
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
                <button
                    disabled
                    className="w-full py-3 px-6 bg-neutral-300 text-neutral-500 rounded-lg font-medium cursor-not-allowed"
                >
                    Add to cart
                </button>

                <div className="flex items-center justify-between">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        Buy Sample
                    </button>

                    <button className="flex items-center gap-2 text-sm text-neutral-700 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>Add to Wishlist</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
