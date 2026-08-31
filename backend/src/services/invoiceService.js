const PDFDocument = require('pdfkit');

/**
 * Generate a luxury, printable A4 PDF invoice stream for a real MongoDB Order
 * @param {Object} order - Populated MongoDB Order document
 * @param {Object} res - Express Response stream
 */
const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `Invoice ${order.invoiceNumber || order.orderNumber}`,
      Author: 'MONOLITH Luxury Atelier',
      Subject: `Tax Invoice for Order ${order.orderNumber}`,
      Keywords: 'Invoice, Luxury Fashion, Monolith',
      CreationDate: new Date()
    }
  });

  // Pipe directly to HTTP response
  doc.pipe(res);

  const primaryColor = '#000000';
  const secondaryColor = '#555555';
  const lightBg = '#F8F8F8';
  const borderColor = '#E5E5E5';
  const accentGold = '#996515';

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `INR ${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Header Banner
  doc
    .rect(40, 40, 515, 65)
    .fill(primaryColor);

  doc
    .fillColor('#FFFFFF')
    .font('Helvetica-Bold')
    .fontSize(18)
    .text('M O N O L I T H', 55, 55, { characterSpacing: 4 })
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#CCCCCC')
    .text('LUXURY ATELIER • HAUTE COUTURE & TIMEPIECES', 55, 78, { characterSpacing: 1.5 });

  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('#FFFFFF')
    .text('TAX INVOICE', 400, 55, { align: 'right', width: 140 })
    .font('Helvetica')
    .fontSize(8)
    .fillColor('#CCCCCC')
    .text(`ORIGINAL FOR RECIPIENT`, 400, 72, { align: 'right', width: 140 })
    .text(`GSTIN: 27AABCM8923M1Z8`, 400, 84, { align: 'right', width: 140 });

  // Order & Invoice Details Box
  let y = 120;

  doc
    .rect(40, y, 515, 60)
    .strokeColor(borderColor)
    .lineWidth(1)
    .stroke();

  // Invoice & Order metadata grid
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(secondaryColor)
    .text('INVOICE NUMBER:', 55, y + 10)
    .text('INVOICE DATE:', 190, y + 10)
    .text('ORDER NUMBER:', 320, y + 10)
    .text('PAYMENT STATUS:', 440, y + 10);

  const invoiceNum = order.invoiceNumber || `INV-${order.orderNumber?.replace('ORD-', '')}`;
  const isPaid = order.paymentStatus === 'paid';

  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(primaryColor)
    .text(invoiceNum, 55, y + 22)
    .font('Helvetica')
    .text(formatDate(order.createdAt), 190, y + 22)
    .text(order.orderNumber || 'N/A', 320, y + 22)
    .font('Helvetica-Bold')
    .fillColor(isPaid ? '#0D7B3C' : '#996515')
    .text(isPaid ? 'PAID' : (order.paymentStatus || 'PENDING').toUpperCase(), 440, y + 22);

  // Second row of metadata
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(secondaryColor)
    .text('PAYMENT METHOD:', 55, y + 38)
    .text('RAZORPAY REF ID:', 190, y + 38)
    .text('SHIPPING METHOD:', 320, y + 38)
    .text('FULFILLMENT:', 440, y + 38);

  let displayPaymentMethod = 'Cash on Delivery';
  if (order.paymentMethod === 'upi') displayPaymentMethod = 'UPI Payment';
  else if (order.paymentMethod === 'credit_debit_card') displayPaymentMethod = 'Credit / Debit Card';
  else if (order.paymentMethod === 'net_banking') displayPaymentMethod = 'Net Banking';
  else if (order.paymentMethod !== 'cash_on_delivery') displayPaymentMethod = 'Online Payment (Razorpay)';

  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(primaryColor)
    .text(displayPaymentMethod, 55, y + 48)
    .text(order.razorpayPaymentId || order.razorpayOrderId || 'N/A', 190, y + 48)
    .text((order.shippingMethod || 'standard').toUpperCase(), 320, y + 48)
    .text((order.orderStatus || 'confirmed').toUpperCase(), 440, y + 48);

  // Addresses Section
  y = 195;

  // Billed To
  doc
    .rect(40, y, 250, 95)
    .strokeColor(borderColor)
    .stroke();

  doc
    .rect(40, y, 250, 20)
    .fill(lightBg);

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(primaryColor)
    .text('BILLED TO (CUSTOMER DETAILS)', 50, y + 6);

  const billing = order.billingAddress || order.shippingAddress || {};
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(primaryColor)
    .text(billing.fullName || order.user?.firstName || 'Customer', 50, y + 26)
    .font('Helvetica')
    .fontSize(8)
    .fillColor(secondaryColor)
    .text(billing.addressLine1 || '', 50, y + 38, { width: 230 })
    .text(`${billing.addressLine2 ? billing.addressLine2 + ', ' : ''}${billing.city || ''}, ${billing.state || ''} - ${billing.postalCode || ''}`, 50, y + 50, { width: 230 })
    .text(`Phone: ${billing.phone || order.user?.phone || 'N/A'}`, 50, y + 64)
    .text(`Email: ${order.user?.email || 'N/A'}`, 50, y + 76);

  // Shipped To
  doc
    .rect(305, y, 250, 95)
    .strokeColor(borderColor)
    .stroke();

  doc
    .rect(305, y, 250, 20)
    .fill(lightBg);

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(primaryColor)
    .text('SHIPPED TO (DELIVERY ADDRESS)', 315, y + 6);

  const shipping = order.shippingAddress || {};
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(primaryColor)
    .text(shipping.fullName || 'Recipient', 315, y + 26)
    .font('Helvetica')
    .fontSize(8)
    .fillColor(secondaryColor)
    .text(shipping.addressLine1 || '', 315, y + 38, { width: 230 })
    .text(`${shipping.addressLine2 ? shipping.addressLine2 + ', ' : ''}${shipping.city || ''}, ${shipping.state || ''} - ${shipping.postalCode || ''}`, 315, y + 50, { width: 230 })
    .text(`Country: ${shipping.country || 'India'}`, 315, y + 64)
    .text(`Tracking: ${order.trackingNumber || `MNL-TRK-${order.orderNumber?.replace('ORD-', '')}`}`, 315, y + 76);

  // Items Table Header
  y = 305;

  doc
    .rect(40, y, 515, 22)
    .fill(primaryColor);

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor('#FFFFFF')
    .text('#', 48, y + 7)
    .text('ITEM & SPECIFICATION', 70, y + 7)
    .text('SKU', 280, y + 7)
    .text('QTY', 355, y + 7)
    .text('UNIT PRICE', 400, y + 7, { align: 'right', width: 65 })
    .text('TOTAL', 480, y + 7, { align: 'right', width: 65 });

  // Items Rows
  y += 22;
  const items = order.items || [];

  items.forEach((item, index) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    const rowHeight = 32;

    if (index % 2 === 1) {
      doc
        .rect(40, y, 515, rowHeight)
        .fill(lightBg);
    }

    doc
      .rect(40, y, 515, rowHeight)
      .strokeColor(borderColor)
      .lineWidth(0.5)
      .stroke();

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(secondaryColor)
      .text(String(index + 1), 48, y + 7);

    // Item Title & Variants
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(primaryColor)
      .text(item.name || 'Luxury Fashion Item', 70, y + 6, { width: 200, ellipsis: true });

    const variantSpecs = [
      item.size ? `Size: ${item.size}` : null,
      item.color ? `Color: ${item.color}` : null
    ].filter(Boolean).join(' • ');

    if (variantSpecs) {
      doc
        .font('Helvetica')
        .fontSize(7.5)
        .fillColor(secondaryColor)
        .text(variantSpecs, 70, y + 18);
    }

    // SKU
    doc
      .font('Helvetica')
      .fontSize(7.5)
      .fillColor(secondaryColor)
      .text(item.sku || 'MNL-ATELIER', 280, y + 10);

    // Quantity
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(primaryColor)
      .text(String(item.quantity || 1), 355, y + 10);

    // Unit Price
    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor(primaryColor)
      .text(formatCurrency(item.price), 400, y + 10, { align: 'right', width: 65 });

    // Item Total
    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(primaryColor)
      .text(formatCurrency(itemTotal), 480, y + 10, { align: 'right', width: 65 });

    y += rowHeight;
  });

  // Totals Summary Box
  y += 15;
  const totalsBoxWidth = 230;
  const totalsBoxX = 555 - totalsBoxWidth;

  doc
    .rect(totalsBoxX, y, totalsBoxWidth, 110)
    .strokeColor(borderColor)
    .lineWidth(1)
    .stroke();

  let lineY = y + 10;

  // Subtotal
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(secondaryColor)
    .text('Subtotal:', totalsBoxX + 15, lineY)
    .fillColor(primaryColor)
    .text(formatCurrency(order.subtotal), totalsBoxX + 100, lineY, { align: 'right', width: 115 });

  // Coupon Discount
  if (order.discount && order.discount > 0) {
    lineY += 16;
    const couponLabel = order.coupon?.code ? `Coupon (${order.coupon.code}):` : 'Promotional Discount:';
    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor('#0D7B3C')
      .text(couponLabel, totalsBoxX + 15, lineY)
      .text(`- ${formatCurrency(order.discount)}`, totalsBoxX + 100, lineY, { align: 'right', width: 115 });
  }

  // Shipping Fee
  lineY += 16;
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(secondaryColor)
    .text('Insured Shipping:', totalsBoxX + 15, lineY)
    .fillColor(primaryColor)
    .text(order.shippingFee === 0 ? 'COMPLIMENTARY' : formatCurrency(order.shippingFee), totalsBoxX + 100, lineY, { align: 'right', width: 115 });

  // Tax (if applicable)
  if (order.tax && order.tax > 0) {
    lineY += 16;
    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor(secondaryColor)
      .text('GST / Tax (Included):', totalsBoxX + 15, lineY)
      .fillColor(primaryColor)
      .text(formatCurrency(order.tax), totalsBoxX + 100, lineY, { align: 'right', width: 115 });
  }

  // Total Divider
  lineY += 18;
  doc
    .moveTo(totalsBoxX + 10, lineY)
    .lineTo(totalsBoxX + totalsBoxWidth - 10, lineY)
    .strokeColor(primaryColor)
    .lineWidth(1)
    .stroke();

  // Grand Total
  lineY += 8;
  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .fillColor(primaryColor)
    .text('GRAND TOTAL:', totalsBoxX + 15, lineY)
    .text(formatCurrency(order.total), totalsBoxX + 100, lineY, { align: 'right', width: 115 });

  // Left Note / Declarations Box
  doc
    .rect(40, y, 270, 110)
    .strokeColor(borderColor)
    .stroke();

  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(primaryColor)
    .text('TERMS & ATELIER CONDITIONS', 50, y + 10)
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor(secondaryColor)
    .text('1. All items are verified 100% authentic by Monolith Luxury Atelier.', 50, y + 24, { width: 250 })
    .text('2. 14-day complimentary returns for unworn items with security tags.', 50, y + 36, { width: 250 })
    .text('3. This is a computer-generated tax invoice and requires no physical signature.', 50, y + 48, { width: 250 })
    .text('4. Handcrafted in India. Registered Office: Worli Sea Face, Mumbai.', 50, y + 60, { width: 250 })
    .font('Helvetica-Bold')
    .fillColor(accentGold)
    .text('Thank you for patronizing Monolith Luxury Atelier.', 50, y + 84);

  // Footer
  const footerY = 770;

  doc
    .moveTo(40, footerY)
    .lineTo(555, footerY)
    .strokeColor(borderColor)
    .lineWidth(0.5)
    .stroke();

  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor(secondaryColor)
    .text(
      'Monolith Haute Horlogerie & Fashion Pvt Ltd • Worli Sea Face, Mumbai, MH 400030 • concierge@monolithluxury.com • +91 22 8923 0000',
      40,
      footerY + 10,
      { align: 'center', width: 515 }
    );

  // Finalize PDF file
  doc.end();
};

module.exports = {
  generateInvoicePDF
};
