"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, FolderPlus } from 'lucide-react';
import { useNotification } from '@/components/providers/NotificationProvider';

interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    parentCategories: Category[];
    onSave: () => void;
}

const CategoryModal = ({ isOpen, onClose, category, parentCategories, onSave }: CategoryModalProps) => {
    const { showToast } = useNotification();
    const [formData, setFormData] = useState<Partial<Category>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData(category);
        } else {
            setFormData({
                name: '',
                slug: '',
                parent_id: null
            });
        }
    }, [category, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const url = category ? `http://localhost:3001/categories/${category.id}` : 'http://localhost:3001/categories';
            const method = category ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                showToast(category ? 'Category Updated' : 'Category Created', `Successfully ${category ? 'updated' : 'created'} ${formData.name}.`, 'success');
                onSave();
                onClose();
            } else {
                const errorData = await res.json();
                showToast('Error', errorData.message || 'Failed to save category.', 'error');
            }
        } catch (error) {
            showToast('Error', 'Failed to save category.', 'error');
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
                            <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tighter uppercase">{category ? 'Edit Category' : 'New Category'}</h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Manage Spare Part Hierarchy</p>
                        </div>
                        <button type="button" onClick={onClose} className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-black dark:hover:text-white"><X size={20} /></button>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-bold outline-none"
                                placeholder="e.g. Engine Components"
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
                                placeholder="engine-components"
                                value={formData.slug || ''}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent Category</label>
                            <select
                                className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl p-4 text-sm font-bold outline-none appearance-none cursor-pointer"
                                value={formData.parent_id || ''}
                                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                            >
                                <option value="">None (Root Category)</option>
                                {parentCategories
                                    .filter(c => c.id !== category?.id) // Prevent self-referencing
                                    .map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50 dark:border-slate-800">
                        <button type="button" onClick={onClose} className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400">Cancel</button>
                        <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95 transition-all">
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            {category ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
