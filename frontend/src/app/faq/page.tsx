"use client";

import React, { useState } from 'react';
import LegalLayout from '@/components/LegalLayout';
import { ChevronDown, Shield, RefreshCw, Truck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqData = [
    {
        category: 'Warranty',
        icon: Shield,
        questions: [
            { q: "I'm having trouble with my part, what should I do?", a: "First, check the installation guide. If the issue persists, contact our support team with your order number and part details." },
            { q: "I already took my car to a mechanic and they said my part is defective, what do I do?", a: "Please provide a formal report from your mechanic. We will review it and initiate a warranty claim process if the part is confirmed defective under our terms." }
        ]
    },
    {
        category: 'Returns & Refunds',
        icon: RefreshCw,
        questions: [
            { q: "I returned my part, how long will it take for me to receive my refund?", a: "Refunds are processed within 5-7 business days once we receive and inspect the returned part." }
        ]
    },
    {
        category: 'Shipping',
        icon: Truck,
        questions: [
            { q: "What are the shipping cut off times?", a: "Orders placed before 2 PM local time are shipped the same day. Orders after 2 PM are processed the next business day." },
            { q: "Is international shipping available?", a: "Currently, we focus on nationwide delivery across Somaliland. Contact us for special bulk export requests." }
        ]
    },
    {
        category: 'About Us',
        icon: Info,
        questions: [
            { q: "Are your prices and products rates affordable?", a: "We strive to provide the most competitive prices in the market while maintaining genuine OEM quality standards." }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggle = (id: string) => setOpenIndex(openIndex === id ? null : id);

    return (
        <LegalLayout
            title="Frequently Asked Questions"
            subtitle="Find quick answers about our spare part products, online ordering, warranty, returns, and shipping policies."
            lastUpdated="October 12, 2023"
            breadcrumb={[{ name: 'FAQ', href: '/faq' }]}
            showSearch={true}
        >
            <div className="space-y-12">
                {faqData.map((cat, catIdx) => (
                    <div key={catIdx} className="space-y-6">
                        <div className="flex items-center gap-4 px-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <cat.icon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight m-0">{cat.category}</h2>
                        </div>

                        <div className="space-y-3">
                            {cat.questions.map((item, qIdx) => {
                                const id = `${catIdx}-${qIdx}`;
                                const isOpen = openIndex === id;
                                return (
                                    <div
                                        key={qIdx}
                                        className={cn(
                                            "bg-white dark:bg-slate-950 border rounded-2xl transition-all duration-300 overflow-hidden",
                                            isOpen ? "border-primary ring-4 ring-primary/5" : "border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700"
                                        )}
                                    >
                                        <button
                                            onClick={() => toggle(id)}
                                            className="w-full text-left px-8 py-6 flex items-center justify-between gap-4"
                                        >
                                            <span className={cn(
                                                "font-bold text-base transition-colors",
                                                isOpen ? "text-primary" : "text-gray-700 dark:text-gray-300"
                                            )}>
                                                {item.q}
                                            </span>
                                            <ChevronDown
                                                size={18}
                                                className={cn(
                                                    "text-gray-400 transition-transform duration-300",
                                                    isOpen && "rotate-180 text-primary"
                                                )}
                                            />
                                        </button>
                                        {isOpen && (
                                            <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed m-0">
                                                    {item.a}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </LegalLayout>
    );
}
