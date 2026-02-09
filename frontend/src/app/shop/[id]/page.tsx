"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Minus, Plus, FileText, CheckCircle2, Globe2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductGallery from '@/components/ProductGallery';
import ProductDetailTabs from '@/components/ProductDetailTabs';
import InquiredTogether from '@/components/InquiredTogether';
import { useQuote } from '@/components/providers/QuoteProvider';

export default function ProductDetailPage() {
    const [quantity, setQuantity] = useState(1);
    const { toggleFavorite, isFavorite, addToQuote } = useQuote();

    const product = {
        name: "TVS King Cylinder Block - 200cc Engine Assembly",
        sku: "TVS-7729-BLK-GEN",
        description: "High-precision cylinder block engineered for the TVS King 200cc engine. Manufactured with premium cast-aluminum alloy for superior thermal dissipation and structural longevity. Designed to original equipment manufacturer specifications to ensure seamless integration and peak engine performance.",
        images: [
            "https://placehold.co/800x800/f3f4f6/1d428a?text=Cylinder+Block+Front",
            "https://placehold.co/800x800/f3f4f6/1d428a?text=Cylinder+Block+Side",
            "https://placehold.co/800x800/f3f4f6/1d428a?text=Cylinder+Block+Top",
            "https://placehold.co/800x800/f3f4f6/1d428a?text=Video+Thumbnail",
        ],
        tags: ["In Stock", "OEM Part", "Genuine TVS Part"]
    };

    return (
        <div className="w-full min-h-screen bg-gray-50/50 dark:bg-background transition-colors duration-300">
            <div className="container mx-auto px-4 py-12">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-12">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={12} className="text-gray-300" />
                    <Link href="/shop" className="hover:text-primary transition-colors">Engine Components</Link>
                    <ChevronRight size={12} className="text-gray-300" />
                    <span className="text-secondary dark:text-foreground">Cylinder Blocks</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-24">
                    {/* Left: Gallery */}
                    <ProductGallery images={product.images} />

                    {/* Right: Info */}
                    <div className="space-y-10">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-3">
                            {product.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className={cn(
                                        "text-[9px] font-black uppercase px-4 py-2 rounded-full tracking-widest shadow-sm",
                                        idx === 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                            idx === 1 ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                                "bg-gray-100 text-gray-600 border border-gray-200"
                                    )}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Title & SKU */}
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-6">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary dark:text-foreground leading-[1.1] tracking-tighter">
                                    {product.name}
                                </h1>
                                <button
                                    onClick={() => toggleFavorite({
                                        id: product.sku,
                                        name: product.name,
                                        category: product.tags[1], // "OEM Part"
                                        image: product.images[0]
                                    })}
                                    className={cn(
                                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all shadow-xl shrink-0",
                                        isFavorite(product.sku)
                                            ? "bg-red-500 text-white shadow-red-500/20"
                                            : "bg-white dark:bg-muted/20 text-gray-400 hover:text-red-500 border border-gray-100 dark:border-muted"
                                    )}
                                >
                                    <Heart size={28} className={cn(isFavorite(product.sku) && "fill-current")} />
                                </button>
                            </div>
                            <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                SKU: <span className="text-secondary dark:text-foreground">{product.sku}</span>
                            </div>
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-lg max-w-xl">
                            {product.description}
                        </p>

                        {/* Quote Box */}
                        <div className="bg-white dark:bg-muted/30 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-muted p-10 space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Quantity:</span>
                                    <div className="flex items-center bg-gray-50 dark:bg-background rounded-2xl p-1 border border-gray-100 dark:border-muted">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-muted rounded-xl transition-all text-gray-400 hover:text-primary"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <div className="w-12 h-10 flex items-center justify-center font-black text-secondary dark:text-foreground text-lg">
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-muted rounded-xl transition-all text-gray-400 hover:text-primary"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">(Bulk discounts available)</span>
                            </div>

                            <button
                                onClick={() => addToQuote({
                                    id: product.sku,
                                    name: product.name,
                                    category: product.tags[1],
                                    image: product.images[0]
                                }, quantity)}
                                className="w-full bg-primary hover:bg-primary/95 text-white py-6 rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase tracking-[0.15em] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                            >
                                <FileText size={22} className="group-hover:rotate-12 transition-transform" />
                                Add to Quote Request
                            </button>

                            <p className="text-[10px] text-center font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto uppercase tracking-wider">
                                Adding to quote does not commit to purchase. Pricing will be provided upon inquiry review.
                            </p>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            <div className="flex items-center gap-5 p-6 rounded-3xl bg-white dark:bg-muted/20 border border-gray-100 dark:border-muted shadow-soft">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-black text-secondary dark:text-foreground">Quality Guaranteed</h4>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">12-month manufacturer warranty</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-6 rounded-3xl bg-white dark:bg-muted/20 border border-gray-100 dark:border-muted shadow-soft">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
                                    <Globe2 size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="text-sm font-black text-secondary dark:text-foreground">Global Shipping</h4>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fast logistics via Air or Sea</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mb-24">
                    <ProductDetailTabs />
                </div>

                {/* Inquired Together Section */}
                <InquiredTogether />
            </div>
        </div>
    );
}
