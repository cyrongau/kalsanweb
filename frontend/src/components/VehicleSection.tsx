"use client";

import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, Edit2, Download } from 'lucide-react';
import { useAuth } from './providers/AuthProvider';
import { useNotification } from './providers/NotificationProvider';
import { API_BASE_URL } from '@/lib/config';
import { cn } from '@/lib/utils';

interface Vehicle {
    id: string;
    make: string;
    model?: string;
    year?: number;
    vin?: string;
    source: 'order' | 'manual' | 'quote';
    addedAt: string;
}

export default function VehicleSection() {
    const { user, token, updateUser } = useAuth();
    const { showToast } = useNotification();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [vehicleForm, setVehicleForm] = useState({
        make: '',
        model: '',
        year: '',
        vin: '',
    });

    // Load vehicles from user profile
    useEffect(() => {
        if (user?.garage_details) {
            setVehicles(user.garage_details as Vehicle[]);
        }
    }, [user?.garage_details]);

    const handleExtractVehicles = async () => {
        if (!user || !token) return;

        setIsExtracting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/users/${user.id}/vehicles/extract`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to extract vehicles');

            const extractedVehicles = await response.json();

            // Merge with existing vehicles, avoiding duplicates
            const mergedVehicles = [...vehicles];
            extractedVehicles.forEach((extracted: Vehicle) => {
                const exists = mergedVehicles.find(v =>
                    v.make.toLowerCase() === extracted.make.toLowerCase() &&
                    v.vin === extracted.vin
                );
                if (!exists) {
                    mergedVehicles.push(extracted);
                }
            });

            setVehicles(mergedVehicles);
            await saveVehicles(mergedVehicles);
            showToast('Success', `Extracted ${extractedVehicles.length} vehicle(s) from your orders`, 'success');
        } catch (error) {
            console.error('Failed to extract vehicles:', error);
            showToast('Error', 'Failed to extract vehicles from orders', 'error');
        } finally {
            setIsExtracting(false);
        }
    };

    const saveVehicles = async (updatedVehicles: Vehicle[]) => {
        if (!user || !token) return;

        try {
            const response = await fetch(`${API_BASE_URL}/users/${user.id}/vehicles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vehicles: updatedVehicles })
            });

            if (!response.ok) throw new Error('Failed to save vehicles');

            // Update local user state
            await updateUser({ garage_details: updatedVehicles });
        } catch (error) {
            console.error('Failed to save vehicles:', error);
            throw error;
        }
    };

    const handleAddVehicle = () => {
        setEditingVehicle(null);
        setVehicleForm({ make: '', model: '', year: '', vin: '' });
        setIsModalOpen(true);
    };

    const handleEditVehicle = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setVehicleForm({
            make: vehicle.make,
            model: vehicle.model || '',
            year: vehicle.year?.toString() || '',
            vin: vehicle.vin || '',
        });
        setIsModalOpen(true);
    };

    const handleSaveVehicle = async () => {
        if (!vehicleForm.make.trim()) {
            showToast('Error', 'Vehicle make is required', 'error');
            return;
        }

        const newVehicle: Vehicle = {
            id: editingVehicle?.id || `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            make: vehicleForm.make,
            model: vehicleForm.model || undefined,
            year: vehicleForm.year ? parseInt(vehicleForm.year) : undefined,
            vin: vehicleForm.vin || undefined,
            source: 'manual',
            addedAt: editingVehicle?.addedAt || new Date().toISOString(),
        };

        try {
            let updatedVehicles;
            if (editingVehicle) {
                updatedVehicles = vehicles.map(v => v.id === editingVehicle.id ? newVehicle : v);
            } else {
                updatedVehicles = [...vehicles, newVehicle];
            }

            await saveVehicles(updatedVehicles);
            setVehicles(updatedVehicles);
            setIsModalOpen(false);
            showToast('Success', editingVehicle ? 'Vehicle updated' : 'Vehicle added', 'success');
        } catch (error) {
            showToast('Error', 'Failed to save vehicle', 'error');
        }
    };

    const handleDeleteVehicle = async (vehicleId: string) => {
        try {
            const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
            await saveVehicles(updatedVehicles);
            setVehicles(updatedVehicles);
            showToast('Success', 'Vehicle removed', 'success');
        } catch (error) {
            showToast('Error', 'Failed to remove vehicle', 'error');
        }
    };

    return (
        <section className="space-y-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 border-l-4 border-primary pl-6">
                    <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">My Vehicles</h2>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExtractVehicles}
                        disabled={isExtracting}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all disabled:opacity-50"
                    >
                        <Download size={16} />
                        {isExtracting ? 'Extracting...' : 'Extract from Orders'}
                    </button>
                    <button
                        onClick={handleAddVehicle}
                        className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-transform"
                    >
                        <Plus size={16} />
                        Add Vehicle
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-slate-800">
                <p className="text-xs text-gray-400 font-medium mb-6 italic">
                    Saved from your order history. Your primary vehicle will be automatically saved here after your first order.
                </p>

                {vehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <Car className="text-primary" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-secondary dark:text-white text-sm">{vehicle.make}</h3>
                                            {vehicle.model && (
                                                <p className="text-xs text-gray-400 font-medium">{vehicle.model}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                                        vehicle.source === 'order' ? "bg-green-500/10 text-green-500" :
                                            vehicle.source === 'quote' ? "bg-blue-500/10 text-blue-500" :
                                                "bg-gray-500/10 text-gray-500"
                                    )}>
                                        {vehicle.source}
                                    </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                    {vehicle.year && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400 font-medium">Year:</span>
                                            <span className="text-secondary dark:text-white font-bold">{vehicle.year}</span>
                                        </div>
                                    )}
                                    {vehicle.vin && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400 font-medium">VIN:</span>
                                            <span className="text-secondary dark:text-white font-bold font-mono text-[10px]">{vehicle.vin}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                                    <button
                                        onClick={() => handleEditVehicle(vehicle)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <Edit2 size={12} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteVehicle(vehicle.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <Trash2 size={12} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <Car className="mx-auto mb-4 text-gray-300 dark:text-slate-700" size={48} />
                        <p className="text-gray-400 font-bold italic">
                            No vehicles detected yet. Your primary vehicle will be automatically saved here after your first order.
                        </p>
                    </div>
                )}
            </div>

            {/* Add/Edit Vehicle Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="text-2xl font-black text-secondary dark:text-white mb-8 uppercase tracking-tight">
                            {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                        </h3>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Make *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Toyota, Honda"
                                        value={vehicleForm.make}
                                        onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Model</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Camry, Civic"
                                        value={vehicleForm.model}
                                        onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Year</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2020"
                                        value={vehicleForm.year}
                                        onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">VIN</label>
                                    <input
                                        type="text"
                                        placeholder="17-character VIN"
                                        maxLength={17}
                                        value={vehicleForm.vin}
                                        onChange={(e) => setVehicleForm({ ...vehicleForm, vin: e.target.value.toUpperCase() })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <button
                                onClick={handleSaveVehicle}
                                className="flex-1 btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20"
                            >
                                <span className="uppercase tracking-[0.2em] font-black text-xs">
                                    {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                                </span>
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-10 py-5 bg-gray-50 dark:bg-slate-800 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
