'use client';

import React, { useState, useCallback } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { CropperEditor } from "@/components/CropperEditor";
import { ControlPanel } from "@/components/ControlPanel";
import { Preview } from "@/components/Preview";
import { ProductCustomizer } from "@/components/ProductCustomizer";
import { ImageConverter } from "@/components/ImageConverter";
import { PDFConverter } from "@/components/PDFConverter";
import { ImageResizer } from "@/components/ImageResizer";
import { ImageCompressor } from "@/components/ImageCompressor";
import { X, Menu, Crop, FileImage, FileText, Maximize2, Minimize2 } from "lucide-react";

type ToolType = 'cropper' | 'jpg-to-png' | 'png-to-jpg' | 'jpg-to-pdf' | 'png-to-pdf' | 'resize' | 'compress';

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>('cropper');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cropper state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [cropperRef, setCropperRef] = useState<any>(null);
  const [activeRatio, setActiveRatio] = useState<number | undefined>(16 / 9);

  const handleImageSelected = (src: string) => {
    setImageSrc(src);
    setCroppedImage(null);
  };

  const handleCrop = useCallback((dataUrl: string) => {
    setCroppedImage(dataUrl);
  }, []);

  const handleZoom = (amount: number) => {
    if (cropperRef) cropperRef.zoom(amount);
  };

  const handleRotate = (degree: number) => {
    if (cropperRef) cropperRef.rotate(degree);
  };

  const handleAspectRatio = (ratio: number | undefined) => {
    setActiveRatio(ratio);
    if (cropperRef) cropperRef.setAspectRatio(ratio ?? NaN);
  };

  const handleReset = () => {
    if (cropperRef) cropperRef.reset();
  };

  const clearImage = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setCropperRef(null);
  };

  const menuItems = [
    { id: 'cropper' as ToolType, label: 'Image Cropper', icon: Crop },
    { id: 'jpg-to-png' as ToolType, label: 'JPG to PNG', icon: FileImage },
    { id: 'png-to-jpg' as ToolType, label: 'PNG to JPG', icon: FileImage },
    { id: 'jpg-to-pdf' as ToolType, label: 'JPG to PDF', icon: FileText },
    { id: 'png-to-pdf' as ToolType, label: 'PNG to PDF', icon: FileText },
    { id: 'resize' as ToolType, label: 'Resize Image', icon: Maximize2 },
    { id: 'compress' as ToolType, label: 'Compress Image', icon: Minimize2 },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-primary text-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-br from-purple-600 to-blue-600 text-white p-6 transition-transform duration-300 z-40 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Image Tools</h1>
          <p className="text-sm text-purple-100">Professional Suite</p>
          <p className="text-xs text-purple-200 mt-2">Developed by</p>
          <p className="text-sm font-semibold text-white">Amarjeet Sharma</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTool(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTool === item.id
                  ? 'bg-white/20 shadow-lg'
                  : 'hover:bg-white/10'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:ml-0">
        <div className="max-w-6xl mx-auto">
          {/* Cropper Tool */}
          {activeTool === 'cropper' && (
            <div className="space-y-8">
              <header className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Janta Service
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Upload, crop, and preview product images with precision.
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="relative aspect-[4/3] bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-sm overflow-hidden">
                    {!imageSrc ? (
                      <div className="w-full h-full p-4">
                        <ImageUploader onImageSelected={handleImageSelected} />
                      </div>
                    ) : (
                      <>
                        <CropperEditor
                          imageSrc={imageSrc}
                          onCrop={handleCrop}
                          setCropperRef={setCropperRef}
                        />
                        <button
                          onClick={clearImage}
                          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-neutral-600 dark:text-neutral-300 hover:text-red-500 transition-colors shadow-sm"
                          title="Remove Image"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {imageSrc && (
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 px-6 shadow-sm">
                      <ControlPanel
                        onZoom={handleZoom}
                        onRotate={handleRotate}
                        onAspectRatio={handleAspectRatio}
                        onReset={handleReset}
                        activeRatio={activeRatio}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm h-fit sticky top-8">
                    <Preview imageSrc={croppedImage} />
                  </div>
                </div>
              </div>

              {croppedImage && (
                <div className="mt-12">
                  <ProductCustomizer croppedImage={croppedImage} />
                </div>
              )}
            </div>
          )}

          {/* Image Converters */}
          {activeTool === 'jpg-to-png' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
              <ImageConverter type="jpg-to-png" />
            </div>
          )}

          {activeTool === 'png-to-jpg' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
              <ImageConverter type="png-to-jpg" />
            </div>
          )}

          {/* PDF Converters */}
          {activeTool === 'jpg-to-pdf' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
              <PDFConverter type="jpg-to-pdf" />
            </div>
          )}

          {activeTool === 'png-to-pdf' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
              <PDFConverter type="png-to-pdf" />
            </div>
          )}

          {/* Resize Tool */}
          {activeTool === 'resize' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
              <ImageResizer />
            </div>
          )}

          {/* Compress Tool */}
          {activeTool === 'compress' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
              <ImageCompressor />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Developed by <span className="font-semibold text-primary">Amarjeet Sharma</span>
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
            © 2026 All rights reserved
          </p>
        </footer>
      </main>
    </div>
  );
}
