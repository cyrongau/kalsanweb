import React from 'react';
import EmailLayout from './EmailLayout';

const WelcomeEmail: React.FC = () => {
    return (
        <EmailLayout previewText="Welcome to Kalsan Auto Spare Parts">
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(29, 66, 138, 0.05)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <span style={{ fontSize: '32px' }}>🏠</span>
                </div>

                <h1 style={{ fontSize: '32px', color: '#1d428a', fontWeight: 900, marginBottom: '16px', marginTop: '0' }}>
                    Welcome to the family!
                </h1>
                <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                    We're thrilled to have you here. Kalsan Auto is your one-stop shop for premium spare parts and expert automotive advice.
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
                        Start Exploring
                    </a>
                </div>

                <div style={{ textAlign: 'left', borderTop: '1px solid #f1f5f9', paddingTop: '32px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#1d428a', textTransform: 'uppercase', marginBottom: '12px' }}>Next Steps:</h3>
                    <ul style={{ fontSize: '14px', color: '#64748b', paddingLeft: '20px', margin: '0' }}>
                        <li style={{ marginBottom: '8px' }}>Complete your profile for faster checkout.</li>
                        <li style={{ marginBottom: '8px' }}>Browse our latest catalog for genuine parts.</li>
                        <li>Add items to your quote list to get expert pricing.</li>
                    </ul>
                </div>
            </div>
        </EmailLayout>
    );
};

export default WelcomeEmail;
