import React from 'react';
import EmailLayout from './EmailLayout';

const QuoteReceivedEmail: React.FC = () => {
    return (
        <EmailLayout previewText="We've received your quote request">
            <div style={{ textAlign: 'center' }}>
                {/* Hero Icon Wrapper */}
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
                    <span style={{ fontSize: '32px' }}>📋</span>
                </div>

                <h1 style={{ fontSize: '28px', color: '#1d428a', fontWeight: 900, marginBottom: '8px', marginTop: '0' }}>
                    We've Received Your Request
                </h1>
                <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '24px' }}>
                    Your quote is being prepared by our expert team.
                </p>

                <div style={{
                    border: '1px dashed #1d428a',
                    borderRadius: '16px',
                    padding: '20px',
                    backgroundColor: 'rgba(29, 66, 138, 0.02)',
                    marginBottom: '40px'
                }}>
                    <p style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Quote Reference ID</p>
                    <p style={{ fontSize: '24px', fontWeight: 900, color: '#1d428a', margin: '0' }}>#KA-88291</p>
                </div>

                {/* What Happens Next Section */}
                <div style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 900, color: '#1d428a', textTransform: 'uppercase', marginBottom: '20px' }}>What Happens Next?</h2>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: '#1d428a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, flexShrink: 0 }}>1</div>
                        <div>
                            <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 900, color: '#1d428a' }}>Expert Review</p>
                            <p style={{ margin: '0', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>Our technicians review your vehicle specs to ensure 100% part compatibility.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: '#1d428a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, flexShrink: 0 }}>2</div>
                        <div>
                            <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 900, color: '#1d428a' }}>Receive Quote</p>
                            <p style={{ margin: '0', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>You'll receive an email within 24 hours with a personalized price offer.</p>
                        </div>
                    </div>
                </div>

                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0' }}>
                    Need urgent assistance? Contact us at <span style={{ color: '#1d428a', fontWeight: 800 }}>support@kalsanauto.com</span>
                </p>
            </div>
        </EmailLayout>
    );
};

export default QuoteReceivedEmail;
