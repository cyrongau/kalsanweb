"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Shield, Users, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';
import { API_BASE_URL } from '@/lib/config';

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdate: () => void;
}

const teams = ['Support', 'Technical', 'Sales & Marketing', 'None'];
const roles = ['customer', 'inventory_staff', 'sales_manager', 'admin', 'super_admin'];

export default function UserEditModal({ isOpen, onClose, user, onUpdate }: UserEditModalProps) {
    const { showToast } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        role: user.role || 'customer',
        team: user.team || 'None',
    });

    useEffect(() => {
        setFormData({
            name: user.name || '',
            role: user.role || 'customer',
            team: user.team || 'None',
        });
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                name: formData.name,
                role: formData.role,
                team: formData.team === 'None' ? null : formData.team,
            };

            const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                showToast('Success', 'User profile updated successfully', 'success');
                onUpdate();
                onClose();
            } else {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            showToast('Error', 'Could not update user profile', 'error');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-secondary/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-950/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight uppercase">Manage Identity</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    {/* Name */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2">Display Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Full Name"
                                className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                                <Shield size={12} />
                                System Role
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-5 px-8 text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 outline-none appearance-none dark:text-white"
                            >
                                {roles.map(r => (
                                    <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>

                        {/* Team Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                                <Users size={12} />
                                Chat Team
                            </label>
                            <select
                                value={formData.team}
                                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-5 px-8 text-sm font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/5 outline-none appearance-none dark:text-white"
                            >
                                {teams.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Modifications
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
