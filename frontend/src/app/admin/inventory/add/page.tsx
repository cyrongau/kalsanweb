"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ChevronRight,
    Eye,
    Rocket,
    Save,
    ChevronDown,
    Search,
    CloudUpload,
    Plus,
    CheckCircle2,
    Monitor,
    Loader2,
    X
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotification } from '@/components/providers/NotificationProvider';
import {
    MediaSlot,
    CompatibilityTag,
    StatusOption,
    FormSectionHeader
} from '@/components/admin/InventoryComponents';
import RichTextEditor from '@/components/cms/RichTextEditor';
import Modal from '@/components/ui/Modal';
import ProductPreview from '@/components/admin/ProductPreview';

const AddProductPage = () => {
    const router = useRouter();
    const { showToast } = useNotification();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dynamic Data State
    const [brands, setBrands] = useState<{ id: string, name: string }[]>([]);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [conditions, setConditions] = useState<{ id: string, name: string }[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sku: `AUTO-BP-${Math.floor(Math.random() * 9000) + 1000}`,
        brand_id: '',
        category_id: '',
        condition_id: '',
        price: '',
        description: '',
        stock_status: 'in_stock',
        quantity: 0,
        universalFit: false,
        specifications: {} as Record<string, string>
    });

    const [images, setImages] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [modelInput, setModelInput] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = window.location.origin.replace('3000', '3001');
                const [brandsRes, catsRes, condsRes] = await Promise.all([
                    fetch(`${baseUrl}/brands`),
                    fetch(`${baseUrl}/categories`),
                    fetch(`${baseUrl}/conditions`)
                ]);

                if (brandsRes.ok && catsRes.ok && condsRes.ok) {
                    const brandsData = await brandsRes.json();
                    const catsData = await catsRes.json();
                    const condsData = await condsRes.json();
                    setBrands(brandsData);
                    setCategories(catsData);
                    setConditions(condsData);
                }
            } catch (err) {
                console.error("Failed to fetch taxonomy data", err);
            } finally {
                setIsFetchingData(false);
            }
        };
        fetchData();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const baseUrl = window.location.origin.replace('3000', '3001');
            const res = await fetch(`${baseUrl}/uploads`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setImages(prev => [...prev.slice(0, 4), data.url]);
                showToast('Image Uploaded', 'Product image added successfully.', 'success');
            }
        } catch (err) {
            showToast('Upload Failed', 'There was an error uploading the image.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const addModel = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && modelInput.trim()) {
            e.preventDefault();
            if (!models.includes(modelInput.trim())) {
                setModels([...models, modelInput.trim()]);
            }
            setModelInput('');
        }
    };

    const [specifications, setSpecifications] = useState<{ key: string, value: string }[]>([]);

    const addSpec = () => setSpecifications([...specifications, { key: '', value: '' }]);
    const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specifications];
        newSpecs[index][field] = value;
        setSpecifications(newSpecs);
    };
    const removeSpec = (index: number) => setSpecifications(specifications.filter((_, i) => i !== index));

    const handleAction = async (type: 'publish' | 'draft') => {
        if (!formData.name || !formData.brand_id || !formData.category_id) {
            showToast('Missing Fields', 'Please fill in all required basic information.', 'error');
            return;
        }

        setIsPublishing(true);
        try {
            // Convert array to object for backend
            const specObj: Record<string, string> = {};
            specifications.forEach(s => {
                if (s.key.trim()) specObj[s.key.trim()] = s.value;
            });

            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                image_urls: images,
                compatibility: models,
                condition_id: formData.condition_id,
                universal_fit: formData.universalFit,
                specifications: specObj,
                stock_status: type === 'publish' ? 'in_stock' : 'draft'
            };

            const res = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                showToast(
                    type === 'publish' ? 'Product Published' : 'Draft Saved',
                    'The product has been successfully created.',
                    'success'
                );
                router.push('/admin/inventory');
            } else {
                throw new Error("Failed to save product");
            }
        } catch (err) {
            showToast('Action Failed', 'Could not save the product at this time.', 'error');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Breadcrumbs & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Link href="/admin/inventory" className="hover:text-primary transition-colors">Products</Link>
                            <ChevronRight size={12} />
                            <span className="text-secondary dark:text-white">Add New Product</span>
                        </nav>
                        <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Add New Product</h1>
                    </div>

                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-secondary dark:text-white hover:bg-gray-50 transition-all shadow-sm group"
                    >
                        <Eye size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        Preview
                    </button>
                </div>

                <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
                    <ProductPreview
                        product={{
                            ...formData,
                            brand_name: brands.find(b => b.id === formData.brand_id)?.name,
                            category_name: categories.find(c => c.id === formData.category_id)?.name,
                            condition_name: conditions.find(c => c.id === formData.condition_id)?.name,
                            image_urls: images,
                            specifications: specifications.reduce((acc, s) => {
                                if (s.key.trim()) acc[s.key.trim()] = s.value;
                                return acc;
                            }, {} as Record<string, string>)
                        }}
                        onClose={() => setIsPreviewOpen(false)}
                    />
                </Modal>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Basic Information */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50">
                            <FormSectionHeader title="Basic Information" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Heavy Duty Brake Pad Set for TVS King"
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SKU</label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        readOnly
                                        className="w-full bg-gray-100/50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand</label>
                                    <div className="relative">
                                        <select
                                            value={formData.brand_id}
                                            onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                                            className="w-full appearance-none bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            className="w-full appearance-none bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Part Condition</label>
                                    <div className="relative">
                                        <select
                                            value={formData.condition_id}
                                            onChange={(e) => setFormData({ ...formData, condition_id: e.target.value })}
                                            className="w-full appearance-none bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        >
                                            <option value="">Select Condition</option>
                                            {conditions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit Price ($)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50 overflow-hidden">
                            <FormSectionHeader title="Product Description" />
                            <RichTextEditor
                                value={formData.description}
                                onChange={(val) => setFormData({ ...formData, description: val })}
                                placeholder="Enter technical specifications..."
                            />
                        </div>

                        {/* Additional Information (Specifications) */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50">
                            <div className="flex items-center justify-between mb-8">
                                <FormSectionHeader title="Additional Information" subtitle="Key technical specifications & details" />
                                <button
                                    onClick={addSpec}
                                    className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                >
                                    <Plus size={14} /> Add Field
                                </button>
                            </div>

                            <div className="space-y-4">
                                {specifications.map((spec, i) => (
                                    <div key={i} className="flex gap-4 animate-in slide-in-from-left-2 duration-300">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Key (e.g. Material)"
                                                value={spec.key}
                                                onChange={(e) => updateSpec(i, 'key', e.target.value)}
                                                className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="flex-[2]">
                                            <input
                                                type="text"
                                                placeholder="Value (e.g. Carbon Steel)"
                                                value={spec.value}
                                                onChange={(e) => updateSpec(i, 'value', e.target.value)}
                                                className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeSpec(i)}
                                            className="p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                                {specifications.length === 0 && (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-50 dark:border-slate-800 rounded-[2rem]">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No extra details added yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Media */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50">
                            <FormSectionHeader title="Product Media" subtitle="Max 5 images. Suggested size: 1000x1000px" />

                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="relative group">
                                        <div className={cn(
                                            "aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50/50",
                                            images[i] ? "border-solid border-gray-100" : "border-gray-200"
                                        )}>
                                            {images[i] ? (
                                                <img src={images[i]} alt="Product" className="w-full h-full object-cover" />
                                            ) : (
                                                <Plus size={20} className="text-gray-300" />
                                            )}
                                        </div>
                                        {i === 0 && <span className="absolute bottom-2 left-2 text-[8px] font-black uppercase tracking-widest bg-primary text-white px-2 py-1 rounded-lg">Main</span>}
                                    </div>
                                ))}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-gray-50/30 dark:bg-slate-950/30 group hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                    {isUploading ? <Loader2 size={24} className="animate-spin" /> : <CloudUpload size={24} />}
                                </div>
                                <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                                    <span className="text-secondary dark:text-white">Drag and drop images here</span> or click to browse files
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-10">

                        {/* Publishing */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50 space-y-8">
                            <FormSectionHeader title="PUBLISHING" />

                            <div className="space-y-4">
                                <button
                                    onClick={() => handleAction('publish')}
                                    disabled={isPublishing}
                                    className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Rocket size={16} />
                                    Publish Product
                                </button>
                                <button
                                    onClick={() => handleAction('draft')}
                                    disabled={isPublishing}
                                    className="w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-secondary dark:text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                                >
                                    <Save size={16} className="text-gray-400" />
                                    Save Draft
                                </button>
                            </div>

                            <div className="pt-8 border-t border-gray-50 dark:border-slate-800 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Visibility</span>
                                    <span className="text-primary">Public</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Last Modified</span>
                                    <span className="text-secondary dark:text-white">Just now</span>
                                </div>
                            </div>
                        </div>

                        {/* Part Status */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50">
                            <FormSectionHeader title="PART STATUS" />
                            <div className="space-y-3">
                                <StatusOption
                                    id="status-in-stock"
                                    label="In Stock"
                                    value="in_stock"
                                    selected={formData.stock_status === 'in_stock'}
                                    onChange={(v) => setFormData({ ...formData, stock_status: v })}
                                    colorClass="text-emerald-500"
                                />
                                <StatusOption
                                    id="status-out-of-stock"
                                    label="Out of Stock"
                                    value="out_of_stock"
                                    selected={formData.stock_status === 'out_of_stock'}
                                    onChange={(v) => setFormData({ ...formData, stock_status: v })}
                                    colorClass="text-gray-500"
                                />
                                <StatusOption
                                    id="status-discontinued"
                                    label="Discontinued"
                                    value="discontinued"
                                    selected={formData.stock_status === 'discontinued'}
                                    onChange={(v) => setFormData({ ...formData, stock_status: v })}
                                    colorClass="text-red-500"
                                />
                            </div>
                        </div>

                        {/* Compatibility */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50 space-y-8">
                            <div className="flex items-center justify-between">
                                <FormSectionHeader title="COMPATIBILITY" />
                                <Link href="/admin/settings?section=taxonomy" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline mb-8">Manage Models</Link>
                            </div>

                            <div className="space-y-6">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                                    <input
                                        type="text"
                                        value={modelInput}
                                        onChange={(e) => setModelInput(e.target.value)}
                                        onKeyDown={addModel}
                                        placeholder="Add model (e.g. Bajaj RE) + Enter"
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {models.map((model, i) => (
                                        <CompatibilityTag
                                            key={i}
                                            label={model}
                                            onRemove={() => setModels(models.filter((_, idx) => idx !== i))}
                                        />
                                    ))}
                                    {models.length === 0 && !formData.universalFit && (
                                        <p className="text-[10px] text-gray-400 font-medium italic">No models specified</p>
                                    )}
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={cn(
                                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                        formData.universalFit ? "border-primary bg-primary" : "border-gray-200 group-hover:border-primary/40"
                                    )} onClick={() => setFormData({ ...formData, universalFit: !formData.universalFit })}>
                                        {formData.universalFit && <CheckCircle2 size={12} className="text-white" />}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-secondary dark:group-hover:text-white transition-colors">Universal fitment (All models)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AddProductPage;
