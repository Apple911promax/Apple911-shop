module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { order, type, newStatus } = req.body || {};
  if (!order) {
    return res.status(400).json({ error: 'Missing order' });
  }

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const ownerId = process.env.LINE_OWNER_USER_ID;
  if (!token || !ownerId) {
    console.warn('LINE Messaging API env vars not set');
    return res.status(200).json({ ok: false, reason: 'not_configured' });
  }

  if (type === 'status_change') {
    const statusEmoji = { '已付款': '✅', '已出貨': '📦', '已完成': '🎉', '已取消': '❌', '處理中': '🔧', '待取貨': '🏪' };
    const emoji = statusEmoji[newStatus] || '🔔';

    const ownerText = `${emoji} 訂單狀態變更\n訂單編號：${order.id}\n新狀態：${newStatus}\n客人：${order.shippingInfo?.name || '—'}`;

    const customerMsgMap = {
      '已付款': `✅ 您的訂單已確認付款\n訂單編號：${order.id}\n我們將盡快為您處理，感謝您的購買！`,
      '已出貨': `📦 您的訂單已出貨\n訂單編號：${order.id}\n請留意配送通知，感謝您的耐心等候！`,
      '已完成': `🎉 訂單已完成\n訂單編號：${order.id}\n感謝您的購買，歡迎再次光臨 Apple911！`,
      '已取消': `❌ 訂單已取消\n訂單編號：${order.id}\n如有疑問請聯繫客服，感謝您的理解。`,
      '處理中': `🔧 您的訂單正在處理中\n訂單編號：${order.id}\n我們會盡快完成，感謝您的等候！`,
      '待取貨': `🏪 您的訂單已備妥，可前來取貨\n訂單編號：${order.id}`,
    };

    const pushPromises = [
      fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ to: ownerId, messages: [{ type: 'text', text: ownerText }] }),
      }),
    ];

    if (order.lineUserId && customerMsgMap[newStatus]) {
      pushPromises.push(
        fetch('https://api.line.me/v2/bot/message/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ to: order.lineUserId, messages: [{ type: 'text', text: customerMsgMap[newStatus] }] }),
        })
      );
    }

    try {
      const results = await Promise.all(pushPromises);
      for (const r of results) {
        if (!r.ok) { const d = await r.json(); console.error('LINE push failed:', d); }
      }
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('LINE notify error:', e);
      return res.status(200).json({ ok: false, reason: e.message });
    }
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
