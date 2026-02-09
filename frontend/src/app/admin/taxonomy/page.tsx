"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    GripVertical,
    ChevronRight,
    ChevronDown,
    MoreVertical,
    Trash2,
    Edit2,
    FolderPlus,
    Download,
    AlertCircle,
    Save,
    Upload,
    X,
    Loader2,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { API_BASE_URL } from '@/lib/config';
import { useNotification } from '@/components/providers/NotificationProvider';
import ImageSelectionModal from '@/components/admin/ImageSelectionModal';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import CategoryModal from '@/components/admin/CategoryModal';

interface Brand {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    hero_banner_url?: string;
    is_active: boolean;
    products_count: number;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    children: Category[];
}

const TaxonomyManager = () => {
    const { showToast } = useNotification();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [conditions, setConditions] = useState<any[]>([]);
    const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
    const [editingCondition, setEditingCondition] = useState<any | null>(null);

    const [confirmationConfig, setConfirmationConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [brandsRes, categoriesRes, conditionsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/brands`),
                fetch(`${API_BASE_URL}/categories`),
                fetch(`${API_BASE_URL}/conditions`)
            ]);

            if (brandsRes.ok && categoriesRes.ok && conditionsRes.ok) {
                const brandsData = await brandsRes.json();
                const categoriesData = await categoriesRes.json();
                const conditionsData = await conditionsRes.json();
                setBrands(brandsData.map((b: any) => ({ ...b, products_count: 0 })));
                setCategories(categoriesData);
                setConditions(conditionsData);
            }
        } catch (error) {
            console.error("Failed to fetch taxonomy data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSavePositions = () => {
        setHasChanges(false);
        showToast('Structure Saved', 'Category hierarchy has been synchronized.', 'success');
    };

    const handleEditBrand = (brand: Brand) => {
        setEditingBrand(brand);
        setIsBrandModalOpen(true);
    };

    const handleDeleteBrand = (id: string) => {
        setConfirmationConfig({
            isOpen: true,
            title: 'Delete Brand?',
            message: 'Are you sure you want to remove this brand? All associated brand metadata will be lost.',
            onConfirm: async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/brands/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        showToast('Brand Deleted', 'The brand has been removed successfully.', 'success');
                        fetchData();
                    }
                } catch (error) {
                    showToast('Error', 'Failed to delete brand.', 'error');
                }
            }
        });
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryModalOpen(true);
    };

    const handleDeleteCategory = (id: string) => {
        setConfirmationConfig({
            isOpen: true,
            title: 'Delete Category?',
            message: 'Are you sure you want to remove this category? This will also affect any associated child categories.',
            onConfirm: async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        showToast('Category Deleted', 'The category has been removed successfully.', 'success');
                        fetchData();
                    }
                } catch (error) {
                    showToast('Error', 'Failed to delete category.', 'error');
                }
            }
        });
    };

    const handleEditCondition = (condition: any) => {
        setEditingCondition(condition);
        setIsConditionModalOpen(true);
    };

    const handleDeleteCondition = (id: string) => {
        setConfirmationConfig({
            isOpen: true,
            title: 'Delete Condition?',
            message: 'Are you sure you want to remove this condition? Products using this condition may be affected.',
            onConfirm: async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/conditions/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        showToast('Condition Deleted', 'The condition has been removed successfully.', 'success');
                        fetchData();
                    }
                } catch (error) {
                    showToast('Error', 'Failed to delete condition.', 'error');
                }
            }
        });
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Name", "Slug", "Description", "Active"];
        const rows = brands.map(b => [b.id, b.name, b.slug, b.description || "", b.is_active]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "vehicle_brands_catalog.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Export Successful', 'Brand catalog exported as CSV.', 'success');
    };

    return (
        <AdminLayout>
            <div className="space-y-8 pb-32">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>Catalog</span>
                            <ChevronRight size={10} />
                            <span className="text-primary">Brand & Category Management</span>
                        </nav>
                        <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Taxonomy Manager</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-2xl">
                            Organize manufacturer brands and the product navigation hierarchy for your store front.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                        >
                            <Download size={14} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => { setEditingCondition(null); setIsConditionModalOpen(true); }}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                        >
                            <Plus size={16} />
                            New Condition
                        </button>
                        <button
                            onClick={() => { setEditingBrand(null); setIsBrandModalOpen(true); }}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus size={16} />
                            New Brand
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Manufacturer Brands */}
                    <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-soft overflow-hidden h-fit">
                        <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-black text-secondary dark:text-white uppercase tracking-widest text-xs flex items-center gap-3">
                                Manufacturer Brands
                                <span className="text-[10px] bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-400">{filteredBrands.length} Active</span>
                            </h3>
                        </div>
                        <div className="p-4 border-b border-gray-50 dark:border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search brands (e.g. TVS, Bajaj...)"
                                    className={cn(
                                        "w-full bg-gray-50/50 dark:bg-slate-950 border border-transparent focus:border-primary/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all",
                                        searchQuery && "border-primary/20 ring-4 ring-primary/5"
                                    )}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-primary hover:text-primary-dark"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                            {filteredBrands.map((brand) => (
                                <div key={brand.id} className="p-6 flex items-center gap-4 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 overflow-hidden p-1 flex items-center justify-center shrink-0">
                                        {brand.logo_url ? (
                                            <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-xs font-black text-gray-300 uppercase">{brand.name.slice(0, 2)}</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-secondary dark:text-white text-sm">{brand.name}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{brand.slug}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditBrand(brand)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBrand(brand.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredBrands.length === 0 && (
                                <div className="p-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No brands found</div>
                            )}
                        </div>

                        {/* Middle: Part Conditions */}
                        <div className="mt-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-soft overflow-hidden h-fit">
                            <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-black text-secondary dark:text-white uppercase tracking-widest text-xs flex items-center gap-3">
                                    Part Conditions
                                    <span className="text-[10px] bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-400">{conditions.length} Active</span>
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-slate-800">
                                {conditions.map((condition) => (
                                    <div key={condition.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div>
                                            <h4 className="font-black text-secondary dark:text-white text-sm uppercase tracking-tight">{condition.name}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{condition.slug}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditCondition(condition)}
                                                className="p-2 text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCondition(condition.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {conditions.length === 0 && (
                                    <div className="p-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No conditions defined</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Category Hierarchy */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-soft">
                            <div className="px-10 py-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-black text-secondary dark:text-white uppercase tracking-widest text-xs">Category Hierarchy</h3>
                                    <p className="text-[10px] font-medium text-gray-400">Drag items to reorder the storefront navigation.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-secondary transition-colors">Collapse All</button>
                                    <button
                                        onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-colors"
                                    >
                                        <FolderPlus size={14} />
                                        Add Root Category
                                    </button>
                                </div>
                            </div>

                            <div className="p-10 min-h-[500px]">
                                {categories.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-gray-200">
                                            <FolderPlus size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-black text-secondary dark:text-white text-sm">No categories defined yet</p>
                                            <p className="text-xs text-gray-400">Start by adding your first root category.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {categories.map((cat) => (
                                            <CategoryItem
                                                key={cat.id}
                                                category={cat}
                                                onEdit={handleEditCategory}
                                                onDelete={handleDeleteCategory}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div className="mt-12 flex flex-col items-center justify-center text-center py-10 border-t border-dashed border-gray-100 dark:border-slate-800">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-slate-950 rounded-xl flex items-center justify-center text-gray-200 mb-4">
                                        <AlertCircle size={20} />
                                    </div>
                                    <p className="text-[11px] italic text-gray-400 font-medium max-w-xs">
                                        Tip: Deeply nested categories can be managed in "Advanced Category View"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BrandModal
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                brand={editingBrand}
                onSave={() => fetchData()}
            />

            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                category={editingCategory}
                parentCategories={categories}
                onSave={() => fetchData()}
            />

            <ConditionModal
                isOpen={isConditionModalOpen}
                onClose={() => setIsConditionModalOpen(false)}
                condition={editingCondition}
                onSave={() => fetchData()}
            />

            <ConfirmationModal
                isOpen={confirmationConfig.isOpen}
                onClose={() => setConfirmationConfig({ ...confirmationConfig, isOpen: false })}
                onConfirm={confirmationConfig.onConfirm}
                title={confirmationConfig.title}
                message={confirmationConfig.message}
            />

            {/* Unsaved Changes Bar */}
            <div className={cn(
                "fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-spring",
                hasChanges ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-90"
            )}>
                <div className="bg-[#1e1e1e] dark:bg-secondary border border-white/10 px-8 py-5 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center gap-12 min-w-[600px]">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 animate-pulse">
                            <AlertCircle size={22} />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-white font-black text-sm tracking-tight">Unsaved changes detected</h4>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Category reordering pending.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button
                            className="text-white hover:text-white/80 px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors"
                            onClick={() => setHasChanges(false)}
                        >
                            Discard
                        </button>
                        <button
                            className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                            onClick={handleSavePositions}
                        >
                            <Save size={16} />
                            Save Structure
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

interface BrandModalProps {
    isOpen: boolean;
    onClose: () => void;
    brand: Brand | null;
    onSave: () => void;
}

// ImageSelectionModal is now imported from @/components/admin/ImageSelectionModal

const BrandModal = ({ isOpen, onClose, brand, onSave }: BrandModalProps) => {
    const { showToast } = useNotification();
    const [formData, setFormData] = useState<Partial<Brand>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageSelectType, setImageSelectType] = useState<'logo' | 'banner'>('logo');

    useEffect(() => {
        if (brand) {
            setFormData(brand);
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                is_active: true,
                logo_url: '',
                hero_banner_url: ''
            });
        }
    }, [brand, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = brand ? `${API_BASE_URL}/brands/${brand.id}` : `${API_BASE_URL}/brands`;
            const method = brand ? 'PATCH' : 'POST';

            const { products_count, ...payload } = formData as any;
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showToast(brand ? 'Brand Updated' : 'Brand Created', `Successfully ${brand ? 'updated' : 'created'} ${formData.name}.`, 'success');
                onSave();
                onClose();
            } else {
                const errorData = await res.json();
                showToast('Error', errorData.message || 'Failed to save brand.', 'error');
            }
        } catch (error) {
            showToast('Error', 'Failed to save brand.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
                <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="flex items-center justify-between border-b border-gray-50 dark:border-slate-800 pb-6">
                            <div>
                                <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tighter uppercase">{brand ? 'Edit Brand' : 'New Brand'}</h3>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Configure vehicle manufacturer</p>
                            </div>
                            <button type="button" onClick={onClose} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-black dark:hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-bold outline-none"
                                    placeholder="e.g. TVS Motors"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-bold outline-none font-mono"
                                    placeholder="tvs-motors"
                                    value={formData.slug || ''}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea
                                className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-bold outline-none min-h-[100px]"
                                placeholder="Describe the brand and its spare parts specialty..."
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand Logo</label>
                                <div
                                    onClick={() => { setImageSelectType('logo'); setIsImageModalOpen(true); }}
                                    className="aspect-square bg-gray-50 dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group overflow-hidden"
                                >
                                    {formData.logo_url ? (
                                        <img src={formData.logo_url} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <Upload className="mx-auto text-gray-200 group-hover:text-primary transition-colors" size={32} />
                                            <p className="text-[10px] font-black text-gray-300 uppercase">Upload Logo</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hero Banner</label>
                                <div
                                    onClick={() => { setImageSelectType('banner'); setIsImageModalOpen(true); }}
                                    className="aspect-square bg-gray-50 dark:bg-slate-950 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-slate-800 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group overflow-hidden"
                                >
                                    {formData.hero_banner_url ? (
                                        <img src={formData.hero_banner_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <Upload className="mx-auto text-gray-200 group-hover:text-primary transition-colors" size={32} />
                                            <p className="text-[10px] font-black text-gray-300 uppercase">Upload Banner</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="w-5 h-5 accent-primary"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <label htmlFor="is_active" className="text-xs font-black text-secondary dark:text-white uppercase tracking-widest">Active Manufacturer</label>
                            </div>
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400">Cancel</button>
                                <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transition-all">
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    {brand ? 'Update Brand' : 'Create Brand'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <ImageSelectionModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onSelect={(url) => setFormData({ ...formData, [imageSelectType === 'logo' ? 'logo_url' : 'hero_banner_url']: url })}
                title={imageSelectType === 'logo' ? 'Select Brand Logo' : 'Select Hero Banner'}
                currentImage={imageSelectType === 'logo' ? formData.logo_url : formData.hero_banner_url}
            />
        </>
    );
};


const CategoryItem = ({ category, onEdit, onDelete }: { category: Category, onEdit: (c: Category) => void, onDelete: (id: string) => void }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="space-y-3">
            <div
                className={cn(
                    "flex items-center gap-6 p-5 rounded-2xl border border-transparent transition-all group",
                    "hover:bg-primary/[0.02] hover:border-primary/5 active:bg-primary/[0.05]"
                )}
            >
                <div className="cursor-grab text-gray-200 hover:text-gray-400 transition-colors">
                    <GripVertical size={20} />
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 text-gray-300 hover:text-secondary transition-colors"
                >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                <div className="flex items-center gap-4 flex-1">
                    {category.parent_id === null && (
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <FolderPlus size={18} />
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <span className="font-black text-xl text-secondary dark:text-white tracking-tighter uppercase italic">{category.name}</span>
                    </div>
                </div>

                <div className="items-center gap-3 hidden group-hover:flex">
                    <button
                        onClick={() => onEdit(category)}
                        className="p-2 text-gray-300 hover:text-primary transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {isExpanded && category.children && category.children.length > 0 && (
                <div className="pl-20 space-y-3 border-l-2 border-gray-50 dark:border-slate-800 ml-11 mt-2">
                    {category.children.map((child) => (
                        <div key={child.id} className="flex items-center gap-6 py-3 group">
                            <div className="w-4 h-0.5 bg-gray-50 dark:bg-slate-800 shrink-0" />
                            <div className="cursor-grab text-gray-100 group-hover:text-gray-200">
                                <GripVertical size={16} />
                            </div>
                            <div className="flex-1 text-sm font-black text-gray-500 dark:text-gray-400 group-hover:text-secondary dark:group-hover:text-white transition-colors">
                                {child.name}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onEdit(child)}
                                    className="p-1.5 text-gray-300 hover:text-primary transition-colors"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => onDelete(child.id)}
                                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ConditionModal = ({ isOpen, onClose, condition, onSave }: any) => {
    const { showToast } = useNotification();
    const [formData, setFormData] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (condition) {
            setFormData(condition);
        } else {
            setFormData({
                name: '',
                slug: '',
                description: ''
            });
        }
    }, [condition, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = condition ? `${API_BASE_URL}/conditions/${condition.id}` : `${API_BASE_URL}/conditions`;
            const method = condition ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast(condition ? 'Condition Updated' : 'Condition Created', `Successfully saved ${formData.name}.`, 'success');
                onSave();
                onClose();
            }
        } catch (error) {
            showToast('Error', 'Failed to save condition.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-50 dark:border-slate-800 pb-6">
                        <div>
                            <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tighter uppercase">{condition ? 'Edit Condition' : 'New Condition'}</h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Define part quality state</p>
                        </div>
                        <button type="button" onClick={onClose} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-black dark:hover:text-white"><X size={20} /></button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition Name</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-bold outline-none"
                                placeholder="e.g. Brand New"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Slug (URL)</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-bold outline-none font-mono"
                                placeholder="new-genuine"
                                value={formData.slug || ''}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400">Cancel</button>
                        <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transition-all">
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            {condition ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxonomyManager;
