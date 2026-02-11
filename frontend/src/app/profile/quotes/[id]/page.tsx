"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    Printer,
    MessageCircle,
    Clock,
    FileText,
    Inbox,
    CheckCircle2,
    ShoppingCart,
    AlertCircle
} from 'lucide-react';
import QuoteStatusTimeline from '@/components/QuoteStatusTimeline';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useAdmin } from '@/components/providers/AdminProvider';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/config';

const QuoteDetailPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
    const params = React.use(paramsPromise);
    const { showToast } = useNotification();
    const { settings } = useAdmin();
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/quotes/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setQuote(data);
                } else {
                    showToast('Error', 'Quote not found', 'error');
                }
            } catch (error) {
                console.error("Failed to fetch quote:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchQuote();
    }, [params.id]);

    const handlePrintQuote = () => {
        if (!quote) return;
        const doc = new jsPDF() as any;

        doc.setFontSize(22);
        doc.setTextColor(29, 66, 138);
        doc.text("KALSAN AUTO SPARE PARTS", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(settings.tagline || "Premium Quality Parts for Every Ride", 105, 28, { align: "center" });

        doc.setDrawColor(230, 230, 230);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.text("FROM:", 20, 45);
        doc.setFont("helvetica", "bold");
        doc.text("Kalsan Auto Parts", 20, 50);
        doc.setFont("helvetica", "normal");
        doc.text(settings.contactAddress, 20, 55);
        doc.text(`Email: ${settings.contactEmail}`, 20, 60);
        doc.text(`Phone: ${settings.contactPhone}`, 20, 65);

        doc.text("QUOTE TO:", 140, 45);
        doc.setFont("helvetica", "bold");
        doc.text(quote.user?.displayName || 'Valued Customer', 140, 50);
        doc.setFont("helvetica", "normal");
        doc.text(quote.user?.email || 'N/A', 140, 55);

        doc.setFillColor(245, 245, 245);
        doc.rect(20, 75, 170, 20, 'F');
        doc.setFontSize(10);
        doc.text(`QUOTE NO: #${quote.id.split('-')[0].toUpperCase()}`, 30, 87);
        doc.text(`DATE: ${new Date(quote.created_at).toLocaleDateString()}`, 85, 87);
        doc.text(`STATUS: ${quote.status === 'price_ready' ? 'READY' : 'PENDING'}`, 150, 87);

        const tableColumn = ["Item Description", "SKU", "Qty", "Unit Price", "Total"];
        const tableRows = quote.items.map((item: any) => [
            item.product?.name,
            item.product?.sku || 'N/A',
            item.quantity,
            `$${item.unit_price || 0}`,
            `$${(item.unit_price || 0) * item.quantity}`
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 105,
            theme: 'grid',
            headStyles: { fillColor: [29, 66, 138], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            margin: { left: 20, right: 20 }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text("Subtotal:", 140, finalY);
        doc.text(`$${quote.total_amount || 0}`, 170, finalY);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL AMOUNT:", 140, finalY + 18);
        doc.text(`$${quote.total_amount || 0}`, 170, finalY + 18);

        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for choosing Kalsan Auto Parts. This quote is valid for 48 hours.", 105, 280, { align: "center" });

        doc.save(`Quote_${quote.id.split('-')[0]}.pdf`);
        showToast('Success', 'PDF Quote generated successfully', 'success');
    };

    const handleContactSupport = () => {
        window.dispatchEvent(new CustomEvent('open-support-chat'));
        showToast('Connecting', 'Opening Support Hub...', 'success');
    };

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Quote Details...</p>
        </div>
    );

    if (!quote) return null;

    const steps: any[] = [
        { label: "Inquiry Sent", description: new Date(quote.created_at).toLocaleDateString(), icon: Inbox, status: 'completed' as const },
        { label: "Reviewing", description: quote.status === 'reviewing' || quote.status === 'price_ready' ? "Completed" : "Pending", icon: Clock, status: quote.status === 'pending' ? 'active' as const : 'completed' as const },
        { label: "Quote Ready", description: quote.status === 'price_ready' ? "Completed" : "Pending", icon: FileText, status: quote.status === 'reviewing' ? 'active' as const : quote.status === 'price_ready' ? 'completed' as const : 'pending' as const },
        { label: "Completed", description: quote.status === 'converted' ? "Completed" : "Pending", icon: CheckCircle2, status: quote.status === 'price_ready' ? 'active' as const : quote.status === 'converted' ? 'completed' as const : 'pending' as const },
    ];

    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/400x300';
        if (url.startsWith('http')) return url;

        const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        let cleanUrl = url.startsWith('/') ? url : `/${url}`;

        // Ensure we are pointing to /uploads/ if it's not already there
        // and if it's not a root API route (though typically images are in uploads)
        if (!cleanUrl.startsWith('/uploads/')) {
            cleanUrl = `/uploads${cleanUrl}`;
        }

        return `${baseUrl}${cleanUrl}`;
    };

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 pt-12 pb-12 transition-colors">
                <div className="container mx-auto px-4">
                    <Link href="/profile" className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest hover:underline mb-8 transition-all group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Profile
                    </Link>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl md:text-5xl font-black text-secondary dark:text-white tracking-tighter uppercase">{quote.id.split('-')[0]}</h1>
                                <span className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    quote.status === 'pending' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                        quote.status === 'reviewing' ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                            quote.status === 'price_ready' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                )}>
                                    {quote.status === 'pending' ? 'Inquiry Sent' : quote.status === 'reviewing' ? 'Under Review' : quote.status === 'price_ready' ? 'Quote Ready' : quote.status}
                                </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                Requested on {new Date(quote.created_at).toLocaleDateString()} • {quote.items?.length} Items
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handlePrintQuote}
                                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-secondary dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                            >
                                <Printer size={18} />
                                Print Quote
                            </button>
                            <button
                                onClick={handleContactSupport}
                                className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-secondary dark:bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-secondary/10 dark:shadow-primary/20"
                            >
                                <MessageCircle size={18} />
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <QuoteStatusTimeline steps={steps} />

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 overflow-hidden">
                            <div className="p-8 md:p-10 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/20">
                                <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight">Requested Items</h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                {quote.items.map((item: any, index: number) => (
                                    <div key={index} className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-100 dark:border-slate-700">
                                            <img
                                                src={getImageUrl(item.product?.image_urls?.[0])}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">P/N: {item.product?.sku || 'N/A'}</div>
                                                <h4 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight leading-tight">{item.product?.name}</h4>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                <div className="bg-gray-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400">Qty: {item.quantity}</div>
                                            </div>
                                        </div>
                                        <div className="text-right w-full md:w-auto space-y-2">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Price</div>
                                            <div className="text-2xl font-black text-secondary dark:text-white">${item.unit_price || '0.00'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 p-8 md:p-10 sticky top-32">
                            <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight mb-8">Quote Summary</h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Quote Subtotal</span>
                                    <span className="font-black text-secondary dark:text-white">${quote.total_amount || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-black text-emerald-500 font-black uppercase text-[10px] tracking-widest">Included</span>
                                </div>
                                {quote.discount > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Discount ({quote.discount}%)</span>
                                        <span className="font-black text-emerald-500">-${(Number(quote.total_amount) / (1 - (Number(quote.discount) / 100)) * (Number(quote.discount) / 100)).toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="pt-8 border-t border-gray-100 dark:border-slate-800">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Payable Amount</span>
                                            <div className="text-4xl font-black text-secondary dark:text-white">${quote.total_amount || '0.00'}</div>
                                        </div>
                                    </div>
                                </div>

                                {quote.status === 'price_ready' ? (
                                    <Link
                                        href={`/checkout/${quote.id}?quoteId=${quote.id}`}
                                        className="w-full bg-primary text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8"
                                    >
                                        Proceed to Checkout
                                        <ShoppingCart size={18} />
                                    </Link>
                                ) : (
                                    <div className="w-full bg-gray-50 dark:bg-slate-800 text-gray-400 py-6 rounded-3xl font-black uppercase tracking-[0.1em] text-[10px] flex items-center justify-center gap-3 mt-8 border border-dashed border-gray-200 dark:border-slate-700">
                                        <Clock size={16} />
                                        Waiting for Admin Pricing
                                    </div>
                                )}

                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold text-center uppercase tracking-widest mt-4 leading-relaxed">
                                    Prices include handling and delivery within Hargeisa.
                                    Quote valid for 48 hours.
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary dark:bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl">
                            <div className="space-y-6">
                                <h4 className="text-xl font-black uppercase tracking-tight">Need expert help?</h4>
                                <p className="text-white/60 text-sm font-medium leading-relaxed">Our mechanics are ready to verify these parts with your VIN number.</p>
                                <div className="flex flex-col gap-3">
                                    <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all group">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all">
                                            <MessageCircle size={20} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Live Chat</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default QuoteDetailPage;
