const SHIPPING_MAP = { home: '宅配到府', cvs: '超商取貨', store: '門市自取' };
const PAYMENT_MAP = { transfer: '銀行轉帳', linepay: 'LINE Pay', onsite: '現場付款', cash: '貨到付款' };

function buildCustomerHtml(order) {
  const shipping = SHIPPING_MAP[order.shippingMethod] || order.shippingMethod || '—';
  const payment = PAYMENT_MAP[order.paymentMethod] || order.paymentMethod || '—';
  const itemRows = (order.items || []).map(i =>
    `<tr>
      <td style="padding:8px 12px;color:#ffffff;border-bottom:1px solid #1e293b;">${i.name}</td>
      <td style="padding:8px 12px;color:#9ca3af;text-align:center;border-bottom:1px solid #1e293b;">×${i.qty}</td>
      <td style="padding:8px 12px;color:#e2c78e;text-align:right;border-bottom:1px solid #1e293b;">NT$${i.price * i.qty}</td>
    </tr>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f18;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#050505;border:1px solid #00f3ff33;border-radius:8px;overflow:hidden;max-width:600px;">
        <!-- Header -->
        <tr><td style="background:#0a0f18;padding:28px 32px;text-align:center;border-bottom:1px solid #00f3ff33;">
          <h1 style="margin:0;color:#00f3ff;font-size:22px;letter-spacing:4px;font-weight:bold;">APPLE911</h1>
          <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;letter-spacing:2px;">配件怪獸 × 專業維修</p>
        </td></tr>
        <!-- Title -->
        <tr><td style="padding:28px 32px 0;text-align:center;">
          <h2 style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">訂單成立通知</h2>
          <p style="margin:10px 0 0;color:#9ca3af;font-size:14px;line-height:1.6;">感謝您的訂購，您的訂單已成功建立，<br>我們將盡快為您處理。</p>
        </td></tr>
        <!-- Order ID -->
        <tr><td style="padding:20px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;border-radius:6px;">
            <tr><td style="padding:14px 16px;">
              <span style="color:#9ca3af;font-size:12px;letter-spacing:1px;">訂單編號</span>
              <span style="display:block;color:#e2c78e;font-size:16px;font-weight:bold;margin-top:4px;letter-spacing:2px;">${order.id}</span>
            </td></tr>
          </table>
        </td></tr>
        <!-- Items -->
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 10px;color:#00f3ff;font-size:12px;font-weight:bold;letter-spacing:2px;">商品明細</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;border-radius:6px;">
            <thead>
              <tr>
                <th style="padding:10px 12px;color:#9ca3af;font-size:11px;text-align:left;border-bottom:1px solid #1e293b;">商品</th>
                <th style="padding:10px 12px;color:#9ca3af;font-size:11px;text-align:center;border-bottom:1px solid #1e293b;">數量</th>
                <th style="padding:10px 12px;color:#9ca3af;font-size:11px;text-align:right;border-bottom:1px solid #1e293b;">小計</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
        </td></tr>
        <!-- Amount -->
        <tr><td style="padding:16px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;border-radius:6px;padding:4px 0;">
            ${order.discount > 0 ? `<tr>
              <td style="padding:8px 16px;color:#9ca3af;font-size:13px;">折扣</td>
              <td style="padding:8px 16px;color:#ff003c;font-size:13px;text-align:right;">-NT$${order.discount}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:8px 16px;color:#9ca3af;font-size:13px;">運費</td>
              <td style="padding:8px 16px;color:#9ca3af;font-size:13px;text-align:right;">${order.shippingFee > 0 ? `NT$${order.shippingFee}` : '免費'}</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;">
              <td style="padding:12px 16px;color:#e2c78e;font-size:16px;font-weight:bold;">總金額</td>
              <td style="padding:12px 16px;color:#e2c78e;font-size:16px;font-weight:bold;text-align:right;">NT$${order.orderTotal}</td>
            </tr>
          </table>
        </td></tr>
        <!-- Shipping & Payment -->
        <tr><td style="padding:16px 32px 0;">
          <p style="margin:0 0 10px;color:#00f3ff;font-size:12px;font-weight:bold;letter-spacing:2px;">配送與付款</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;border-radius:6px;">
            <tr>
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;width:30%;">配送方式</td>
              <td style="padding:10px 16px;color:#ffffff;font-size:13px;text-align:right;">${shipping}</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;">
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;">付款方式</td>
              <td style="padding:10px 16px;color:#ffffff;font-size:13px;text-align:right;">${payment}</td>
            </tr>
          </table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:32px;text-align:center;border-top:1px solid #1e293b;margin-top:24px;">
          <p style="margin:0;color:#9ca3af;font-size:12px;line-height:2;">
            Apple911｜配件怪獸 X 專業維修<br>
            官方 LINE：@apple911
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildAdminHtml(order, customerEmail) {
  const shipping = SHIPPING_MAP[order.shippingMethod] || order.shippingMethod || '—';
  const payment = PAYMENT_MAP[order.paymentMethod] || order.paymentMethod || '—';
  const timeStr = new Date(order.time).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
  const itemLines = (order.items || []).map(i =>
    `<tr>
      <td style="padding:8px 12px;color:#ffffff;border-bottom:1px solid #1e293b;">${i.name}</td>
      <td style="padding:8px 12px;color:#9ca3af;text-align:center;border-bottom:1px solid #1e293b;">×${i.qty}</td>
      <td style="padding:8px 12px;color:#e2c78e;text-align:right;border-bottom:1px solid #1e293b;">NT$${i.price * i.qty}</td>
    </tr>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f18;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#050505;border:1px solid #ff003c33;border-radius:8px;overflow:hidden;max-width:600px;">
        <!-- Header -->
        <tr><td style="background:#0a0f18;padding:28px 32px;text-align:center;border-bottom:1px solid #ff003c33;">
          <h1 style="margin:0;color:#ff003c;font-size:20px;letter-spacing:3px;font-weight:bold;">🛒 新訂單通知</h1>
          <p style="margin:8px 0 0;color:#9ca3af;font-size:12px;">Apple911 後台系統</p>
        </td></tr>
        <!-- Order Info -->
        <tr><td style="padding:24px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;border-radius:6px;">
            <tr>
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;width:30%;">訂單編號</td>
              <td style="padding:10px 16px;color:#e2c78e;font-size:13px;font-weight:bold;text-align:right;">${order.id}</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;">
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;">下單時間</td>
              <td style="padding:10px 16px;color:#ffffff;font-size:13px;text-align:right;">${timeStr}</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;">
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;">客人 Email</td>
              <td style="padding:10px 16px;color:#ffffff;font-size:13px;text-align:right;">${customerEmail || '（未登入會員）'}</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;">
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;">收件人</td>
              <td style="padding:10px 16px;color:#ffffff;font-size:13px;text-align:right;">${order.shippingInfo?.name || '—'} / ${order.shippingInfo?.phone || '—'}</td>
            </tr>
          </table>
        </td></tr>
        <!-- Items -->
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 10px;color:#00f3ff;font-size:12px;font-weight:bold;letter-spacing:2px;">商品明細</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;border-radius:6px;">
            <thead>
              <tr>
                <th style="padding:10px 12px;color:#9ca3af;font-size:11px;text-align:left;border-bottom:1px solid #1e293b;">商品</th>
                <th style="padding:10px 12px;color:#9ca3af;font-size:11px;text-align:center;border-bottom:1px solid #1e293b;">數量</th>
                <th style="padding:10px 12px;color:#9ca3af;font-size:11px;text-align:right;border-bottom:1px solid #1e293b;">小計</th>
              </tr>
            </thead>
            <tbody>${itemLines}</tbody>
          </table>
        </td></tr>
        <!-- Amount & Method -->
        <tr><td style="padding:16px 32px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f18;border-radius:6px;">
            <tr>
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;width:30%;">總金額</td>
              <td style="padding:10px 16px;color:#e2c78e;font-size:15px;font-weight:bold;text-align:right;">NT$${order.orderTotal}</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;">
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;">配送方式</td>
              <td style="padding:10px 16px;color:#ffffff;font-size:13px;text-align:right;">${shipping}</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;">
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;">付款方式</td>
              <td style="padding:10px 16px;color:#ffffff;font-size:13px;text-align:right;">${payment}</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;">
              <td style="padding:10px 16px;color:#9ca3af;font-size:13px;">訂單狀態</td>
              <td style="padding:10px 16px;color:#ff003c;font-size:13px;font-weight:bold;text-align:right;">${order.status || '—'}</td>
            </tr>
          </table>
        </td></tr>
        ${order.note ? `<tr><td style="padding:16px 32px 0;">
          <p style="margin:0 0 8px;color:#00f3ff;font-size:12px;font-weight:bold;letter-spacing:2px;">備註</p>
          <div style="background:#0a0f18;border-radius:6px;padding:14px 16px;color:#ffffff;font-size:13px;">${order.note}</div>
        </td></tr>` : ''}
        <!-- Footer -->
        <tr><td style="padding:28px 32px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#9ca3af;font-size:11px;line-height:2;">
            Apple911｜配件怪獸 X 專業維修<br>
            官方 LINE：@apple911
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { order, customerEmail } = req.body || {};
  if (!order) return res.status(400).json({ error: 'Missing order' });

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn('[send-order-email] RESEND_API_KEY or RESEND_FROM_EMAIL not set');
    return res.status(200).json({ ok: false, reason: 'not_configured' });
  }

  const fromCustomer = `Apple 911 配件怪獸 <${fromEmail}>`;
  const fromAdmin    = `Apple 911 後台中心 <${fromEmail}>`;

  const sendEmail = (to, subject, html, from) =>
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

  const results = [];

  if (customerEmail) {
    try {
      const r = await sendEmail(customerEmail, `Apple911 訂單成立通知 ${order.id}`, buildCustomerHtml(order), fromCustomer);
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        console.warn('[send-order-email] customer email failed:', err);
        results.push({ to: 'customer', ok: false });
      } else {
        results.push({ to: 'customer', ok: true });
      }
    } catch (e) {
      console.warn('[send-order-email] customer email error:', e.message);
      results.push({ to: 'customer', ok: false });
    }
  }

  if (adminEmail) {
    try {
      const r = await sendEmail(adminEmail, `🛒 新訂單 ${order.id}｜NT$${order.orderTotal}`, buildAdminHtml(order, customerEmail), fromAdmin);
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        console.warn('[send-order-email] admin email failed:', err);
        results.push({ to: 'admin', ok: false });
      } else {
        results.push({ to: 'admin', ok: true });
      }
    } catch (e) {
      console.warn('[send-order-email] admin email error:', e.message);
      results.push({ to: 'admin', ok: false });
    }
  }

  return res.status(200).json({ ok: true, results });
};
