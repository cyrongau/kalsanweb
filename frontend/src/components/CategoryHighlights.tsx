"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/components/providers/AdminProvider";

const categories = [
    {
        title: "Engine Auto Parts",
        description: "Parts engineered to ensure best quality, performance and maintenance.",
        image: "https://images.unsplash.com/photo-1621905235294-7548c7c9ec9b?auto=format&fit=crop&q=80&w=1000",
        link: "/shop?category=engine",
        bgColor: "bg-[#F8F9FA]"
    },
    {
        title: "Shock Absorbers",
        description: "Great quality suspension systems and shocks to replace your old ones.",
        image: "https://images.unsplash.com/photo-1541443131876-44ea4908920d?auto=format&fit=crop&q=80&w=1000",
        link: "/shop?category=shocks",
        bgColor: "bg-[#F8F9FA]"
    }
];

const CategoryHighlights = () => {
    const { settings } = useAdmin();
    const highlights = settings.categoryHighlights?.length > 0 ? settings.categoryHighlights : categories;

    return (
        <section className="pb-24 bg-white dark:bg-background transition-colors duration-300">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {highlights.map((cat, index) => (
                    <div key={index} className={cn(
                        "rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row items-stretch border border-gray-100 dark:border-muted group shadow-soft hover:shadow-xl transition-all duration-500",
                        cat.bgColor === "bg-[#F8F9FA]" || !cat.bgColor ? "bg-[#F8F9FA] dark:bg-muted/10" : cat.bgColor
                    )}>
                        <div className="flex-1 space-y-8 p-10 md:p-12 self-center">
                            <div className="text-primary dark:text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
                                <div className="w-8 h-0.5 bg-primary rounded-full transition-all group-hover:w-12" />
                                Specialized
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-secondary dark:text-foreground leading-[1.1] tracking-tighter">
                                {cat.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-sm">
                                {cat.description}
                            </p>
                            <Link href={cat.link} className="btn-primary w-fit uppercase text-[10px] font-black tracking-[0.2em] px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:translate-x-2 transition-all">
                                Shop for parts
                            </Link>
                        </div>
                        <div className="w-full md:w-1/2 min-h-[300px] relative overflow-hidden rounded-[3rem] transition-all duration-700">
                            <div
                                className="absolute inset-0 bg-center bg-no-repeat bg-cover transform group-hover:scale-110 transition-transform duration-1000"
                                style={{ backgroundImage: `url(${cat.image})` }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};


export default CategoryHighlights;
