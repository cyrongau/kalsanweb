"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, FileText, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const quoteId = searchParams.get('id') || '482931';
    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background flex items-center justify-center py-20 px-4 transition-colors duration-300">
            <div className="max-w-4xl w-full text-center space-y-12">
                {/* Success Icon */}
                <div className="relative inline-block animate-in zoom-in duration-700">
                    <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center animate-bounce duration-[3000ms]">
                        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
                            <CheckCircle2 size={48} className="text-white" />
                        </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#0056b3] rounded-full border-4 border-white dark:border-background flex items-center justify-center text-[10px] font-black text-white shadow-xl italic tracking-tighter">
                        SENT
                    </div>
                </div>

                {/* Title & Message */}
                <div className="space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-5xl md:text-7xl font-black text-secondary dark:text-foreground tracking-tighter uppercase italic">Inquiry Received!</h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        Thank you for reaching out to Kalsan Auto. Your inquiry has been successfully submitted and assigned to our dedicated parts specialists.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="bg-white dark:bg-muted/30 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-muted shadow-2xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-muted">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Reference Number</p>
                            <p className="text-xl font-black text-secondary dark:text-blue-400">#RQ-{quoteId.slice(-6).toUpperCase()}</p>
                        </div>
                        <div className="space-y-1 md:pl-8">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date Submitted</p>
                            <p className="text-xl font-black text-secondary dark:text-foreground">{currentDate}</p>
                        </div>
                        <div className="space-y-1 md:pl-8">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</p>
                            <p className="text-xl font-black text-primary dark:text-blue-400 flex items-center gap-2 justify-center italic">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                Under Review
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#1D428A]/5 dark:bg-primary/10 p-6 rounded-2xl border border-primary/10 flex items-start gap-4 text-left">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                            <Info size={20} className="text-white" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-primary dark:text-blue-400 font-black text-xs uppercase tracking-wider">What's next?</p>
                            <p className="text-primary/70 dark:text-blue-300/70 text-sm font-semibold leading-relaxed">
                                Our team will review your request and verify part compatibility. You will receive a detailed quote with pricing and availability in your inbox within <span className="text-primary dark:text-blue-400 font-black">2-4 business hours</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <Link href="/shop" className="btn-primary w-full sm:w-auto px-12 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-sm font-black uppercase tracking-widest bg-primary">
                        <ShoppingBag size={20} className="mr-3" />
                        Continue Shopping
                    </Link>
                    <Link href="/profile" className="w-full sm:w-auto px-12 py-5 rounded-2xl border-2 border-gray-200 dark:border-muted hover:border-primary dark:hover:border-blue-400 hover:text-primary dark:hover:text-blue-400 transition-all text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 text-gray-400">
                        <FileText size={20} />
                        View Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function InquiryConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
