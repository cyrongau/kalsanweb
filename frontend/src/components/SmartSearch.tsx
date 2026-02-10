"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, X, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/config';

import Link from 'next/link';

interface SmartSearchProps {
    inline?: boolean;
    shortcutHint?: React.ReactNode;
}

const SmartSearch = ({ inline = false, shortcutHint }: SmartSearchProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
                    if (response.ok) {
                        const data = await response.json();
                        setResults(data);
                        setIsOpen(true);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectProduct = (productId: string) => {
        router.push(`/shop/${productId}`);
        setIsOpen(false);
        setQuery('');
        // Close modal if inline (parent handles close usually, but this ensures state reset)
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full focus-within:z-50" ref={dropdownRef}>
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onKeyDown={handleSearchSubmit}
                    autoFocus={inline}
                    placeholder="Search for parts (name, sku)..."
                    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-full py-2.5 px-6 pl-11 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white placeholder:text-gray-400"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                    {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Search size={18} />
                    )}
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query ? (
                        <button
                            onClick={() => setQuery('')}
                            className="text-gray-400 hover:text-secondary dark:hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    ) : (
                        shortcutHint
                    )}
                </div>
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div
                    className={cn(
                        "bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300",
                        inline ? "relative mt-4 shadow-none" : "absolute top-full left-0 right-0 mt-3 shadow-2xl"
                    )}
                >
                    <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                        {results.length > 0 ? (
                            <>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-3 border-b border-gray-50 dark:border-slate-800 mb-1">
                                    Product Results ({results.length})
                                </p>
                                {results.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelectProduct(product.id)}
                                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl transition-all text-left group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 dark:border-slate-800">
                                            {product.image_urls?.[0] ? (
                                                <img src={product.image_urls[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <Package size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-secondary dark:text-white truncate group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h4>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                                SKU: {product.sku}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-300">
                                    <Search size={22} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-secondary dark:text-white uppercase tracking-tight">No Results Found</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Try a different keyword</p>
                                </div>
                            </div>
                        )}
                    </div>
                    {results.length > 0 && (
                        <Link
                            href={`/shop?q=${encodeURIComponent(query)}`}
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center py-4 bg-gray-50/50 dark:bg-slate-950/50 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all border-t border-gray-50 dark:border-slate-800"
                        >
                            View All Parts in Catalog
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default SmartSearch;
