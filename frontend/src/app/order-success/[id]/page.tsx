"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Check,
    Download,
    ArrowRight,
    Package,
    MapPin,
    CreditCard,
    ShoppingCart,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateReceiptPDF } from '@/lib/pdf-utils';
import { useAdmin } from '@/components/providers/AdminProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OrderTrackerStep = ({ label, description, time, status }: { label: string; description: string; time?: string; status: 'completed' | 'active' | 'pending' }) => {
    const isCompleted = status === 'completed';
    const isActive = status === 'active';

    return (
        <div className="flex-1 flex flex-col items-center text-center space-y-4 group">
            <div className="relative">
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
                    isCompleted ? "bg-primary text-white shadow-xl shadow-primary/20" :
                        isActive ? "bg-white dark:bg-slate-800 border-2 border-primary text-primary" :
                            "bg-gray-100 dark:bg-slate-800 text-gray-300"
                )}>
                    {isCompleted ? <Check size={24} strokeWidth={3} /> :
                        isActive ? <Package size={24} /> : <Package size={24} />}
                </div>
                {/* Connector Line Logic handled in parent */}
            </div>
            <div className="space-y-1">
                <p className={cn(
                    "text-xs font-black uppercase tracking-widest",
                    isActive ? "text-primary" : "text-secondary dark:text-white"
                )}>{label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{description}</p>
                {time && <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">{time}</p>}
            </div>
        </div>
    );
};

const OrderSuccessPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
    const params = React.use(paramsPromise);
    const { settings } = useAdmin();
    const orderId = params.id || "KLSN-9823-XQ";

    const orderItems = [
        { name: "Premium Ceramic Brake Pads (Front)", sku: "PART #KLS-BP-001 | QTY: 1", price: 84.99, image: "https://images.unsplash.com/photo-1635773107344-93e11749876a?auto=format&fit=crop&q=80&w=200" },
        { name: "High Performance Oil Filter", sku: "PART #KLS-OF-055 | QTY: 2", price: 25.98, oldPrice: 42.98, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" }
    ];

    const recommendedItems = [
        { name: "Pro-Series Brake Cleaner Spray", tag: "RECOMMENDED", price: "$8.50", image: "https://images.unsplash.com/photo-1635773107344-93e11749876a?auto=format&fit=crop&q=80&w=200" },
        { name: "Full Synthetic Engine Oil 5W...", tag: "ESSENTIALS", price: "$34.99", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=200" },
        { name: "Heavy Duty Shop Towels (Roll)", tag: "ADD-ON", price: "$4.25", image: "https://images.unsplash.com/photo-1577705998148-ebad79568a2c?auto=format&fit=crop&q=80&w=200" },
        { name: "Professional Lubrication Kit", tag: "TOOLS", price: "$22.95", image: "https://images.unsplash.com/photo-1517520287167-4bda64282b54?auto=format&fit=crop&q=80&w=200" },
    ];

    const handleDownloadInvoice = () => {
        const receiptItems = orderItems.map(item => ({ name: item.name, qty: 1, price: item.price }));
        generateReceiptPDF(orderId, receiptItems, settings, "Visa ending in 4492");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#030712] flex flex-col">
            <Navbar />

            <main className="flex-1 py-16">
                <div className="container mx-auto px-4 max-w-6xl space-y-12">

                    {/* Status Hero */}
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-primary mx-auto ring-8 ring-blue-50/50 dark:ring-blue-500/5">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Your Order is on its Way!</h1>
                            <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                                Thank you for choosing Kalsan Auto. We've received your order and our team is already preparing it.
                            </p>
                        </div>
                    </div>

                    {/* Order Summary Block */}
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800 space-y-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Order Summary</div>
                                <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tighter">#{orderId}</h2>
                            </div>
                            <div className="flex gap-12">
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Date</div>
                                    <div className="text-base font-black text-secondary dark:text-white text-nowrap">Oct 24, 2023</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Est. Delivery</div>
                                    <div className="text-base font-black text-primary text-nowrap">Oct 27 - 28, 2023</div>
                                </div>
                            </div>
                        </div>

                        {/* Tracker */}
                        <div className="relative flex items-center justify-between px-8">
                            <div className="absolute top-7 left-[15%] right-[15%] h-[2px] bg-gray-100 dark:bg-slate-800 -z-0">
                                <div className="h-full bg-primary w-[33%]" />
                            </div>
                            <OrderTrackerStep label="Confirmed" description="Oct 24, 10:00 AM" status="completed" />
                            <OrderTrackerStep label="Processing" description="In Progress" status="active" />
                            <OrderTrackerStep label="Shipped" description="Pending" status="pending" />
                            <OrderTrackerStep label="Delivered" description="Estimated Friday" status="pending" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Items Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800">
                                <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest flex items-center gap-3 mb-10">
                                    <Package size={20} className="text-primary" />
                                    Items in your package
                                </h3>
                                <div className="space-y-10">
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-black text-secondary dark:text-white tracking-tight leading-tight">{item.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sku}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-base font-black text-secondary dark:text-white">${item.price}</div>
                                                {item.oldPrice && <div className="text-[10px] text-gray-300 font-bold line-through">${item.oldPrice}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 pt-8 border-t border-dotted border-gray-200 dark:border-slate-800 space-y-4">
                                    <div className="flex justify-between items-center text-xs font-bold font-mono">
                                        <span className="text-gray-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                                        <span className="text-secondary dark:text-white">$110.97</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold font-mono">
                                        <span className="text-gray-400 uppercase tracking-widest text-[10px]">Shipping</span>
                                        <span className="text-emerald-500 uppercase tracking-widest text-[10px]">Free</span>
                                    </div>
                                    <div className="pt-4 flex justify-between items-center">
                                        <span className="text-base font-black text-secondary dark:text-white uppercase tracking-widest">Total</span>
                                        <span className="text-2xl font-black text-primary">$110.97</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Address Side Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipping Address</h3>
                                    <MapPin size={16} className="text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-black text-secondary dark:text-white">James Sterling</div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        1245 Industrial Way, Suite 400<br />
                                        Automotive District<br />
                                        Detroit, MI 48201
                                    </p>
                                </div>
                            </div>

                            {/* Payment Side Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800 space-y-6">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment Method</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg flex items-center justify-center">
                                        <div className="w-8 h-4 bg-primary/10 rounded flex items-center justify-center text-[8px] font-black text-primary">VISA</div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-xs font-black text-secondary dark:text-white uppercase tracking-tight">Visa ending in 4492</div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Exp: 09/26</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <Link href="/shop">
                                    <button className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group transition-all shrink-0">
                                        <ShoppingCart size={18} className="transition-transform group-hover:scale-110" />
                                        Continue Shopping
                                    </button>
                                </Link>
                                <button
                                    onClick={handleDownloadInvoice}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-secondary dark:text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                                >
                                    <Download size={14} />
                                    Download Invoice (PDF)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations Section */}
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-secondary dark:text-white tracking-tighter">You might also need...</h2>
                            <Link href="/shop" className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                                View maintenance kits
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {recommendedItems.map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 space-y-6 group hover:scale-[1.02] transition-transform duration-500">
                                    <div className="w-full aspect-square rounded-2xl bg-gray-50 dark:bg-slate-800 overflow-hidden border border-gray-50 dark:border-slate-700">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="text-[9px] font-black text-primary uppercase tracking-widest">{item.tag}</div>
                                        <h4 className="text-xs font-black text-secondary dark:text-white tracking-tight line-clamp-2 leading-tight">{item.name}</h4>
                                        <div className="text-sm font-black text-secondary dark:text-white">{item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderSuccessPage;
