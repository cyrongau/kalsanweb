"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Shield, Wrench, BarChart3, ChevronLeft, Paperclip, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/components/providers/AuthProvider';

type Team = 'Support' | 'Technical' | 'Sales & Marketing';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const teams = [
    { name: 'Support' as Team, icon: Shield, description: 'Order status, returns, and general inquiries', color: 'bg-blue-500' },
    { name: 'Technical' as Team, icon: Wrench, description: 'Part compatibility and technical specifications', color: 'bg-purple-500' },
    { name: 'Sales & Marketing' as Team, icon: BarChart3, description: 'Bulk orders, discounts, and partnerships', color: 'bg-orange-500' },
];

export default function SupportChat() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [preChatInfo, setPreChatInfo] = useState({ name: '', email: '' });
    const [isPreChatDone, setIsPreChatDone] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Listener for custom event to open support hub
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-support-chat', handleOpen);
        return () => window.removeEventListener('open-support-chat', handleOpen);
    }, []);

    // Socket initialization
    useEffect(() => {
        socketRef.current = io('http://localhost:3001');

        socketRef.current.on('new_message', (message: Message) => {
            setMessages(prev => {
                if (prev.find(m => m.id === message.id)) return prev;
                return [...prev, { ...message, timestamp: new Date(message.timestamp) }];
            });
        });

        socketRef.current.on('chat_resolved', () => {
            // Handle chat resolution (e.g., show a summary or rating)
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Persistence
    useEffect(() => {
        const savedMessages = localStorage.getItem('support_chat_messages');
        const savedTeam = localStorage.getItem('support_chat_team');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages).map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp)
            })));
        }
        if (savedTeam) setSelectedTeam(savedTeam as Team);
    }, []);

    useEffect(() => {
        localStorage.setItem('support_chat_messages', JSON.stringify(messages));
        if (selectedTeam) localStorage.setItem('support_chat_team', selectedTeam);
        else localStorage.removeItem('support_chat_team');
    }, [messages, selectedTeam]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Welcome message when team is selected and pre-chat is done
    const startConversation = async () => {
        if (!selectedTeam || (!user && !isPreChatDone)) return;

        try {
            const res = await fetch('http://localhost:3001/chat/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: user?.displayName || preChatInfo.name,
                    userEmail: user?.email || preChatInfo.email,
                    team: selectedTeam,
                }),
            });

            if (res.ok) {
                const conv = await res.json();
                setConversationId(conv.id);
                socketRef.current?.emit('join_conversation', conv.id);

                if (messages.length === 0) {
                    setIsTyping(true);
                    setTimeout(() => {
                        setIsTyping(false);
                        setMessages([{
                            id: 'welcome',
                            text: `Hello! You're connected with the ${selectedTeam} team. How can we help you today?`,
                            sender: 'bot' as any,
                            timestamp: new Date()
                        }]);
                    }, 1000);
                }
            }
        } catch (error) {
            console.error("Failed to start conversation", error);
        }
    };

    useEffect(() => {
        if (selectedTeam && (user || isPreChatDone)) {
            startConversation();
        }
    }, [selectedTeam, isPreChatDone, user]);

    const handleSend = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim() || !conversationId) return;

        const messageData = {
            conversationId,
            text: inputText,
            sender: 'user',
        };

        socketRef.current?.emit('send_message', messageData);
        setInputText('');
    };

    const getMockResponse = (team: Team | null, text: string) => {
        const lowerText = text.toLowerCase();
        if (team === 'Support') {
            if (lowerText.includes('order')) return "I can help with that! Please provide your order number and I'll check the status for you.";
            return "Our support team typically responds within 15 minutes. How can I assist you with your experience today?";
        }
        if (team === 'Technical') {
            if (lowerText.includes('part') || lowerText.includes('compatible')) return "To give you the most accurate advice, could you specify the make and model of your vehicle?";
            return "You're connected with our technical division. We are experts in bajaj and tvs components. What specifications are you looking for?";
        }
        if (team === 'Sales & Marketing') {
            if (lowerText.includes('discount') || lowerText.includes('bulk')) return "We offer excellent rates for bulk purchases! I can connect you with a manager for a custom quote.";
            return "Looking to partner with Kalsan? Tell me more about your business or what you're looking to purchase.";
        }
        return "Thanks for reaching out! One of our team members will be with you shortly.";
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-6 w-[400px] h-[600px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">

                    {/* Header */}
                    <div className="bg-secondary p-6 text-white flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {selectedTeam ? (
                                <>
                                    <button onClick={() => setSelectedTeam(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div>
                                        <h3 className="font-black uppercase tracking-widest text-[10px] text-white/60">Chatting with</h3>
                                        <p className="font-black text-sm uppercase tracking-tight">{selectedTeam} Team</p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                        <MessageCircle size={20} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-tight">Support Hub</h3>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {!selectedTeam ? (
                            <div className="space-y-6 py-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="text-center space-y-2">
                                    <p className="font-bold text-gray-400 uppercase tracking-[0.2em] text-[10px]">Welcome to Kalsan Live</p>
                                    <h2 className="text-2xl font-black text-secondary dark:text-white uppercase tracking-tight">Who would you like to speak with?</h2>
                                </div>
                                <div className="space-y-3">
                                    {teams.map((team) => (
                                        <button
                                            key={team.name}
                                            onClick={() => setSelectedTeam(team.name)}
                                            className="w-full p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-4 text-left hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                                        >
                                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform", team.color)}>
                                                <team.icon size={22} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-secondary dark:text-white uppercase tracking-tight truncate">{team.name}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-1">{team.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : !user && !isPreChatDone ? (
                            <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center space-y-2">
                                    <p className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">Just a quick step</p>
                                    <h2 className="text-2xl font-black text-secondary dark:text-white uppercase tracking-tight">Let us know who you are</h2>
                                </div>
                                <form
                                    onSubmit={(e) => { e.preventDefault(); setIsPreChatDone(true); }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Your Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={preChatInfo.name}
                                            onChange={(e) => setPreChatInfo({ ...preChatInfo, name: e.target.value })}
                                            placeholder="Enter your name"
                                            className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={preChatInfo.email}
                                            onChange={(e) => setPreChatInfo({ ...preChatInfo, email: e.target.value })}
                                            placeholder="Enter your email"
                                            className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 mt-4"
                                    >
                                        Start chatting
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <>
                                {messages.length === 0 && (
                                    <div className="text-center py-10 space-y-4">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center text-gray-300">
                                            <User size={32} />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start a conversation with our {selectedTeam} team</p>
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex flex-col max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                                            msg.sender === 'user' ? "ml-auto items-end" : "items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-4 rounded-2xl text-sm font-medium",
                                            msg.sender === 'user'
                                                ? "bg-primary text-white rounded-br-none"
                                                : "bg-gray-100 dark:bg-slate-800 text-secondary dark:text-white rounded-bl-none"
                                        )}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex items-start max-w-[80%] animate-in fade-in duration-300">
                                        <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none">
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Footer / Input */}
                    {selectedTeam && (
                        <div className="p-6 pt-0 border-t border-gray-50 dark:border-slate-800 mt-auto">
                            <form
                                onSubmit={handleSend}
                                className="relative flex items-center gap-2 mt-4"
                            >
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-6 pr-12 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
                                        <button type="button" className="hover:text-primary transition-colors">
                                            <Paperclip size={16} />
                                        </button>
                                        <button type="button" className="hover:text-primary transition-colors">
                                            <Smile size={16} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-14 h-14 bg-secondary dark:bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-secondary/20"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 group relative",
                    isOpen
                        ? "bg-white text-secondary dark:bg-slate-900 dark:text-white rotate-90"
                        : "bg-secondary text-white dark:bg-primary"
                )}
            >
                {isOpen ? <X size={32} /> : <MessageCircle size={32} className="group-hover:rotate-12 transition-transform" />}

                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 border-4 border-white dark:border-slate-950 rounded-full animate-pulse" />
                )}
            </button>
        </div>
    );
}
