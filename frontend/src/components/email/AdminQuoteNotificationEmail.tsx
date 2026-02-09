import React from 'react';
import EmailLayout from './EmailLayout';

interface AdminQuoteNotificationEmailProps {
    quoteId: string;
    customerName: string;
    customerEmail: string;
    itemsCount: number;
}

export const AdminQuoteNotificationEmail = ({
    quoteId,
    customerName,
    customerEmail,
    itemsCount
}: AdminQuoteNotificationEmailProps) => {
    return (
        <EmailLayout previewText={`New Quote Request from ${customerName}`}>
            <div style={{ padding: '40px' }}>
                <div style={{
                    display: 'inline-block',
                    backgroundColor: '#eff6ff',
                    color: '#3b82f6',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    marginBottom: '20px'
                }}>
                    Priority Inquiry
                </div>

                <h1 style={{ color: '#1d428a', fontSize: '24px', fontWeight: '900', margin: '0 0 20px 0', textTransform: 'uppercase' }}>
                    New Quote Request Received
                </h1>

                <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', margin: '0 0 30px 0' }}>
                    A new inquiry has been submitted by <strong>{customerName}</strong> ({customerEmail}).
                </p>

                <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '30px',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Request ID:</span>
                        <span style={{ color: '#1d428a', fontSize: '12px', fontWeight: '900' }}>#{quoteId.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Total Items:</span>
                        <span style={{ color: '#1d428a', fontSize: '12px', fontWeight: '900' }}>{itemsCount} Parts</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <a href="#" style={{
                        display: 'inline-block',
                        backgroundColor: '#1d428a',
                        color: '#ffffff',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '900',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        Manage in Dashboard
                    </a>
                </div>

                <p style={{ textAlign: 'center', marginTop: '30px', color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }}>
                    This is an automated system notification for Kalsan Admin.
                </p>
            </div>
        </EmailLayout>
    );
};

export default AdminQuoteNotificationEmail;
