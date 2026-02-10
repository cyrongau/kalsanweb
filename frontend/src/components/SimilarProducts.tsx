"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { API_BASE_URL, normalizeImageUrl } from '@/lib/config';
import { cn } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    price: number;
    image_urls: string[];
    category?: { name: string };
}

interface SimilarProductsProps {
    categorySlug?: string;
    currentProductId: string;
}

const SimilarProducts = ({ categorySlug, currentProductId }: SimilarProductsProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSimilar = async () => {
            if (!categorySlug) return;

            try {
                // Fetch products from the same category
                // API supports filtering by category slug via ?category=
                const res = await fetch(`${API_BASE_URL}/products?category=${categorySlug}&limit=5`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter out the current product and take top 4
                    const related = data
                        .filter((p: Product) => p.id !== currentProductId)
                        .slice(0, 4);
                    setProducts(related);
                }
            } catch (err) {
                console.error("Failed to load similar products", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSimilar();
    }, [categorySlug, currentProductId]);

    if (isLoading || products.length === 0) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-muted pb-4">
                <h3 className="text-2xl font-black text-secondary dark:text-foreground tracking-tighter">
                    Similar Products
                </h3>
                <Link
                    href="/shop"
                    className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
                >
                    View Catalog
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/shop/${product.id}`}
                        className="group bg-white dark:bg-muted/10 rounded-[2rem] p-4 border border-gray-100 dark:border-muted hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="aspect-square rounded-[1.5rem] bg-gray-50 dark:bg-muted/20 mb-4 overflow-hidden relative">
                            {product.image_urls?.[0] ? (
                                <img
                                    src={normalizeImageUrl(product.image_urls[0])}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ShoppingBag size={32} />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>

                        <div className="px-2 pb-2 space-y-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest line-clamp-1">
                                {product.category?.name || 'Part'}
                            </p>
                            <h4 className="font-bold text-secondary dark:text-foreground text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                {product.name}
                            </h4>
                            <div className="pt-2 flex items-center justify-between">
                                <span className="font-black text-secondary dark:text-foreground">
                                    ${Number(product.price).toFixed(2)}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-muted/30 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                                    <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts;
