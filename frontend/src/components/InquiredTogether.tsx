"use client";

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const recommendedProducts = [
    {
        id: 101,
        name: "Piston Assembly Set",
        sku: "TVS-PST-99",
        image: "https://placehold.co/400x300/white/1d428a?text=Piston+Set",
    },
    {
        id: 102,
        name: "Full Gasket Seal Kit",
        sku: "TVS-GSK-11",
        image: "https://placehold.co/400x300/white/1d428a?text=Gasket+Kit",
    },
    {
        id: 103,
        name: "Engine Valve Set",
        sku: "TVS-VLV-45",
        image: "https://placehold.co/400x300/white/1d428a?text=Valve+Set",
    },
    {
        id: 104,
        name: "Heavy Duty Crankshaft",
        sku: "TVS-CRK-22",
        image: "https://placehold.co/400x300/white/1d428a?text=Crankshaft",
    },
];

const InquiredTogether = () => {
    return (
        <section className="space-y-10">
            <h2 className="text-2xl font-black text-secondary tracking-tight">Commonly Inquired Together</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {recommendedProducts.map((p) => (
                    <div key={p.id} className="group flex flex-col bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-xl transition-all duration-500">
                        <Link href={`/shop/${p.id}`} className="aspect-[4/3] rounded-2xl bg-gray-50 mb-6 overflow-hidden flex items-center justify-center p-4">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                            />
                        </Link>
                        <div className="flex-1 space-y-2">
                            <Link href={`/shop/${p.id}`}>
                                <h3 className="text-lg font-black text-secondary group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                            </Link>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {p.sku}</p>
                        </div>
                        <div className="pt-6">
                            <button className="w-full py-3 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">
                                Add to Quote
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InquiredTogether;
