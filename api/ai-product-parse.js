// ─────────────────────────────────────────────────────────────
// AI 上架助手 v1  —  api/ai-product-parse.js
// 更換模型只需修改這一行：
const AI_MODEL = 'claude-sonnet-4-5';
// ─────────────────────────────────────────────────────────────

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT = `你是一個商品資料解析助手。
用戶會貼上商品說明文字（可能來自供應商報價單、商品頁面描述、或任意格式的商品資訊）。
你的工作是從這段文字中萃取商品資料，然後只回傳一個 JSON 物件，不加任何說明或 markdown。

JSON 格式如下（所有欄位都必須存在，無法判斷的欄位回傳空字串或空陣列）：
{
  "name": "商品名稱（字串）",
  "price": 0,
  "productCode": "產品代號或型號（字串，若無則空字串）",
  "description": "商品說明（字串，保留重要規格資訊，簡潔即可）",
  "colors": ["顏色選項陣列，每個元素是一個顏色名稱字串"],
  "specs": ["規格選項陣列，例如適用機型、容量等"],
  "imageUrl": "圖片網址（若文字中有提到圖片連結則填入，否則空字串）",
  "supplierUrl": "來源網址（若用戶有提供則填入，否則空字串）"
}

規則：
- price 必須是數字（不含貨幣符號），若無法判斷則填 0
- colors 和 specs 都是字串陣列，不可是巢狀物件
- 不可查詢任何外部資源，只從傳入文字解析
- 只回傳 JSON，不加任何前後說明文字、不加 markdown code block`;

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: '伺服器未設定 AI API Key，請聯絡管理員' });
  }

  const { input, url } = req.body || {};
  if (!input || !input.trim()) {
    return res.status(400).json({ error: '請提供商品資料文字' });
  }

  // 組合給 AI 的 user message
  let userMessage = `請解析以下商品資料：\n\n${input.trim()}`;
  if (url && url.trim()) {
    userMessage += `\n\n來源網址（僅供參考，請填入 supplierUrl）：${url.trim()}`;
  }

  try {
    const response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ error: `AI 服務回應錯誤（${response.status}），請稍後再試` });
    }

    const aiData = await response.json();
    const rawText = (aiData.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    // 清除可能的 markdown fence
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('JSON parse failed. Raw:', cleaned);
      return res.status(502).json({ error: 'AI 回傳格式無法解析，請重試或調整輸入文字' });
    }

    // 確保所有欄位存在且型別正確，避免前端出錯
    const result = {
      name:        typeof parsed.name        === 'string'  ? parsed.name.trim()        : '',
      price:       typeof parsed.price       === 'number'  ? Math.max(0, Math.floor(parsed.price)) : 0,
      productCode: typeof parsed.productCode === 'string'  ? parsed.productCode.trim() : '',
      description: typeof parsed.description === 'string'  ? parsed.description.trim() : '',
      colors:      Array.isArray(parsed.colors) ? parsed.colors.filter(c => typeof c === 'string' && c.trim()).map(c => c.trim()) : [],
      specs:       Array.isArray(parsed.specs)  ? parsed.specs.filter(s => typeof s === 'string' && s.trim()).map(s => s.trim())  : [],
      imageUrl:    typeof parsed.imageUrl    === 'string'  ? parsed.imageUrl.trim()    : '',
      supplierUrl: typeof parsed.supplierUrl === 'string'  ? parsed.supplierUrl.trim() : (url ? url.trim() : ''),
    };

    return res.status(200).json(result);

  } catch (e) {
    console.error('ai-product-parse handler error:', e);
    return res.status(500).json({ error: '伺服器錯誤，請稍後再試' });
  }
};
