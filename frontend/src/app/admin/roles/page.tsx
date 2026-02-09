"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    Plus,
    Search,
    Users,
    FileText,
    Package,
    ShieldCheck,
    Lock,
    ChevronRight,
    SearchIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotification } from '@/components/providers/NotificationProvider';

interface Permission {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
    restricted?: boolean;
}

interface PermissionGroup {
    title: string;
    icon: any;
    permissions: Permission[];
}

interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
    groups: PermissionGroup[];
}

const INITIAL_ROLES: Role[] = [
    {
        id: 'super_admin',
        name: 'Super Admin',
        description: 'Full System Access',
        userCount: 2,
        groups: [] // Super admin has everything by default
    },
    {
        id: 'sales_manager',
        name: 'Sales Manager',
        description: 'Quotes & Customer Relations',
        userCount: 12,
        groups: [
            {
                title: 'INQUIRIES & QUOTES',
                icon: FileText,
                permissions: [
                    { id: 'view_quotes', label: 'View Quotes', description: 'Allows the user to see all pending and historical price quotes.', enabled: true },
                    { id: 'respond_rfqs', label: 'Respond to RFQs', description: 'Ability to reply to Requests For Quotation from customers.', enabled: true },
                    { id: 'delete_inquiries', label: 'Delete Inquiries', description: 'Permanent removal of customer inquiry records.', enabled: false },
                ]
            },
            {
                title: 'INVENTORY MANAGEMENT',
                icon: Package,
                permissions: [
                    { id: 'view_products', label: 'View Products', description: 'Browse the full catalog and stock levels.', enabled: true },
                    { id: 'edit_stock', label: 'Edit Stock Levels', description: 'Update quantities and availability status.', enabled: true },
                    { id: 'price_mgmt', label: 'Price Management', description: 'Override list prices and set promotional discounts.', enabled: false },
                ]
            },
            {
                title: 'USER CONTROLS',
                icon: Users,
                permissions: [
                    { id: 'view_customers', label: 'View Customer List', description: 'Access to customer profiles and purchase history.', enabled: true },
                    { id: 'create_admin', label: 'Create Admin', description: 'Creation of system level administrative accounts (Restricted).', enabled: false, restricted: true },
                ]
            }
        ]
    },
    {
        id: 'inventory_staff',
        name: 'Inventory Staff',
        description: 'Stock & Categories',
        userCount: 45,
        groups: []
    },
    {
        id: 'customer_support',
        name: 'Customer Support',
        description: 'Tickets & Support',
        userCount: 8,
        groups: []
    }
];

