"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import ProfileSidebar from '@/components/ProfileSidebar';
import { useNotification } from '@/components/providers/NotificationProvider';
import { cn } from '@/lib/utils';
import { Car, Plus, Trash2, Edit2, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface Vehicle {
    year: string;
    make: string;
    model: string;
}

const GaragePage = () => {
    const { user } = useAuth();
    const { showToast, showModal } = useNotification();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<Vehicle>({ year: '', make: '', model: '' });

    useEffect(() => {
        const saved = localStorage.getItem('user_vehicles');
        if (saved) {
            setVehicles(JSON.parse(saved));
        } else {
            // Initial mock data if none exists
            const initial = [
                { year: '2022', make: 'Toyota', model: 'Land Cruiser V8' },
                { year: '2021', make: 'Honda', model: 'Civic' }
            ];
            setVehicles(initial);
            localStorage.setItem('user_vehicles', JSON.stringify(initial));
        }
    }, []);

    const saveToStorage = (newVehicles: Vehicle[]) => {
        setVehicles(newVehicles);
        localStorage.setItem('user_vehicles', JSON.stringify(newVehicles));
    };

    const handleOpenAdd = () => {
        setEditingIndex(null);
        setFormData({ year: '', make: '', model: '' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (index: number) => {
        setEditingIndex(index);
        setFormData(vehicles[index]);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.year || !formData.make || !formData.model) {
            showToast('Error', 'Please fill in all fields', 'error');
            return;
        }

        const newVehicles = [...vehicles];
        if (editingIndex !== null) {
            newVehicles[editingIndex] = formData;
            showToast('Success', 'Vehicle updated successfully');
        } else {
            newVehicles.push(formData);
            showToast('Success', 'Vehicle added to your garage');
        }

        saveToStorage(newVehicles);
        setIsModalOpen(false);
    };

    const handleRemove = (index: number) => {
        showModal({
            title: 'Remove Vehicle',
            message: 'Are you sure you want to remove this vehicle from your garage?',
            type: 'confirm',
            confirmText: 'Remove',
            onConfirm: () => {
                const newVehicles = vehicles.filter((_, i) => i !== index);
                saveToStorage(newVehicles);
                showToast('Success', 'Vehicle removed');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50/10 dark:bg-[#030712] flex flex-col">
            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="flex flex-col lg:flex-row gap-12">
                    <ProfileSidebar activeTab="Garage" onTabChange={() => { }} />

                    <div className="flex-1 space-y-12">
                        {/* Header */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-soft border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
                                    <Car className="text-primary" size={32} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-secondary dark:text-white tracking-tight uppercase">My Garage</h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">{vehicles.length} Vehicles Saved</p>
                                </div>
                            </div>
                            <button
                                onClick={handleOpenAdd}
                                className="btn-primary px-8 py-4 rounded-2xl group flex items-center gap-3"
                            >
                                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                <span className="uppercase tracking-widest font-black text-sm">Add New Vehicle</span>
                            </button>
                        </div>

                        {/* Vehicle List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {vehicles.length > 0 ? (
                                vehicles.map((vehicle, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800 shadow-soft group hover:border-primary/20 transition-all">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                                <Car className="text-gray-400 group-hover:text-primary transition-colors" size={24} />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(idx)}
                                                    className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-400 rounded-xl hover:text-primary hover:bg-primary/5 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(idx)}
                                                    className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-400 rounded-xl hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{vehicle.year}</p>
                                            <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tight">{vehicle.make}</h3>
                                            <p className="text-primary font-bold text-lg">{vehicle.model}</p>
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-slate-800 flex items-center gap-2 text-green-500">
                                            <CheckCircle2 size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Active in profile</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300">
                                        <Car size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight">Your Garage is Empty</h3>
                                        <p className="text-gray-400 font-medium max-w-sm mx-auto">Add your vehicles to get personalized parts recommendations and track your service history.</p>
                                    </div>
                                    <button onClick={handleOpenAdd} className="text-primary font-black uppercase tracking-widest text-sm hover:underline">
                                        Add your first vehicle
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl transition-all">
                            <X size={20} />
                        </button>

                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Car size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-secondary dark:text-white uppercase tracking-tight">
                                        {editingIndex !== null ? 'Edit Vehicle' : 'Add Vehicle'}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Enter your vehicle details below</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Year</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2022"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Make</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Toyota"
                                        value={formData.make}
                                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Model</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Land Cruiser V8"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20 uppercase tracking-widest font-black text-xs"
                                >
                                    {editingIndex !== null ? 'Update Vehicle' : 'Save To Garage'}
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-10 py-5 bg-gray-50 dark:bg-slate-800 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GaragePage;
