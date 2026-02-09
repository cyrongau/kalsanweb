import React from 'react';
import EmailLayout from './EmailLayout';

const QuoteReadyEmail: React.FC = () => {
    return (
        <EmailLayout previewText="Your quote is ready for review">
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <span style={{ fontSize: '32px' }}>✅</span>
                </div>

                <h1 style={{ fontSize: '32px', color: '#1d428a', fontWeight: 900, marginBottom: '8px', marginTop: '0' }}>
                    Your Quote is Ready
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px' }}>
                    We've processed your request. Please review the pricing details below to proceed with your order.
                </p>

                {/* Pricing Table */}
                <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    marginBottom: '40px'
                }}>
                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ fontSize: '12px', textAlign: 'left' }}>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                            <th style={{ padding: '16px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Item Description</th>
                            <th style={{ padding: '16px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                            <th style={{ padding: '16px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Total</th>
                        </tr>
                        <tr>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#1d428a' }}>Brake Pads - Front (Ceramic)</td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#64748b' }}>2</td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: 900, color: '#1d428a' }}>$90.00</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#1d428a' }}>Oil Filter - Synthetic High Flow</td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center', color: '#64748b' }}>1</td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: 900, color: '#1d428a' }}>$15.00</td>
                        </tr>
                        <tr style={{ backgroundColor: '#f8fafc' }}>
                            <td colSpan={2} style={{ padding: '20px', fontWeight: 900, color: '#1d428a', fontSize: '14px' }}>Final Total Amount</td>
                            <td style={{ padding: '20px', textAlign: 'right', fontWeight: 900, color: '#1d428a', fontSize: '20px' }}>$105.00</td>
                        </tr>
                    </table>
                </div>

                <div style={{ marginBottom: '40px' }}>
                    <a href="#" style={{
                        backgroundColor: '#1d428a',
                        color: '#ffffff',
                        padding: '20px 48px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        fontWeight: 900,
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'inline-block',
                        boxShadow: '0 10px 15px -3px rgba(29, 66, 138, 0.3)'
                    }}>
                        View & Finalize Order
                    </a>
                </div>

                <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Clicking the button will take you to our secure checkout portal.
                </p>
            </div>
        </EmailLayout>
    );
};

export default QuoteReadyEmail;
