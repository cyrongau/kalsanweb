"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    Plus,
    Search,
    Filter,
    Download,
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown,
    LayoutGrid,
    List,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';
import { API_BASE_URL, normalizeImageUrl } from '@/lib/config';

interface Product {
    id: string;
    sku: string;
    name: string;
    brand: any;
    category: any;
    price: any;
    quantity: number;
    stock_status: string;
    image?: string;
    image_urls?: string[];
}

const SAMPLE_PRODUCTS: Product[] = [
    { id: '1', sku: 'BRK-992-X', name: 'Ceramic Brake Pads', brand: 'Brembo', category: 'Braking System', price: 85.00, quantity: 124, stock_status: 'in_stock', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=200' },
    { id: '2', sku: 'OIL-FL-400', name: 'Synthetic Oil Filter', brand: 'Mobil 1', category: 'Engine Parts', price: 15.50, quantity: 45, stock_status: 'low_stock', image: 'https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?q=80&w=200' },
    { id: '3', sku: 'BAT-AGM-L5', name: 'AGM Start-Stop Battery', brand: 'Varta', category: 'Electrical', price: 210.00, quantity: 8, stock_status: 'low_stock', image: 'https://images.unsplash.com/photo-1620939511593-6893047bbcc1?q=80&w=200' },
    { id: '4', sku: 'SPK-IRID-IX', name: 'Iridium Spark Plugs (4pc)', brand: 'NGK', category: 'Ignition', price: 45.99, quantity: 0, stock_status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1597766353939-9d7620392f25?q=80&w=200' },
    { id: '5', sku: 'TYR-PS4S-19', name: 'Pilot Sport 4S 255/35 R19', brand: 'Michelin', category: 'Tires & Wheels', price: 340.00, quantity: 24, stock_status: 'in_stock', image: 'https://images.unsplash.com/photo-1549438340-08a8e1047d15?q=80&w=200' },
];

const ITEMS_PER_PAGE = 8;

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-soft space-y-4 group hover:border-primary/20 transition-all">
        <div className="flex items-center justify-between">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", color)}>
                <Icon size={24} className="text-white" />
            </div>
            <div className={cn("flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", trend > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
                {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(trend)}%
            </div>
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <h3 className="text-3xl font-black text-secondary dark:text-white mt-1 tabular-nums tracking-tighter">{value}</h3>
        </div>
    </div>
);

const InventoryPage = () => {
    const { showToast, showModal } = useNotification();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchProducts();
        showToast('Inventory Updated', 'Latest stock levels synchronized with backend.', 'success');
    };

    const handleExportCSV = () => {
        const headers = 'SKU,Name,Brand,Category,Price,Quantity,Status\n';
        const csvContent = products.map(p =>
            `${p.sku},${p.name},${p.brand},${p.category},${p.price},${p.quantity},${p.stock_status}`
        ).join('\n');

        const blob = new Blob([headers + csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventory_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('Export Successful', 'Your inventory has been downloaded as CSV.', 'success');
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        const product = products.find(p => p.id === id);
        showModal({
            title: 'Delete Product',
            message: `Are you sure you want to delete "${product?.name}"? This action cannot be undone.`,
            type: 'warning',
            confirmText: 'Delete Permanently',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        setProducts(prev => prev.filter(p => p.id !== id));
                        showToast('Product Deleted', 'The item has been removed from inventory.', 'success');
                    } else {
                        throw new Error("Failed to delete product");
                    }
                } catch (err) {
                    showToast('Delete Failed', 'There was an error removing the product.', 'error');
                }
            }
        });
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'in_stock': return "bg-green-500/5 text-green-500 border-green-500/20";
            case 'low_stock': return "bg-amber-500/5 text-amber-500 border-amber-500/20";
            case 'out_of_stock': return "bg-red-500/5 text-red-500 border-red-500/20";
            default: return "bg-gray-500/5 text-gray-500 border-gray-500/20";
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <AdminLayout>
            <div className="space-y-12 pb-20 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Admin</span>
                            <ChevronDown size={14} className="-rotate-90" />
                            <span className="text-primary">Inventory Management</span>
                        </div>
                        <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Parts & Stock Control</h2>
                        <p className="text-gray-500 dark:text-gray-300 font-medium text-lg leading-relaxed">
                            Manage your automotive parts catalog, monitor stock levels, and update pricing.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleRefresh}
                            className={cn(
                                "p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-gray-400 hover:text-primary transition-all shadow-sm",
                                isRefreshing && "animate-spin text-primary"
                            )}
                        >
                            <RefreshCw size={20} />
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm text-secondary dark:text-white group"
                        >
                            <Download size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                            Export CSV
                        </button>
                        <Link
                            href="/admin/inventory/add"
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-primary/20 active:scale-95"
                        >
                            <Plus size={20} />
                            Add New Part
                        </Link>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard label="Total Inventory" value={products.length.toLocaleString()} trend={0} icon={Package} color="bg-primary" />
                    <StatCard label="In Stock" value={products.filter(p => p.stock_status === 'in_stock').length.toLocaleString()} trend={0} icon={CheckCircle2} color="bg-green-500" />
                    <StatCard label="Low Stock Items" value={products.filter(p => p.stock_status === 'low_stock').length.toLocaleString()} trend={0} icon={AlertCircle} color="bg-amber-500" />
                    <StatCard label="Out of Stock" value={products.filter(p => p.stock_status === 'out_of_stock').length.toLocaleString()} trend={0} icon={Trash2} color="bg-red-500" />
                </div>

                {/* Filters & Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-soft border border-gray-100 dark:border-slate-800 space-y-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-50 dark:border-slate-800/50">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
                            <div className="relative group flex-1 max-w-md">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by SKU, Name or Brand..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-4 bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl text-gray-400 hover:text-primary transition-all group">
                                    <Filter size={18} />
                                </button>
                                <div className="h-10 w-px bg-gray-100 dark:bg-slate-800 mx-2" />
                                <div className="flex bg-gray-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={cn(
                                            "p-2.5 rounded-xl transition-all",
                                            viewMode === 'list' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        <List size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={cn(
                                            "p-2.5 rounded-xl transition-all",
                                            viewMode === 'grid' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By:</span>
                            <select className="bg-transparent text-sm font-black text-secondary dark:text-white outline-none cursor-pointer hover:text-primary transition-colors">
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Stock: Low to High</option>
                            </select>
                        </div>
                    </div>

                    {/* Table View */}
                    {viewMode === 'list' ? (
                        <div className="overflow-x-auto -mx-8">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="border-b border-gray-50 dark:border-slate-800/50">
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Part Info</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Level</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedProducts.map((p) => (
                                        <tr key={p.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-gray-50 dark:border-slate-800/50 last:border-0">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 group-hover:scale-105 transition-transform duration-500">
                                                        <img src={normalizeImageUrl(p.image_urls?.[0] || p.image)} className="w-full h-full object-cover" alt={p.name} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{p.sku}</p>
                                                        <h4 className="font-black text-secondary dark:text-white text-base tracking-tight">{p.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{(p as any).brand?.name || p.brand}</span>
                                                            <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{(p as any).category?.name || p.category}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-xl font-black text-secondary dark:text-white tabular-nums tracking-tighter">{p.quantity} <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Units</span></span>
                                                        <span className="text-xs font-bold text-primary tracking-tight">${parseFloat(p.price || 0).toFixed(2)} / ea</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-1000",
                                                                p.quantity > 50 ? "bg-primary" : p.quantity > 10 ? "bg-amber-500" : "bg-red-500"
                                                            )}
                                                            style={{ width: `${Math.min((p.quantity / 150) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-solid whitespace-nowrap",
                                                    getStatusStyles(p.stock_status)
                                                )}>
                                                    {p.stock_status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-black text-secondary dark:text-white text-lg tracking-tight tabular-nums">
                                                ${(parseFloat(p.price || 0) * p.quantity).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/inventory/edit/${p.id}`}
                                                        className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-primary hover:border-primary/20 transition-all"
                                                    >
                                                        <Edit3 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500/20 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {paginatedProducts.map((p) => (
                                <div key={p.id} className="bg-gray-50/50 dark:bg-slate-950 rounded-[2rem] border border-gray-100 dark:border-slate-800 p-6 space-y-6 group hover:border-primary/20 transition-all">
                                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-inner">
                                        <img src={normalizeImageUrl(p.image_urls?.[0] || p.image)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                                        <div className="absolute top-4 right-4 group-hover:opacity-100 transition-opacity">
                                            <span className={cn(
                                                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-md border",
                                                getStatusStyles(p.stock_status)
                                            )}>
                                                {p.stock_status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{p.sku}</p>
                                            <h4 className="font-black text-secondary dark:text-white text-lg leading-tight tracking-tight line-clamp-2 min-h-[3rem]">{p.name}</h4>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                                                <p className="text-xl font-black text-secondary dark:text-white tabular-nums tracking-tighter">${parseFloat(p.price || 0).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</p>
                                                <p className="text-xl font-black text-secondary dark:text-white tabular-nums tracking-tighter">{p.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <Link
                                                href={`/admin/inventory/edit/${p.id}`}
                                                className="flex-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary dark:text-white hover:bg-primary hover:text-white hover:border-primary transition-all text-center"
                                            >
                                                Edit
                                            </Link>
                                            <button className="px-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-gray-400 hover:text-primary transition-all"><Eye size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-8">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">
                                Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} items
                            </p>

                            <div className="flex items-center gap-2 mx-auto sm:mx-0">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary hover:border-primary disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all"
                                >
                                    <ChevronsLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary hover:border-primary disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <div className="flex items-center gap-2 px-2">
                                    <span className="text-sm font-black text-secondary dark:text-white">{currentPage}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase">of</span>
                                    <span className="text-sm font-black text-gray-400">{totalPages}</span>
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary hover:border-primary disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary hover:border-primary disabled:opacity-50 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all"
                                >
                                    <ChevronsRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default InventoryPage;
