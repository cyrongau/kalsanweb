"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Truck, Info, Star } from 'lucide-react';

const tabs = [
    { id: 'specifications', label: 'Specifications', icon: FileText },
    { id: 'compatibility', label: 'Vehicle Compatibility', icon: Truck },
    { id: 'shipping', label: 'Shipping Info', icon: Info },
    { id: 'reviews', label: 'Reviews', icon: Star },
];

// ... (inside component render, after 'shipping' tab content)

{
    activeTab === 'reviews' && (
        <div className="text-center py-8 space-y-4">
            <div className="flex justify-center gap-1 text-gray-300">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={24} />
                ))}
            </div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">No reviews yet for this product.</p>
            <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
                Be the first to review
            </button>
        </div>
    )
}

const specifications = [
    { label: 'Material', value: 'High-Grade Cast Aluminum' },
    { label: 'Compression Ratio', value: '9.5:1' },
    { label: 'Bore Size', value: '62.00 mm' },
    { label: 'Heat Treatment', value: 'T6 Temper' },
    { label: 'Weight', value: '4.25 kg' },
    { label: 'Surface Finish', value: 'Anti-Corrosive Coating' },
];

interface ProductDetailTabsProps {
    specifications?: Record<string, string>;
    compatibility?: string[];
}

const ProductDetailTabs = ({ specifications = {}, compatibility = [] }: ProductDetailTabsProps) => {
    const [activeTab, setActiveTab] = useState('specifications');

    const specList = Object.entries(specifications).map(([label, value]) => ({ label, value }));

    return (
        <div className="bg-white dark:bg-muted/10 rounded-3xl shadow-soft border border-gray-100 dark:border-muted overflow-hidden transition-colors">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100 dark:border-muted">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex-1 py-5 px-4 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2",
                            activeTab === tab.id
                                ? "text-primary border-primary bg-primary/5"
                                : "text-gray-400 border-transparent hover:text-gray-600"
                        )}
                    >
                        <tab.icon size={18} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
                {activeTab === 'specifications' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {specList.length > 0 ? specList.map((spec, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-50 dark:border-muted/50 pb-4">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">{spec.label}</span>
                                <span className="text-sm font-black text-secondary dark:text-foreground">{spec.value}</span>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500 font-medium col-span-2 text-center py-4">No detailed specifications available for this part.</p>
                        )}
                    </div>
                )}
                {activeTab === 'compatibility' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium space-y-2">
                        {compatibility.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {compatibility.map((item, idx) => (
                                    <li key={idx} className="uppercase tracking-tight font-bold">{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center py-4 italic">Universal Fit / No specific model compatibility listed.</p>
                        )}
                    </div>
                )}
                {activeTab === 'shipping' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center py-4">
                        <p>Fast global shipping via Air or Sea Carriers.</p>
                        <p className="font-black text-secondary dark:text-foreground mt-2 uppercase tracking-widest text-xs">Standard delivery: 3-5 business days.</p>
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div className="text-center py-8 space-y-4">
                        <div className="flex justify-center gap-1 text-gray-300">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={24} />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">No reviews yet for this product.</p>
                        <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
                            Be the first to review
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailTabs;
