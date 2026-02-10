"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import SmartSearch from './SmartSearch';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                isOpen ? onClose() : null; // Toggle logic is handled by parent, but this is a good reminder
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Search size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-secondary dark:text-white uppercase tracking-tight">Global Search</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Find parts, sku, or documentation</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="relative">
                        <SmartSearch
                            inline={true}
                            shortcutHint={
                                <div className="pointer-events-none hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Command size={10} />
                                    <span>K</span>
                                </div>
                            }
                        />
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-secondary dark:text-white">Enter</span>
                            <span>to search</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-secondary dark:text-white">Esc</span>
                            <span>to close</span>
                        </div>
                    </div>
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Kalsan Auto Parts Search</p>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
