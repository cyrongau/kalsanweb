"use client";

import React, { useState } from 'react';
import { Star, Package, ShieldCheck, Truck, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductPreviewProps {
    product: {
        name: string;
        price: string | number;
        description: string;
        image_urls: string[];
        specifications: Record<string, string>;
        brand_name?: string;
        category_name?: string;
        condition_name?: string;
    };
    onClose: () => void;
}

const ProductPreview = ({ product, onClose }: ProductPreviewProps) => {
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
    const [mainImage, setMainImage] = useState(product.image_urls[0] || null);

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'specs', label: 'Additional Information' },
        { id: 'reviews', label: 'Reviews (0)' },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-slate-800">
            {/* Header */}
            <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Package size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-tight">Product Preview</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer View Mockup</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 text-gray-400 hover:text-secondary dark:hover:text-white transition-all shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Media Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[2rem] bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 overflow-hidden flex items-center justify-center group">
                            {mainImage ? (
                                <img src={mainImage} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center gap-2">
                                    <Package size={48} />
                                    <span className="text-[10px] uppercase font-black tracking-widest">No Image</span>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            {product.image_urls.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setMainImage(img)}
                                    className={cn(
                                        "aspect-square rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden bg-white dark:bg-slate-900",
                                        mainImage === img ? "border-primary shadow-lg shadow-primary/10 scale-105" : "border-gray-100 dark:border-slate-800 hover:border-primary/50"
                                    )}
                                >
                                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                <span>{product.brand_name || 'Generic'}</span>
                                <ChevronRight size={10} />
                                <span className="text-gray-400">{product.category_name || 'Uncategorized'}</span>
                                {product.condition_name && (
                                    <>
                                        <ChevronRight size={10} />
                                        <span className="bg-secondary/5 px-2 py-0.5 rounded text-secondary">{product.condition_name}</span>
                                    </>
                                )}
                            </div>
                            <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tighter leading-none">
                                {product.name || 'New Product Name'}
                            </h1>
                            <div className="flex items-center gap-6">
                                <div className="text-3xl font-black text-primary tracking-tight">
                                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00'}
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="fill-emerald-500 text-emerald-500" />
                                    ))}
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">(0 Reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50/50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-emerald-500 shadow-sm">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Warranty</p>
                                    <p className="text-xs font-bold text-secondary dark:text-white">12 Months</p>
                                </div>
                            </div>
                            <div className="bg-gray-50/50 dark:bg-slate-950/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-blue-500 shadow-sm">
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping</p>
                                    <p className="text-xs font-bold text-secondary dark:text-white">Worldwide</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-secondary dark:bg-white text-white dark:text-secondary py-5 rounded-[1.25rem] font-black uppercase tracking-[0.25em] text-[10px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                            Check Availability
                        </button>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-16 space-y-10">
                    <div className="flex items-center justify-center border-b border-gray-100 dark:border-slate-800">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                                    activeTab === tab.id
                                        ? "text-primary bg-primary/5"
                                        : "text-gray-400 hover:text-secondary dark:hover:text-white"
                                )}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary animate-in slide-in-from-bottom-1" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto min-h-[300px] animate-in fade-in slide-in-from-top-2 duration-500">
                        {activeTab === 'description' && (
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: product.description || '<p className="text-gray-400 italic">No description provided...</p>' }} />
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-slate-800">
                                <table className="w-full text-left">
                                    <tbody>
                                        {Object.entries(product.specifications).length > 0 ? (
                                            Object.entries(product.specifications).map(([key, value], i) => (
                                                <tr key={key} className={cn(i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50/50 dark:bg-slate-950/50")}>
                                                    <td className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 border-r border-gray-100 dark:border-slate-800 w-1/3">{key}</td>
                                                    <td className="px-8 py-5 text-sm font-bold text-secondary dark:text-white uppercase">{value}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-8 py-10 text-center text-gray-400 font-medium italic">No additional information available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-slate-950/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 dashed">
                                <Star size={40} className="text-gray-200 mb-4" />
                                <p className="text-sm font-bold text-secondary dark:text-white">No reviews yet</p>
                                <p className="text-xs text-gray-400 font-medium">Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreview;
