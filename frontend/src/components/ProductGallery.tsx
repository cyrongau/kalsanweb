"use client";

import React, { useState } from 'react';
import { Search, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { normalizeImageUrl } from '@/lib/config';

interface ProductGalleryProps {
    images: string[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square rounded-[2rem] bg-gray-50 border border-gray-100 overflow-hidden group shadow-soft">
                <img
                    src={normalizeImageUrl(images[activeImage])}
                    alt="Product detail"
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Search size={20} />
                </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={cn(
                            "relative aspect-square rounded-2xl bg-gray-50 border-2 transition-all overflow-hidden",
                            activeImage === idx ? "border-primary shadow-md" : "border-transparent hover:border-gray-200"
                        )}
                    >
                        <img src={normalizeImageUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        {idx === 3 && ( // Sample video icon for the last one as per prototype
                            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center text-gray-500">
                                <Play size={20} className="fill-current" />
                                <span className="text-[10px] font-black uppercase mt-1">Video</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;
