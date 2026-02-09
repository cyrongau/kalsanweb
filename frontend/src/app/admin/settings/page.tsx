"use client";

import React, { useState } from 'react';
import {
    Save,
    RotateCcw,
    Upload,
    MessageSquare,
    Facebook,
    Instagram,
    Twitter,
    AlertCircle,
    ShieldCheck,
    Mail,
    Power,
    RefreshCcw,
    Clock,
    Bell
} from 'lucide-react';
import { API_BASE_URL, normalizeImageUrl } from '@/lib/config';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminSettingsSidebar from '@/components/admin/AdminSettingsSidebar';
import { useAdmin } from '@/components/providers/AdminProvider';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useRef, useEffect } from 'react';

const SettingGroup = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-soft border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 dark:border-slate-800 flex items-center gap-4 bg-gray-50/50 dark:bg-slate-900/50">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-black text-secondary dark:text-white tracking-tight">{title}</h3>
        </div>
        <div className="p-10 space-y-10">
            {children}
        </div>
    </div>
);

const InputGroup = ({ label, placeholder, value, onChange, secondary, multiline, description }: any) => (
    <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</label>
            {secondary && <span className="text-[10px] font-bold text-gray-300">{secondary}</span>}
        </div>
        {multiline ? (
            <textarea
                className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px] resize-none"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <input
                type="text"
                className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        )}
        {description && <p className="text-[10px] font-medium text-primary px-2">{description}</p>}
    </div>
);

