"use client";

import React from "react";
import Link from "next/link";
import { Plus, Star, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuote, Product } from "@/components/providers/QuoteProvider";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { toggleFavorite, isFavorite, addToQuote, quoteItems } = useQuote();
    const [isAnimating, setIsAnimating] = React.useState(false);
    const favorit = isFavorite(product.id);
    const isInQuote = quoteItems.some(item => item.id === product.id);

    const handleAddToQuote = () => {
        setIsAnimating(true);
        addToQuote(product);
        setTimeout(() => setIsAnimating(false), 1000);
    };

    return (
        <div className="group flex flex-col transition-all duration-500">
            {/* Image Link */}
            <div className="relative aspect-[4/5] rounded-[2.5rem] bg-gray-100 dark:bg-muted/20 mb-6 overflow-hidden group-hover:shadow-xl transition-all duration-500">
                <Link href={`/shop/${product.id}`} className="block w-full h-full">
                    <div
                        className="absolute inset-0 bg-center bg-no-repeat bg-cover transform group-hover:scale-110 transition-transform duration-1000"
                        style={{ backgroundImage: `url("${product.image}")`, backgroundColor: '#f3f4f6' }}
                    />
                </Link>

                <div className="absolute top-6 left-6 bg-white/90 dark:bg-background/90 backdrop-blur-sm px-4 py-2 rounded-2xl text-[10px] font-black text-primary shadow-lg uppercase tracking-[0.2em] pointer-events-none z-10">
                    {product.category}
                </div>

                <div className={cn(
                    "absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none z-30",
                    isAnimating ? "opacity-100" : "opacity-0"
                )} />

                {isAnimating && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
                        <span className="text-5xl font-black text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)] animate-fly-up">+1</span>
                    </div>
                )}

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                    }}
                    className={cn(
                        "absolute top-6 right-6 w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 shadow-xl z-20",
                        favorit
                            ? "bg-red-500 text-white"
                            : "bg-white/90 dark:bg-background/90 text-gray-400 hover:text-red-500"
                    )}
                >
                    <Heart size={20} className={cn(favorit && "fill-current")} />
                </button>
            </div>

            <div className="space-y-4 px-2">
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={cn(
                                "fill-current",
                                i < (product.rating || 5) ? "text-yellow-400" : "text-gray-200 dark:text-muted"
                            )}
                        />
                    ))}
                </div>

                {/* Title Link */}
                <Link href={`/shop/${product.id}`}>
                    <h3 className="text-xl font-bold text-secondary dark:text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight h-14">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-widest">In Stock</span>
                    </div>
                    <button
                        onClick={handleAddToQuote}
                        className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all border border-primary/10 group/btn shadow-soft",
                            isInQuote
                                ? "bg-primary text-white border-transparent"
                                : "bg-primary/5 dark:bg-primary/10 text-primary hover:bg-primary hover:text-white"
                        )}
                    >
                        <Plus size={18} className={cn("transition-transform", isInQuote ? "rotate-45" : "group-hover/btn:rotate-90")} />
                        {isInQuote ? "Add Quantity" : "Add to Quote"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
