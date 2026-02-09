"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ChevronRight,
    History,
    CloudUpload,
    Download,
    Play,
    X,
    CheckCircle2,
    AlertCircle,
    FileText,
    Info,
    Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNotification } from '@/components/providers/NotificationProvider';
import {
    StepCard,
    ImportStatusBadge,
    FormSectionHeader
} from '@/components/admin/InventoryComponents';

const BulkImportPage = () => {
    const { showToast } = useNotification();
    const [isUpdatingExisting, setIsUpdatingExisting] = useState(true);
    const [skipErrors, setSkipErrors] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const mockPreview = [
        { status: 'valid' as const, sku: 'BP-1029-X', name: 'Brembo Front Brake Pads', price: '$89.00', action: 'ready' as const },
        { status: 'valid' as const, sku: 'OIL-M1-5W30', name: 'Mobil 1 Synthetic Oil 5W-30', price: '$45.50', action: 'ready' as const },
        { status: 'error' as const, sku: 'ERR-999', name: 'Spark Plug Iridium', price: 'N/A', action: 'invalid' as const },
        { status: 'valid' as const, sku: 'FIL-KN-HP100', name: 'K&N High Performance Filter', price: '$15.99', action: 'ready' as const },
        { status: 'valid' as const, sku: 'TIRE-MS-AS3', name: 'Michelin Pilot Sport A/S 3+', price: '$195.00', action: 'ready' as const },
    ];

    const handleImport = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            showToast('Import Complete', '124 products have been successfully imported.', 'success');
        }, 2000);
    };

    return (
        <AdminLayout>
            <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Link href="/admin/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                            <ChevronRight size={12} />
                            <Link href="/admin/inventory" className="hover:text-primary transition-colors">Inventory</Link>
                            <ChevronRight size={12} />
                            <span className="text-secondary dark:text-white">Bulk Import</span>
                        </nav>
                        <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Bulk Product Import</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Upload and validate your inventory files to update the catalog in bulk.</p>
                    </div>

                    <button className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-secondary dark:text-white hover:bg-gray-50 transition-all shadow-sm group">
                        <History size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        View Import History
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Upload Zone */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 border-2 border-dashed border-blue-200 dark:border-blue-900/50 flex flex-col items-center justify-center gap-6 bg-blue-50/20 dark:bg-blue-950/10 group hover:bg-blue-50/50 transition-all cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <CloudUpload size={200} />
                            </div>

                            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
                                <CloudUpload size={32} />
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight">Upload your product file</h3>
                                <p className="text-xs font-bold text-gray-400">Drag and drop CSV or Excel (XLSX) files here. Max 50MB.</p>
                            </div>

                            <button className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                                Select File
                            </button>

                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accepted formats: .csv, .xls, .xlsx</p>
                        </div>

                        {/* Validation Preview */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-primary">
                                        <FileText size={18} />
                                    </div>
                                    <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">Validation Preview</h3>
                                    <span className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest">Showing first 5 rows</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                        <CheckCircle2 size={14} /> 124 Valid
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest">
                                        <AlertCircle size={14} /> 3 Errors
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-gray-50 dark:border-slate-800">
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Part Name</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                                        {mockPreview.map((row, idx) => (
                                            <tr key={idx} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="py-6">
                                                    {row.status === 'valid' ? (
                                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                                    ) : (
                                                        <AlertCircle size={18} className="text-red-500" />
                                                    )}
                                                </td>
                                                <td className="py-6">
                                                    <span className={cn(
                                                        "text-[11px] font-black uppercase tracking-tight",
                                                        row.status === 'error' ? "text-red-500" : "text-gray-500"
                                                    )}>{row.sku}</span>
                                                </td>
                                                <td className="py-6 font-bold text-sm text-secondary dark:text-white">{row.name}</td>
                                                <td className="py-6 text-sm font-medium text-gray-500">{row.price}</td>
                                                <td className="py-6">
                                                    <ImportStatusBadge status={row.action} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-10">

                        {/* Import Settings */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800/50 space-y-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-primary">
                                    <Info size={18} />
                                </div>
                                <h3 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">Import Settings</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-secondary dark:text-white tracking-tight uppercase">Update existing products</p>
                                        <p className="text-[10px] text-gray-400 font-medium">Overwrite data for existing SKUs</p>
                                    </div>
                                    <button
                                        onClick={() => setIsUpdatingExisting(!isUpdatingExisting)}
                                        className={cn(
                                            "w-12 h-6 rounded-full p-1 transition-all duration-300",
                                            isUpdatingExisting ? "bg-primary" : "bg-gray-200 dark:bg-slate-800"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-4 h-4 bg-white rounded-full transition-all duration-300",
                                            isUpdatingExisting ? "translate-x-6" : "translate-x-0"
                                        )} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setSkipErrors(!skipErrors)}>
                                    <div className={cn(
                                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                        skipErrors ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-gray-200 group-hover:border-primary/40"
                                    )}>
                                        {skipErrors && <CheckCircle2 size={12} className="text-white" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-secondary dark:text-white tracking-tight uppercase">Skip rows with errors</p>
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-[200px]">Only import valid rows and generate a report for failed ones.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Mapping</label>
                                    <select className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-primary transition-all appearance-none">
                                        <option>Auto-detect from file</option>
                                        <option>Braking System</option>
                                        <option>Engine Cooling</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Template Download */}
                        <div className="bg-blue-50/30 dark:bg-blue-950/20 rounded-[2.5rem] p-10 border border-blue-100 dark:border-blue-900/40 space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <Download size={22} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black text-secondary dark:text-white tracking-tight uppercase">Need the template?</h4>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Download our standard CSV format to avoid mapping errors.</p>
                                </div>
                            </div>
                            <button className="w-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 text-primary py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
                                <Download size={14} />
                                Download CSV Template
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            <button
                                onClick={handleImport}
                                disabled={isProcessing}
                                className="w-full bg-primary hover:bg-primary-dark text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing ? "Processing..." : "Commence Import"}
                                {!isProcessing && <Rocket size={18} />}
                            </button>
                            <button className="w-full py-2 text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-[0.3em] transition-colors">
                                Cancel and Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step-by-Step Guide */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-slate-800/50 space-y-12">
                    <h2 className="text-2xl font-black text-secondary dark:text-white tracking-tighter">Step-by-Step Import Guide</h2>
                    <div className="flex flex-col md:flex-row gap-10">
                        <StepCard
                            number={1}
                            title="Download Template"
                            description="Start with our pre-formatted CSV template to ensure your data headers match our system perfectly."
                        />
                        <StepCard
                            number={2}
                            title="Prepare Your Data"
                            description="Fill in the product details, SKUs, and pricing. Make sure required fields are not empty."
                        />
                        <StepCard
                            number={3}
                            title="Upload & Validate"
                            description="Upload your file. Our system will automatically validate the data before processing the import."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-10 border-t border-gray-100 dark:border-slate-800/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        © 2024 AutoParts Inventory Solutions. All technical documentation is confidential.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BulkImportPage;
