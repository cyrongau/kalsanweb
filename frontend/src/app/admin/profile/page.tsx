"use client";

import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    ShieldCheck,
    Save,
    X,
    KeyRound,
    Settings,
    Bell,
    Globe,
    CheckCircle2,
    LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';
import { useAdmin } from '@/components/providers/AdminProvider';

const ProfileSection = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-slate-800 space-y-8">
        <div className="space-y-1">
            <h3 className="text-xl font-black text-secondary dark:text-white tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-gray-400">{description}</p>
        </div>
        <div className="pt-2">
            {children}
        </div>
    </section>
);

const AdminProfilePage = () => {
    const { showToast, showModal } = useNotification();
    const router = useRouter();
    const { profile, updateProfile } = useAdmin();
    const [activeTab, setActiveTab] = useState('Account Details');
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
    const [formData, setFormData] = useState({
        displayName: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        location: profile.location
    });

    const handleLogout = () => {
        showModal({
            title: "Sign Out?",
            message: "Are you sure you want to log out of your admin session? You will need to sign in again to access the dashboard.",
            type: "warning",
            confirmText: "Yes, Sign Out",
            onConfirm: () => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                router.push('/auth/login');
            }
        });
    };

    // Update internal state when provider profile changes (on mount/reload)
    useEffect(() => {
        setAvatarPreview(profile.avatar);
        setFormData({
            displayName: profile.displayName,
            email: profile.email,
            phone: profile.phone,
            role: profile.role,
            location: profile.location
        });
    }, [profile]);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setHasChanges(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setAvatarPreview(base64);
                setHasChanges(true);
                // Update provider immediately for instant sync in sidebar
                updateProfile({ avatar: base64 });
                showToast("Avatar Updated", "Your profile picture has been updated locally.", "info");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            updateProfile({
                ...formData,
                avatar: avatarPreview
            });
            setIsSaving(false);
            setHasChanges(false);
            showToast(
                "Profile Updated",
                "Your account information has been successfully saved and persisted.",
                "success"
            );
        }, 1500);
    };

    const handleDiscard = () => {
        showModal({
            title: "Discard Changes?",
            message: "Are you sure you want to discard your unsaved edits? This action cannot be undone.",
            type: "warning",
            confirmText: "Yes, Discard",
            onConfirm: () => {
                setFormData({
                    displayName: profile.displayName,
                    email: profile.email,
                    phone: profile.phone,
                    role: profile.role,
                    location: profile.location
                });
                setAvatarPreview(profile.avatar);
                setHasChanges(false);
                showToast("Changes Discarded", "All unsaved edits have been reverted.", "info");
            }
        });
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Account Details':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProfileSection
                            title="Personal Information"
                            description="Use a permanent address where you can receive mail."
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Display Name</label>
                                    <div className="relative group">
                                        <input
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 pl-14 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                                        />
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role Visibility</label>
                                    <input
                                        disabled
                                        value={formData.role}
                                        className="w-full bg-gray-100 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-black uppercase tracking-widest text-gray-400 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 pl-14 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                                        />
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 pl-14 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white"
                                        />
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                    </div>
                                </div>
                            </div>
                        </ProfileSection>

                        <ProfileSection
                            title="Security Credentials"
                            description="Keep your account secure by rotating your password regularly."
                        >
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/20 p-6 rounded-2xl flex items-start gap-4 mb-8">
                                <KeyRound className="text-amber-500 mt-1 shrink-0" size={20} />
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest italic">Password Recommendation</p>
                                    <p className="text-[11px] font-medium text-amber-600/80 dark:text-amber-500/70 leading-relaxed">
                                        Use at least 12 characters with a mix of letters, numbers, and symbols. Avoid using the same password for other online services.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value="••••••••••••"
                                            readOnly
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 pl-14 text-sm font-bold outline-none dark:text-white"
                                        />
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            placeholder="Min. 12 characters"
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 pl-14 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-700"
                                        />
                                        <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                    </div>
                                </div>
                            </div>
                        </ProfileSection>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProfileSection
                            title="Notification Preferences"
                            description="Decide what you want to be notified about, and how."
                        >
                            <div className="space-y-6">
                                {[
                                    { label: "New Quotations", desc: "Get notified when a customer submits a new quote request.", type: "Email" },
                                    { label: "Inventory Alerts", desc: "Receive alerts when stock levels drop below your set limit.", type: "Push" },
                                    { label: "System Updates", desc: "Stay informed about platform changes and new features.", type: "Email & Push" },
                                    { label: "Customer Inquiries", desc: "Real-time alerts for customer messages and support tickets.", type: "In-App" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all group">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-secondary dark:text-white">{item.label}</p>
                                            <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.type}</span>
                                            <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                                                <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ProfileSection>
                    </div>
                );
            case 'Security & Privacy':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProfileSection
                            title="Advanced Security"
                            description="Additional measures to keep your admin account safe."
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-4 hover:border-primary/20 transition-all group">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-2">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <p className="text-sm font-black text-secondary dark:text-white">Two-Factor Authentication</p>
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                                    <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pt-2">Setup 2FA Now</button>
                                </div>
                                <div className="p-8 border border-gray-100 dark:border-slate-800 rounded-3xl space-y-4 hover:border-primary/20 transition-all">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                                        <KeyRound size={24} />
                                    </div>
                                    <p className="text-sm font-black text-secondary dark:text-white">API Access Tokens</p>
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">Generate secure tokens for headless CMS access or external service integrations.</p>
                                    <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pt-2 italic">Generate New Key</button>
                                </div>
                            </div>
                        </ProfileSection>

                        <ProfileSection
                            title="Active Sessions"
                            description="Monitor and manage your active login sessions across devices."
                        >
                            <div className="space-y-4">
                                {[
                                    { device: "MacBook Pro - Chrome", location: "Hargeisa, Somaliland", time: "Active now", current: true },
                                    { device: "iPhone 15 Pro - Safari", location: "Hargeisa, Somaliland", time: "2 hours ago", current: false }
                                ].map((session, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-950 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-gray-400">
                                                <Globe size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-secondary dark:text-white">{session.device}</p>
                                                    {session.current && <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Current</span>}
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{session.location} • {session.time}</p>
                                            </div>
                                        </div>
                                        {!session.current && <button className="text-[10px] font-black text-red-500 uppercase tracking-widest">Logout</button>}
                                    </div>
                                ))}
                            </div>
                        </ProfileSection>
                    </div>
                );
            case 'Preferences':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProfileSection
                            title="Interface Customization"
                            description="Adjust how Kalsan Admin feels and looks."
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Language & Locale</label>
                                    <select className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none dark:text-white appearance-none cursor-pointer">
                                        <option>English (United Kingdom)</option>
                                        <option>English (United States)</option>
                                        <option>Somali (Soomaali)</option>
                                        <option>Arabic (العربية)</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Timezone</label>
                                    <select className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold outline-none dark:text-white appearance-none cursor-pointer">
                                        <option>(GMT+03:00) Hargeisa, Somalia</option>
                                        <option>(GMT+03:00) Nairobi, Kenya</option>
                                        <option>(GMT+00:00) London, UTC</option>
                                    </select>
                                </div>
                            </div>
                        </ProfileSection>

                        <ProfileSection
                            title="Email Reports"
                            description="Configure your automated business intelligence summaries."
                        >
                            <div className="space-y-4">
                                {[
                                    { label: "Daily Quote Summary", enabled: true },
                                    { label: "Weekly Inventory Balance", enabled: true },
                                    { label: "Monthly Performance Insights", enabled: false }
                                ].map((report, idx) => (
                                    <label key={idx} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-950 rounded-2xl cursor-pointer hover:bg-gray-100/50 dark:hover:bg-slate-800/20 transition-all">
                                        <p className="text-sm font-black text-secondary dark:text-white">{report.label}</p>
                                        <input type="checkbox" defaultChecked={report.enabled} className="w-5 h-5 accent-primary" />
                                    </label>
                                ))}
                            </div>
                        </ProfileSection>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">My Profile</h2>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Verified Admin</span>
                            </div>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
                            Manage your personal identification, security credentials, and preferences.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Identity Card */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[2.5rem] p-10 text-white text-center space-y-8 relative overflow-hidden group shadow-2xl">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 blur-[80px] -ml-16 -mb-16" />

                            <div className="relative inline-block group/avatar">
                                <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white/10 p-1 bg-white/5 transition-transform group-hover/avatar:scale-105 duration-500">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="w-full h-full object-cover rounded-[1.8rem]"
                                    />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-[#0F172A]"
                                >
                                    <Camera size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 relative">
                                <h3 className="text-2xl font-black tracking-tight text-white">{formData.displayName}</h3>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="bg-primary px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-primary/20">
                                        <ShieldCheck size={12} className="text-white" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{profile.role}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                                        <Globe size={12} />
                                        <span>{formData.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 relative">
                                <div className="text-center text-white">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Inquiries</p>
                                    <p className="text-xl font-black">1.2k</p>
                                </div>
                                <div className="text-center border-l border-white/10 text-white">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Avg Temp</p>
                                    <p className="text-xl font-black">98%</p>
                                </div>
                            </div>

                            {/* Sign Out Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full mt-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-red-500/10 flex items-center justify-center gap-2 group"
                            >
                                <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                                Sign Out Session
                            </button>
                        </div>

                        {/* Quick Nav Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 space-y-2">
                            {[
                                { icon: User, label: 'Account Details' },
                                { icon: Bell, label: 'Notifications' },
                                { icon: KeyRound, label: 'Security & Privacy' },
                                { icon: Settings, label: 'Preferences' },
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveTab(item.label)}
                                    className={cn(
                                        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                                        activeTab === item.label
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-12">
                        {renderContent()}
                    </div>
                </div>
            </div>

            {/* Unsaved Changes Bar */}
            <div className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-12 transition-all duration-500 z-50 border border-white/10 backdrop-blur-xl",
                hasChanges ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
            )}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <Save size={20} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-black tracking-tight">You have unsaved changes</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Admin Profile • Security Settings</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDiscard}
                        className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white/50 hover:text-white"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfilePage;
