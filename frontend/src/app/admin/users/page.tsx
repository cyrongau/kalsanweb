"use client";

import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    MoreHorizontal,
    Filter,
    ChevronLeft,
    ChevronRight,
    Circle,
    UserCircle,
    Shield,
    Users,
    Loader2
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserEditModal from '@/components/admin/UserEditModal';
import { cn } from '@/lib/utils';

const UserStatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 space-y-2 group hover:shadow-md transition-all">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className={cn("text-4xl font-black tracking-tighter transition-transform group-hover:scale-110 origin-left", color)}>
            {value}
        </p>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        Active: "bg-emerald-500/10 text-emerald-500",
        Pending: "bg-blue-500/10 text-blue-500",
        Inactive: "bg-gray-500/10 text-gray-500",
        Suspended: "bg-red-500/10 text-red-500"
    }[status] || "bg-gray-500/10 text-gray-500";

    return (
        <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", styles)}>
            <div className={cn("w-1.5 h-1.5 rounded-full bg-current")} />
            {status}
        </div>
    );
};

const RoleBadge = ({ role }: { role: string }) => {
    const styles = {
        ADMIN: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
        CUSTOMER: "bg-blue-50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400",
        'SALES MANAGER': "bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400",
        SUPPORT: "bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
    }[role] || "bg-gray-100 text-gray-600";

    return (
        <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", styles)}>
            {role}
        </span>
    );
};

const AdminUserManagementPage = () => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.role?.toLowerCase().includes(search.toLowerCase()) ||
        user.team?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">User Management</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
                            Managing 1,240 internal and customer accounts
                        </p>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <UserPlus size={20} />
                        Create New User
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <UserStatCard label="Active Users" value="1,102" color="text-secondary dark:text-white" />
                    <UserStatCard label="Pending" value="48" color="text-blue-500" />
                    <UserStatCard label="Inactive" value="90" color="text-gray-400" />
                    <UserStatCard label="Suspended" value="24" color="text-red-500" />
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-950 border border-transparent focus:border-primary/20 rounded-2xl py-5 px-6 pl-16 text-sm font-bold transition-all outline-none dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select className="bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-5 px-8 text-sm font-black uppercase tracking-widest outline-none dark:text-white w-full md:w-48 appearance-none">
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>Manager</option>
                            <option>Customer</option>
                        </select>
                        <select className="bg-gray-50 dark:bg-slate-950 border-none rounded-2xl py-5 px-8 text-sm font-black uppercase tracking-widest outline-none dark:text-white w-full md:w-48 appearance-none">
                            <option>All Statuses</option>
                            <option>Active</option>
                            <option>Pending</option>
                            <option>Suspended</option>
                        </select>
                        <button className="bg-gray-50 dark:bg-slate-950 p-5 rounded-2xl text-gray-400 hover:text-secondary dark:hover:text-white transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* User List Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-50 dark:border-slate-800">
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Identity</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                                    <th className="px-10 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Team</th>
                                    <th className="px-10 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-20 text-center text-gray-400">
                                            <Loader2 size={32} className="animate-spin mx-auto mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest">Loading Users...</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-20 text-center text-gray-400">
                                            <p className="text-xs font-black uppercase tracking-widest">No users found</p>
                                        </td>
                                    </tr>
                                ) : filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs shadow-soft transition-transform group-hover:scale-110">
                                                    {user.name ? user.name.slice(0, 2).toUpperCase() : user.email.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black text-secondary dark:text-white">{user.name || 'No Name'}</p>
                                                    <p className="text-[11px] text-gray-400 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-10 py-6">
                                            {user.team ? (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary dark:text-white bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                                    {user.team}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Not Assigned</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="text-[10px] font-black text-primary hover:text-primary/70 uppercase tracking-widest transition-all"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-10 py-8 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                            Showing <span className="text-secondary dark:text-white">1 - 5</span> of <span className="text-secondary dark:text-white">1,240</span> users
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-300 cursor-not-allowed">
                                <ChevronLeft size={20} />
                            </button>
                            {[1, 2, 3, '...', 248].map((page, idx) => (
                                <button
                                    key={idx}
                                    className={cn(
                                        "w-10 h-10 rounded-xl text-xs font-black transition-all",
                                        page === 1
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                    © 2024 Admin Control Systems. All rights reserved. Built with precision for the future of internal management.
                </p>
            </div>

            {selectedUser && (
                <UserEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    onUpdate={fetchUsers}
                />
            )}
        </AdminLayout>
    );
};

export default AdminUserManagementPage;
