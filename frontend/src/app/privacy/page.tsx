import LegalLayout from '@/components/LegalLayout';

export default function PrivacyPage() {
    return (
        <LegalLayout
            title="Privacy Policy"
            subtitle="Your data security is our priority"
            lastUpdated="October 12, 2023"
            breadcrumb={[{ name: 'Privacy Policy', href: '/privacy' }]}
            heroImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000"
        >
            <h2>1. Information We Collect</h2>
            <p>
                We collect information you provide directly to us when you create an account, request a quote, make a purchase, or communicate with us. This may include your name, email address, phone number, shipping address, and vehicle details.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
                We use the information we collect to provide, maintain, and improve our services, such as processing your quote requests and orders, sending you technical notices, updates, security alerts, and support messages.
            </p>

            <h2>3. Information Sharing</h2>
            <p>
                We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
            </p>

            <h2>4. Security</h2>
            <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>

            <h2>5. Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us at info@kalsanspareparts.com.
            </p>
        </LegalLayout>
    );
}
