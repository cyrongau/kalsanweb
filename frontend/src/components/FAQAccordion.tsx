"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen?: boolean;
    onClick?: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
    return (
        <div className={cn(
            "bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 overflow-hidden",
            isOpen
                ? "border-primary shadow-xl shadow-primary/5"
                : "border-gray-100 dark:border-slate-800 hover:border-primary/30"
        )}>
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-7 md:p-8 text-left group"
            >
                <span className={cn(
                    "text-lg font-bold transition-colors",
                    isOpen ? "text-primary" : "text-secondary dark:text-white"
                )}>
                    {question}
                </span>
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isOpen
                        ? "bg-primary text-white rotate-180"
                        : "bg-gray-50 dark:bg-slate-950 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <ChevronDown size={20} />
                </div>
            </button>
            <div className={cn(
                "transition-all duration-300 ease-in-out px-8 text-gray-500 dark:text-gray-400 leading-relaxed overflow-hidden",
                isOpen ? "max-h-[500px] pb-8 opacity-100" : "max-h-0 opacity-0"
            )}>
                <p>{answer}</p>
            </div>
        </div>
    );
};

interface FAQAccordionProps {
    items: { question: string; answer: string }[];
}

const FAQAccordion = ({ items }: FAQAccordionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-4">
            {items.map((item, idx) => (
                <FAQItem
                    key={idx}
                    {...item}
                    isOpen={openIndex === idx}
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                />
            ))}
        </div>
    );
};

export default FAQAccordion;
