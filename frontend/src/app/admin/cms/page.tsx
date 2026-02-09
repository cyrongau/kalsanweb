"use client";

import React, { useState } from 'react';
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Link as LinkIcon,
    ChevronDown,
    Eye,
    Monitor,
    Tablet,
    Smartphone,
    Play,
    Layout,
    ShoppingBag,
    Search,
    X,
    ExternalLink,
    Save,
    Send,
    FileText as FileIcon,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import RichTextEditor from '@/components/cms/RichTextEditor';
import { useAdmin } from '@/components/providers/AdminProvider';
import { useNotification } from '@/components/providers/NotificationProvider';
import ImageSelectionModal from '@/components/admin/ImageSelectionModal';

const SectionHeader = ({ icon: Icon, title, subtitle, isVisible, onToggleVisibility }: any) => (
    <div className="flex items-center justify-between p-6 border-b border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 dark:border-slate-700">
                <Icon size={20} />
            </div>
            <div>
                <h3 className="text-base font-black text-secondary dark:text-white tracking-tight">{title}</h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-widest">{subtitle}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-gray-200 dark:border-slate-700">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visible</span>
                <button
                    onClick={onToggleVisibility}
                    className={cn(
                        "w-10 h-5 rounded-full transition-colors relative",
                        isVisible ? "bg-primary" : "bg-gray-200 dark:bg-slate-800"
                    )}
                >
                    <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                        isVisible ? "left-6" : "left-1"
                    )} />
                </button>
            </div>
            <button className="text-gray-400 hover:text-secondary dark:hover:text-white">
                <ChevronDown size={20} />
            </button>
        </div>
    </div>
);

const HeroSliderManager = ({ slides, onUpdate }: { slides: any[], onUpdate: (slides: any[]) => void }) => {
    const [selectedSlideId, setSelectedSlideId] = useState<number | null>(null);

    const addSlide = () => {
        if (slides.length >= 4) return;
        const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1;
        onUpdate([...slides, {
            id: newId,
            headline: 'New Exciting Collection',
            subtext: 'Description of your new slide',
            cta: 'Learn More',
            link: '/shop',
            image: 'https://placehold.co/1920x1080/f3f4f6/1d428a?text=New+Slide'
        }]);
    };

    const removeSlide = (id: number) => {
        onUpdate(slides.filter(s => s.id !== id));
    };

    const updateSlide = (id: number, field: string, value: string) => {
        onUpdate(slides.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 overflow-hidden">
            <SectionHeader
                icon={Play}
                title="Hero Slider Manager"
                subtitle="Main attraction at the top of the homepage"
                isVisible={true}
            />
            <div className="p-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {slides.map((slide, idx) => (
                        <div key={slide.id} className="bg-gray-50/50 dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 space-y-6 group">
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-inner">
                                <img src={slide.image} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setSelectedSlideId(slide.id)}
                                        className="w-10 h-10 bg-white rounded-xl text-secondary flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                    >
                                        <ImageIcon size={18} />
                                    </button>
                                </div>
                                <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest border border-white/5">
                                    Slide #{idx + 1}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Headline</label>
                                    <input
                                        type="text"
                                        value={slide.headline}
                                        onChange={(e) => updateSlide(slide.id, 'headline', e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Subtext</label>
                                    <input
                                        type="text"
                                        value={slide.subtext}
                                        onChange={(e) => updateSlide(slide.id, 'subtext', e.target.value)}
                                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">CTA Label</label>
                                        <input
                                            type="text"
                                            value={slide.cta}
                                            onChange={(e) => updateSlide(slide.id, 'cta', e.target.value)}
                                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Link</label>
                                        <input
                                            type="text"
                                            value={slide.link}
                                            onChange={(e) => updateSlide(slide.id, 'link', e.target.value)}
                                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => removeSlide(slide.id)}
                                className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest pt-2 hover:opacity-70 transition-opacity"
                            >
                                <Trash2 size={12} />
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addSlide}
                        disabled={slides.length >= 4}
                        className={cn(
                            "border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl aspect-video xl:aspect-auto flex flex-col items-center justify-center space-y-4 text-gray-400 hover:border-primary hover:text-primary transition-all group p-8",
                            slides.length >= 4 && "opacity-50 cursor-not-allowed hover:border-gray-100 hover:text-gray-400"
                        )}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border border-gray-100 dark:border-slate-800">
                            <Plus size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-black uppercase tracking-widest">Add Slide</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Maximum 4 slides</p>
                        </div>
                    </button>
                </div>
            </div>

            <ImageSelectionModal
                isOpen={!!selectedSlideId}
                onClose={() => setSelectedSlideId(null)}
                title="Change Slide Image"
                currentImage={slides.find(s => s.id === selectedSlideId)?.image}
                onSelect={(url) => {
                    if (selectedSlideId) updateSlide(selectedSlideId, 'image', url);
                    setSelectedSlideId(null);
                }}
            />
        </div>
    );
};

