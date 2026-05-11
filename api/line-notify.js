function buildOrderFlexMessage(order) {
  const shippingMap = { home: '宅配', cvs: '超商取貨', store: '門市自取' };
  const shippingLabel = shippingMap[order.shippingMethod] || order.shippingMethod || '—';
  const timeStr = new Date(order.time).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

  const items = order.items || [];
  const displayItems = items.slice(0, 5);
  const extraCount = items.length - displayItems.length;

  const statusColor =
    (order.status === '已付款' || order.status === '已付款待確認') ? '#00f3ff' :
    order.status === '未付款' ? '#ff003c' : '#9ca3af';

  const itemRows = displayItems.map(i => ({
    type: 'box', layout: 'horizontal', paddingTop: '6px', paddingBottom: '6px',
    contents: [
      { type: 'text', text: i.name, color: '#ffffff', size: 'sm', flex: 5, wrap: true },
      { type: 'text', text: `×${i.qty}`, color: '#9ca3af', size: 'sm', flex: 1, align: 'center' },
      { type: 'text', text: `NT$${i.price * i.qty}`, color: '#e2c78e', size: 'sm', flex: 2, align: 'end' },
    ],
  }));

  if (extraCount > 0) {
    itemRows.push({ type: 'text', text: `另有 ${extraCount} 項商品`, color: '#9ca3af', size: 'xs', paddingTop: '4px' });
  }

  const amountRows = [
    { label: '小計', value: `NT$${order.subtotal}`, color: '#ffffff' },
  ];
  if (order.discount > 0) {
    amountRows.push({ label: '折扣', value: `-NT$${order.discount}`, color: '#ff003c' });
  }
  amountRows.push({ label: '運費', value: order.shippingFee > 0 ? `NT$${order.shippingFee}` : '免費', color: '#9ca3af' });

  const noteContents = order.note ? [{
    type: 'box', layout: 'vertical', backgroundColor: '#0a0f18', paddingAll: '10px',
    cornerRadius: '4px', margin: 'md',
    contents: [
      { type: 'text', text: '備註', color: '#9ca3af', size: 'xs', weight: 'bold' },
      { type: 'text', text: order.note, color: '#ffffff', size: 'sm', wrap: true, margin: 'sm' },
    ],
  }] : [];

  return {
    type: 'flex',
    altText: `🛒 Apple911 新訂單 ${order.id}`,
    contents: {
      type: 'bubble',
      size: 'giga',
      header: {
        type: 'box', layout: 'vertical', backgroundColor: '#0a0f18', paddingAll: '16px',
        contents: [
          { type: 'text', text: '🛒  Apple911 新訂單', color: '#00f3ff', size: 'lg', weight: 'bold', align: 'center' },
          { type: 'text', text: order.id, color: '#9ca3af', size: 'xs', align: 'center', margin: 'sm' },
        ],
      },
      body: {
        type: 'box', layout: 'vertical', backgroundColor: '#050505', paddingAll: '16px', spacing: 'none',
        contents: [
          {
            type: 'box', layout: 'horizontal',
            contents: [
              { type: 'text', text: '時間', color: '#9ca3af', size: 'xs', flex: 1 },
              { type: 'text', text: timeStr, color: '#ffffff', size: 'xs', flex: 3, align: 'end' },
            ],
          },
          { type: 'separator', color: '#0a0f18', margin: 'md' },
          { type: 'text', text: '商品明細', color: '#00f3ff', size: 'xs', weight: 'bold', margin: 'md' },
          {
            type: 'box', layout: 'vertical', backgroundColor: '#0a0f18', paddingAll: '10px',
            cornerRadius: '4px', margin: 'sm', contents: itemRows,
          },
          { type: 'separator', color: '#0a0f18', margin: 'md' },
          { type: 'text', text: '金額', color: '#00f3ff', size: 'xs', weight: 'bold', margin: 'md' },
          {
            type: 'box', layout: 'vertical', backgroundColor: '#0a0f18', paddingAll: '10px',
            cornerRadius: '4px', margin: 'sm',
            contents: [
              ...amountRows.map(r => ({
                type: 'box', layout: 'horizontal', paddingTop: '4px', paddingBottom: '4px',
                contents: [
                  { type: 'text', text: r.label, color: '#9ca3af', size: 'sm', flex: 1 },
                  { type: 'text', text: r.value, color: r.color, size: 'sm', flex: 1, align: 'end' },
                ],
              })),
              { type: 'separator', color: '#1e293b', margin: 'sm' },
              {
                type: 'box', layout: 'horizontal', paddingTop: '6px',
                contents: [
                  { type: 'text', text: '總計', color: '#e2c78e', size: 'md', weight: 'bold', flex: 1 },
                  { type: 'text', text: `NT$${order.orderTotal}`, color: '#e2c78e', size: 'md', weight: 'bold', flex: 1, align: 'end' },
                ],
              },
            ],
          },
          { type: 'separator', color: '#0a0f18', margin: 'md' },
          { type: 'text', text: '配送與付款', color: '#00f3ff', size: 'xs', weight: 'bold', margin: 'md' },
          {
            type: 'box', layout: 'vertical', backgroundColor: '#0a0f18', paddingAll: '10px',
            cornerRadius: '4px', margin: 'sm',
            contents: [
              {
                type: 'box', layout: 'horizontal', paddingBottom: '4px',
                contents: [
                  { type: 'text', text: '取貨', color: '#9ca3af', size: 'sm', flex: 1 },
                  { type: 'text', text: shippingLabel, color: '#ffffff', size: 'sm', flex: 2, align: 'end' },
                ],
              },
              {
                type: 'box', layout: 'horizontal', paddingBottom: '4px',
                contents: [
                  { type: 'text', text: '付款', color: '#9ca3af', size: 'sm', flex: 1 },
                  { type: 'text', text: order.paymentMethod || '—', color: '#ffffff', size: 'sm', flex: 2, align: 'end' },
                ],
              },
              {
                type: 'box', layout: 'horizontal',
                contents: [
                  { type: 'text', text: '狀態', color: '#9ca3af', size: 'sm', flex: 1 },
                  { type: 'text', text: order.status || '—', color: statusColor, size: 'sm', flex: 2, align: 'end', weight: 'bold' },
                ],
              },
            ],
          },
          { type: 'separator', color: '#0a0f18', margin: 'md' },
          { type: 'text', text: '顧客資料', color: '#00f3ff', size: 'xs', weight: 'bold', margin: 'md' },
          {
            type: 'box', layout: 'vertical', backgroundColor: '#0a0f18', paddingAll: '10px',
            cornerRadius: '4px', margin: 'sm',
            contents: [
              {
                type: 'box', layout: 'horizontal', paddingBottom: '4px',
                contents: [
                  { type: 'text', text: '姓名', color: '#9ca3af', size: 'sm', flex: 1 },
                  { type: 'text', text: order.shippingInfo?.name || '—', color: '#ffffff', size: 'sm', flex: 2, align: 'end' },
                ],
              },
              {
                type: 'box', layout: 'horizontal',
                contents: [
                  { type: 'text', text: '電話', color: '#9ca3af', size: 'sm', flex: 1 },
                  { type: 'text', text: order.shippingInfo?.phone || '—', color: '#ffffff', size: 'sm', flex: 2, align: 'end' },
                ],
              },
            ],
          },
          ...noteContents,
          { type: 'text', text: 'Apple911  配件怪獸 × 專業維修', color: '#9ca3af', size: 'xxs', align: 'center', margin: 'xl' },
        ],
      },
      footer: {
        type: 'box', layout: 'vertical', backgroundColor: '#0a0f18', paddingAll: '12px',
        contents: [{
          type: 'button',
          action: { type: 'uri', label: '查看後台訂單', uri: 'https://apple911-shop.vercel.app/admin.html' },
          style: 'primary', color: '#00f3ff', height: 'sm',
        }],
      },
    },
  };
}

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

  // 狀態變更通知（純文字，不動）
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

  // 新訂單通知：優先送 Flex Message，失敗自動 fallback 純文字
  const shippingMap = { home: '宅配', cvs: '超商取貨', store: '門市自取' };
  const shippingLabel = shippingMap[order.shippingMethod] || order.shippingMethod || '—';
  const itemLines = (order.items || [])
    .map(i => `  • ${i.name} ×${i.qty}  NT$${i.price * i.qty}`)
    .join('\n');

  const fallbackText = [
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
    if (l === '' && arr[i - 1] === '') return false;
    return true;
  }).join('\n').trim();

  // 先試 Flex Message
  try {
    const flexMsg = buildOrderFlexMessage(order);
    const flexRes = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ to: ownerId, messages: [flexMsg] }),
    });

    if (flexRes.ok) {
      return res.status(200).json({ ok: true, format: 'flex' });
    }

    const flexErr = await flexRes.json();
    console.warn('Flex Message failed, fallback to text:', flexErr);
  } catch (e) {
    console.warn('Flex Message error, fallback to text:', e.message);
  }

  // Fallback 純文字
  try {
    const pushRes = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ to: ownerId, messages: [{ type: 'text', text: fallbackText }] }),
    });

    const data = await pushRes.json();
    if (!pushRes.ok) {
      console.error('LINE fallback text push failed:', data);
      return res.status(200).json({ ok: false, reason: data });
    }
    return res.status(200).json({ ok: true, format: 'text' });
  } catch (e) {
    console.error('LINE notify error:', e);
    return res.status(200).json({ ok: false, reason: e.message });
  }
};
