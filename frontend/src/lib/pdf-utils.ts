import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ReceiptItem {
    name: string;
    qty: number;
    price: number;
}

interface CompanySettings {
    tagline?: string;
    contactAddress: string;
    contactEmail: string;
    contactPhone: string;
}

export const generateReceiptPDF = (
    orderId: string,
    items: ReceiptItem[],
    settings: CompanySettings,
    paymentMethod: string,
    customerInfo?: { name: string; email: string },
    shippingAddress?: string
) => {
    const doc = new jsPDF() as any;

    // Background Graphic Elements
    doc.setFillColor(29, 66, 138); // Primary Color
    doc.rect(0, 0, 210, 15, 'F'); // Top bar

    // Brand & Header
    doc.setFontSize(24);
    doc.setTextColor(29, 66, 138);
    doc.setFont("helvetica", "bold");
    doc.text("KALSAN AUTO", 20, 35);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("SPARE PARTS", 20, 40);

    // Official Title
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL INVOICE", 190, 35, { align: "right" });

    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: #${orderId.split('-')[0].toUpperCase()}`, 190, 42, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 190, 47, { align: "right" });

    // Horizontal Line
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 55, 190, 55);

    // Two Column Layout for Addresses
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("FROM:", 20, 65);
    doc.text("BILL TO:", 105, 65);

    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "bold");
    doc.text("Kalsan Auto Parts", 20, 71);
    doc.text(customerInfo?.name || "Valued Customer", 105, 71);

    doc.setFont("helvetica", "normal");
    doc.text(settings.contactAddress, 20, 77);
    doc.text(customerInfo?.email || "N/A", 105, 77);
    doc.text(`Email: ${settings.contactEmail}`, 20, 83);
    if (shippingAddress) {
        doc.text(shippingAddress, 105, 83, { maxWidth: 80 });
    }

    doc.text(`Phone: ${settings.contactPhone}`, 20, 89);

    // Items Table
    const tableColumn = ["Item Description", "Qty", "Unit Price", "Total"];
    const tableRows = items.map(item => [
        item.name,
        item.qty.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.qty * item.price).toFixed(2)}`
    ]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 105,
        theme: 'striped',
        headStyles: {
            fillColor: [29, 66, 138],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'center'
        },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { left: 20, right: 20 }
    });

    // Calculations
    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    // Summary
    const finalY = doc.lastAutoTable.finalY + 15;

    // Payment Method Box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, finalY - 5, 80, 25, 3, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information", 25, finalY + 5);
    doc.setFont("helvetica", "normal");
    doc.text(`Method: ${paymentMethod.toUpperCase()}`, 25, finalY + 12);
    doc.text(`Status: PAID`, 25, finalY + 17);

    // Totals Section
    doc.setFontSize(10);
    doc.text("Subtotal:", 140, finalY);
    doc.text(`$${subtotal.toFixed(2)}`, 190, finalY, { align: "right" });

    doc.text("Sales Tax (5%):", 140, finalY + 8);
    doc.text(`$${tax.toFixed(2)}`, 190, finalY + 8, { align: "right" });

    doc.setDrawColor(29, 66, 138);
    doc.setLineWidth(0.5);
    doc.line(140, finalY + 13, 190, finalY + 13);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(29, 66, 138);
    doc.text("TOTAL DUE:", 140, finalY + 22);
    doc.text(`$${total.toFixed(2)}`, 190, finalY + 22, { align: "right" });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for choosing Kalsan Auto Spare Parts. We appreciate your business!", 105, 280, { align: "center" });

    doc.setDrawColor(230, 230, 230);
    doc.line(20, 285, 190, 285);
    doc.text(settings.tagline || "Premium Quality Parts for Every Ride", 105, 290, { align: "center" });

    doc.save(`Invoice_${orderId.split('-')[0].toUpperCase()}.pdf`);
};
