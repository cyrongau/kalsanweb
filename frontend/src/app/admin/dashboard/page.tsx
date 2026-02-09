"use client";

import React from 'react';
import {
    BarChart3,
    FileText,
    Users2,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { API_BASE_URL } from '@/lib/config';

const StatCard = ({ icon: Icon, label, value, trend, color, alert }: any) => (
    <div className={cn(
        "bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border-l-4 transition-all hover:scale-[1.02]",
        color === 'blue' ? "border-blue-500" :
            color === 'orange' ? "border-orange-500" :
                color === 'emerald' ? "border-emerald-500" :
                    "border-red-500"
    )}>
        <div className="flex justify-between items-start mb-4">
            <div className={cn(
                "p-3 rounded-2xl",
                color === 'blue' ? "bg-blue-50 text-blue-500 dark:bg-blue-500/10" :
                    color === 'orange' ? "bg-orange-50 text-orange-500 dark:bg-orange-500/10" :
                        color === 'emerald' ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10" :
                            "bg-red-50 text-red-500 dark:bg-red-500/10"
            )}>
                <Icon size={22} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">
                    <TrendingUp size={14} />
                    <span className="text-[10px] font-black">{trend}</span>
                </div>
            )}
            {alert && (
                <div className="flex items-center gap-1 text-red-500 dark:text-red-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">{alert}</span>
                </div>
            )}
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</p>
            <h3 className="text-3xl font-black text-secondary dark:text-white tracking-tight">{value}</h3>
        </div>
    </div>
);

const RecentInquiriesTable = ({ data = [] }: { data: any[] }) => {
    const inquiries = data.map(item => ({
        date: new Date(item.created_at).toLocaleDateString(),
        customer: item.guest_name || item.user?.name || 'Guest',
        part: item.items?.[0]?.product_name || 'Multiple Parts',
        brand: item.items?.[0]?.brand || 'N/A',
        status: item.status
    }));

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-secondary dark:text-white tracking-tight">Recent Quote Inquiries</h2>
                <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-100 dark:border-slate-800">
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Part Requested</th>
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand</th>
                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                        {inquiries.map((item, idx) => (
                            <tr key={idx} className="group hover:bg-gray-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="py-5">
                                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 w-20 leading-relaxed">
                                        {item.date}
                                    </div>
                                </td>
                                <td className="py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-secondary dark:text-white">
                                            {item.customer.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-bold text-secondary dark:text-white">{item.customer}</span>
                                    </div>
                                </td>
                                <td className="py-5">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.part}</span>
                                </td>
                                <td className="py-5">
                                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {item.brand}
                                    </span>
                                </td>
                                <td className="py-5 text-right">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                        item.status === 'New' ? "bg-blue-50 text-blue-500 dark:bg-blue-500/10" :
                                            item.status === 'Processing' ? "bg-orange-50 text-orange-500 dark:bg-orange-500/10" :
                                                "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10"
                                    )}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing 4 of 1,284 inquiries</p>
                <div className="flex items-center gap-2">
                    <button className="p-2 border border-gray-100 dark:border-slate-800 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"><ChevronLeft size={16} /></button>
                    <button className="p-2 border border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-primary rounded-xl font-black text-[10px]">1</button>
                    <button className="p-2 border border-gray-100 dark:border-slate-800 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

const TrendsVisualization = ({ data }: { data: any }) => {
    const bars = data?.bars || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const peakDemand = data?.peakDemand || 'N/A';
    const averageDaily = data?.averageDaily || 0;
    const increasePercentage = data?.increasePercentage || 0;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-secondary dark:text-white tracking-tight">Inquiry Trends</h2>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-slate-800 px-3 py-1 rounded-lg">Last 30 Days</span>
            </div>

            {/* Mock Chart */}
            <div className="flex-1 flex items-end justify-between gap-2 h-40 relative mb-8 min-h-[160px]">
                {bars.map((height: number, idx: number) => (
                    <div
                        key={idx}
                        className={cn(
                            "flex-1 rounded-t-lg transition-all duration-500",
                            idx === bars.length - 2 ? "bg-blue-600" :
                                idx === bars.length - 3 ? "bg-blue-400" :
                                    "bg-blue-100 dark:bg-slate-800"
                        )}
                        style={{ height: `${height}%` }}
                    />
                ))}
            </div>

            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">
                <span>Start</span>
                <span>Mid</span>
                <span>Today</span>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                        <span className="text-xs font-medium text-gray-500">Peak Demand</span>
                    </div>
                    <span className="text-xs font-black text-secondary dark:text-white uppercase">{peakDemand}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-100" />
                        <span className="text-xs font-medium text-gray-500">Average Daily</span>
                    </div>
                    <span className="text-xs font-black text-secondary dark:text-white uppercase">{averageDaily} Inquiries</span>
                </div>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-50 dark:border-slate-800">
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium capitalize">
                    Inquiries have changed by <span className={cn("font-black", increasePercentage >= 0 ? "text-emerald-500" : "text-red-500")}>
                        {increasePercentage >= 0 ? '+' : ''}{increasePercentage}%
                    </span> compared to the previous period.
                </p>
            </div>
        </div>
    );
};

const DashboardOverview = () => {
    const [stats, setStats] = React.useState<any>(null);
    const [inquiries, setInquiries] = React.useState<any[]>([]);
    const [trends, setTrends] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [overviewRes, inquiriesRes, trendsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/stats/overview`),
                    fetch(`${API_BASE_URL}/stats/recent-inquiries`),
                    fetch(`${API_BASE_URL}/stats/trends`)
                ]);

                if (overviewRes.ok) setStats(await overviewRes.json());
                if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
                if (trendsRes.ok) setTrends(await trendsRes.json());
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={BarChart3}
                        label="Total Inquiries"
                        value={stats?.totalInquiries || 0}
                        trend="+0%"
                        color="blue"
                    />
                    <StatCard
                        icon={Clock}
                        label="Pending Quotes"
                        value={stats?.pendingQuotes || 0}
                        color="orange"
                        alert={stats?.pendingQuotes > 0 ? "Needs attention" : null}
                    />
                    <StatCard
                        icon={Users2}
                        label="New Customers"
                        value={stats?.newCustomers || 0}
                        trend="+0%"
                        color="emerald"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Low Stock Alerts"
                        value={stats?.lowStockAlerts || 0}
                        color="red"
                        alert={stats?.lowStockAlerts > 0 ? "Restock Now" : null}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                    <div className="lg:col-span-2">
                        <RecentInquiriesTable data={inquiries} />
                    </div>
                    <div>
                        <TrendsVisualization data={trends} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardOverview;