export default function AdminRolesPage() {
    const { showToast } = useNotification();
    const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
    const [selectedRoleId, setSelectedRoleId] = useState('sales_manager');
    const [searchQuery, setSearchQuery] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const activeRole = roles.find(r => r.id === selectedRoleId) || roles[0];

    const handleTogglePermission = (groupIdx: number, permId: string) => {
        if (selectedRoleId === 'super_admin') return; // Cannot edit super admin permissions

        const newRoles = [...roles];
        const roleIdx = newRoles.findIndex(r => r.id === selectedRoleId);
        if (roleIdx === -1) return;

        const role = { ...newRoles[roleIdx] };
        const groups = [...role.groups];
        const group = { ...groups[groupIdx] };
        const permissions = [...group.permissions];
        const permIdx = permissions.findIndex(p => p.id === permId);

        if (permIdx === -1) return;

        permissions[permIdx] = { ...permissions[permIdx], enabled: !permissions[permIdx].enabled };
        group.permissions = permissions;
        groups[groupIdx] = group;
        role.groups = groups;
        newRoles[roleIdx] = role;

        setRoles(newRoles);
        setHasChanges(true);
    };

    const handleSave = () => {
        showToast('Permissions Saved', `Matrix for ${activeRole.name} has been updated.`, 'success');
        setHasChanges(false);
    };

    const handleDiscard = () => {
        setRoles(INITIAL_ROLES);
        setHasChanges(false);
        showToast('Changes Discarded', 'Permission updates have been reverted.', 'info');
    };

    const filteredSidebarRoles = roles.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex h-[calc(100vh-160px)] gap-10">
                {/* Left Sidebar: Roles List */}
                <aside className="w-80 flex flex-col space-y-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-secondary dark:text-white uppercase tracking-tight">User Roles</h2>
                        <button className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Filter roles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50/50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all dark:text-white"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none">
                        {filteredSidebarRoles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRoleId(role.id)}
                                className={cn(
                                    "w-full p-5 rounded-2xl flex flex-col gap-1 text-left transition-all border",
                                    selectedRoleId === role.id
                                        ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20"
                                        : "hover:bg-gray-50 dark:hover:bg-slate-800 border-transparent"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={cn(
                                        "font-black text-sm transition-colors",
                                        selectedRoleId === role.id ? "text-primary" : "text-secondary dark:text-white"
                                    )}>
                                        {role.name}
                                    </span>
                                    <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
                                        {role.userCount} Users
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                    {role.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main: Permissions Matrix */}
                <main className="flex-1 flex flex-col space-y-8 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-right duration-500">
                        <div className="space-y-2 text-left">
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span>Admin</span>
                                <ChevronRight size={10} />
                                <span>Roles</span>
                                <ChevronRight size={10} />
                                <span className="text-primary">{activeRole.name}</span>
                            </div>
                            <h1 className="text-4xl font-black text-secondary dark:text-white tracking-tight">
                                Permissions Matrix: {activeRole.name}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                Configure what actions users with the {activeRole.name} role can perform.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleDiscard}
                                disabled={!hasChanges}
                                className={cn(
                                    "px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border",
                                    hasChanges
                                        ? "bg-white dark:bg-slate-900 text-secondary dark:text-white border-gray-200 dark:border-slate-800 hover:bg-gray-50"
                                        : "text-gray-300 border-transparent cursor-not-allowed"
                                )}
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className={cn(
                                    "px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl",
                                    hasChanges
                                        ? "bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95"
                                        : "bg-gray-200 dark:bg-slate-800 text-gray-400 shadow-none cursor-not-allowed"
                                )}
                            >
                                Save Permissions
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-10 pb-20 scrollbar-none">
                        {activeRole.id === 'super_admin' ? (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border border-gray-100 dark:border-slate-800 space-y-6">
                                <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-pulse">
                                    <ShieldCheck size={48} className="text-primary" />
                                </div>
                                <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tight uppercase">Unrestricted Access</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
                                    The Super Admin role is immutable and has full system-wide permissions across all modules.
                                </p>
                            </div>
                        ) : activeRole.groups.length > 0 ? (
                            activeRole.groups.map((group, gIdx) => (
                                <div key={gIdx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-soft animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${gIdx * 100}ms` }}>
                                    <div className="px-10 py-6 bg-gray-50/50 dark:bg-slate-950/50 border-b border-gray-100 dark:border-slate-800 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <group.icon size={20} className="text-primary" />
                                        </div>
                                        <h3 className="text-[11px] font-black text-secondary dark:text-white uppercase tracking-[0.2em]">
                                            {group.title}
                                        </h3>
                                    </div>
                                    <div className="p-2">
                                        {group.permissions.map((perm) => (
                                            <div key={perm.id} className="group p-8 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors rounded-[1.5rem]">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-black text-secondary dark:text-white text-sm">{perm.label}</h4>
                                                        {perm.restricted && <Lock size={12} className="text-gray-400" />}
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-medium">{perm.description}</p>
                                                </div>
                                                <div
                                                    onClick={() => handleTogglePermission(gIdx, perm.id)}
                                                    className={cn(
                                                        "w-12 h-6 rounded-full relative cursor-pointer ring-4 transition-all duration-300",
                                                        perm.enabled ? "bg-primary ring-primary/10" : "bg-gray-200 dark:bg-slate-800 ring-transparent"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                                                        perm.enabled ? "left-7" : "left-1"
                                                    )} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border border-gray-100 dark:border-slate-800">
                                <p className="text-gray-400 font-bold italic uppercase tracking-widest">No permissions defined yet for this role.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </AdminLayout>
    );
}
