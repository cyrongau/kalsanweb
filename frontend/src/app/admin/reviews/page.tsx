"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Clock, MessageSquare, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { API_BASE_URL } from '@/lib/config';

interface Review {
    id: string;
    rating: number;
    comment: string;
    title?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    guest_name?: string;
    guest_email?: string;
    user?: {
        first_name: string;
        last_name: string;
        email: string;
    };
    product: {
        id: string;
        name: string;
        image_urls: string[];
    };
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/reviews/admin`); // Requires auth header naturally, but simplifying for now
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        try {
            const res = await fetch(`${API_BASE_URL}/reviews/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchReviews(); // Refresh
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchReviews();
            }
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-secondary dark:text-white tracking-tight">Review Management</h1>
                    <p className="text-gray-500 font-medium">Moderate customer reviews and feedback.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary w-8 h-8" />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-soft">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800">
                                    <tr>
                                        <th className="text-left py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                                        <th className="text-left py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="text-left py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating & Comment</th>
                                        <th className="text-left py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="text-left py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="text-right py-6 px-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                                        {review.product?.image_urls?.[0] && (
                                                            <img src={review.product.image_urls[0]} className="w-full h-full object-cover" alt="" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-secondary dark:text-white line-clamp-1 max-w-[150px]">{review.product?.name || 'Unknown Product'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex flex-col">
                                                    {review.user ? (
                                                        <>
                                                            <span className="text-sm font-bold text-secondary dark:text-white">{review.user.first_name} {review.user.last_name}</span>
                                                            <span className="text-xs text-gray-400">{review.user.email}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-sm font-bold text-secondary dark:text-white">{review.guest_name || 'Guest'}</span>
                                                            <span className="text-xs text-gray-400">{review.guest_email || 'No email provided'}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 max-w-sm">
                                                <div className="space-y-1">
                                                    <div className="flex gap-0.5 text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-200 dark:text-slate-700"} />
                                                        ))}
                                                    </div>
                                                    {review.title && <p className="text-xs font-bold text-secondary dark:text-white">{review.title}</p>}
                                                    <p className="text-sm text-gray-500 line-clamp-2">{review.comment}</p>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className="text-xs font-medium text-gray-500">{formatDate(review.created_at)}</span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${review.status === 'approved' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
                                                    review.status === 'rejected' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                                                        'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
                                                    }`}>
                                                    {review.status === 'pending' && <Clock size={12} />}
                                                    {review.status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex items-center justify-end gap-2">
                                                    {review.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(review.id, 'approved')}
                                                                className="w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                                                className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 flex items-center justify-center transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {reviews.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                                                No reviews found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
