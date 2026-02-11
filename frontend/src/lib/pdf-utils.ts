import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReceiptItem {
    name: string;
    qty: number;
    price: number;
    image?: string;
    spec?: string;
}

export interface CompanySettings {
    tagline?: string;
    contactAddress: string;
    contactEmail: string;
    contactPhone: string;
    logoLight?: string;
    logoDark?: string;
    siteIcon?: string;
    siteTitle?: string;
}

const getBase64FromUrl = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn("Failed to load image for PDF", e);
        return "";
    }
};

export const generateReceiptPDF = async (
    orderId: string,
    items: ReceiptItem[],
    settings: CompanySettings,
    paymentMethod: string,
    customerInfo?: { name: string; email: string },
    shippingAddress?: string
) => {
    const doc = new jsPDF() as any;

    // Load logo
    const logoUrl = settings.logoLight || settings.logoDark || settings.siteIcon;
    let logoBase64 = "";
    let logoWidth = 0;
    let logoHeight = 0;

    if (logoUrl) {
        logoBase64 = await getBase64FromUrl(logoUrl);
        if (logoBase64) {
            try {
                const imgProps = doc.getImageProperties(logoBase64);
                const maxHeight = 25; // Max height in mm
                const ratio = imgProps.width / imgProps.height;
                logoHeight = maxHeight;
                logoWidth = maxHeight * ratio;
            } catch (e) {
                console.warn("Failed to get image properties", e);
                // Fallback dimensions if properties fail
                logoWidth = 25;
                logoHeight = 25;
            }
        }
    }

    // Colors
    const primaryColor: [number, number, number] = [29, 66, 138]; // #1d428a
    const secondaryColor: [number, number, number] = [100, 116, 139]; // Slate 500

    // Header Background
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 50, 'F');

    // Logo & Brand
    if (logoBase64) {
        try {
            // Logo at top left
            doc.addImage(logoBase64, 'PNG', 15, 10, logoWidth, logoHeight, undefined, 'FAST');

            // Slogan below logo (aligned left with logo margin)
            doc.setFontSize(10);
            doc.setTextColor(...secondaryColor);
            doc.setFont("helvetica", "normal");
            doc.text(settings.tagline || "GENUINE SPARE PARTS", 15, 10 + logoHeight + 5);
        } catch (e) {
            console.error("Error adding logo to PDF:", e);
            // Fallback text if logo fails
            doc.setFontSize(24);
            doc.setTextColor(...primaryColor);
            doc.setFont("helvetica", "bold");
            doc.text(settings.siteTitle || "KALSAN AUTO", 15, 25);
        }
    } else {
        doc.setFontSize(24);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text(settings.siteTitle || "KALSAN AUTO", 15, 25);
    }

    // Invoice Details (Right aligned)
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text("INVOICE NO", 195, 20, { align: "right" });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`#${orderId.split('-')[0].toUpperCase()}`, 195, 26, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text("DATE", 195, 34, { align: "right" });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(new Date().toLocaleDateString(), 195, 40, { align: "right" });

    let yPos = 65;

    // Contact Info Section
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text("FROM:", 15, yPos);
    doc.text("BILL TO:", 110, yPos);

    yPos += 6;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(settings.siteTitle || "Kalsan Auto Spares", 15, yPos);

    if (customerInfo?.name) {
        doc.text(customerInfo.name, 110, yPos);
    }

    yPos += 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);

    // Address splitting for wrapping
    const addressLines = doc.splitTextToSize(settings.contactAddress, 70);
    doc.text(addressLines, 15, yPos);

    if (shippingAddress) {
        const shippingLines = doc.splitTextToSize(shippingAddress, 80);
        doc.text(shippingLines, 110, yPos);
    }

    yPos += (addressLines.length * 5) + 2;
    doc.text(settings.contactEmail, 15, yPos);
    if (customerInfo?.email) doc.text(customerInfo.email, 110, yPos);

    yPos += 5;
    doc.text(settings.contactPhone, 15, yPos);

    yPos += 15;

    // Table
    const tableRows = items.map(item => [
        item.name,
        item.qty.toString(),
        `$${Number(item.price || 0).toFixed(2)}`,
        `$${(item.qty * Number(item.price || 0)).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Item Description', 'Qty', 'Price', 'Total']],
        body: tableRows,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'left' // Explicitly align left
        },
        columnStyles: {
            0: { cellWidth: 90 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' }
        },
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        didDrawPage: (data) => {
            // Footer?
        }
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const subtotal = items.reduce((acc, item) => acc + (item.qty * Number(item.price || 0)), 0);
    const tax = 0; // Assuming tax inclusive or not handled
    const total = subtotal + tax;

    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text("SUBTOTAL", 150, finalY);
    doc.setTextColor(0, 0, 0);
    doc.text(`$${subtotal.toFixed(2)}`, 195, finalY, { align: "right" });

    doc.setTextColor(...secondaryColor);
    doc.text("TOTAL DUE", 150, finalY + 10);
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
