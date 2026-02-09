"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '@/lib/config';

interface User {
    id: string;
    email: string;
    role: string;
    name?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load auth from localStorage on mount
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
            } catch (e) {
                console.error("Failed to parse auth data", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User, userToken: string) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        setUser(userData);
        setToken(userToken);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        // We'll show the toast in the component that calls logout typically, 
        // but adding it here ensures it always happens.
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user || !token) return;

        try {
            const res = await fetch(`${API_BASE_URL}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error("Failed to sync user updates to backend", error);
            // Fallback to local update if backend fails (optional)
            const localUpdate = { ...user, ...updates };
            localStorage.setItem('user', JSON.stringify(localUpdate));
            setUser(localUpdate);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
