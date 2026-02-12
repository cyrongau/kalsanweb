"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import ProfileSidebar from '@/components/ProfileSidebar';
import AddressCard from '@/components/AddressCard';
import { cn } from '@/lib/utils';
import { Camera, ChevronDown, Plus, Save, FileText, ShoppingBag, Bookmark, Settings, Eye, CheckCircle2, Clock, X, MapPin, Heart, Search, Shield, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useQuote } from '@/components/providers/QuoteProvider';
import ProductCard from '@/components/ProductCard';
import VehicleSection from '@/components/VehicleSection';
import { API_BASE_URL } from '@/lib/config';

interface ListSearchFilterProps {
    placeholder: string;
    statuses: string[];
    searchQuery: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
}

const ListSearchFilter = ({
    placeholder,
    statuses,
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange
}: ListSearchFilterProps) => (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
            />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['All', ...statuses].map((status) => (
                <button
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className={cn(
                        "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                        statusFilter === status
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                            : "bg-white dark:bg-slate-900 text-gray-400 border-gray-100 dark:border-slate-800 hover:border-primary/20"
                    )}
                >
                    {status}
                </button>
            ))}
        </div>
    </div>
);

interface Address {
    type: string;
    label: string;
    address: string;
    isDefault: boolean;
}

const OrderHistoryTab = ({ user, searchQuery, onSearchChange, statusFilter, onStatusChange }: {
    user: any,
    searchQuery: string,
    onSearchChange: (val: string) => void,
    statusFilter: string,
    onStatusChange: (val: string) => void
}) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_BASE_URL}/orders/user/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    const mappedOrders = data.map((order: any) => ({
                        id: order.id,
                        date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        total: `$${Number(order.total_paid).toLocaleString()}`,
                        status: order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase(),
                        vehicle: order.quote?.items?.[0]?.product?.name || 'Various Parts'
                    }));
                    setOrders(mappedOrders);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [user]);

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <section className="space-y-10">
            <div className="flex items-center gap-3 border-l-4 border-primary pl-6">
                <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">Order History</h2>
            </div>

            <ListSearchFilter
                placeholder="Search by Order ID or Vehicle..."
                statuses={['Processing', 'Delivered', 'Cancelled']}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                statusFilter={statusFilter}
                onStatusChange={onStatusChange}
            />

            {loadingOrders ? (
                <div className="py-20 text-center text-gray-400">Loading orders...</div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.length > 0 ? filteredOrders.map((order, i) => (
                        <div key={i} className="bg-gray-50/50 dark:bg-slate-950 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-105">
                                    <ShoppingBag className="text-primary" size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">ID: {order.id}</p>
                                    <h3 className="text-lg font-black text-secondary dark:text-white">{order.total} Order</h3>
                                    <p className="text-sm font-bold text-gray-500">Ordered for <span className="text-primary">{order.vehicle}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Date</p>
                                    <p className="text-lg font-black text-secondary dark:text-white">{order.date}</p>
                                </div>
                                <span className={cn(
                                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    order.status === 'Delivered' ? "bg-green-500/5 text-green-500 border-green-500/20" :
                                        order.status === 'Processing' || order.status === 'Paid' ? "bg-blue-500/5 text-blue-500 border-blue-500/20" :
                                            "bg-red-500/5 text-red-500 border-red-500/20"
                                )}>
                                    {order.status}
                                </span>
                                <Link
                                    href={`/order-success/${order.id}`}
                                    className="btn-primary p-4 rounded-xl shadow-none flex items-center justify-center"
                                >
                                    <FileText size={20} />
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center bg-gray-50/30 dark:bg-slate-950 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
                            <Search className="mx-auto mb-4 text-gray-300 dark:text-slate-700" size={48} />
                            <p className="text-gray-400 font-bold italic">No records found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const { showToast, showModal } = useNotification();
    const { favorites } = useQuote();
    const [activeTab, setActiveTab] = useState('Profile Info');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [userAvatar, setUserAvatar] = useState(user?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200');

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        nationality: user?.nationality || '',
    });

    const handleSaveProfile = async () => {
        await updateUser({
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            nationality: formData.nationality,
        });
        showToast('Success', 'Profile updated successfully', 'success');
    };

    const [vehicles, setVehicles] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
    const [addressForm, setAddressForm] = useState<Address>({
        type: 'Home',
        label: '',
        address: '',
        isDefault: false
    });

    const [userQuotes, setUserQuotes] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                nationality: user.nationality || '',
            });
            if (user.avatar_url) setUserAvatar(user.avatar_url);
            if (user.garage_details) setVehicles(user.garage_details);
            if (user.addresses) setAddresses(user.addresses);

            // Fetch User Quotes
            const fetchQuotes = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/quotes/user/${user.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setUserQuotes(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch quotes:', error);
                }
            };
            fetchQuotes();
        }
    }, [user]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                setUserAvatar(base64String);
                await updateUser({ avatar_url: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOpenAddAddress = () => {
        setEditingAddressIndex(null);
        setAddressForm({
            type: 'Home',
            label: '',
            address: '',
            isDefault: addresses.length === 0
        });
        setIsAddressModalOpen(true);
    };

    const handleOpenEditAddress = (index: number) => {
        setEditingAddressIndex(index);
        setAddressForm(addresses[index]);
        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = async () => {
        if (!addressForm.label || !addressForm.address) {
            showToast('Error', 'Please fill in all fields', 'error');
            return;
        }

        let newAddresses = [...addresses];
        if (editingAddressIndex !== null) {
            newAddresses[editingAddressIndex] = addressForm;
        } else {
            newAddresses.push(addressForm);
        }

        // Handle default address consistency
        if (addressForm.isDefault) {
            newAddresses = newAddresses.map((addr, idx) => ({
                ...addr,
                isDefault: idx === (editingAddressIndex !== null ? editingAddressIndex : newAddresses.length - 1)
            }));
        }

        setAddresses(newAddresses);
        await updateUser({ addresses: newAddresses });
        setIsAddressModalOpen(false);
        showToast('Success', 'Address saved successfully');
    };

    const handleRemoveAddress = (index: number) => {
        showModal({
            title: 'Remove Address',
            message: 'Are you sure you want to remove this address?',
            type: 'confirm',
            confirmText: 'Remove',
            onConfirm: async () => {
                const newAddresses = addresses.filter((_, i) => i !== index);
                setAddresses(newAddresses);
                await updateUser({ addresses: newAddresses });
                showToast('Success', 'Address removed');
            }
        });
    };

    const handleSetAsDefault = (index: number) => {
        const newAddresses = addresses.map((addr, idx) => ({
            ...addr,
            isDefault: idx === index
        }));
        setAddresses(newAddresses);
        showToast('Success', 'Default address updated');
    };



    return (
        <div className="min-h-screen bg-gray-50/10 dark:bg-[#030712] flex flex-col">
            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <ProfileSidebar
                        activeTab={activeTab}
                        onTabChange={(tab) => {
                            setActiveTab(tab);
                            setSearchQuery('');
                            setStatusFilter('All');
                        }}
                    />

                    {/* Main Content */}
                    <div className="flex-1 space-y-12">
                        {/* Header Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-soft border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row items-center md:items-center justify-between gap-6 md:gap-8 animate-in fade-in slide-in-from-right duration-500 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full md:w-auto">
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-50 dark:border-slate-800 shadow-xl transition-transform group-hover:scale-105 mx-auto">
                                        <img
                                            src={userAvatar}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <label className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-primary text-white p-2 md:p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-slate-900 cursor-pointer">
                                        <Camera size={16} className="md:w-[18px] md:h-[18px]" />
                                        <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                                    </label>
                                </div>
                                <div className="space-y-3 w-full">
                                    <div className="space-y-1">
                                        <h1 className="text-2xl md:text-3xl font-black text-secondary dark:text-white tracking-tight">{formData.fullName}</h1>
                                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium tracking-tight">Customer since October 2023</p>
                                    </div>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                                        <span className="bg-primary/5 text-primary text-[10px] md:text-xs font-black px-4 py-2 md:px-3 md:py-1 rounded-full uppercase tracking-widest border border-primary/20">Premium Customer</span>
                                        <span className="bg-green-500/5 text-green-500 text-[10px] md:text-xs font-black px-4 py-2 md:px-3 md:py-1 rounded-full uppercase tracking-widest border border-green-500/20">Verified</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                className="w-full md:w-auto btn-primary px-8 py-4 rounded-2xl group shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-3"
                            >
                                <Save size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="uppercase tracking-[0.2em] font-black text-sm">Save All Changes</span>
                            </button>
                        </div>

                        {/* Details Sections Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-14 shadow-soft border border-gray-100 dark:border-slate-800 space-y-16 animate-in fade-in slide-in-from-bottom duration-700">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Address Form Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsAddressModalOpen(false)}
                    />
                    <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 p-10 md:p-14 animate-in zoom-in-95 fade-in duration-300">
                        <button
                            onClick={() => setIsAddressModalOpen(false)}
                            className="absolute top-8 right-8 p-3 rounded-2xl text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <MapPin className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tight uppercase">
                                        {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">Provide your shipping details below</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Address Type</label>
                                        <div className="relative group">
                                            <select
                                                value={addressForm.type}
                                                onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value })}
                                                className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white appearance-none cursor-pointer"
                                            >
                                                <option value="Home">Home</option>
                                                <option value="Office">Office</option>
                                                <option value="Warehouse">Warehouse</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary transition-colors" size={16} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Label Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. My Home"
                                            value={addressForm.label}
                                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                                            className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Address</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Street number, district, city, etc."
                                        value={addressForm.address}
                                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white resize-none"
                                    />
                                </div>

                                <label className="flex items-center gap-4 cursor-pointer group w-fit">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={addressForm.isDefault}
                                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                        />
                                        <div className={cn(
                                            "w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center",
                                            addressForm.isDefault
                                                ? "bg-primary border-primary shadow-lg shadow-primary/20"
                                                : "bg-gray-50 dark:bg-slate-950 border-gray-100 dark:border-slate-800 group-hover:border-primary/30"
                                        )}>
                                            {addressForm.isDefault && <CheckCircle2 className="text-white" size={14} />}
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-primary transition-colors">Set as Default Address</span>
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    onClick={handleSaveAddress}
                                    className="flex-1 btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20"
                                >
                                    <span className="uppercase tracking-[0.2em] font-black text-xs">
                                        {editingAddressIndex !== null ? 'Update Address' : 'Save Address'}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="px-10 py-5 bg-gray-50 dark:bg-slate-800 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-all"
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

    function renderTabContent() {
        switch (activeTab) {
            case 'Profile Info':
                return (
                    <>
                        {/* Personal Details */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-6">
                                <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">Personal Details</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nationality</label>
                                    <input
                                        type="text"
                                        value={formData.nationality}
                                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Primary Vehicle - Populated from orders */}
                        <section className="space-y-10">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-6">
                                <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">My Vehicles</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50/30 dark:bg-slate-950 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />

                                <div className="md:col-span-3 mb-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved from your order history</p>
                                </div>

                                {vehicles.length > 0 ? vehicles.map((v, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 py-1 px-4 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-bl-xl">Detected</div>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle Detail</p>
                                                <p className="text-lg font-black text-secondary dark:text-white">{v.year} {v.make}</p>
                                                <p className="text-sm font-bold text-primary">{v.model}</p>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="md:col-span-3 py-12 text-center space-y-4">
                                        <p className="text-gray-400 font-bold italic">No vehicles detected yet. Your primary vehicle will be automatically saved here after your first order.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Shipping Addresses */}
                        <section className="space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 border-l-4 border-primary pl-6">
                                    <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">Shipping & Delivery Addresses</h2>
                                </div>
                                <button
                                    onClick={handleOpenAddAddress}
                                    className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-transform"
                                >
                                    <Plus size={16} />
                                    Add New Address
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {addresses.length > 0 ? addresses.map((address, idx) => (
                                    <AddressCard
                                        key={idx}
                                        {...address}
                                        onEdit={() => handleOpenEditAddress(idx)}
                                        onRemove={() => handleRemoveAddress(idx)}
                                        onSetDefault={() => handleSetAsDefault(idx)}
                                    />
                                )) : (
                                    <div className="md:col-span-2 py-16 text-center bg-gray-50/30 dark:bg-slate-950 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
                                        <MapPin className="mx-auto mb-4 text-gray-300 dark:text-slate-700" size={48} />
                                        <p className="text-gray-400 font-bold italic">No addresses saved yet. Add one to speed up your checkout.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                );
            case 'My Quotes':
                const mapStatus = (status: string) => {
                    switch (status) {
                        case 'pending': return 'Reviewing';
                        case 'reviewing': return 'Reviewing';
                        case 'price_ready': return 'Price Ready';
                        case 'converted': return 'Ordered';
                        case 'expired': return 'Expired';
                        default: return status;
                    }
                };

                const filteredQuotes = userQuotes.filter(q => {
                    const matchesSearch = q.id.toLowerCase().includes(searchQuery.toLowerCase());
                    const status = mapStatus(q.status);
                    const matchesStatus = statusFilter === 'All' || status === statusFilter;
                    return matchesSearch && matchesStatus;
                });

                return (
                    <section className="space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-6">
                                <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">My Quote Requests</h2>
                            </div>
                        </div>

                        <ListSearchFilter
                            placeholder="Search by Quote ID (e.g. Q-9482)..."
                            statuses={['Price Ready', 'Reviewing', 'Expired']}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            statusFilter={statusFilter}
                            onStatusChange={setStatusFilter}
                        />

                        <div className="space-y-6">
                            {filteredQuotes.length > 0 ? filteredQuotes.map((quote, i) => {
                                const displayStatus = mapStatus(quote.status);
                                return (
                                    <div key={i} className="bg-gray-50/50 dark:bg-slate-950 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-slate-800 shadow-sm transition-transform group-hover:scale-105">
                                                <FileText className="text-primary" size={24} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest" title={quote.id}>ID: #{quote.id.slice(0, 8)}</p>
                                                <h3 className="text-lg font-black text-secondary dark:text-white">{Array.isArray(quote.items) ? quote.items.length : 0} Items Requested</h3>
                                                <p className="text-sm font-bold text-gray-500">Requested on {new Date(quote.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Amount</p>
                                                <p className="text-xl font-black text-secondary dark:text-white">
                                                    {quote.total_amount ? `$${Number(quote.total_amount).toLocaleString()}` : '---'}
                                                </p>
                                            </div>
                                            <span className={cn(
                                                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                displayStatus === 'Price Ready' ? "bg-green-500/5 text-green-500 border-green-500/20" :
                                                    displayStatus === 'Reviewing' ? "bg-amber-500/5 text-amber-500 border-amber-500/20" :
                                                        displayStatus === 'Ordered' ? "bg-blue-500/5 text-blue-500 border-blue-500/20" :
                                                            "bg-red-500/5 text-red-500 border-red-500/20"
                                            )}>
                                                {displayStatus}
                                            </span>
                                            <Link
                                                href={`/profile/quotes/${quote.id}`}
                                                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary hover:border-primary/20 transition-all"
                                            >
                                                <Eye size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="py-20 text-center bg-gray-50/30 dark:bg-slate-950 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-800">
                                    <Search className="mx-auto mb-4 text-gray-300 dark:text-slate-700" size={48} />
                                    <p className="text-gray-400 font-bold italic">No records found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </section>
                );
            case 'Order History':
                return (
                    <OrderHistoryTab
                        user={user}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                    />
                );
            case 'Saved Parts':
                return (
                    <section className="space-y-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-6">
                                <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">Saved Parts & Components</h2>
                            </div>
                            <div className="px-6 py-3 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {favorites.length} Items Saved
                            </div>
                        </div>

                        {favorites.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {favorites.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50/50 dark:bg-slate-950 rounded-[3rem] p-20 text-center border border-dashed border-gray-200 dark:border-slate-800">
                                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl text-gray-200">
                                    <Heart size={32} />
                                </div>
                                <div className="space-y-2 mb-10">
                                    <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight">No Saved Parts Yet</h3>
                                    <p className="text-gray-400 font-medium max-w-xs mx-auto">Explore our catalog and heart the items you want to keep track of.</p>
                                </div>
                                <Link href="/shop" className="btn-primary inline-flex items-center gap-3 px-10">
                                    Start Browsing
                                </Link>
                            </div>
                        )}
                    </section>
                );
            case 'Settings':
                return (
                    <section className="space-y-12">
                        {/* Two-Factor Authentication */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4 border-l-4 border-primary pl-6">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Shield size={20} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">Two-Factor Authentication (2FA)</h2>
                            </div>

                            <div className="bg-gray-50/30 dark:bg-slate-950 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 space-y-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-gray-100 dark:border-slate-900">
                                    <div className="space-y-1">
                                        <h3 className="font-black text-secondary dark:text-white text-base">Protect Your Account</h3>
                                        <p className="text-sm text-gray-500 font-medium max-w-md">Once enabled, you'll receive a secure OTP code after entering your password as an extra layer of security.</p>
                                    </div>
                                    <div
                                        onClick={() => updateUser({ twoFactorEnabled: !user?.twoFactorEnabled })}
                                        className={cn(
                                            "w-16 h-8 rounded-full relative cursor-pointer ring-4 transition-all duration-300",
                                            user?.twoFactorEnabled ? "bg-primary ring-primary/10" : "bg-gray-200 dark:bg-slate-800 ring-transparent"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300",
                                            user?.twoFactorEnabled ? "left-9" : "left-1"
                                        )} />
                                    </div>
                                </div>

                                {user?.twoFactorEnabled && (
                                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Preferred OTP Channel</label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { id: 'email', label: 'Email Address', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/5', desc: user?.email || 'Registered Email' },
                                                    { id: 'sms', label: 'SMS Message', icon: Smartphone, color: 'text-primary', bg: 'bg-primary/5', desc: user?.phone || 'Linked mobile number' },
                                                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/5', desc: 'Secure message to your WhatsApp' }
                                                ].map((method) => (
                                                    <button
                                                        key={method.id}
                                                        onClick={() => updateUser({ twoFactorMethod: method.id as any })}
                                                        className={cn(
                                                            "p-6 rounded-3xl border text-left transition-all group",
                                                            user?.twoFactorMethod === method.id
                                                                ? "border-primary bg-white dark:bg-slate-900 shadow-xl shadow-primary/5 ring-4 ring-primary/5"
                                                                : "border-gray-100 dark:border-slate-800 hover:border-primary/30"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-4 mb-3">
                                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", method.bg)}>
                                                                <method.icon size={18} className={method.color} />
                                                            </div>
                                                            {user?.twoFactorMethod === method.id && (
                                                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center ml-auto">
                                                                    <CheckCircle2 size={10} className="text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h4 className="font-black text-secondary dark:text-white text-[11px] uppercase tracking-widest">{method.label}</h4>
                                                        <p className="text-[10px] text-gray-400 font-bold mt-1 leading-relaxed">{method.desc}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-center gap-4 border-l-4 border-primary pl-6">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Clock size={20} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">Security & Account</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-6">
                                <h2 className="text-lg font-black text-secondary dark:text-white uppercase tracking-widest">Preferences</h2>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: 'Email Notifications', desc: 'Receive updates about your quotes and orders' },
                                    { title: 'Marketing Emails', desc: 'Latest arrivals and special offers' },
                                    { title: 'Order Status Updates', desc: 'Real-time SMS/Email alerts for pickups' }
                                ].map((pref, i) => (
                                    <div key={i} className="flex justify-between items-center bg-gray-50/30 dark:bg-slate-950 p-6 rounded-2xl border border-gray-100 dark:border-slate-800">
                                        <div>
                                            <h4 className="font-black text-secondary dark:text-white text-sm uppercase tracking-widest">{pref.title}</h4>
                                            <p className="text-xs text-gray-500 font-medium">{pref.desc}</p>
                                        </div>
                                        <div className="w-12 h-6 bg-primary/20 rounded-full relative cursor-pointer ring-4 ring-primary/5">
                                            <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            case 'Garage':
                return <VehicleSection />;
            default:
                return null;
        }
    }
};
export default ProfilePage;
