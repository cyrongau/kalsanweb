"use client";

import LegalLayout from '@/components/LegalLayout';
import { useAdmin } from '@/components/providers/AdminProvider';

export default function ShippingPage() {
    const { settings } = useAdmin();
    return (
        <LegalLayout
            title="Shipping"
            subtitle="Fast & reliable delivery nationwide"
            lastUpdated="October 12, 2023"
            breadcrumb={[{ name: 'Shipping', href: '/shipping' }]}
            heroImage={settings.shippingBanner || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000"}
        >
            <h2>1. Delivery Areas</h2>
            <p>
                Kalsan Auto Spare Parts delivers across all major cities in Somaliland. We have a dedicated logistics team in Hargeisa and partner with reliable couriers for regional deliveries.
            </p>

            <h2>2. Shipping Times</h2>
            <ul>
                <li><strong>Hargeisa:</strong> Same day or next day delivery.</li>
                <li><strong>Berbera, Boroma:</strong> 1-2 business days.</li>
                <li><strong>Burco, Ceerigaabo, Laascaanood:</strong> 2-4 business days.</li>
            </ul>

            <h2>3. Local Pickup</h2>
            <p>
                You can also choose to pick up your order directly from our main warehouse in Hargeisa. Select "Local Pickup" during the checkout process (available once your quote is accepted).
            </p>

            <h2>4. Shipping Costs</h2>
            <p>
                Shipping costs are calculated based on the weight of the parts and the destination. For bulk orders or very heavy components (like engines or transmissions), we offer flat-rate freight shipping.
            </p>

            <h2>5. International Shipping</h2>
            <p>
                Currently, we only ship within Somaliland. For international inquiries, please contact our export team.
            </p>
        </LegalLayout>
    );
}
