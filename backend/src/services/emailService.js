const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'MONOLITH Luxury Atelier <onboarding@resend.dev>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3008';

let resendClient = null;
const getResendClient = () => {
  if (!resendClient && RESEND_API_KEY) {
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
};

/**
 * Generate Luxury MONOLITH Email Template Wrapper
 */
const getLuxuryEmailHtml = ({ title, preheader, contentHtml, callToAction }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0c0d0e;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #e5e5e5;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0c0d0e;
      padding: 40px 0;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #141517;
      border: 1px solid #26282b;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      padding: 36px 40px 24px;
      text-align: center;
      border-bottom: 1px solid #222428;
    }
    .brand-logo {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 6px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
      font-family: 'Times New Roman', Times, serif;
    }
    .brand-subtitle {
      font-size: 10px;
      letter-spacing: 3px;
      color: #8c9099;
      text-transform: uppercase;
      margin-top: 6px;
      margin-bottom: 0;
    }
    .body-content {
      padding: 36px 40px;
      line-height: 1.7;
      color: #d1d5db;
      font-size: 14px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #ffffff;
      color: #0c0d0e !important;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 16px 36px;
      border-radius: 4px;
    }
    .footer {
      padding: 24px 40px;
      background-color: #0f1012;
      border-top: 1px solid #222428;
      text-align: center;
      font-size: 11px;
      color: #6b7280;
      line-height: 1.6;
    }
    .footer a {
      color: #9ca3af;
      text-decoration: underline;
    }
    .notice {
      font-size: 12px;
      color: #9ca3af;
      background-color: #1a1c20;
      border-left: 3px solid #3b82f6;
      padding: 12px 16px;
      margin: 20px 0;
      border-radius: 0 4px 4px 0;
    }
    .link-fallback {
      font-size: 11px;
      color: #6b7280;
      word-break: break-all;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #222428;
    }
    .link-fallback a {
      color: #60a5fa;
    }
  </style>
</head>
<body>
  <div style="display: none; font-size: 1px; color: #0c0d0e; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader || title}
  </div>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-logo">MONOLITH</h1>
        <p class="brand-subtitle">Haute Couture & Luxury Goods</p>
      </div>
      <div class="body-content">
        ${contentHtml}
        ${
          callToAction
            ? `
        <div class="cta-container">
          <a href="${callToAction.url}" class="cta-button" target="_blank">${callToAction.label}</a>
        </div>
        <div class="link-fallback">
          If the button above does not work, copy and paste this secure URL into your browser:<br>
          <a href="${callToAction.url}">${callToAction.url}</a>
        </div>
        `
            : ''
        }
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} MONOLITH Luxury Atelier. All rights reserved.</p>
        <p>Private Client Concierge & Customer Care | Mumbai • London • Paris • Milan</p>
        <p>This is a secure automated message from MONOLITH. Please do not reply directly to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};

