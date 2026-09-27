import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, Order, BusinessSettings } from '../types';

export function generateInvoicePDF(
  invoice: Invoice,
  order: Order | undefined,
  settings: BusinessSettings
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header with logo and store info
  if (settings.logo) {
    try {
      doc.addImage(settings.logo, 'PNG', 14, 10, 30, 30);
    } catch (e) {
      console.warn('Failed to add logo to PDF');
    }
  }
  
  // Store name and details
  doc.setFontSize(20);
  doc.setTextColor(...hexToRgb(settings.bannerColor || '#059669'));
  doc.text(settings.storeName, settings.logo ? 50 : 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`${settings.address}, ${settings.city}`, settings.logo ? 50 : 14, 28);
  doc.text(`Phone: ${settings.phone}`, settings.logo ? 50 : 14, 34);
  if (settings.ntn) {
    doc.text(`NTN: ${settings.ntn}`, settings.logo ? 50 : 14, 40);
  }
  
  // Invoice title
  doc.setFontSize(24);
  doc.setTextColor(50, 50, 50);
  doc.text('INVOICE', pageWidth - 14, 20, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 14, 28, { align: 'right' });
  doc.text(`Date: ${invoice.createdAt}`, pageWidth - 14, 34, { align: 'right' });
  doc.text(`Due: ${invoice.dueDate}`, pageWidth - 14, 40, { align: 'right' });
  
  // Status badge
  const statusColors: Record<string, [number, number, number]> = {
    draft: [150, 150, 150],
    sent: [59, 130, 246],
    paid: [34, 197, 94],
    overdue: [239, 68, 68],
    cancelled: [150, 150, 150],
  };
  const statusColor = statusColors[invoice.status] || [150, 150, 150];
  doc.setFillColor(...statusColor);
  doc.roundedRect(pageWidth - 50, 44, 36, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(invoice.status.toUpperCase(), pageWidth - 32, 49.5, { align: 'center' });
  
  // Bill To section
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text('BILL TO:', 14, 65);
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(invoice.customerName, 14, 73);
  
  if (order) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(order.shippingAddress, 14, 80);
  }
  
  // Order items table
  if (order && order.items.length > 0) {
    const tableData = order.items.map(item => [
      item.productName,
      item.quantity.toString(),
      `${settings.currency} ${item.price.toLocaleString()}`,
      `${settings.currency} ${item.total.toLocaleString()}`,
    ]);
    
    autoTable(doc, {
      startY: 95,
      head: [['Item', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: hexToRgb(settings.bannerColor || '#059669'),
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
    });
  }
  
  // Totals
  let yPos = (doc as any).lastAutoTable?.finalY || 150;
  yPos += 10;
  
  if (order) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    doc.text('Subtotal:', pageWidth - 60, yPos);
    doc.setTextColor(50, 50, 50);
    doc.text(`${settings.currency} ${order.subtotal.toLocaleString()}`, pageWidth - 14, yPos, { align: 'right' });
    yPos += 6;
    
    doc.setTextColor(100, 100, 100);
    doc.text('Shipping:', pageWidth - 60, yPos);
    doc.setTextColor(50, 50, 50);
    doc.text(`${settings.currency} ${order.shippingCost.toLocaleString()}`, pageWidth - 14, yPos, { align: 'right' });
    yPos += 6;
    
    if (order.discount > 0) {
      doc.setTextColor(100, 100, 100);
      doc.text('Discount:', pageWidth - 60, yPos);
      doc.setTextColor(239, 68, 68);
      doc.text(`-${settings.currency} ${order.discount.toLocaleString()}`, pageWidth - 14, yPos, { align: 'right' });
      yPos += 6;
    }
    
    // Total line
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - 70, yPos, pageWidth - 14, yPos);
    yPos += 8;
    
    doc.setFontSize(14);
    doc.setTextColor(...hexToRgb(settings.bannerColor || '#059669'));
    doc.text('TOTAL:', pageWidth - 60, yPos);
    doc.text(`${settings.currency} ${order.total.toLocaleString()}`, pageWidth - 14, yPos, { align: 'right' });
  } else {
    // Simple invoice without order details
    doc.setFontSize(14);
    doc.setTextColor(...hexToRgb(settings.bannerColor || '#059669'));
    doc.text('TOTAL DUE:', pageWidth - 60, yPos);
    doc.text(`${settings.currency} ${invoice.amount.toLocaleString()}`, pageWidth - 14, yPos, { align: 'right' });
  }
  
  // Footer
  if (settings.receiptFooter) {
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(settings.receiptFooter, pageWidth / 2, 280, { align: 'center' });
  }
  
  // Save PDF
  doc.save(`${invoice.invoiceNumber}.pdf`);
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [5, 150, 105]; // Default emerald
}
