"use client";

import { Search, X } from "lucide-react";
import SmartSearch from "./SmartSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const SidebarFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [conditions, setConditions] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsRes, catsRes, condsRes] = await Promise.all([
                    fetch('http://localhost:3001/brands'),
                    fetch('http://localhost:3001/categories'),
                    fetch('http://localhost:3001/conditions')
                ]);

                if (brandsRes.ok) {
                    const data = await brandsRes.json();
                    setBrands(data.filter((b: any) => b.is_active));
                }
                if (catsRes.ok) setCategories(await catsRes.json());
                if (condsRes.ok) setConditions(await condsRes.json());

            } catch (error) {
                console.error("Failed to fetch filters for sidebar", error);
            }
        };
        fetchData();
    }, []);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (params.get(name) === value) {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        router.push(`/shop?${createQueryString(name, value)}`);
    };

    const clearAll = () => {
        router.push('/shop');
    };

    const isActive = (name: string, value: string) => {
        return searchParams.get(name) === value;
    };

    return (
        <aside className="w-full lg:w-64 space-y-10">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-black text-secondary dark:text-foreground flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                    Filters
                </h3>
                <button
                    onClick={clearAll}
                    className="text-primary dark:text-blue-400 text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                    CLEAR ALL
                </button>
            </div>

            {/* Search Filter */}
            <div className="px-2">
                <SmartSearch />
            </div>

            {/* Categories */}
            <div className="space-y-6">
                <h4 className="font-black text-secondary dark:text-foreground uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 px-2">
                    <div className="w-4 h-0.5 bg-primary" />
                    Categories
                </h4>
                <div className="space-y-4 px-2">
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex justify-between items-center group cursor-pointer hover:translate-x-1 transition-transform">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={isActive('category', cat.slug)}
                                        onChange={() => handleFilterChange('category', cat.slug)}
                                        className="peer w-5 h-5 rounded-lg border-2 border-gray-200 dark:border-muted appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                    />
                                    <div className="absolute text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-sm group-hover:text-primary dark:group-hover:text-blue-400 transition-colors font-bold uppercase tracking-tight",
                                    isActive('category', cat.slug) ? "text-primary font-black" : "text-gray-500 dark:text-gray-400"
                                )}>
                                    {cat.name}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="space-y-6">
                <h4 className="font-black text-secondary dark:text-foreground uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 px-2">
                    <div className="w-4 h-0.5 bg-primary" />
                    Brands
                </h4>
                <div className="grid grid-cols-2 gap-4 px-2">
                    {brands.map(brand => (
                        <label
                            key={brand.id}
                            className={cn(
                                "flex flex-col items-center gap-3 p-4 rounded-3xl border-2 cursor-pointer transition-all bg-white dark:bg-muted/20 group shadow-sm hover:shadow-xl hover:-translate-y-1",
                                isActive('brand', brand.slug) ? "border-primary shadow-lg shadow-primary/10" : "border-gray-100 dark:border-muted hover:border-primary"
                            )}
                        >
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={isActive('brand', brand.slug)}
                                onChange={() => handleFilterChange('brand', brand.slug)}
                            />
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center p-2 transition-colors overflow-hidden",
                                isActive('brand', brand.slug) ? "bg-primary/10" : "bg-gray-50 dark:bg-muted/30 group-hover:bg-primary/5"
                            )}>
                                {brand.logo_url ? (
                                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                                ) : (
                                    <span className={cn(
                                        "text-lg font-black transition-all",
                                        isActive('brand', brand.slug) ? "text-primary scale-110" : "text-gray-300 group-hover:text-primary/50"
                                    )}>{brand.name.slice(0, 1)}</span>
                                )}
                            </div>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                isActive('brand', brand.slug) ? "text-primary" : "text-gray-400 dark:text-gray-500"
                            )}>{brand.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Part Condition */}
            <div className="space-y-6">
                <h4 className="font-black text-secondary dark:text-foreground uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 px-2">
                    <div className="w-4 h-0.5 bg-primary" />
                    Condition
                </h4>
                <div className="space-y-4 px-2">
                    {conditions.map(cond => (
                        <label key={cond.id} className="flex items-center gap-4 group cursor-pointer">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={isActive('condition', cond.slug)}
                                    onChange={() => handleFilterChange('condition', cond.slug)}
                                    className="peer w-5 h-5 rounded-lg border-2 border-gray-200 dark:border-muted appearance-none checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                />
                                <div className="absolute text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <span className={cn(
                                "text-sm group-hover:text-primary transition-colors font-bold uppercase tracking-tight",
                                isActive('condition', cond.slug) ? "text-primary font-black" : "text-gray-500 dark:text-gray-400"
                            )}>
                                {cond.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default SidebarFilters;
