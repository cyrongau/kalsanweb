"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Truck, Info } from 'lucide-react';

const tabs = [
    { id: 'specifications', label: 'Specifications', icon: FileText },
    { id: 'compatibility', label: 'Vehicle Compatibility', icon: Truck },
    { id: 'shipping', label: 'Shipping Info', icon: Info },
];

const specifications = [
    { label: 'Material', value: 'High-Grade Cast Aluminum' },
    { label: 'Compression Ratio', value: '9.5:1' },
    { label: 'Bore Size', value: '62.00 mm' },
    { label: 'Heat Treatment', value: 'T6 Temper' },
    { label: 'Weight', value: '4.25 kg' },
    { label: 'Surface Finish', value: 'Anti-Corrosive Coating' },
];

const ProductDetailTabs = () => {
    const [activeTab, setActiveTab] = useState('specifications');

    return (
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-100">
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
                        {specifications.map((spec, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-4">
                                <span className="text-sm font-bold text-gray-400">{spec.label}</span>
                                <span className="text-sm font-black text-secondary">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'compatibility' && (
                    <div className="text-sm text-gray-500 font-medium">
                        Compatible with TVS King (200cc) models from 2018-2024.
                    </div>
                )}
                {activeTab === 'shipping' && (
                    <div className="text-sm text-gray-500 font-medium">
                        Fast global shipping via Air or Sea. Standard delivery: 3-5 business days.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailTabs;
