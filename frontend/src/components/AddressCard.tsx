"use client";

import React from 'react';
import { MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressCardProps {
    type: string;
    label: string;
    address: string;
    isDefault?: boolean;
    onEdit?: () => void;
    onRemove?: () => void;
    onSetDefault?: () => void;
}

const AddressCard = ({
    type,
    label,
    address,
    isDefault,
    onEdit,
    onRemove,
    onSetDefault
}: AddressCardProps) => {
    return (
        <div className={cn(
            "relative p-8 rounded-[2rem] border-2 transition-all group h-full flex flex-col justify-between",
            isDefault
                ? "border-primary bg-primary/[0.02] dark:bg-primary/[0.05]"
                : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/30"
        )}>
            {isDefault && (
                <CheckCircle2
                    className="absolute top-6 right-6 text-primary"
                    size={24}
                />
            )}

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    {isDefault && (
                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                            Default
                        </span>
                    )}
                    <span className="text-secondary dark:text-white font-black text-lg uppercase tracking-tight">
                        {type}
                    </span>
                </div>

                <div className="space-y-3">
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed whitespace-pre-line">
                        {address}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                <button
                    onClick={onEdit}
                    className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                >
                    Edit
                </button>
                {!isDefault && (
                    <button
                        onClick={onSetDefault}
                        className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        Set as Default
                    </button>
                )}
                <button
                    onClick={onRemove}
                    className="text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default AddressCard;
