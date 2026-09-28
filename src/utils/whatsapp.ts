import { Order, Customer, BusinessSettings } from '../types';

export function sendWhatsAppMessage(phone: string, message: string) {
  // Format phone number - remove spaces, dashes, and ensure it starts with country code
  let formattedPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // If phone doesn't start with +, assume Pakistan (+92)
  if (!formattedPhone.startsWith('+')) {
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '92' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('92')) {
      formattedPhone = '92' + formattedPhone;
    }
  } else {
    formattedPhone = formattedPhone.substring(1); // Remove the +
  }
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  // Open in new tab
  window.open(whatsappUrl, '_blank');
}

export function generateOrderConfirmationMessage(order: Order, settings: BusinessSettings): string {
  const itemsList = order.items.map(item => 
    `• ${item.productName} x${item.quantity} = ${settings.currency} ${item.total.toLocaleString()}`
  ).join('\n');

  return `Assalam o Alaikum ${order.customerName}! 🌟

Thank you for your order with ${settings.storeName}!

📋 *Order Details:*
Order #: ${order.orderNumber}
Date: ${order.createdAt}

🛍️ *Items:*
${itemsList}

💰 *Order Summary:*
Subtotal: ${settings.currency} ${order.subtotal.toLocaleString()}
Shipping: ${settings.currency} ${order.shippingCost.toLocaleString()}
${order.discount > 0 ? `Discount: -${settings.currency} ${order.discount.toLocaleString()}\n` : ''}*Total: ${settings.currency} ${order.total.toLocaleString()}*

📦 *Shipping Address:*
${order.shippingAddress}

💳 *Payment Method:* ${order.paymentMethod}
📊 *Status:* ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

We'll notify you once your order is shipped! 🚚

Thank you for shopping with us! 🙏

---
${settings.storeName}
${settings.phone}
${settings.address}, ${settings.city}`;
}

export function generateOrderStatusMessage(order: Order, settings: BusinessSettings): string {
  const statusMessages: Record<string, string> = {
    pending: `Your order ${order.orderNumber} is being processed. We'll update you soon! ⏳`,
    confirmed: `Great news! Your order ${order.orderNumber} has been confirmed! ✅`,
    processing: `Your order ${order.orderNumber} is being prepared for shipment! 📦`,
    shipped: `Your order ${order.orderNumber} has been shipped! 🚚${order.trackingNumber ? `\nTracking #: ${order.trackingNumber}` : ''}`,
    delivered: `Your order ${order.orderNumber} has been delivered! 🎉 We hope you enjoy your purchase!`,
    cancelled: `We're sorry, your order ${order.orderNumber} has been cancelled. Please contact us for assistance.`,
    returned: `Your return for order ${order.orderNumber} has been processed.`,
  };

  return `Assalam o Alaikum ${order.customerName}! 👋

${statusMessages[order.status] || `Order ${order.orderNumber} status: ${order.status}`}

Order #: ${order.orderNumber}
Current Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}

If you have any questions, feel free to contact us!

---
${settings.storeName}
${settings.phone}`;
}

export function generatePaymentReminderMessage(order: Order, settings: BusinessSettings): string {
  return `Assalam o Alaikum ${order.customerName}! 👋

This is a friendly reminder about your pending payment for order ${order.orderNumber}.

💰 *Amount Due: ${settings.currency} ${order.total.toLocaleString()}*
📅 Order Date: ${order.createdAt}
💳 Payment Method: ${order.paymentMethod}

Please complete your payment at your earliest convenience.

If you've already made the payment, please ignore this message or share the receipt with us.

Thank you! 🙏

---
${settings.storeName}
${settings.phone}`;
}

export function generateDeliveryConfirmationMessage(order: Order, settings: BusinessSettings): string {
  return `Assalam o Alaikum ${order.customerName}! 🎉

Your order ${order.orderNumber} has been successfully delivered!

📦 *Order #:* ${order.orderNumber}
💰 *Total:* ${settings.currency} ${order.total.toLocaleString()}

We hope you're happy with your purchase! If you have any issues or questions, please don't hesitate to contact us.

Your feedback means a lot to us! ⭐

Thank you for choosing ${settings.storeName}! 🙏

---
${settings.phone}
${settings.address}, ${settings.city}`;
}

export function generateCustomerGreetingMessage(customer: Customer, settings: BusinessSettings): string {
  return `Assalam o Alaikum ${customer.name}! 👋

Welcome to ${settings.storeName}! 🌟

We're excited to have you as our customer. Browse our latest products and enjoy great deals!

If you need any assistance, feel free to reach out to us.

Happy Shopping! 🛍️

---
${settings.storeName}
${settings.phone}
${settings.address}, ${settings.city}`;
}

export function generatePromotionalMessage(customer: Customer, settings: BusinessSettings, offer: string): string {
  return `Assalam o Alaikum ${customer.name}! 🎁

*Special Offer Just For You!* 🌟

${offer}

Visit us today and avail this exclusive deal! Don't miss out! 🛍️

Shop now and save big! 💰

---
${settings.storeName}
${settings.phone}
${settings.address}, ${settings.city}`;
}
