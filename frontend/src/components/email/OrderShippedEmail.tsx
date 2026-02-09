import React from 'react';
import EmailLayout from './EmailLayout';
import { Package, Truck, Calendar } from 'lucide-react';

interface OrderShippedEmailProps {
    customerName: string;
    orderId: string;
    trackingNumber: string;
    deliveryEstimate?: string;
}

export const OrderShippedEmail = ({
    customerName,
    orderId,
    trackingNumber,
    deliveryEstimate = '3-5 Business Days'
}: OrderShippedEmailProps) => {
    return (
        <EmailLayout previewText="Good news! Your order has shipped">
            <div style={{ padding: '40px' }}>
                <h1 style={{ color: '#1d428a', fontSize: '24px', fontWeight: '900', margin: '0 0 20px 0', textTransform: 'uppercase' }}>
                    Your Order has Shipped!
                </h1>

                <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', margin: '0 0 30px 0' }}>
                    Hello {customerName}, great news! Your order <strong>#{orderId}</strong> has been packaged and is now on its way to you.
                </p>

                <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '30px',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '900', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Tracking Number
                        </p>
                        <p style={{ color: '#1d428a', fontSize: '18px', fontWeight: '900', margin: '0' }}>
                            {trackingNumber}
                        </p>
                    </div>

                    <div>
                        <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '900', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Estimated Delivery
                        </p>
                        <p style={{ color: '#1d428a', fontSize: '18px', fontWeight: '900', margin: '0' }}>
                            {deliveryEstimate}
                        </p>
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
                        Track My Package
                    </a>
                </div>

                <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e2e8f0' }}>
                    <h3 style={{ color: '#1d428a', fontSize: '14px', fontWeight: '900', margin: '0 0 15px 0', textTransform: 'uppercase' }}>
                        What happens next?
                    </h3>
                    <ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
                        <li style={{ color: '#64748b', fontSize: '13px', margin: '0 0 10px 0', display: 'flex', alignItems: 'center' }}>
                            • Courier will contact you for delivery
                        </li>
                        <li style={{ color: '#64748b', fontSize: '13px', margin: '0 0 10px 0', display: 'flex', alignItems: 'center' }}>
                            • Inspect the package upon arrival
                        </li>
                    </ul>
                </div>
            </div>
        </EmailLayout>
    );
};

export default OrderShippedEmail;
