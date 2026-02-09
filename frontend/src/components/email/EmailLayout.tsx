import React from 'react';

interface EmailLayoutProps {
    children: React.ReactNode;
    previewText?: string;
}

const EmailLayout: React.FC<EmailLayoutProps> = ({ children, previewText }) => {
    return (
        <div style={{
            backgroundColor: '#f8fafc',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '40px 20px',
            margin: '0',
            width: '100%',
        }}>
            {previewText && (
                <div style={{ display: 'none', maxHeight: '0px', overflow: 'hidden' }}>
                    {previewText}
                </div>
            )}

            <table align="center" border={0} cellPadding="0" cellSpacing="0" width="100%" style={{ maxWidth: '600px' }}>
                {/* Header / Logo */}
                <tr>
                    <td align="center" style={{ paddingBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: '#1d428a', borderRadius: '8px' }}></div>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#1d428a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                                Kalsan Auto
                            </span>
                        </div>
                    </td>
                </tr>

                {/* Main Content Card */}
                <tr>
                    <td style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '24px',
                        padding: '48px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f1f5f9'
                    }}>
                        {children}
                    </td>
                </tr>

                {/* Social Icons & Contact */}
                <tr>
                    <td align="center" style={{ paddingTop: '48px', paddingBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            {/* Simple colored dots representing social icons as seen in Image 1 */}
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏅</div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔗</div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</div>
                        </div>
                    </td>
                </tr>

                {/* Footer Info */}
                <tr>
                    <td align="center" style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500, lineHeight: '1.6' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#64748b', fontWeight: 700 }}>Kalsan Auto Spare Parts LLC</p>
                        <p style={{ margin: '0 0 16px 0' }}>123 Industrial Area, Dubai, United Arab Emirates</p>
                        <p style={{ margin: '0 0 24px 0' }}>© 2024 Kalsan Auto. All rights reserved.</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <a href="#" style={{ color: '#1d428a', textDecoration: 'none', fontWeight: 700 }}>Privacy Policy</a>
                            <span style={{ color: '#e2e8f0' }}>•</span>
                            <a href="#" style={{ color: '#1d428a', textDecoration: 'none', fontWeight: 700 }}>Terms of Service</a>
                            <span style={{ color: '#e2e8f0' }}>•</span>
                            <a href="#" style={{ color: '#1d428a', textDecoration: 'none', fontWeight: 700 }}>Unsubscribe</a>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    );
};

export default EmailLayout;
