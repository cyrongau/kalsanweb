"use client";

import Link from "next/link";
import { ArrowRight, Truck, Headphones, ShieldCheck, ShoppingBag } from "lucide-react";
import LatestArrivals from "@/components/LatestArrivals";
import CategoryHighlights from "@/components/CategoryHighlights";
import HomeHero from "@/components/HomeHero";
import HomeBanners from "@/components/HomeBanners";

export default function Home() {
  return (
    <div className="w-full bg-white dark:bg-background transition-colors duration-300">
      {/* Hero Slider */}
      <HomeHero />

      {/* Feature Section */}
      <section className="bg-gray-50 dark:bg-muted/10 py-24 transition-colors">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="bg-white dark:bg-muted/20 p-8 rounded-[2.5rem] shadow-soft flex items-start gap-6 group hover:translate-y-[-10px] transition-all border border-gray-100 dark:border-muted">
            <div className="w-16 h-16 rounded-2xl bg-light-blue dark:bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Truck size={32} className="text-primary dark:text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-xl font-black text-secondary dark:text-foreground mb-2">Fast Delivery</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">Free delivery for all orders within Hargeisa and outskirts.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-muted/20 p-8 rounded-[2.5rem] shadow-soft flex items-start gap-6 group hover:translate-y-[-10px] transition-all border border-gray-100 dark:border-muted">
            <div className="w-16 h-16 rounded-2xl bg-light-blue dark:bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Headphones size={32} className="text-primary dark:text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-xl font-black text-secondary dark:text-foreground mb-2">Expert Support</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">Professional mechanics ready to consult on part compatibility.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-muted/20 p-8 rounded-[2.5rem] shadow-soft flex items-start gap-6 group hover:translate-y-[-10px] transition-all relative overflow-hidden border border-gray-100 dark:border-muted">
            <div className="w-16 h-16 rounded-2xl bg-light-blue dark:bg-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <ShieldCheck size={32} className="text-primary dark:text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-xl font-black text-secondary dark:text-foreground mb-2">Quality Guarantee</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">100% Genuine spare parts sourced directly from manufacturers.</p>
            </div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-primary/20 rounded-full animate-ping" />
            <div className="absolute top-5 right-5 w-2 h-2 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      <LatestArrivals />
      <HomeBanners />
      <CategoryHighlights />

      {/* Call to Action Section */}
      <section className="py-24 bg-primary dark:bg-muted/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/20 dark:bg-primary/10 -skew-x-12 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white/5 blur-3xl rounded-full" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-3xl space-y-4 text-center lg:text-left">
            <h2 className="text-5xl md:text-7xl font-black !text-white dark:text-foreground tracking-tighter leading-tight">Keep Your Vehicle in <span className="text-[#abbcdd] dark:text-primary">Great Condition</span></h2>
            <p className="text-white dark:text-gray-400 text-xl font-medium max-w-2xl">We stock a variety of genuine spare parts at very competitive prices. Download our catalog or shop online today.</p>
          </div>
          <Link href="/shop" className="bg-white dark:bg-primary text-primary dark:text-white px-12 py-6 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 whitespace-nowrap">
            <ShoppingBag size={28} />
            ORDER ONLINE
          </Link>
        </div>
      </section>
    </div>
  );
}
