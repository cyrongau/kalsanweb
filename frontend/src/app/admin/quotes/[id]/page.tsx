"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft,
    User,
    Mail,
    Calendar,
    Clock,
    Package,
    DollarSign,
    FileText,
    Send,
    AlertCircle,
    Plus,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useAdmin } from '@/components/providers/AdminProvider';
import { API_BASE_URL } from '@/lib/config';

const QuoteDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useNotification();
    const { markAsRead } = useAdmin();
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prices, setPrices] = useState<any[]>([]);
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/quotes/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setQuote(data);
                    setAdminNotes(data.admin_notes || '');
                    // Initialize prices from existing data or set to 0
                    setPrices(data.items.map((item: any) => ({
                        itemId: item.id,
                        unitPrice: Number(item.unit_price) || 0
                    })));

                    // Mark as read if it's currently unread
                    if (!data.is_read) {
                        markAsRead('quotes', data.id);
                    }
                } else {
                    showToast('Error', 'Quote not found', 'error');
                    router.push('/admin/quotes');
                }
            } catch (error) {
                console.error("Failed to fetch quote details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchQuote();
    }, [params.id]);

    const handlePriceChange = (itemId: string, value: string) => {
        setPrices(prev => prev.map(p =>
            p.itemId === itemId ? { ...p, unitPrice: Number(value) } : p
        ));
    };

    const handleSendResponse = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/quotes/${params.id}/prices`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: prices })
            });

            if (res.ok) {
                showToast('Quote Sent', 'The finalized pricing has been sent to the customer.', 'success');
                router.push('/admin/quotes');
            } else {
                showToast('Error', 'Failed to send quote response.', 'error');
            }
        } catch (error) {
            console.error("Failed to send quote:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Inquiry Details...</p>
            </div>
        </AdminLayout>
    );

    if (!quote) return null;

    const subtotal = prices.reduce((acc, p) => {
        const item = quote.items.find((i: any) => i.id === p.itemId);
        return acc + (p.unitPrice * (item?.quantity || 0));
    }, 0);

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 group text-gray-500 hover:text-secondary transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                            <ChevronLeft size={20} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Back to Inquiries</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                            quote.status === 'pending' ? "bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20" :
                                quote.status === 'reviewing' ? "bg-orange-50 text-orange-500 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20" :
                                    "bg-emerald-50 text-emerald-500 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20"
                        )}>
                            Status: {quote.status === 'pending' ? 'New Request' : quote.status === 'reviewing' ? 'Draft Review' : 'Pricing Sent'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Line Items & Pricing */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-sm space-y-8">
                            <div>
                                <h2 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight flex items-center gap-3">
                                    <Package size={24} className="text-primary" />
                                    Items Requested
                                </h2>
                                <p className="text-gray-400 text-xs font-medium mt-1 uppercase tracking-widest">Provide unit pricing for each part</p>
                            </div>

                            <div className="space-y-6">
                                {quote.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-6 p-6 rounded-3xl bg-gray-50/50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800/50">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                                            <img
                                                src={item.product?.image_urls?.[0] || 'https://placehold.co/400x300?text=No+Image'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-secondary dark:text-white">{item.product?.name}</h3>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">SKU: {item.product?.sku || 'N/A'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Qty</span>
                                                    <span className="text-lg font-black text-primary">{item.quantity}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 pt-4">
                                                <div className="flex-1 max-w-[200px] relative group">
                                                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="number"
                                                        placeholder="Unit Price"
                                                        value={prices.find(p => p.itemId === item.id)?.unitPrice || ''}
                                                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm font-black outline-none focus:ring-4 focus:ring-primary/5 transition-all text-secondary dark:text-white"
                                                    />
                                                </div>
                                                <div className="text-right flex-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Line Total</span>
                                                    <span className="text-sm font-black text-secondary dark:text-white">
                                                        ${((prices.find(p => p.itemId === item.id)?.unitPrice || 0) * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Table */}
                            <div className="pt-10 border-t border-gray-50 dark:border-slate-800 space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>Shipping Est.</span>
                                    <span className="text-emerald-500">TBD / Included</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-lg font-black text-secondary dark:text-white uppercase tracking-tight">Estimated Total</span>
                                    <span className="text-3xl font-black text-primary">${subtotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                            <h2 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight flex items-center gap-3">
                                <FileText size={24} className="text-primary" />
                                Notes & Communication
                            </h2>
                            <textarea
                                placeholder="Add internal notes or instructions for the customer..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                className="w-full min-h-[150px] bg-gray-50/50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all text-secondary dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Right Column: Customer Info & Timeline */}
                    <div className="space-y-8">
                        {/* Customer Card */}
                        <div className="bg-[#1D428A] rounded-[2.5rem] p-10 text-white shadow-xl shadow-primary/20 space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tight">{quote.user?.displayName || 'Guest User'}</h3>
                                    <p className="text-white/60 text-xs font-medium">Customer Member</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={16} className="text-white/40" />
                                    <span className="font-bold">{quote.user?.email || 'No email provided'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar size={16} className="text-white/40" />
                                    <span className="font-bold">Requested: {new Date(quote.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock size={16} className="text-white/40" />
                                    <span className="font-bold">Expires: {quote.expires_at ? new Date(quote.expires_at).toLocaleDateString() : '7 Days Default'}</span>
                                </div>
                            </div>

                            <Link
                                href={`/admin/users/${quote.user?.id}`}
                                className="block w-full text-center py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                View Customer Profile
                            </Link>
                        </div>

                        {/* Status Timeline or Quick Actions */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</h4>

                            <button
                                onClick={handleSendResponse}
                                disabled={isSubmitting || subtotal === 0}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-primary hover:bg-primary-dark disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-400 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all group active:scale-95"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Send Finalized Quote
                                    </>
                                )}
                            </button>

                            <button className="w-full flex items-center justify-center gap-3 py-4 bg-gray-50 dark:bg-slate-950 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                                Save Draft (Internal)
                            </button>

                            <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20 flex gap-4">
                                <AlertCircle size={20} className="text-orange-500 flex-shrink-0" />
                                <p className="text-[10px] text-orange-700 dark:text-orange-400 font-bold leading-relaxed uppercase tracking-tight">
                                    Sending this quote will automatically notify the customer via email and enable their checkout flow.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default QuoteDetailsPage;
