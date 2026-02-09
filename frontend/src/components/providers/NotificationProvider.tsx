"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastType } from '../ui/Toast';
import Modal, { ModalType } from '../ui/Modal';

interface ToastState {
    id: string;
    title: string;
    message?: string;
    type: ToastType;
}

interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    type: ModalType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
}

interface NotificationContextType {
    showToast: (title: string, message?: string, type?: ToastType) => void;
    showModal: (config: Omit<ModalState, 'isOpen'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastState[]>([]);
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const showToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
        setToasts((prev) => {
            // Check for duplicates
            const isDuplicate = prev.some(t => t.title === title && t.message === message);
            if (isDuplicate) return prev;

            const id = Math.random().toString(36).substring(2, 9);
            return [...prev, { id, title, message, type }];
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showModal = useCallback((config: Omit<ModalState, 'isOpen'>) => {
        setModal({ ...config, isOpen: true });
    }, []);

    const closeModal = useCallback(() => {
        setModal((prev) => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <NotificationContext.Provider value={{ showToast, showModal }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-8 right-8 z-[110] flex flex-col gap-4 max-w-full">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </div>

            {/* Global Modal */}
            <Modal
                {...modal}
                onClose={closeModal}
            />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
