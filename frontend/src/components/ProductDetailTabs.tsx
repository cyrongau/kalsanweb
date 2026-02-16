"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FileText, Truck, Info, Star, AlignLeft, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { API_BASE_URL } from '@/lib/config';
import Modal from '@/components/ui/Modal';

const tabs = [
    { id: 'description', label: 'Description', icon: AlignLeft },
    { id: 'specifications', label: 'Specifications', icon: FileText },
    { id: 'compatibility', label: 'Vehicle Compatibility', icon: Truck },
    { id: 'shipping', label: 'Shipping Info', icon: Info },
    { id: 'reviews', label: 'Reviews', icon: Star },
];

// ... (inside component render, after 'shipping' tab content)



const specifications = [
    { label: 'Material', value: 'High-Grade Cast Aluminum' },
    { label: 'Compression Ratio', value: '9.5:1' },
    { label: 'Bore Size', value: '62.00 mm' },
    { label: 'Heat Treatment', value: 'T6 Temper' },
    { label: 'Weight', value: '4.25 kg' },
    { label: 'Surface Finish', value: 'Anti-Corrosive Coating' },
];

interface ProductDetailTabsProps {
    description?: string;
    specifications?: Record<string, string>;
    compatibility?: string[];
    reviews?: any[];
}

const ProductDetailTabs = ({ description, specifications = {}, compatibility = [], reviews: initialReviews = [] }: ProductDetailTabsProps) => {
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState(initialReviews);

    // Form State
    const [rating, setRating] = useState(0);
    const [headline, setHeadline] = useState('');
    const [comment, setComment] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verification Modal
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'success' | 'error', title: string, message: string }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    const { user } = useAuth(); // Assuming useAuth exists and provides user info
    const [productId, setProductId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const id = window.location.pathname.split('/').pop() || null;
            setProductId(id);
        }
    }, []);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setModalConfig({
                isOpen: true,
                type: 'error',
                title: 'Rating Required',
                message: 'Please select a rating before submitting your review.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                product_id: productId,
                rating,
                title: headline,
                comment,
                guest_name: !user ? guestName : undefined,
                guest_email: !user ? guestEmail : undefined,
            };

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(reviewData),
            });

            if (response.ok) {
                setModalConfig({
                    isOpen: true,
                    type: 'success',
                    title: 'Review Submitted',
                    message: 'Thank you! Your review has been submitted and is pending approval.'
                });
                // Reset form
                setRating(0);
                setHeadline('');
                setComment('');
                setGuestName('');
                setGuestEmail('');
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            setModalConfig({
                isOpen: true,
                type: 'error',
                title: 'Submission Error',
                message: 'Something went wrong while submitting your review. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const specList = Object.entries(specifications).map(([label, value]) => ({ label, value }));

    return (
        <div className="bg-white dark:bg-muted/10 rounded-3xl shadow-soft border border-gray-100 dark:border-muted overflow-hidden transition-colors">
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
            />

            {/* Tab Headers */}
            <div className="flex border-b border-gray-100 dark:border-muted">
                {/* ... existing tab mapping ... */}
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex-1 py-5 px-4 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2",
                            activeTab === tab.id
                                ? "text-primary border-primary bg-primary/5"
                                : "text-gray-400 border-transparent hover:text-gray-600"
                        )}
                    >
                        <tab.icon size={18} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
                {activeTab === 'description' && (
                    <div
                        className="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-300 [&_*]:!bg-transparent"
                        dangerouslySetInnerHTML={{ __html: description || "<p>No detailed description available.</p>" }}
                    />
                )}
                {activeTab === 'specifications' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {specList.length > 0 ? specList.map((spec, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-50 dark:border-muted/50 pb-4">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">{spec.label}</span>
                                <span className="text-sm font-black text-secondary dark:text-foreground">{spec.value}</span>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500 font-medium col-span-2 text-center py-4">No detailed specifications available for this part.</p>
                        )}
                    </div>
                )}
                {activeTab === 'compatibility' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium space-y-2">
                        {compatibility.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {compatibility.map((item, idx) => (
                                    <li key={idx} className="uppercase tracking-tight font-bold">{item}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center py-4 italic">Universal Fit / No specific model compatibility listed.</p>
                        )}
                    </div>
                )}
                {activeTab === 'shipping' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium space-y-4 py-4">
                        <div className="p-4 bg-gray-50 dark:bg-muted/20 rounded-2xl border border-gray-100 dark:border-muted">
                            <h4 className="text-xs font-black text-secondary dark:text-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Truck size={14} className="text-primary" />
                                Regional & Domestic Shipping
                            </h4>
                            <p className="leading-relaxed">
                                We offer swift and reliable delivery services within the country. For regional transport (Ethiopia ↔ Berbera), we partner with trusted couriers like <span className="text-secondary dark:text-white font-bold">Sahal Transport</span> and <span className="text-secondary dark:text-white font-bold">Fudaydiye Logistics</span> to ensure your parts arrive safely and on time.
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="font-black text-secondary dark:text-foreground mt-2 uppercase tracking-widest text-xs">
                                Estimated Delivery: 1-3 Business Days (Domestic)
                            </p>
                        </div>
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div className="max-w-3xl mx-auto py-4 space-y-12">
                        {/* Reviews Stats */}
                        <div className="text-center space-y-4">
                            <h3 className="text-2xl font-black text-secondary dark:text-foreground">Customer Reviews</h3>
                            <div className="flex items-center justify-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={24} className="fill-current" />
                                    ))}
                                </div>
                                <span className="text-lg font-bold text-gray-500 dark:text-gray-400">4.8 out of 5</span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Based on {reviews?.length || 0} reviews</p>
                        </div>

                        {/* Review List */}
                        <div className="space-y-6">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((review: any) => (
                                    <div key={review.id} className="bg-gray-50 dark:bg-muted/10 p-6 rounded-3xl border border-gray-100 dark:border-muted">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white dark:bg-muted/30 flex items-center justify-center font-black text-primary text-lg uppercase">
                                                    {review.user?.first_name?.[0] || review.guest_name?.[0] || 'G'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-secondary dark:text-foreground text-sm">
                                                        {review.user?.first_name || review.guest_name || 'Guest User'}
                                                    </h4>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex text-yellow-400 gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-200 dark:text-gray-600"} />
                                                ))}
                                            </div>
                                        </div>
                                        {review.title && <h5 className="font-bold text-secondary dark:text-foreground mb-2">{review.title}</h5>}
                                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-gray-50/50 dark:bg-muted/5 rounded-3xl border border-dashed border-gray-200 dark:border-muted">
                                    <p className="text-gray-400 font-bold">No reviews yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>

                        {/* Review Form */}
                        <div className="bg-white dark:bg-muted/10 rounded-[2rem] p-8 border border-gray-100 dark:border-muted shadow-soft">
                            <h4 className="text-xl font-black text-secondary dark:text-foreground mb-6">Write a Review</h4>
                            <form className="space-y-6" onSubmit={handleSubmitReview}>
                                {!user && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-background border border-gray-100 dark:border-muted rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-background border border-gray-100 dark:border-muted rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="text-yellow-400 hover:scale-110 transition-transform"
                                            >
                                                <Star size={32} className={star <= rating ? "fill-current" : "text-gray-200 dark:text-gray-700"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Headline</label>
                                    <input
                                        type="text"
                                        required
                                        value={headline}
                                        onChange={(e) => setHeadline(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-background border border-gray-100 dark:border-muted rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="What's most important to know?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Review</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-background border border-gray-100 dark:border-muted rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        placeholder="Tell us what you liked or disliked..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-primary/20"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailTabs;
