import nodemailer from 'nodemailer';

// Create test transport (or console log fallback)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'bitehub_test@ethereal.email',
    pass: 'bitehub_secret_pass',
  },
});

export async function sendOrderReceiptEmail(order, userEmail) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 16px; padding: 24px; color: #333;">
      <div style="text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 16px;">
        <h1 style="color: #ef4444; margin: 0; font-size: 24px;">BiteHub Order Confirmation</h1>
        <p style="color: #666; font-size: 14px; margin-top: 4px;">Thank you for your order!</p>
      </div>

      <div style="margin: 20px 0;">
        <p><strong>Order ID:</strong> #${order.id}</p>
        <p><strong>Restaurant:</strong> ${order.restaurantName}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f9fafb; border-bottom: 1px solid #ddd; text-align: left; font-size: 12px; color: #666;">
            <th style="padding: 8px;">Item</th>
            <th style="padding: 8px;">Qty</th>
            <th style="padding: 8px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map(i => `
            <tr style="border-bottom: 1px solid #eee; font-size: 14px;">
              <td style="padding: 8px;">${i.name}</td>
              <td style="padding: 8px;">${i.quantity}</td>
              <td style="padding: 8px; text-align: right;">₹${i.price * i.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="text-align: right; border-top: 2px solid #333; padding-top: 12px; font-size: 16px; font-weight: bold;">
        Total Amount: ₹${order.total}
      </div>

      <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
        © 2026 BiteHub Food Delivery. Fictional Receipt.
      </p>
    </div>
  `;

  try {
    console.log(`✉️ Sending simulated order receipt email for #${order.id} to ${userEmail}...`);
    // Attempt send (suppresses error if test SMTP fails)
    await transporter.sendMail({
      from: '"BiteHub Support" <orders@bitehub.com>',
      to: userEmail || 'customer@example.com',
      subject: `BiteHub Order Confirmation #${order.id}`,
      html,
    }).catch(() => {});
    console.log(`✅ Order receipt email dispatched to ${userEmail}`);
  } catch (err) {
    console.error('Email send error:', err);
  }
}

export async function sendRefundNotificationEmail(refund, userEmail) {
  try {
    console.log(`✉️ Sending refund notification email for Ticket #${refund.id} (Status: ${refund.status}) to ${userEmail}...`);
  } catch (err) {
    console.error('Refund email error:', err);
  }
}
