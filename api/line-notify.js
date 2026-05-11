module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { order } = req.body || {};
  if (!order) {
    return res.status(400).json({ error: 'Missing order' });
  }

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const ownerId = process.env.LINE_OWNER_USER_ID;
  if (!token || !ownerId) {
    console.warn('LINE Messaging API env vars not set');
    return res.status(200).json({ ok: false, reason: 'not_configured' });
  }

  const shippingMap = { home: '宅配', cvs: '超商取貨', store: '門市自取' };
  const shippingLabel = shippingMap[order.shippingMethod] || order.shippingMethod || '—';
  const itemLines = (order.items || [])
    .map(i => `  • ${i.name} ×${i.qty}  NT$${i.price * i.qty}`)
    .join('\n');

  const text = [
    '🛒 新訂單通知',
    `訂單編號：${order.id}`,
    `時間：${new Date(order.time).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`,
    '',
    '【商品】',
    itemLines,
    '',
    `小計：NT$${order.subtotal}`,
    order.discount > 0 ? `折扣：-NT$${order.discount}` : '',
    order.shippingFee > 0 ? `運費：NT$${order.shippingFee}` : '運費：免費',
    `總計：NT$${order.orderTotal}`,
    '',
    `取貨：${shippingLabel}`,
    `付款：${order.paymentMethod || '—'}`,
    `狀態：${order.status}`,
    '',
    `姓名：${order.shippingInfo?.name || '—'}`,
    `電話：${order.shippingInfo?.phone || '—'}`,
    order.note ? `備註：${order.note}` : '',
  ].filter(l => l !== undefined && l !== null).filter((l, i, arr) => {
    // 移除連續空行
    if (l === '' && arr[i - 1] === '') return false;
    return true;
  }).join('\n').trim();

  try {
    const pushRes = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: ownerId,
        messages: [{ type: 'text', text }],
      }),
    });

    const data = await pushRes.json();
    if (!pushRes.ok) {
      console.error('LINE push failed:', data);
      return res.status(200).json({ ok: false, reason: data });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('LINE notify error:', e);
    return res.status(200).json({ ok: false, reason: e.message });
  }
};
