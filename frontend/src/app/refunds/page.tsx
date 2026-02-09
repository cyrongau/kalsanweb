import LegalLayout from '@/components/LegalLayout';

export default function RefundsPage() {
    return (
        <LegalLayout
            title="Returns & Refunds"
            subtitle="Our commitment to your satisfaction"
            lastUpdated="October 12, 2023"
            breadcrumb={[{ name: 'Returns & Refunds', href: '/refunds' }]}
            heroImage="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000"
        >
            <h2>1. Returns Policy</h2>
            <p>
                You have 7 working days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
            </p>

            <h2>2. Refund Process</h2>
            <p>
                Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
            </p>

            <h2>3. OEM Parts</h2>
            <p>
                Please note that certain specialized OEM parts (Original Equipment Manufacturer) are subject to a 15% restocking fee if returned due to "change of mind". Electrical components that have been installed are non-returnable.
            </p>

            <h2>4. Shipping</h2>
            <p>
                You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
            </p>

            <h2>5. Contact Us</h2>
            <p>
                If you have any questions on how to return your item to us, contact us at sales@kalsanspareparts.com.
            </p>
        </LegalLayout>
    );
}
