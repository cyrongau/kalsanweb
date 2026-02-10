import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL, normalizeImageUrl } from '@/lib/config';

interface InquiredTogetherProps {
    productCategory?: string;
    currentProductId?: string;
}

const InquiredTogether = ({ productCategory, currentProductId }: InquiredTogetherProps) => {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            setIsLoading(true);
            try {
                // Fetch products in the same category
                let url = `${API_BASE_URL}/products?limit=4`;
                if (productCategory) {
                    url += `&category=${productCategory}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    // Filter out the current product itself
                    setProducts(data.filter((p: any) => p.id !== currentProductId).slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch related products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRelated();
    }, [productCategory, currentProductId]);

    if (!isLoading && products.length === 0) return null;

    return (
        <section className="space-y-10 animate-in fade-in duration-700">
            <h2 className="text-2xl font-black text-secondary dark:text-foreground tracking-tight uppercase">Commonly Inquired Together</h2>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <div key={p.id} className="group flex flex-col bg-white dark:bg-muted/10 rounded-3xl p-6 border border-gray-100 dark:border-muted shadow-soft hover:shadow-xl transition-all duration-500">
                            <Link href={`/shop/${p.id}`} className="aspect-[4/3] rounded-2xl bg-gray-50 dark:bg-background mb-6 overflow-hidden flex items-center justify-center p-4">
                                <img
                                    src={normalizeImageUrl(p.image_urls?.[0]) || 'https://placehold.co/400x300/white/1d428a?text=No+Image'}
                                    alt={p.name}
                                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                />
                            </Link>
                            <div className="flex-1 space-y-2">
                                <Link href={`/shop/${p.id}`}>
                                    <h3 className="text-lg font-black text-secondary dark:text-foreground group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">{p.name}</h3>
                                </Link>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">SKU: {p.sku}</p>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href={`/shop/${p.id}`}
                                    className="w-full py-3 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all inline-block text-center"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default InquiredTogether;
