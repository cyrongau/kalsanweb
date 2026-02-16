"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    ArrowRight,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useAdmin } from '@/components/providers/AdminProvider';
import { API_BASE_URL } from '@/lib/config';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

const QuotesPage = () => {
    const { showToast } = useNotification();
    const { markAsRead } = useAdmin();
    const [quotes, setQuotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

    const handleExportCSV = () => {
        const headers = 'Quote ID,Customer,Email,Part Requested,Amount,Status,Date\n';
        const csvContent = quotes.map(q =>
            `${q.id},${q.user?.name},${q.user?.email},${q.items?.[0]?.product?.name},${q.total_amount},${q.status},${q.created_at}`
        ).join('\n');

        const blob = new Blob([headers + csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quote_inquiries_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Export Successful', 'Quote inquiries have been downloaded as CSV.', 'success');
    };

    const fetchQuotes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/quotes`);
            if (res.ok) {
                const result = await res.json();
                setQuotes(result.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch quotes:", error);
            showToast('Error', 'Failed to load quote inquiries.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        console.log("Delete button clicked for ID:", id);
        e.stopPropagation();
        e.preventDefault(); // Adding verify prevention
        setQuoteToDelete(id);
        setDeleteModalOpen(true);
        console.log("Modal state set to true");
    };

    const confirmDelete = async () => {
        console.log("Confirm delete triggered for:", quoteToDelete);
        if (!quoteToDelete) return;

        try {
            const res = await fetch(`${API_BASE_URL}/quotes/${quoteToDelete}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                showToast('Success', 'Quote deleted successfully', 'success');
                setQuotes(prev => prev.filter(q => q.id !== quoteToDelete));
            } else {
                showToast('Error', 'Failed to delete quote', 'error');
            }
        } catch (error) {
            console.error("Failed to delete quote:", error);
            showToast('Error', 'Failed to delete quote', 'error');
        } finally {
            setDeleteModalOpen(false);
            setQuoteToDelete(null);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const filteredQuotes = quotes.filter(q => {
        const matchesSearch = (q.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.items?.some((item: any) => item.product?.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'All' ||
            (statusFilter === 'New' && q.status === 'pending') ||
            (statusFilter === 'Processing' && q.status === 'reviewing') ||
            (statusFilter === 'Sent' && q.status === 'price_ready') ||
            (statusFilter === 'Expired' && q.status === 'expired');

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-secondary dark:text-white uppercase tracking-tight">Quote Inquiries</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage and respond to customer spare part requests.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:border-primary/20 transition-all"
                        >
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, Customer, or Part..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                        {['All', 'New', 'Processing', 'Sent', 'Expired'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                    statusFilter === status
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                        : "bg-white dark:bg-slate-900 text-gray-400 border-gray-100 dark:border-slate-800 hover:border-primary/20"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-50 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Quote ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Part Requested</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Inquiries...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredQuotes.map((quote) => (
                                    <tr
                                        key={quote.id}
                                        className={cn(
                                            "group transition-colors",
                                            !quote.is_read ? "bg-primary/[0.03] dark:bg-primary/[0.05]" : "hover:bg-gray-50/30 dark:hover:bg-slate-800/10"
                                        )}
                                    >
                                        <td className="px-8 py-6 relative">
                                            {!quote.is_read && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                            )}
                                            <span className={cn(
                                                "text-sm truncate block max-w-[100px]",
                                                !quote.is_read ? "font-black text-primary" : "font-bold text-secondary dark:text-white"
                                            )}>
                                                {quote.id.split('-')[0]}...
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-secondary dark:text-white">{quote.user?.name || 'Guest'}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">{quote.user?.email || 'No Email'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {quote.items?.[0]?.product?.name}
                                                    {quote.items?.length > 1 && ` + ${quote.items.length - 1} more`}
                                                </span>
                                                <span className="text-[10px] text-primary font-black uppercase tracking-widest">
                                                    {quote.total_amount ? `$${quote.total_amount}` : 'Pricing TBD'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                                                quote.status === 'pending' ? "bg-blue-50 text-blue-500 dark:bg-blue-500/10" :
                                                    quote.status === 'reviewing' ? "bg-orange-50 text-orange-500 dark:bg-orange-500/10" :
                                                        quote.status === 'price_ready' ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10" :
                                                            "bg-gray-50 text-gray-500 dark:bg-slate-800"
                                            )}>
                                                {quote.status === 'pending' && <AlertCircle size={10} />}
                                                {quote.status === 'reviewing' && <Clock size={10} />}
                                                {quote.status === 'price_ready' && <CheckCircle2 size={10} />}
                                                {quote.status === 'pending' ? 'New' : quote.status === 'reviewing' ? 'Processing' : quote.status === 'price_ready' ? 'Sent' : quote.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-gray-500 tracking-tight">
                                                {new Date(quote.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/quotes/${quote.id}`}
                                                    onClick={() => !quote.is_read && markAsRead('quotes', quote.id)}
                                                    className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-primary rounded-xl transition-all group/btn"
                                                >
                                                    <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                </Link>
                                                <button
                                                    onClick={(e) => handleDelete(quote.id, e)}
                                                    className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-all group/btn"
                                                >
                                                    <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredQuotes.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-950 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300">
                                <Search size={32} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-black text-secondary dark:text-white uppercase tracking-tight">No results found</p>
                                <p className="text-sm font-medium text-gray-400 italic">Try adjusting your search or filters.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>



            {/* Actions */}



            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Quote"
                message="Are you sure you want to delete this quote? This action cannot be undone."
            />
        </AdminLayout>
    );
};

export default QuotesPage;
