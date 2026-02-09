import React from 'react';
import EmailLayout from './EmailLayout';

const PasswordResetEmail: React.FC = () => {
    return (
        <EmailLayout previewText="Reset your Kalsan account password">
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', color: '#1d428a', fontWeight: 900, marginBottom: '16px', marginTop: '0' }}>
                    Hi there,
                </h1>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                    We received a request to reset your password for your Kalsan account. Click the button below to choose a new one.
                </p>

                <div style={{ marginBottom: '48px' }}>
                    <a href="#" style={{
                        backgroundColor: '#1d428a',
                        color: '#ffffff',
                        padding: '16px 40px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 900,
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'inline-block',
                        boxShadow: '0 10px 15px -3px rgba(29, 66, 138, 0.3)'
                    }}>
                        Reset Password
                    </a>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic', margin: '0' }}>
                        If you didn't request this change, you can safely ignore this email. The link will expire in 24 hours.
                    </p>
                </div>
            </div>
        </EmailLayout>
    );
};

export default PasswordResetEmail;
