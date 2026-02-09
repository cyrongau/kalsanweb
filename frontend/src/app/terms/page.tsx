import LegalLayout from '@/components/LegalLayout';

export default function TermsPage() {
    return (
        <LegalLayout
            title="Terms of Service"
            subtitle="The rules of our relationship"
            lastUpdated="October 12, 2023"
            breadcrumb={[{ name: 'Terms of Service', href: '/terms' }]}
            heroImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000"
        >
            <h2>1. Acceptance of Terms</h2>
            <p>
                By accessing or using the Kalsan Auto Spare Parts website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2>2. Use License</h2>
            <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Kalsan's website for personal, non-commercial transitory viewing only.
            </p>

            <h2>3. Disclaimer</h2>
            <p>
                The materials on Kalsan's website are provided on an 'as is' basis. Kalsan makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>4. Limitations</h2>
            <p>
                In no event shall Kalsan or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kalsan's website.
            </p>

            <h2>5. Governing Law</h2>
            <p>
                These terms and conditions are governed by and construed in accordance with the laws of Somaliland and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
        </LegalLayout>
    );
}