const emailService = {
  /**
   * Send Password Reset Link Email via Resend
   * @param {Object} user User object containing firstName, lastName, email
   * @param {string} rawToken Cryptographically generated random reset token
   */
  sendPasswordResetEmail: async (user, rawToken) => {
    const resend = getResendClient();
    if (!resend) {
      console.warn('[EmailService] RESEND_API_KEY is not configured. Email skipped.');
      return { success: false, reason: 'unconfigured' };
    }

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(rawToken)}`;
    const recipientName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Valued Client';

    const contentHtml = `
      <p class="greeting">Dear ${recipientName},</p>
      <p>
        We received a request to reset the password associated with your MONOLITH private client account (<strong>${user.email}</strong>).
      </p>
      <p>
        To create a new password and restore access to your private suite, please click the secure link below:
      </p>
      <div class="notice">
        <strong>Security Notice:</strong> This password reset authorization will expire in <strong>60 minutes</strong> and can only be used once.
      </div>
      <p style="font-size: 13px; color: #9ca3af;">
        If you did not initiate this password reset request, no action is required. Your current credentials and personal data remain fully secure.
      </p>
    `;

    const html = getLuxuryEmailHtml({
      title: 'Reset Your MONOLITH Account Password',
      preheader: 'Secure password reset authorization for your MONOLITH luxury account.',
      contentHtml,
      callToAction: {
        label: 'Reset Password',
        url: resetUrl,
      },
    });

    try {
      console.log(`[EmailService] Dispatching password reset email to ${user.email}...`);
      const response = await resend.emails.send({
        from: EMAIL_FROM,
        to: [user.email],
        subject: 'MONOLITH — Password Reset Request',
        html,
      });

      if (response.error) {
        console.error('[EmailService Error]:', {
          statusCode: response.error.statusCode,
          name: response.error.name,
          message: response.error.message,
        });
        return { success: false, error: response.error };
      }

      console.log(`[EmailService] Email successfully queued/sent. Resend ID: ${response.data?.id}`);
      return { success: true, messageId: response.data?.id };
    } catch (err) {
      console.error('[EmailService Exception]:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Reusable Order Confirmation Email template
   */
  sendOrderConfirmationEmail: async (order, user) => {
    const resend = getResendClient();
    if (!resend) return { success: false, reason: 'unconfigured' };

    const recipientName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Valued Client';
    const orderUrl = `${FRONTEND_URL}/order-details/${order._id || order.orderNumber}`;

    const contentHtml = `
      <p class="greeting">Dear ${recipientName},</p>
      <p>
        Thank you for acquiring with MONOLITH. Your bespoke order <strong>${order.orderNumber}</strong> has been confirmed and is now being processed by our atelier specialists.
      </p>
      <p>
        Total Amount: <strong>₹${(order.total || 0).toLocaleString('en-IN')}</strong><br>
        Estimated Delivery: <strong>${order.estimatedDelivery || '3-5 Business Days'}</strong>
      </p>
    `;

    const html = getLuxuryEmailHtml({
      title: `Order Confirmation — ${order.orderNumber}`,
      preheader: `Thank you for your order ${order.orderNumber} with MONOLITH.`,
      contentHtml,
      callToAction: {
        label: 'View Order Details',
        url: orderUrl,
      },
    });

    try {
      const response = await resend.emails.send({
        from: EMAIL_FROM,
        to: [user.email],
        subject: `MONOLITH Order Confirmation — ${order.orderNumber}`,
        html,
      });
      return { success: !response.error, messageId: response.data?.id };
    } catch (err) {
      console.error('[EmailService Order Error]:', err.message);
      return { success: false, error: err.message };
    }
  },

  /**
   * Reusable Shipping Update Email template
   */
  sendShippingUpdateEmail: async (order, user) => {
    const resend = getResendClient();
    if (!resend) return { success: false, reason: 'unconfigured' };

    const recipientName = user.firstName || 'Valued Client';
    const trackUrl = `${FRONTEND_URL}/track-order`;

    const contentHtml = `
      <p class="greeting">Dear ${recipientName},</p>
      <p>
        Your MONOLITH order <strong>${order.orderNumber}</strong> has been dispatched via <strong>${order.carrier || 'Bespoke White-Glove Courier'}</strong>.
      </p>
      <p>
        Air Waybill (AWB): <strong>${order.awbNumber || order.trackingNumber || 'Assigned'}</strong>
      </p>
    `;

    const html = getLuxuryEmailHtml({
      title: `Shipment Dispatched — ${order.orderNumber}`,
      preheader: `Your order ${order.orderNumber} is on its way.`,
      contentHtml,
      callToAction: {
        label: 'Track Consignment',
        url: trackUrl,
      },
    });

    try {
      const response = await resend.emails.send({
        from: EMAIL_FROM,
        to: [user.email],
        subject: `MONOLITH Shipment Dispatched — ${order.orderNumber}`,
        html,
      });
      return { success: !response.error, messageId: response.data?.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

module.exports = emailService;
