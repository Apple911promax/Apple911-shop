const SHIPPING_MAP = { home: '宅配到府', cvs: '超商取貨', store: '門市自取' };
const PAYMENT_MAP = { transfer: '銀行轉帳', linepay: 'LINE Pay', onsite: '現場付款', cash: '貨到付款' };

function buildCustomerHtml(order) {
  const shipping = SHIPPING_MAP[order.shippingMethod] || order.shippingMethod || '—';
  const payment  = PAYMENT_MAP[order.paymentMethod]  || order.paymentMethod  || '—';

  const itemRows = (order.items || []).map(i => {
    const _v = [i.selectedColor, i.selectedSpec].filter(Boolean).join(' / ');
    return `
    <tr>
      <td style="padding:10px 14px;color:#e8eaf0;font-size:13px;border-bottom:1px solid #0d2233;line-height:1.5;">${i.name}${_v ? `<div style="color:#7ecfff;font-size:11px;margin-top:2px;">${_v}</div>` : ''}</td>
      <td style="padding:10px 14px;color:#7ecfff;font-size:13px;text-align:center;border-bottom:1px solid #0d2233;white-space:nowrap;">×${i.qty}</td>
      <td style="padding:10px 14px;color:#e2c78e;font-size:13px;text-align:right;border-bottom:1px solid #0d2233;white-space:nowrap;font-weight:bold;">NT$${(i.price * i.qty).toLocaleString()}</td>
    </tr>`;}).join('');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="dark">
</head>
<body style="margin:0;padding:0;background-color:#060b14;font-family:Arial,'Microsoft JhengHei',sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#060b14;padding:36px 0 48px;">
    <tr><td align="center" style="padding:0 12px;">

      <!-- Main card -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#080e1a;border:1px solid #00aaff44;border-radius:10px;">

        <!-- ══ HEADER ══ -->
        <tr>
          <td style="background-color:#050a12;padding:0;border-radius:10px 10px 0 0;border-bottom:2px solid #00aaff66;text-align:center;">
            <!-- Top neon accent bar -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="height:3px;background-color:#00aaff;border-radius:10px 10px 0 0;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:30px 32px 24px;text-align:center;">
                  <div style="display:inline-block;border:1px solid #00aaff55;border-radius:6px;padding:6px 20px;margin-bottom:14px;">
                    <span style="color:#7ecfff;font-size:10px;letter-spacing:4px;font-weight:bold;">ORDER CONFIRMED</span>
                  </div>
                  <div style="color:#00c8ff;font-size:26px;letter-spacing:6px;font-weight:bold;text-shadow:0 0 16px #00aaff88;margin-bottom:6px;">APPLE911</div>
                  <div style="color:#5a7a99;font-size:11px;letter-spacing:3px;">配件怪獸 × 專業維修</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ TITLE ══ -->
        <tr>
          <td style="padding:28px 32px 0;text-align:center;">
            <div style="color:#ffffff;font-size:18px;font-weight:bold;margin-bottom:10px;">✅ 訂單成立通知</div>
            <div style="color:#7a90a8;font-size:13px;line-height:1.8;">感謝您的訂購，您的訂單已成功建立。<br>我們將盡快為您處理出貨作業。</div>
          </td>
        </tr>

        <!-- ══ ORDER ID ══ -->
        <tr>
          <td style="padding:22px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#040c18;border:1px solid #00aaff33;border-radius:8px;">
              <tr>
                <td style="padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <div style="color:#4a6a88;font-size:10px;letter-spacing:3px;font-weight:bold;margin-bottom:6px;">ORDER NUMBER</div>
                        <div style="color:#e2c78e;font-size:18px;font-weight:bold;letter-spacing:3px;">${order.id}</div>
                      </td>
                      <td style="text-align:right;vertical-align:middle;">
                        <div style="background-color:#0a1e30;border:1px solid #00aaff44;border-radius:20px;padding:5px 14px;display:inline-block;">
                          <span style="color:#7ecfff;font-size:11px;letter-spacing:1px;">${order.status || '處理中'}</span>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ ITEMS TABLE ══ -->
        <tr>
          <td style="padding:22px 32px 0;">
            <div style="color:#00aaff;font-size:10px;font-weight:bold;letter-spacing:4px;margin-bottom:10px;">▌ 商品明細</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#040c18;border:1px solid #00aaff22;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background-color:#071524;">
                  <th style="padding:10px 14px;color:#4a6a88;font-size:11px;text-align:left;border-bottom:1px solid #0d2233;font-weight:bold;letter-spacing:2px;">商品名稱</th>
                  <th style="padding:10px 14px;color:#4a6a88;font-size:11px;text-align:center;border-bottom:1px solid #0d2233;font-weight:bold;letter-spacing:2px;">數量</th>
                  <th style="padding:10px 14px;color:#4a6a88;font-size:11px;text-align:right;border-bottom:1px solid #0d2233;font-weight:bold;letter-spacing:2px;">小計</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
          </td>
        </tr>

        <!-- ══ AMOUNT SUMMARY ══ -->
        <tr>
          <td style="padding:14px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#040c18;border:1px solid #00aaff22;border-radius:8px;">
              ${order.discount > 0 ? `
              <tr>
                <td style="padding:10px 20px;color:#7a90a8;font-size:13px;border-bottom:1px solid #0d2233;">折扣優惠</td>
                <td style="padding:10px 20px;color:#ff4466;font-size:13px;text-align:right;border-bottom:1px solid #0d2233;font-weight:bold;">－NT$${order.discount.toLocaleString()}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:10px 20px;color:#7a90a8;font-size:13px;border-bottom:1px solid #0d2233;">運費</td>
                <td style="padding:10px 20px;color:#b0c4d8;font-size:13px;text-align:right;border-bottom:1px solid #0d2233;">${order.shippingFee > 0 ? `NT$${Number(order.shippingFee).toLocaleString()}` : '免運費'}</td>
              </tr>
              <tr style="background-color:#071828;">
                <td style="padding:14px 20px;color:#e2c78e;font-size:15px;font-weight:bold;">訂單總金額</td>
                <td style="padding:14px 20px;color:#e2c78e;font-size:18px;font-weight:bold;text-align:right;">NT$${Number(order.orderTotal).toLocaleString()}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ SHIPPING & PAYMENT ══ -->
        <tr>
          <td style="padding:18px 32px 0;">
            <div style="color:#00aaff;font-size:10px;font-weight:bold;letter-spacing:4px;margin-bottom:10px;">▌ 配送與付款</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <!-- Shipping -->
                <td width="48%" valign="top">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#040c18;border:1px solid #00aaff22;border-radius:8px;">
                    <tr>
                      <td style="padding:14px 16px;">
                        <div style="color:#4a6a88;font-size:10px;letter-spacing:3px;font-weight:bold;margin-bottom:8px;">SHIPPING</div>
                        <div style="color:#7ecfff;font-size:12px;margin-bottom:4px;">配送方式</div>
                        <div style="color:#ffffff;font-size:14px;font-weight:bold;">${shipping}</div>
                      </td>
                    </tr>
                  </table>
                </td>
                <td width="4%">&nbsp;</td>
                <!-- Payment -->
                <td width="48%" valign="top">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#040c18;border:1px solid #e2c78e33;border-radius:8px;">
                    <tr>
                      <td style="padding:14px 16px;">
                        <div style="color:#6a5a2a;font-size:10px;letter-spacing:3px;font-weight:bold;margin-bottom:8px;">PAYMENT</div>
                        <div style="color:#e2c78e;font-size:12px;margin-bottom:4px;">付款方式</div>
                        <div style="color:#ffffff;font-size:14px;font-weight:bold;">${payment}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ PAYMENT REMINDER ══ -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0c04;border:1px solid #e2c78e55;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:0;">
                  <!-- Gold top accent -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr><td style="height:2px;background-color:#e2c78e;font-size:0;line-height:0;">&nbsp;</td></tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding:18px 20px 20px;">
                        <div style="color:#e2c78e;font-size:13px;font-weight:bold;letter-spacing:2px;margin-bottom:12px;">💳 付款提醒</div>
                        <div style="color:#b0a070;font-size:13px;line-height:1.9;margin-bottom:12px;">
                          若您的訂單目前尚未付款，請完成付款後，透過以下方式回報：
                        </div>
                        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                          <tr>
                            <td style="padding:4px 0;color:#d4b96a;font-size:13px;line-height:1.7;">
                              <span style="color:#e2c78e;font-weight:bold;">1.</span>&nbsp; 官方 LINE：<span style="color:#00c8ff;font-weight:bold;">@apple911</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:4px 0;color:#d4b96a;font-size:13px;line-height:1.7;">
                              <span style="color:#e2c78e;font-weight:bold;">2.</span>&nbsp; 網站會員中心 → 訂單管理 → 上傳付款資訊 / 回報付款
                            </td>
                          </tr>
                        </table>
                        <div style="color:#7a6a40;font-size:12px;line-height:1.7;border-top:1px solid #3a2e10;padding-top:10px;">
                          收到付款回報後，我們會盡快確認並安排出貨。
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ FOOTER ══ -->
        <tr>
          <td style="padding:28px 32px 32px;text-align:center;border-top:1px solid #0d2233;margin-top:24px;">
            <!-- Divider dots -->
            <div style="color:#1a3050;font-size:10px;letter-spacing:6px;margin-bottom:16px;">· · ·</div>
            <div style="color:#00aaff;font-size:13px;font-weight:bold;letter-spacing:4px;margin-bottom:6px;">APPLE911</div>
            <div style="color:#4a6a88;font-size:11px;letter-spacing:2px;margin-bottom:12px;">配件怪獸 × 專業維修</div>
            <div style="background-color:#040c18;border:1px solid #00aaff33;border-radius:20px;display:inline-block;padding:6px 18px;margin-bottom:8px;">
              <span style="color:#7ecfff;font-size:12px;">官方 LINE：</span><span style="color:#ffffff;font-size:12px;font-weight:bold;">@apple911</span>
            </div>
            <div style="color:#2a4060;font-size:10px;margin-top:12px;">此信件由系統自動發送，請勿直接回覆</div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

function buildAdminHtml(order, customerEmail) {
  const shipping = SHIPPING_MAP[order.shippingMethod] || order.shippingMethod || '—';
  const payment  = PAYMENT_MAP[order.paymentMethod]  || order.paymentMethod  || '—';
  const timeStr  = new Date(order.time).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

  const itemLines = (order.items || []).map(i => {
    const _v = [i.selectedColor, i.selectedSpec].filter(Boolean).join(' / ');
    return `
    <tr>
      <td style="padding:10px 14px;color:#e8eaf0;font-size:13px;border-bottom:1px solid #1a0808;line-height:1.5;">${i.name}${_v ? `<div style="color:#ff8888;font-size:11px;margin-top:2px;">${_v}</div>` : ''}</td>
      <td style="padding:10px 14px;color:#ff8888;font-size:13px;text-align:center;border-bottom:1px solid #1a0808;white-space:nowrap;">×${i.qty}</td>
      <td style="padding:10px 14px;color:#e2c78e;font-size:13px;text-align:right;border-bottom:1px solid #1a0808;white-space:nowrap;font-weight:bold;">NT$${(i.price * i.qty).toLocaleString()}</td>
    </tr>`;}).join('');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="dark">
</head>
<body style="margin:0;padding:0;background-color:#0a0606;font-family:Arial,'Microsoft JhengHei',sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0606;padding:36px 0 48px;">
    <tr><td align="center" style="padding:0 12px;">

      <!-- Main card -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#100808;border:1px solid #ff003c44;border-radius:10px;">

        <!-- ══ HEADER ══ -->
        <tr>
          <td style="background-color:#0a0404;padding:0;border-radius:10px 10px 0 0;border-bottom:2px solid #ff003c66;text-align:center;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="height:3px;background-color:#ff003c;border-radius:10px 10px 0 0;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="padding:26px 32px 22px;text-align:center;">
                  <div style="display:inline-block;border:1px solid #ff003c55;border-radius:6px;padding:5px 18px;margin-bottom:12px;">
                    <span style="color:#ff6688;font-size:10px;letter-spacing:4px;font-weight:bold;">ADMIN NOTIFICATION</span>
                  </div>
                  <div style="color:#ff003c;font-size:22px;letter-spacing:4px;font-weight:bold;text-shadow:0 0 14px #ff003c88;margin-bottom:4px;">🛒 新訂單通知</div>
                  <div style="color:#6a3a3a;font-size:11px;letter-spacing:3px;">Apple911 後台系統</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ ORDER INFO ══ -->
        <tr>
          <td style="padding:22px 32px 0;">
            <div style="color:#ff003c;font-size:10px;font-weight:bold;letter-spacing:4px;margin-bottom:10px;">▌ 訂單資訊</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0404;border:1px solid #ff003c22;border-radius:8px;">
              <tr>
                <td style="padding:11px 20px;color:#6a3a3a;font-size:12px;border-bottom:1px solid #1a0808;width:35%;letter-spacing:1px;">訂單編號</td>
                <td style="padding:11px 20px;color:#e2c78e;font-size:14px;font-weight:bold;text-align:right;border-bottom:1px solid #1a0808;letter-spacing:2px;">${order.id}</td>
              </tr>
              <tr>
                <td style="padding:11px 20px;color:#6a3a3a;font-size:12px;border-bottom:1px solid #1a0808;letter-spacing:1px;">下單時間</td>
                <td style="padding:11px 20px;color:#c0c8d0;font-size:13px;text-align:right;border-bottom:1px solid #1a0808;">${timeStr}</td>
              </tr>
              <tr>
                <td style="padding:11px 20px;color:#6a3a3a;font-size:12px;border-bottom:1px solid #1a0808;letter-spacing:1px;">客人 Email</td>
                <td style="padding:11px 20px;color:#c0c8d0;font-size:13px;text-align:right;border-bottom:1px solid #1a0808;">${customerEmail || '（未登入會員）'}</td>
              </tr>
              <tr>
                <td style="padding:11px 20px;color:#6a3a3a;font-size:12px;border-bottom:1px solid #1a0808;letter-spacing:1px;">收件人姓名</td>
                <td style="padding:11px 20px;color:#c0c8d0;font-size:13px;text-align:right;border-bottom:1px solid #1a0808;">${order.shippingInfo?.name || '—'}</td>
              </tr>
              <tr>
                <td style="padding:11px 20px;color:#6a3a3a;font-size:12px;letter-spacing:1px;">收件人電話</td>
                <td style="padding:11px 20px;color:#c0c8d0;font-size:13px;text-align:right;">${order.shippingInfo?.phone || '—'}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ ITEMS TABLE ══ -->
        <tr>
          <td style="padding:20px 32px 0;">
            <div style="color:#ff003c;font-size:10px;font-weight:bold;letter-spacing:4px;margin-bottom:10px;">▌ 商品明細</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0404;border:1px solid #ff003c22;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background-color:#0d0606;">
                  <th style="padding:10px 14px;color:#6a3a3a;font-size:11px;text-align:left;border-bottom:1px solid #1a0808;font-weight:bold;letter-spacing:2px;">商品名稱</th>
                  <th style="padding:10px 14px;color:#6a3a3a;font-size:11px;text-align:center;border-bottom:1px solid #1a0808;font-weight:bold;letter-spacing:2px;">數量</th>
                  <th style="padding:10px 14px;color:#6a3a3a;font-size:11px;text-align:right;border-bottom:1px solid #1a0808;font-weight:bold;letter-spacing:2px;">小計</th>
                </tr>
              </thead>
              <tbody>
                ${itemLines}
              </tbody>
            </table>
          </td>
        </tr>

        <!-- ══ AMOUNT SUMMARY ══ -->
        <tr>
          <td style="padding:14px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0404;border:1px solid #ff003c22;border-radius:8px;">
              <tr style="background-color:#0f0808;">
                <td style="padding:14px 20px;color:#e2c78e;font-size:15px;font-weight:bold;">訂單總金額</td>
                <td style="padding:14px 20px;color:#e2c78e;font-size:18px;font-weight:bold;text-align:right;">NT$${Number(order.orderTotal).toLocaleString()}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ SHIPPING / PAYMENT / STATUS ══ -->
        <tr>
          <td style="padding:16px 32px 0;">
            <div style="color:#ff003c;font-size:10px;font-weight:bold;letter-spacing:4px;margin-bottom:10px;">▌ 配送與付款</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0404;border:1px solid #ff003c22;border-radius:8px;">
              <tr>
                <td style="padding:11px 20px;color:#6a3a3a;font-size:12px;border-bottom:1px solid #1a0808;width:35%;letter-spacing:1px;">配送方式</td>
                <td style="padding:11px 20px;color:#c0c8d0;font-size:13px;text-align:right;border-bottom:1px solid #1a0808;">${shipping}</td>
              </tr>
              <tr>
                <td style="padding:11px 20px;color:#6a3a3a;font-size:12px;border-bottom:1px solid #1a0808;letter-spacing:1px;">付款方式</td>
                <td style="padding:11px 20px;color:#c0c8d0;font-size:13px;text-align:right;border-bottom:1px solid #1a0808;">${payment}</td>
              </tr>
              <tr>
                <td style="padding:11px 20px;color:#6a3a3a;font-size:12px;letter-spacing:1px;">訂單狀態</td>
                <td style="padding:11px 20px;color:#ff6688;font-size:13px;font-weight:bold;text-align:right;">${order.status || '—'}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ NOTE (conditional) ══ -->
        ${order.note ? `
        <tr>
          <td style="padding:16px 32px 0;">
            <div style="color:#ff003c;font-size:10px;font-weight:bold;letter-spacing:4px;margin-bottom:10px;">▌ 備註</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0404;border:1px solid #ff003c22;border-radius:8px;">
              <tr>
                <td style="padding:14px 20px;color:#c0c8d0;font-size:13px;line-height:1.7;">${order.note}</td>
              </tr>
            </table>
          </td>
        </tr>` : ''}

        <!-- ══ FOOTER ══ -->
        <tr>
          <td style="padding:28px 32px 32px;text-align:center;border-top:1px solid #1a0808;">
            <div style="color:#3a1010;font-size:10px;letter-spacing:6px;margin-bottom:14px;">· · ·</div>
            <div style="color:#ff003c;font-size:12px;font-weight:bold;letter-spacing:4px;margin-bottom:5px;">APPLE911</div>
            <div style="color:#4a2020;font-size:11px;letter-spacing:2px;margin-bottom:12px;">配件怪獸 × 專業維修</div>
            <div style="background-color:#0a0404;border:1px solid #ff003c33;border-radius:20px;display:inline-block;padding:5px 16px;margin-bottom:8px;">
              <span style="color:#ff8888;font-size:12px;">官方 LINE：</span><span style="color:#ffffff;font-size:12px;font-weight:bold;">@apple911</span>
            </div>
            <div style="color:#2a1010;font-size:10px;margin-top:12px;">此信件由 Apple911 後台系統自動發送</div>
          </td>
        </tr>

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
