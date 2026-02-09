"use client";

import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    currentImage?: string;
    title?: string;
}

const ImageSelectionModal = ({
    isOpen,
    onClose,
    onSelect,
    currentImage,
    title = "Select Image"
}: ImageSelectionModalProps) => {
    const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
    const [url, setUrl] = useState(currentImage || '');
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            onSelect(url);
            onClose();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:3001/uploads', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setPreviewUrl(data.url);
                } else {
                    console.error("Failed to upload image");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleConfirmUpload = () => {
        if (previewUrl) {
            onSelect(previewUrl);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight uppercase">{title}</h3>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Kalsan Asset Manager</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-secondary dark:hover:text-white transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-8 pt-6">
                    <div className="flex p-1 bg-gray-50 dark:bg-slate-800 rounded-2xl w-full">
                        <button
                            onClick={() => setActiveTab('url')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'url' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-gray-400 hover:text-secondary dark:hover:text-white"
                            )}
                        >
                            <LinkIcon size={14} />
                            Remote URL
                        </button>
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'upload' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-gray-400 hover:text-secondary dark:hover:text-white"
                            )}
                        >
                            <Upload size={14} />
                            Upload Image
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 pb-10">
                    {activeTab === 'url' ? (
                        <form onSubmit={handleUrlSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Image Endpoint URL</label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-5 text-sm font-bold text-secondary dark:text-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        autoFocus
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                                        <ImageIcon size={18} />
                                    </div>
                                </div>
                            </div>

                            {url && (
                                <div className="aspect-video rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 relative group">
                                    <img
                                        src={url}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setUrl('')}
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!url}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                Use Remote Image
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {!previewUrl ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group p-10 text-center",
                                        isUploading && "pointer-events-none opacity-50"
                                    )}
                                >
                                    {isUploading ? (
                                        <Loader2 size={40} className="text-primary animate-spin" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:text-primary transition-all">
                                            <Upload size={28} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-black text-secondary dark:text-white uppercase tracking-tight">
                                            {isUploading ? "Processing Image..." : "Drop image or click to upload"}
                                        </p>
                                        {!isUploading && (
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">PNG, JPG or WebP up to 5MB</p>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xl group">
                                        <img src={previewUrl} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => setPreviewUrl(null)}
                                                className="bg-white text-red-500 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                                            >
                                                Discard & Retry
                                            </button>
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-emerald-500 text-white rounded-lg px-3 py-1 text-[8px] font-black uppercase flex items-center gap-1.5">
                                            <Check size={10} /> Ready to Save
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleConfirmUpload}
                                        className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all"
                                    >
                                        Save & Apply Image
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageSelectionModal;