const BannerManagement = ({ banners, onUpdate }: { banners: any[], onUpdate: (banners: any[]) => void }) => {
    const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);

    const addBanner = () => {
        if (banners.length >= 3) return;
        const colors = ['bg-[#B4C424]', 'bg-[#F2D7B1]', 'bg-[#1d428a]/20'];
        onUpdate([...banners, {
            id: Date.now(),
            title: 'NEW OFFER',
            subtitle: 'Offer description',
            color: colors[banners.length % colors.length],
            link: '/shop',
            image: ''
        }]);
    };

    const removeBanner = (id: number) => {
        onUpdate(banners.filter(b => b.id !== id));
    };

    const updateBanner = (id: number, field: string, value: string) => {
        onUpdate(banners.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 overflow-hidden">
            <SectionHeader
                icon={Layout}
                title="Banner Management"
                subtitle="Promotional grids and side-by-side offers"
                isVisible={true}
            />
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {banners.map((banner) => (
                            <div key={banner.id} className="space-y-4 relative group">
                                <button
                                    onClick={() => removeBanner(banner.id)}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-900 rounded-full shadow-lg border border-gray-100 dark:border-slate-800 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                                >
                                    <X size={14} />
                                </button>
                                <div className={cn("aspect-[4/3] rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-lg relative overflow-hidden group/item", banner.color)}>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 text-[8px] font-black uppercase">Banner Item</div>
                                    <div className="w-12 h-12 bg-white rounded-xl mb-4 shadow-sm overflow-hidden flex items-center justify-center">
                                        {banner.image ? (
                                            <img src={banner.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-4 h-4 bg-gray-100 rounded-full" />
                                        )}
                                    </div>
                                    <p className="text-[8px] font-black uppercase tracking-tighter mb-1 opacity-60">Brand Collection</p>
                                    <h4 className="font-black text-xl tracking-tighter mb-4">{banner.title}</h4>
                                    <button className="bg-black/80 text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg">Shop Now</button>

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => setSelectedBannerId(banner.id)}
                                            className="bg-white text-secondary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Title</label>
                                        <input
                                            type="text"
                                            value={banner.title}
                                            onChange={(e) => updateBanner(banner.id, 'title', e.target.value)}
                                            className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Destination Link</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={banner.link}
                                                onChange={(e) => updateBanner(banner.id, 'link', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addBanner}
                        disabled={banners.length >= 3}
                        className={cn(
                            "border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center space-y-4 text-gray-400 hover:border-primary hover:text-primary transition-all group min-h-[300px]",
                            banners.length >= 3 && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest">Add Banner</p>
                    </button>
                </div>
            </div>

            <ImageSelectionModal
                isOpen={!!selectedBannerId}
                onClose={() => setSelectedBannerId(null)}
                title="Change Banner Image"
                currentImage={banners.find(b => b.id === selectedBannerId)?.image}
                onSelect={(url) => {
                    if (selectedBannerId) updateBanner(selectedBannerId, 'image', url);
                    setSelectedBannerId(null);
                }}
            />
        </div>
    );
};

const FAQEditor = ({ qas, onChange }: { qas: any[], onChange: (qas: any[]) => void }) => {
    const [items, setItems] = useState(qas.length > 0 ? qas : [{ q: '', a: '' }]);

    const addPair = () => setItems([...items, { q: '', a: '' }]);
    const removePair = (idx: number) => {
        const newItems = items.filter((_, i) => i !== idx);
        setItems(newItems.length > 0 ? newItems : [{ q: '', a: '' }]);
    };
    const updatePair = (idx: number, field: 'q' | 'a', val: string) => {
        const newItems = items.map((item, i) => i === idx ? { ...item, [field]: val } : item);
        setItems(newItems);
        onChange(newItems);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">FAQ Questions & Answers</label>
                <button onClick={addPair} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:opacity-70">
                    <Plus size={12} /> Add Pair
                </button>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, idx) => (
                    <div key={idx} className="p-6 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-4 relative group">
                        <button
                            onClick={() => removePair(idx)}
                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Question #{idx + 1}</label>
                            <input
                                type="text"
                                value={item.q}
                                onChange={(e) => updatePair(idx, 'q', e.target.value)}
                                placeholder="What is your return policy?"
                                className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Answer</label>
                            <textarea
                                value={item.a}
                                onChange={(e) => updatePair(idx, 'a', e.target.value)}
                                placeholder="We offer a 30-day return policy..."
                                className="w-full h-24 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryHighlightsManager = ({ categories, onUpdate }: { categories: any[], onUpdate: (categories: any[]) => void }) => {
    const [selectedCatIdx, setSelectedCatIdx] = useState<number | null>(null);

    const updateCategory = (idx: number, field: string, value: string) => {
        onUpdate(categories.map((cat, i) => i === idx ? { ...cat, [field]: value } : cat));
    };

    const handleReplaceImage = (idx: number) => {
        setSelectedCatIdx(idx);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 overflow-hidden">
            <SectionHeader
                icon={ShoppingBag}
                title="Category Highlights Manager"
                subtitle="Manage specialized sections with background images"
                isVisible={true}
            />
            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="bg-gray-50/50 dark:bg-slate-950 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-secondary dark:text-white font-black uppercase tracking-tighter">Section #{idx + 1}</h4>
                                <button
                                    onClick={() => handleReplaceImage(idx)}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70"
                                >
                                    Replace Image
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-1">
                                    <div className="aspect-square rounded-2xl overflow-hidden shadow-inner border border-gray-100 dark:border-slate-800">
                                        <img src={cat.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Title</label>
                                        <input
                                            type="text"
                                            value={cat.title}
                                            onChange={(e) => updateCategory(idx, 'title', e.target.value)}
                                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Link</label>
                                        <input
                                            type="text"
                                            value={cat.link}
                                            onChange={(e) => updateCategory(idx, 'link', e.target.value)}
                                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-secondary dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Description</label>
                                <textarea
                                    value={cat.description}
                                    onChange={(e) => updateCategory(idx, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ImageSelectionModal
                isOpen={selectedCatIdx !== null}
                onClose={() => setSelectedCatIdx(null)}
                title="Change Section Image"
                currentImage={selectedCatIdx !== null ? categories[selectedCatIdx].image : undefined}
                onSelect={(url) => {
                    if (selectedCatIdx !== null) updateCategory(selectedCatIdx, 'image', url);
                    setSelectedCatIdx(null);
                }}
            />
        </div>
    );
};


const ContentEditModal = ({ isOpen, onClose, page, onSave }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-secondary/80 dark:bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-10 space-y-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tighter uppercase">Edit {page?.name}</h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Kalsan Content Manager</p>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-secondary dark:hover:text-white transition-all">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {page?.id === 'faq' ? (
                            <FAQEditor qas={page.qas || []} onChange={(qas) => { }} />
                        ) : (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Page Content (WYSIWYG)</label>
                                <RichTextEditor
                                    value={page?.content || ''}
                                    onChange={(val) => { }}
                                    placeholder="Start writing your policy content..."
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary dark:hover:text-white transition-colors text-center">Discard Changes</button>
                        <button onClick={() => { onSave(); onClose(); }} className="flex-[2] btn-primary py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Save Content</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LegalContentManager = () => {
    const [editingPage, setEditingPage] = useState<any>(null);
    const [pages, setPages] = useState([
        { id: 'privacy', name: 'Privacy Policy', icon: Shield },
        { id: 'terms', name: 'Terms of Service', icon: FileIcon },
        { id: 'refunds', name: 'Returns & Refunds', icon: ShoppingBag },
        { id: 'faq', name: 'Frequently Asked Questions', icon: ExternalLink, qas: [{ q: 'How do I track my order?', a: 'You can track your order in the profile section.' }] }
    ]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 overflow-hidden">
            <SectionHeader
                icon={FileIcon}
                title="Information & Legal Pages"
                subtitle="Manage content for terms, privacy and help pages"
                isVisible={true}
            />
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pages.map((p) => (
                        <div key={p.id} className="bg-gray-50/50 dark:bg-slate-950 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110">
                                    <p.icon className="text-primary" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-black text-secondary dark:text-white uppercase tracking-tight">{p.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Last modified: Oct 12, 2023</p>
                                </div>
                                <button
                                    onClick={() => setEditingPage(p)}
                                    className="btn-primary py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-50 dark:bg-slate-800 text-secondary dark:text-white shadow-none hover:bg-primary hover:text-white transition-all"
                                >
                                    Edit Content
                                </button>
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 whitespace-pre-wrap">
                                <div className="text-xs text-gray-400 line-clamp-3" dangerouslySetInnerHTML={{ __html: p.id === 'faq' ? 'FAQ Section - Manage Q&A pairs' : 'Rich Text Content - Paragraphs, headings, and formatting enabled' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ContentEditModal
                isOpen={!!editingPage}
                onClose={() => setEditingPage(null)}
                page={editingPage}
                onSave={() => { }}
            />
        </div>
    );
};

const DEFAULT_SLIDER = [
    { id: 1, headline: 'Summer Collection 2024', subtext: 'Discover the heat of this season', cta: 'Shop Now', link: '/shop', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, headline: 'Modern Living Essentials', subtext: 'Minimalism for your home', cta: 'Browse', link: '/shop', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop' }
];

const DEFAULT_BANNERS = [
    { id: 1, title: 'FREE SHIPPING', subtitle: 'Orders over $200', color: 'bg-[#B4C424]', link: '/shop', image: '' },
    { id: 2, title: 'NEW ARRIVALS', subtitle: 'Modern Collection', color: 'bg-[#F2D7B1]', link: '/shop', image: '' }
];

const DEFAULT_HIGHLIGHTS = [
    { title: "Engine Auto Parts", description: "Parts engineered to ensure best quality, performance and maintenance.", image: "https://placehold.co/300x300/f3f4f6/1d428a?text=Engine+Parts", link: "/shop?category=engine" },
    { title: "Shock Absorbers", description: "Great quality suspension systems and shocks to replace your old ones.", image: "https://placehold.co/300x300/f3f4f6/1d428a?text=Shock+Absorbers", link: "/shop?category=shocks" }
];

const CMSPage = () => {
    const { settings, updateSettings } = useAdmin();
    const { showToast, showModal } = useNotification();
    const [previewMode, setPreviewMode] = useState('desktop');

    const [sliderState, setSliderState] = useState(settings.heroSlider?.length > 0 ? settings.heroSlider : DEFAULT_SLIDER);
    const [bannerState, setBannerState] = useState(settings.banners?.length > 0 ? settings.banners : DEFAULT_BANNERS);
    const [categoryState, setCategoryState] = useState(settings.categoryHighlights?.length > 0 ? settings.categoryHighlights : DEFAULT_HIGHLIGHTS);

    const handleSaveDraft = () => {
        showToast('Draft Saved', 'Your changes have been saved locally.', 'success');
    };

    const handlePublish = () => {
        showModal({
            title: 'Publish Changes',
            message: 'Are you sure you want to publish these changes? This will update the live storefront immediately.',
            type: 'info',
            confirmText: 'Publish Now',
            cancelText: 'Cancel',
            onConfirm: async () => {
                await updateSettings({
                    heroSlider: sliderState,
                    banners: bannerState,
                    categoryHighlights: categoryState
                });
                showToast('Changes Published', 'Your storefront has been updated successfully!', 'success');
            }
        });
    };

    const handleAddSection = () => {
        showModal({
            title: 'Add New Section',
            message: 'Select a section type to add it to your homepage layout.',
            type: 'info',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            onConfirm: () => {
                showToast('Coming Soon', 'Dynamic section adding is currently under development.', 'info');
            }
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-12 pb-32 animate-in fade-in duration-700">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Admin</span>
                            <ChevronDown size={14} className="-rotate-90" />
                            <span className="text-primary">Content Manager</span>
                        </div>
                        <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Homepage Layout Editor</h2>
                        <p className="text-gray-500 dark:text-gray-300 font-medium text-lg leading-relaxed">
                            Customize your storefront's visual appearance and marketing flow.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSaveDraft}
                            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm text-secondary dark:text-white"
                        >
                            <Save size={16} />
                            Save Draft
                        </button>
                        <button
                            onClick={handlePublish}
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-primary/20"
                        >
                            <Send size={16} />
                            Publish Changes
                        </button>
                    </div>
                </div>

                {/* Section Managers */}
                <div className="space-y-8">
                    <div className="flex justify-end">
                        <button
                            onClick={handleAddSection}
                            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-6 py-3 rounded-xl text-xs font-black text-secondary dark:text-white uppercase tracking-widest flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-sm"
                        >
                            <Plus size={18} className="text-primary" />
                            Add New Section
                        </button>
                    </div>

                    <HeroSliderManager slides={sliderState} onUpdate={setSliderState} />
                    <BannerManagement banners={bannerState} onUpdate={setBannerState} />
                    <CategoryHighlightsManager categories={categoryState} onUpdate={setCategoryState} />
                    <LegalContentManager />
                </div>
            </div>

            {/* Floating Preview Toggle */}
            <div className="fixed bottom-10 right-10 z-50 flex items-center gap-2 bg-[#1e1e1e] dark:bg-[#0c0c0c] p-2 rounded-2xl shadow-2xl border border-white/10">
                <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-2">
                    {[
                        { id: 'desktop', icon: Monitor },
                        { id: 'tablet', icon: Tablet },
                        { id: 'mobile', icon: Smartphone }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setPreviewMode(mode.id)}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                previewMode === mode.id ? "bg-primary text-white" : "text-gray-500 hover:text-white"
                            )}
                        >
                            <mode.icon size={18} />
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => showToast('Preview Mode', 'Opening live preview in a new tab...', 'info')}
                    className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all group overflow-hidden relative"
                >
                    <Eye size={16} className="text-primary group-hover:scale-110 transition-transform" />
                    <span className="relative z-10">Preview Live</span>
                </button>
            </div>
        </AdminLayout>
    );
};

export default CMSPage;
