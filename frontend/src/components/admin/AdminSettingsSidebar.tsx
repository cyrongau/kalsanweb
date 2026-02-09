"use client";

import React from 'react';
import {
    Info,
    Phone,
    Share2,
    Settings,
    Mail,
    Power,
    Activity,
    RefreshCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
    id: string;
    label: string;
    icon: any;
    active: boolean;
    onClick: (id: string) => void;
}

const NavItem = ({ id, label, icon: Icon, active, onClick }: NavItemProps) => (
    <button
        onClick={() => onClick(id)}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left",
            active
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
        )}
    >
        <Icon size={18} className={cn("transition-transform group-hover:scale-110", active ? "text-primary" : "text-gray-400")} />
        <span className="font-bold text-sm tracking-tight">{label}</span>
    </button>
);

const AdminSettingsSidebar = ({ activeSection, onSectionChange }: { activeSection: string; onSectionChange: (id: string) => void }) => {
    const configurationItems = [
        { id: 'general', label: 'General Info', icon: Info },
        { id: 'contact', label: 'Contact Details', icon: Phone },
        { id: 'social', label: 'Social Media', icon: Share2 },
        { id: 'technical', label: 'Technical', icon: Settings },
        { id: 'updates', label: 'Update & Versioning', icon: RefreshCcw },
    ];

    const integrationItems = [
        { id: 'smtp', label: 'SMTP Settings', icon: Mail },
        { id: 'api', label: 'API Integrations', icon: Power },
    ];

    return (
        <aside className="w-80 flex flex-col space-y-10">
            {/* Nav Groups */}
            <div className="space-y-4">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Configuration</p>
                <div className="space-y-1">
                    {configurationItems.map((item) => (
                        <NavItem
                            key={item.id}
                            {...item}
                            active={activeSection === item.id}
                            onClick={onSectionChange}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-1">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Integrations</p>
                <div className="space-y-1">
                    {integrationItems.map((item) => (
                        <NavItem
                            key={item.id}
                            {...item}
                            active={activeSection === item.id}
                            onClick={onSectionChange}
                        />
                    ))}
                </div>
            </div>

            {/* System Health Card */}
            <div className="mt-auto px-2">
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 shadow-soft space-y-4 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">System Health</span>
                        <Activity size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400">API Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-black text-secondary dark:text-white uppercase">Operational</span>
                        </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[85%] rounded-full shadow-lg shadow-primary/20" />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSettingsSidebar;