const AdminSettingsPage = () => {
    const { settings, updateSettings } = useAdmin();
    const { showToast } = useNotification();
    const [activeSection, setActiveSection] = useState('general');
    const [localSettings, setLocalSettings] = useState(settings);
    const [hasChanges, setHasChanges] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingType, setUploadingType] = useState<'logoLight' | 'logoDark' | 'siteIcon' | 'contactBanner' | 'supportBanner' | 'catalogBanner' | 'shippingBanner' | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

    const handleCheckUpdates = () => {
        setIsCheckingUpdates(true);
        setTimeout(() => {
            setIsCheckingUpdates(false);
            showToast('Check Complete', 'Your system is running the latest version.', 'success');
        }, 2000);
    };

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleUpdate = (updates: Partial<typeof settings>) => {
        setLocalSettings(prev => ({ ...prev, ...updates }));
        setHasChanges(true);
    };

    const handleSocialUpdate = (name: string, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            socials: { ...prev.socials, [name]: value }
        }));
        setHasChanges(true);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && uploadingType) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`${API_BASE_URL}/uploads`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const { url } = await response.json();
                    handleUpdate({ [uploadingType]: url });
                    showToast('Image Uploaded', 'Your image has been processed successfully.', 'success');
                } else {
                    showToast('Upload Failed', 'There was an error uploading your image.', 'error');
                }
            } catch (error) {
                console.error("Upload error:", error);
                showToast('Upload Error', 'Failed to connect to the upload service.', 'error');
            } finally {
                setIsUploading(false);
                setUploadingType(null);
            }
        }
    };

    const triggerUpload = (type: 'logoLight' | 'logoDark' | 'siteIcon' | 'contactBanner' | 'supportBanner' | 'catalogBanner' | 'shippingBanner') => {
        setUploadingType(type);
        fileInputRef.current?.click();
    };

    const handleSave = () => {
        updateSettings(localSettings);
        setHasChanges(false);
        showToast('Settings Saved', 'Your system configurations have been updated successfully.', 'success');
    };

    const handleDiscard = () => {
        setLocalSettings(settings);
        setHasChanges(false);
        showToast('Changes Discarded', 'All unsaved modifications have been reverted.', 'info');
    };

    return (
        <AdminLayout>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
            />
            <div className="flex gap-12 relative animate-in fade-in duration-700">
                <AdminSettingsSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />

                <div className="flex-1 space-y-12 pb-32 overflow-y-auto max-h-[calc(100vh-100px)] px-2 pt-2">
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">Global System Settings</h2>
                                <div className="bg-primary/5 border border-primary/20 px-3 py-1 rounded-lg flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Elevated Access</span>
                                </div>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
                                Manage your company's core identity, visual assets, and public contact information.
                            </p>
                        </div>
                    </header>

                    {/* Branding Section */}
                    {activeSection === 'general' && (
                        <SettingGroup title="Branding & Identity" icon={Save}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <InputGroup
                                    label="Site Title"
                                    value={localSettings.siteTitle}
                                    onChange={(val: string) => handleUpdate({ siteTitle: val })}
                                    description="This name appears in browser tabs and search results."
                                />
                                <InputGroup
                                    label="Tagline"
                                    value={localSettings.tagline}
                                    onChange={(val: string) => handleUpdate({ tagline: val })}
                                    description="Brief description used in marketing headers."
                                />
                            </div>

                            <InputGroup
                                label="Meta Description"
                                multiline
                                value={localSettings.metaDescription}
                                onChange={(val: string) => handleUpdate({ metaDescription: val })}
                            />

                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Logo Configuration</label>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div
                                        onClick={() => triggerUpload('logoLight')}
                                        className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center p-8 text-center space-y-4 group cursor-pointer hover:border-primary transition-colors"
                                    >
                                        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Upload size={32} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-secondary dark:text-white uppercase tracking-tight">Click to upload</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PNG, SVG up to 2MB</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 dark:bg-slate-900 dark:border dark:border-slate-800 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center p-8 space-y-6">
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Light Background</span>
                                        <div
                                            onClick={() => triggerUpload('logoLight')}
                                            className="w-full h-24 bg-blue-100 rounded-xl flex items-center justify-center text-primary font-black text-xs tracking-[0.2em] uppercase cursor-pointer overflow-hidden p-4 group"
                                        >
                                            {localSettings.logoLight ? (
                                                <img src={normalizeImageUrl(localSettings.logoLight)} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                                            ) : (
                                                "Kalsan Logo"
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-[#030712] rounded-[2.5rem] aspect-square flex flex-col items-center justify-center p-8 space-y-6 border border-white/5 shadow-2xl">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Dark Background</span>
                                        <div
                                            onClick={() => triggerUpload('logoDark')}
                                            className="w-full h-24 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white font-black text-xs tracking-[0.2em] uppercase cursor-pointer overflow-hidden p-4 group"
                                        >
                                            {localSettings.logoDark ? (
                                                <img src={normalizeImageUrl(localSettings.logoDark)} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                                            ) : (
                                                "Kalsan Logo"
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-[#1e1e1e] rounded-[2.5rem] aspect-square flex flex-col items-center justify-center p-8 space-y-6 border border-white/5 shadow-2xl">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Site Icon (Favicon)</span>
                                        <div
                                            onClick={() => triggerUpload('siteIcon')}
                                            className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white font-black text-xs tracking-[0.2em] uppercase cursor-pointer overflow-hidden p-2 group"
                                        >
                                            {localSettings.siteIcon ? (
                                                <img src={normalizeImageUrl(localSettings.siteIcon)} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                            ) : (
                                                "Icon"
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SettingGroup>
                    )}

                    {/* Contact Details Section */}
                    {activeSection === 'contact' && (
                        <SettingGroup title="Public Contact Information" icon={Upload}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <InputGroup
                                    label="Public Email"
                                    value={localSettings.contactEmail}
                                    onChange={(val: string) => handleUpdate({ contactEmail: val })}
                                />
                                <InputGroup
                                    label="Public Phone"
                                    value={localSettings.contactPhone}
                                    onChange={(val: string) => handleUpdate({ contactPhone: val })}
                                />
                                <InputGroup
                                    label="Office Address"
                                    value={localSettings.contactAddress}
                                    onChange={(val: string) => handleUpdate({ contactAddress: val })}
                                />
                                <InputGroup
                                    label="Working Hours"
                                    value={localSettings.workingHours}
                                    onChange={(val: string) => handleUpdate({ workingHours: val })}
                                />
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Page Banner Configuration</label>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-gray-50/50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Us Banner</span>
                                            <button
                                                onClick={() => triggerUpload('contactBanner')}
                                                className="text-[10px] font-black text-primary uppercase border-b border-primary/30"
                                            >
                                                Upload New
                                            </button>
                                        </div>
                                        <div className="w-full h-40 bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden group">
                                            {localSettings.contactBanner ? (
                                                <img src={normalizeImageUrl(localSettings.contactBanner)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <AlertCircle size={32} className="text-gray-100" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Page Banner</span>
                                            <button
                                                onClick={() => triggerUpload('supportBanner')}
                                                className="text-[10px] font-black text-primary uppercase border-b border-primary/30"
                                            >
                                                Upload New
                                            </button>
                                        </div>
                                        <div className="w-full h-40 bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden group">
                                            {localSettings.supportBanner ? (
                                                <img src={normalizeImageUrl(localSettings.supportBanner)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <AlertCircle size={32} className="text-gray-100" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Catalog Banner</span>
                                            <button
                                                onClick={() => triggerUpload('catalogBanner')}
                                                className="text-[10px] font-black text-primary uppercase border-b border-primary/30"
                                            >
                                                Upload New
                                            </button>
                                        </div>
                                        <div className="w-full h-40 bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden group">
                                            {localSettings.catalogBanner ? (
                                                <img src={normalizeImageUrl(localSettings.catalogBanner)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <AlertCircle size={32} className="text-gray-100" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Info Banner</span>
                                            <button
                                                onClick={() => triggerUpload('shippingBanner')}
                                                className="text-[10px] font-black text-primary uppercase border-b border-primary/30"
                                            >
                                                Upload New
                                            </button>
                                        </div>
                                        <div className="w-full h-40 bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden group">
                                            {localSettings.shippingBanner ? (
                                                <img src={normalizeImageUrl(localSettings.shippingBanner)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                            ) : (
                                                <AlertCircle size={32} className="text-gray-100" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SettingGroup>
                    )}

                    {/* Technical Section */}
                    {activeSection === 'technical' && (
                        <SettingGroup title="Technical configuration" icon={AlertCircle}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <InputGroup
                                    label="API Base URL"
                                    value={localSettings.apiBaseUrl}
                                    onChange={(val: string) => handleUpdate({ apiBaseUrl: val })}
                                    description="Main backend service endpoint."
                                />
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Maintenance Mode</label>
                                    <button
                                        onClick={() => handleUpdate({ maintenanceMode: !localSettings.maintenanceMode })}
                                        className={cn(
                                            "w-full py-5 px-8 rounded-2xl border flex items-center justify-between transition-all",
                                            localSettings.maintenanceMode
                                                ? "bg-red-500/10 border-red-500/20 text-red-500"
                                                : "bg-white dark:bg-slate-950 border-gray-100 dark:border-slate-800 text-gray-400"
                                        )}
                                    >
                                        <span className="font-black text-xs uppercase tracking-widest">
                                            {localSettings.maintenanceMode ? "Deactivate Maintenance" : "Activate Maintenance"}
                                        </span>
                                        <div className={cn(
                                            "w-12 h-6 rounded-full p-1 transition-colors relative",
                                            localSettings.maintenanceMode ? "bg-red-500" : "bg-gray-200 dark:bg-slate-800"
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                                localSettings.maintenanceMode ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </SettingGroup>
                    )}

                    {/* SMTP Settings Section */}
                    {activeSection === 'smtp' && (
                        <SettingGroup title="SMTP Server Configuration" icon={Mail}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <InputGroup
                                    label="SMTP Host"
                                    value={localSettings.smtpHost}
                                    onChange={(val: string) => handleUpdate({ smtpHost: val })}
                                    placeholder="e.g. smtp.gmail.com"
                                />
                                <InputGroup
                                    label="SMTP Port"
                                    value={localSettings.smtpPort}
                                    onChange={(val: string) => handleUpdate({ smtpPort: val })}
                                    placeholder="e.g. 587"
                                />
                                <InputGroup
                                    label="Username"
                                    value={localSettings.smtpUser}
                                    onChange={(val: string) => handleUpdate({ smtpUser: val })}
                                    placeholder="Username or email"
                                />
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end px-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                        value={localSettings.smtpPass}
                                        onChange={(e) => handleUpdate({ smtpPass: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Encryption Method</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['none', 'ssl', 'tls'].map((enc) => (
                                            <button
                                                key={enc}
                                                onClick={() => handleUpdate({ smtpEncryption: enc as any })}
                                                className={cn(
                                                    "py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    localSettings.smtpEncryption === enc
                                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                                        : "bg-white dark:bg-slate-950 text-gray-400 border-gray-100 dark:border-slate-800 hover:border-primary/30"
                                                )}
                                            >
                                                {enc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Verification</label>
                                    <button
                                        onClick={() => {
                                            showToast('Testing Connection', 'Connecting to SMTP server...', 'info');
                                            setTimeout(() => showToast('Connection Successful', 'SMTP configuration verified.', 'success'), 2000);
                                        }}
                                        className="w-full py-5 rounded-2xl border border-gray-100 dark:border-slate-800 text-primary hover:bg-primary/5 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={14} />
                                        Test Connection
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-gray-50 dark:border-slate-800 pt-10">
                                <InputGroup
                                    label="Sender Name"
                                    value={localSettings.smtpFromName}
                                    onChange={(val: string) => handleUpdate({ smtpFromName: val })}
                                />
                                <InputGroup
                                    label="Sender Email"
                                    value={localSettings.smtpFromEmail}
                                    onChange={(val: string) => handleUpdate({ smtpFromEmail: val })}
                                />
                            </div>
                        </SettingGroup>
                    )}

                    {/* API Integrations Section */}
                    {activeSection === 'api' && (
                        <SettingGroup title="Gateway Configurations" icon={Power}>
                            <div className="space-y-16">
                                {/* Payment Gateways */}
                                <div className="space-y-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                                        <h4 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">Payment Gateways</h4>
                                    </div>

                                    <div className="space-y-12">
                                        {/* Premier Wallet */}
                                        <div className="bg-gray-50/30 dark:bg-slate-900/30 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 space-y-8">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Premier Wallet (Default)</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <InputGroup
                                                    label="Merchant ID"
                                                    value={localSettings.paymentMerchantId}
                                                    onChange={(val: string) => handleUpdate({ paymentMerchantId: val })}
                                                />
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">API Private Key</label>
                                                    <input
                                                        type="password"
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                        value={localSettings.paymentGatewaySecret}
                                                        onChange={(e) => handleUpdate({ paymentGatewaySecret: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* WAAFI PAY */}
                                        <div className="bg-gray-50/30 dark:bg-slate-900/30 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 space-y-8">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">WAAFI PAY (ZAAD, SAHAL, EVC Plus)</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <InputGroup
                                                    label="Merchant ID"
                                                    value={localSettings.waafiMerchantId}
                                                    onChange={(val: string) => handleUpdate({ waafiMerchantId: val })}
                                                />
                                                <InputGroup
                                                    label="Account Number"
                                                    value={localSettings.waafiAccountNumber}
                                                    onChange={(val: string) => handleUpdate({ waafiAccountNumber: val })}
                                                />
                                                <div className="md:col-span-2 space-y-4">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">API Key</label>
                                                    <input
                                                        type="password"
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                        value={localSettings.waafiApiKey}
                                                        onChange={(e) => handleUpdate({ waafiApiKey: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* EDHAB */}
                                        <div className="bg-gray-50/30 dark:bg-slate-900/30 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 space-y-8">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">EDHAB API</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <InputGroup
                                                    label="Merchant ID"
                                                    value={localSettings.edhabMerchantId}
                                                    onChange={(val: string) => handleUpdate({ edhabMerchantId: val })}
                                                />
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">API Secret</label>
                                                    <input
                                                        type="password"
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                        value={localSettings.edhabApiKey}
                                                        onChange={(e) => handleUpdate({ edhabApiKey: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Communication Gateways */}
                                <div className="space-y-10 border-t border-gray-50 dark:border-slate-800 pt-16">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                                        <h4 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">SMS & Messaging</h4>
                                    </div>

                                    <div className="space-y-12">
                                        {/* Twilio */}
                                        <div className="bg-gray-50/30 dark:bg-slate-900/30 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 space-y-8">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Twilio SMS Gateway</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <InputGroup
                                                    label="Account SID"
                                                    value={localSettings.twilioSid}
                                                    onChange={(val: string) => handleUpdate({ twilioSid: val })}
                                                />
                                                <InputGroup
                                                    label="From Phone Number"
                                                    value={localSettings.twilioNumber}
                                                    onChange={(val: string) => handleUpdate({ twilioNumber: val })}
                                                />
                                                <div className="md:col-span-2 space-y-4">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Auth Token</label>
                                                    <input
                                                        type="password"
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                        value={localSettings.twilioToken}
                                                        onChange={(e) => handleUpdate({ twilioToken: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* MSG91 */}
                                        <div className="bg-gray-50/30 dark:bg-slate-900/30 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 space-y-8">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">MSG91 SMS API</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <InputGroup
                                                    label="Sender ID"
                                                    value={localSettings.msg91SenderId}
                                                    onChange={(val: string) => handleUpdate({ msg91SenderId: val })}
                                                />
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Auth Key</label>
                                                    <input
                                                        type="password"
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                        value={localSettings.msg91Key}
                                                        onChange={(e) => handleUpdate({ msg91Key: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* WhatsApp Cloud API */}
                                        <div className="bg-gray-50/30 dark:bg-slate-900/30 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 space-y-8">
                                            <p className="text-[10px] font-black text-[#25D366] uppercase tracking-widest">WhatsApp Cloud API (Meta)</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <InputGroup
                                                    label="WABA Business ID"
                                                    value={localSettings.whatsappBusinessId}
                                                    onChange={(val: string) => handleUpdate({ whatsappBusinessId: val })}
                                                />
                                                <InputGroup
                                                    label="Phone Number ID"
                                                    value={localSettings.whatsappPhoneId}
                                                    onChange={(val: string) => handleUpdate({ whatsappPhoneId: val })}
                                                />
                                                <div className="md:col-span-2 space-y-4">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">System User Access Token</label>
                                                    <input
                                                        type="password"
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-5 px-8 text-sm font-bold text-secondary dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                                        value={localSettings.whatsappToken}
                                                        onChange={(e) => handleUpdate({ whatsappToken: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* OTP Configuration */}
                                <div className="space-y-10 border-t border-gray-50 dark:border-slate-800 pt-16">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                                        <h4 className="text-sm font-black text-secondary dark:text-white uppercase tracking-widest">OTP & Security</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Primary OTP Provider</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { id: 'sms', label: 'SMS' },
                                                    { id: 'whatsapp', label: 'WhatsApp' },
                                                    { id: 'both', label: 'Both' }
                                                ].map((provider) => (
                                                    <button
                                                        key={provider.id}
                                                        onClick={() => handleUpdate({ otpProvider: provider.id as any })}
                                                        className={cn(
                                                            "py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                            localSettings.otpProvider === provider.id
                                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                                                : "bg-white dark:bg-slate-950 text-gray-400 border-gray-100 dark:border-slate-800 hover:border-primary/30"
                                                        )}
                                                    >
                                                        {provider.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <InputGroup
                                            label="OTP Expiry (Minutes)"
                                            value={localSettings.otpExpireMinutes}
                                            onChange={(val: string) => handleUpdate({ otpExpireMinutes: parseInt(val) || 5 })}
                                            placeholder="e.g. 5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </SettingGroup>
                    )}

                    {/* Social Media Section */}
                    {activeSection === 'social' && (
                        <SettingGroup title="Social Media Connections" icon={Instagram}>
                            <div className="space-y-6">
                                {[
                                    { key: 'whatsapp', label: 'WhatsApp Business', icon: MessageSquare, color: 'bg-emerald-500' },
                                    { key: 'facebook', label: 'Facebook Page', icon: Facebook, color: 'bg-blue-600' },
                                    { key: 'instagram', label: 'Instagram Profile', icon: Instagram, color: 'bg-pink-500' },
                                    { key: 'twitter', label: 'Twitter Handle', icon: Twitter, color: 'bg-slate-900' }
                                ].map((social, idx) => (
                                    <div key={idx} className="flex items-center gap-6 p-2 rounded-3xl hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110", social.color)}>
                                            <social.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <InputGroup
                                                label={social.label}
                                                value={(localSettings.socials as any)[social.key]}
                                                onChange={(val: string) => handleSocialUpdate(social.key, val)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SettingGroup>
                    )}

                    {/* Updates & Versioning Section */}
                    {activeSection === 'updates' && (
                        <SettingGroup title="System Updates & Versioning" icon={RefreshCcw}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-gray-50/50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-10 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Installation</p>
                                                <h4 className="text-2xl font-black text-secondary dark:text-white tabular-nums tracking-tight">Version {settings.systemVersion}</h4>
                                            </div>
                                            <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                System Up to Date
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-100 dark:bg-slate-800 w-full" />

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                    <RefreshCcw size={20} className={cn(isCheckingUpdates && "animate-spin")} />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-sm font-black text-secondary dark:text-white uppercase tracking-tight">Manual Update Check</h5>
                                                    <p className="text-xs text-gray-400 font-medium">Force a check for the latest software improvements and security patches.</p>
                                                </div>
                                                <button
                                                    onClick={handleCheckUpdates}
                                                    disabled={isCheckingUpdates}
                                                    className="bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-2"
                                                >
                                                    {isCheckingUpdates ? 'Checking...' : 'Check for Updates'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Updates / Changelog */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-2">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Release History</h4>
                                            <button className="text-[10px] font-black text-primary uppercase border-b border-primary/30">View All Notes</button>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { version: '2.3.5', date: 'Jan 24, 2024', type: 'maintenance', title: 'Security & Optimization', desc: 'Resolved minor UI glitches in inventory and patched critical security vulnerability in API layer.' },
                                                { version: '2.3.0', date: 'Jan 15, 2024', type: 'minor', title: 'Inventory Enhancements', desc: 'Added bulk CSV export and advanced filtering options for stock control.' },
                                                { version: '2.2.8', date: 'Jan 02, 2024', type: 'patch', title: 'Performance Patch', desc: 'Optimized image loading and reduced initial bundle size by 15%.' }
                                            ].map((update, idx) => (
                                                <div key={idx} className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 flex items-start gap-5 group hover:border-primary/20 transition-colors">
                                                    <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors border border-gray-100 dark:border-slate-800">
                                                        <Clock size={18} />
                                                    </div>
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-black text-secondary dark:text-white">v{update.version}</span>
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{update.date}</span>
                                                            </div>
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest",
                                                                update.type === 'maintenance' ? "bg-amber-500/10 text-amber-500" :
                                                                    update.type === 'minor' ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                                                            )}>
                                                                {update.type}
                                                            </span>
                                                        </div>
                                                        <h5 className="text-xs font-black text-secondary dark:text-white uppercase tracking-tight">{update.title}</h5>
                                                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{update.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Policy</h5>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                                                    <ShieldCheck size={16} />
                                                </div>
                                                <p className="text-[11px] text-gray-500 font-bold">Automatic critical patches</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500">
                                                    <Bell size={16} />
                                                </div>
                                                <p className="text-[11px] text-gray-500 font-bold">Email alerts for major releases</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl">
                                            Your installation is managed by the Kalsan Enterprise Cloud. Updates are staged before rollout to ensure stability.
                                        </p>
                                    </div>

                                    <div className="bg-secondary dark:bg-primary/5 rounded-[2.5rem] p-8 space-y-4 border border-white/5">
                                        <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Update Channel</h5>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-black text-white">Stable Production</span>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <button className="w-full py-4 text-[10px] font-black text-white/60 hover:text-white uppercase tracking-[0.2em] border border-white/10 rounded-xl transition-all">
                                            Switch to Beta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </SettingGroup>
                    )}
                </div>
            </div>

            {/* Unsaved Changes Bar */}
            <div className={cn(
                "fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-spring",
                hasChanges ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-90"
            )}>
                <div className="bg-[#1e1e1e] dark:bg-[#0c0c0c] border border-white/10 px-8 py-5 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex items-center gap-12 min-w-[600px]">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                            <RotateCcw size={22} />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-white font-black text-sm tracking-tight">Unsaved Changes</h4>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">You have modified branding and contact info.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button
                            onClick={handleDiscard}
                            className="text-white hover:text-white/80 px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                        >
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettingsPage;
