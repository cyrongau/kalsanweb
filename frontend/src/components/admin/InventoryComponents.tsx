"use client";

import React from 'react';
import {
    Image as ImageIcon,
    Plus,
    X,
    Search,
    Type,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link2,
    CloudUpload
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Media Slot Component ---
export const MediaSlot = ({ isMain = false, onAdd }: { isMain?: boolean; onAdd?: () => void }) => (
    <div
        onClick={onAdd}
        className={cn(
            "aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group",
            isMain
                ? "bg-blue-50/50 border-blue-400 hover:bg-blue-50 shadow-sm shadow-blue-100"
                : "bg-gray-50/50 border-gray-200 hover:border-primary/40 hover:bg-gray-50"
        )}
    >
        <div className={cn(
            "p-3 rounded-xl transition-transform group-hover:scale-110",
            isMain ? "bg-blue-100 text-blue-600" : "bg-white text-gray-400 border border-gray-100"
        )}>
            {isMain ? <ImageIcon size={22} /> : <Plus size={22} />}
        </div>
        <span className={cn(
            "text-[9px] font-black uppercase tracking-widest",
            isMain ? "text-blue-600" : "text-gray-400"
        )}>
            {isMain ? "Main Image" : ""}
        </span>
    </div>
);

// --- Rich Text Toolbar Component ---
export const RichTextToolbar = () => (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/50">
        {[
            { icon: Bold, label: 'Bold' },
            { icon: Italic, label: 'Italic' },
            { icon: Underline, label: 'Underline' },
        ].map((btn, i) => (
            <button key={i} type="button" className="p-2 text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all">
                <btn.icon size={16} />
            </button>
        ))}
        <div className="w-px h-6 bg-gray-100 dark:bg-slate-800 mx-2" />
        {[
            { icon: List, label: 'Unordered List' },
            { icon: ListOrdered, label: 'Ordered List' },
            { icon: Link2, label: 'Link' },
            { icon: ImageIcon, label: 'Image' },
        ].map((btn, i) => (
            <button key={i} type="button" className="p-2 text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all">
                <btn.icon size={16} />
            </button>
        ))}
    </div>
);

// --- Compatibility Tag Component ---
export const CompatibilityTag = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/20">
        <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
        <button onClick={onRemove} type="button" className="hover:text-red-500 transition-colors">
            <X size={12} />
        </button>
    </div>
);

// --- Status Option Component ---
export const StatusOption = ({ id, label, value, selected, onChange, colorClass }: { id: string; label: string; value: string; selected: boolean; onChange: (v: string) => void; colorClass: string }) => (
    <label
        className={cn(
            "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
            selected
                ? "bg-white dark:bg-slate-900 border-primary/20 shadow-sm"
                : "bg-gray-50/50 dark:bg-slate-900/30 border-transparent hover:border-gray-200"
        )}
    >
        <div className="relative">
            <input
                type="radio"
                name="partStatus"
                checked={selected}
                onChange={() => onChange(value)}
                className="sr-only"
            />
            <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                selected ? "border-primary" : "border-gray-300"
            )}>
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
        </div>
        <span className={cn(
            "text-xs font-black uppercase tracking-widest",
            selected ? "text-secondary dark:text-white" : colorClass || "text-gray-400"
        )}>
            {label}
        </span>
    </label>
);

// --- Section Header Component ---
export const FormSectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
            <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subtitle}</p>}
        </div>
    </div>
);

// --- Import Step Card ---
export const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6 flex-1 hover:scale-[1.02] transition-transform group">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-primary text-sm font-black ring-8 ring-blue-50/50 dark:ring-blue-500/5 group-hover:scale-110 transition-transform">
            {number}
        </div>
        <div className="space-y-2">
            <h4 className="text-sm font-black text-secondary dark:text-white uppercase tracking-tight">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{description}</p>
        </div>
    </div>
);

// --- Import Status Badge ---
export const ImportStatusBadge = ({ status }: { status: 'valid' | 'error' | 'ready' | 'invalid' }) => {
    const styles = {
        valid: "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10",
        error: "bg-red-50 text-red-500 dark:bg-red-500/10",
        ready: "text-gray-400 font-bold",
        invalid: "text-red-500 font-black"
    };

    return (
        <span className={cn(
            "text-[10px] uppercase tracking-widest",
            styles[status as keyof typeof styles]
        )}>
            {status === 'ready' ? 'Ready' : (status === 'invalid' ? 'Invalid Price' : status)}
        </span>
    );
};
