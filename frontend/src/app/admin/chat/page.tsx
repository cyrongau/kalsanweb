"use client";

import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdmin } from '@/components/providers/AdminProvider';
import { cn } from '@/lib/utils';
import { MessageCircle, Send, User, Shield, Wrench, BarChart3, CheckCircle2, Clock, Search, Phone, Mail, ChevronRight } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/components/providers/AuthProvider';
import { API_BASE_URL } from '@/lib/config';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent' | 'system';
    createdAt: string;
}

interface Conversation {
    id: string;
    userName: string;
    userEmail: string;
    team: string;
    status: string;
    messages: Message[];
    updatedAt: string;
    agentId?: string;
    agent?: {
        name: string;
        email: string;
    };
}

export default function AdminChatPage() {
    const { profile } = useAdmin();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [historyConversations, setHistoryConversations] = useState<Conversation[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chimeRef = useRef<HTMLAudioElement | null>(null);

    const selectedConversation = conversations.find(c => c.id === selectedId);

    const fetchActive = () => {
        fetch(`${API_BASE_URL}/chat/conversations/active`)
            .then(res => res.json())
            .then(data => setConversations(data));
    };

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const res = await fetch(`${API_BASE_URL}/chat/conversations/resolved`);
            const data = await res.json();
            setHistoryConversations(data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchActive();

        // Socket setup
        socketRef.current = io(API_BASE_URL);

        socketRef.current.on('connect', () => {
            socketRef.current?.emit('admin_join');
        });

        socketRef.current.on('incoming_chat', (data: { conversationId: string; message: Message }) => {
            setConversations(prev => {
                const index = prev.findIndex(c => c.id === data.conversationId);
                if (index === -1) {
                    // New conversation (need to fetch full details or handle differently)
                    fetch(`${API_BASE_URL}/chat/conversations/${data.conversationId}`)
                        .then(res => res.json())
                        .then(newConv => setConversations(current => [newConv, ...current]));
                    return prev;
                }

                const updated = [...prev];
                const conv = { ...updated[index] };

                // Avoid duplicates
                if (!conv.messages.find(m => m.id === data.message.id)) {
                    conv.messages = [...conv.messages, data.message];
                    conv.updatedAt = data.message.createdAt;
                    updated.splice(index, 1);
                    updated.unshift(conv);

                    // Only chime if it's from user
                    if (data.message.sender === 'user') {
                        chimeRef.current?.play().catch(e => console.log('Chime blocked', e));
                    }
                }
                return updated;
            });
        });

        socketRef.current.on('new_message', (message: Message) => {
            // This handles cases where we are already in the conversation room
            // But incoming_chat already handles the main logic
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (selectedId) {
            socketRef.current?.emit('join_conversation', selectedId);
        }
    }, [selectedId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedId) return;

        const messageData = {
            conversationId: selectedId,
            text: inputText,
            sender: 'agent',
        };

        socketRef.current?.emit('send_message', messageData);
        setInputText('');
    };

    const resolveChat = async () => {
        if (!selectedId) return;
        try {
            await fetch(`${API_BASE_URL}/chat/conversations/${selectedId}/resolve`, { method: 'POST' });
            if (activeTab === 'active') {
                setConversations(prev => prev.filter(c => c.id !== selectedId));
            } else {
                fetchHistory();
            }
            setSelectedId(null);
        } catch (error) {
            console.error("Failed to resolve chat", error);
        }
    };

    const getTeamIcon = (team: string) => {
        switch (team) {
            case 'Support': return Shield;
            case 'Technical': return Wrench;
            case 'Sales & Marketing': return BarChart3;
            default: return MessageCircle;
        }
    };

    return (
        <AdminLayout>
            <audio ref={chimeRef} src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" />

            <div className="h-[calc(100vh-160px)] flex gap-8 animate-in fade-in duration-700">
                {/* Sidebar - Conversations List */}
                <div className="w-96 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden border border-gray-100 dark:border-slate-800">
                    <div className="p-8 border-b border-gray-50 dark:border-slate-800 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-secondary dark:text-white tracking-tight uppercase">Inquiries</h2>
                            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeTab === 'active' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeTab === 'history' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    History
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
                        {(() => {
                            const list = activeTab === 'active' ? conversations : historyConversations;
                            const filtered = list.filter(c => {
                                // 1. Search filter
                                const matchesSearch =
                                    c.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    c.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    c.team?.toLowerCase().includes(searchQuery.toLowerCase());

                                if (!matchesSearch) return false;

                                // 2. Team filter (Super Admin sees everything, others see only their team)
                                if (user?.role === 'super_admin' || user?.role === 'admin') return true;
                                if (user?.team && user.team !== 'None') {
                                    return c.team === user.team;
                                }

                                return true;
                            });

                            if (filtered.length === 0) {
                                return (
                                    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 text-gray-400">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                            <MessageCircle size={32} />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest">
                                            {searchQuery ? `No results for "${searchQuery}"` : activeTab === 'active' ? 'No active chats' : 'No history found'}
                                        </p>
                                    </div>
                                );
                            }

                            return filtered.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedId(conv.id)}
                                    className={cn(
                                        "w-full p-6 flex flex-col gap-3 transition-all hover:bg-gray-50 dark:hover:bg-slate-800/50 text-left border-b border-gray-50 dark:border-slate-800/50 relative group",
                                        selectedId === conv.id && "bg-blue-50/50 dark:bg-primary/5 shadow-[inset_4px_0_0_0_#3b82f6]"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-secondary dark:text-white">
                                                {conv.userName?.split(' ').map(n => n[0]).join('') || 'U'}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm text-secondary dark:text-white truncate">{conv.userName}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{conv.team}</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    {conv.messages.length > 0 && (
                                        <p className="text-xs text-gray-500 truncate font-medium">
                                            {conv.messages[conv.messages.length - 1].text}
                                        </p>
                                    )}
                                </button>
                            ));
                        })()}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden border border-gray-100 dark:border-slate-800">
                    {selectedConversation ? (
                        <>
                            {/* Header */}
                            <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary">
                                        {React.createElement(getTeamIcon(selectedConversation.team), { size: 24 })}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-secondary dark:text-white tracking-tight uppercase leading-none">{selectedConversation.userName}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Now</p>
                                            </div>
                                            {selectedConversation.agent && (
                                                <div className="flex items-center gap-2 border-l border-gray-100 dark:border-slate-800 pl-4 text-gray-400">
                                                    <User size={12} />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">Assigned to: {selectedConversation.agent.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {selectedConversation.status === 'active' ? (
                                        <button
                                            onClick={resolveChat}
                                            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <CheckCircle2 size={16} />
                                            Resolve Chat
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-slate-700">
                                            <Clock size={16} />
                                            Resolved
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-gray-50/20 dark:bg-transparent">
                                {selectedConversation.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                            msg.sender === 'agent' ? "ml-auto items-end" : "items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-5 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm",
                                            msg.sender === 'agent'
                                                ? "bg-primary text-white rounded-br-none"
                                                : "bg-white dark:bg-slate-800 text-secondary dark:text-white rounded-bl-none border border-gray-100 dark:border-slate-700"
                                        )}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 px-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            {selectedConversation.status === 'active' ? (
                                <div className="p-8 pt-0 border-t border-gray-50 dark:border-slate-800">
                                    <form
                                        onSubmit={handleSend}
                                        className="relative flex items-center gap-4 mt-6"
                                    >
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                value={inputText}
                                                onChange={(e) => setInputText(e.target.value)}
                                                placeholder="Type your reply..."
                                                className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                        >
                                            <Send size={24} />
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-10 border-t border-gray-50 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30">
                                    <div className="flex items-center justify-center gap-3 text-gray-400">
                                        <Clock size={16} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">This conversation is archived and read-only</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                            <div className="w-32 h-32 bg-gray-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-gray-200 dark:text-slate-800">
                                <MessageCircle size={64} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-secondary dark:text-white uppercase tracking-tight">Kalsan Support Center</h2>
                                <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium">Select a conversation from the sidebar to start assisting your customers in real-time.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
