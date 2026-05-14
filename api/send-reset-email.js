// api/send-reset-email.js
// 功能：使用 Firebase Admin 產生密碼重設連結，再用 Resend 寄出 Apple911 風格信件

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// ─── Firebase Admin 初始化（避免重複 init）───────────────────────────────────
function getAdminAuth() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Vercel 環境變數裡的換行符號需還原
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  }
  return getAuth();
}

// ─── Apple911 風格的重設密碼信件 HTML ─────────────────────────────────────────
function buildResetEmailHtml(resetLink) {
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
                    <span style="color:#7ecfff;font-size:10px;letter-spacing:4px;font-weight:bold;">PASSWORD RESET</span>
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
          <td style="padding:32px 32px 0;text-align:center;">
            <div style="color:#e2c78e;font-size:19px;font-weight:bold;margin-bottom:12px;letter-spacing:2px;">🔐 密碼重設通知</div>
            <div style="color:#7a90a8;font-size:13px;line-height:1.9;">
              我們收到您的密碼重設申請。<br>
              請點擊下方按鈕重新設定您的 Apple911 會員密碼。
            </div>
          </td>
        </tr>

        <!-- ══ DIVIDER ══ -->
        <tr>
          <td style="padding:28px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="height:1px;background-color:#0d2233;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ BUTTON ══ -->
        <tr>
          <td style="padding:36px 32px;text-align:center;">
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
              <tr>
                <td style="background-color:#00aaff;border-radius:4px;">
                  <a href="${resetLink}"
                     style="display:inline-block;padding:16px 48px;color:#000000;font-size:14px;font-weight:bold;text-decoration:none;letter-spacing:3px;font-family:Arial,sans-serif;">
                    重設密碼 RESET
                  </a>
                </td>
              </tr>
            </table>
            <div style="margin-top:16px;color:#3a5066;font-size:11px;">按鈕無法點擊？請複製以下連結到瀏覽器</div>
            <div style="margin-top:8px;word-break:break-all;">
              <a href="${resetLink}" style="color:#00aaff;font-size:11px;text-decoration:none;">${resetLink}</a>
            </div>
          </td>
        </tr>

        <!-- ══ WARNING ══ -->
        <tr>
          <td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#0a1520;border:1px solid #00aaff22;border-radius:6px;padding:16px 20px;">
              <tr>
                <td style="padding:16px 20px;">
                  <div style="color:#5a7a99;font-size:12px;line-height:1.8;">
                    ⚠️ 如果這不是您本人操作，請忽略此封信，您的密碼不會被變更。<br>
                    此連結將於 <span style="color:#e2c78e;font-weight:bold;">60 分鐘</span>後失效。
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ DIVIDER ══ -->
        <tr>
          <td style="padding:0 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="height:1px;background-color:#0d2233;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ══ FOOTER ══ -->
        <tr>
          <td style="padding:24px 32px 32px;text-align:center;">
            <div style="color:#00aaff;font-size:13px;font-weight:bold;letter-spacing:3px;margin-bottom:6px;">APPLE911</div>
            <div style="color:#3a5066;font-size:11px;letter-spacing:1px;margin-bottom:4px;">配件怪獸 × 專業維修</div>
            <div style="color:#2a3d50;font-size:10px;letter-spacing:1px;">官方 LINE：@apple911</div>
          </td>
        </tr>

        <!-- Bottom neon accent bar -->
        <tr>
          <td style="padding:0;border-radius:0 0 10px 10px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="height:3px;background-color:#00aaff;border-radius:0 0 10px 10px;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // 只接受 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body || {};

  // 基本驗證
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: '請提供 email' });
  }
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    return res.status(400).json({ error: '請提供 email' });
  }

  // 環境變數檢查
  const resendApiKey   = process.env.RESEND_API_KEY;
  const resendFrom     = process.env.RESEND_FROM_EMAIL;
  const siteUrl        = (process.env.SITE_URL || 'https://apple911-shop.vercel.app').replace(/\/$/, '');

  if (!resendApiKey || !resendFrom) {
    console.warn('[send-reset-email] RESEND_API_KEY 或 RESEND_FROM_EMAIL 未設定');
    return res.status(500).json({ error: '信件服務未設定，請聯絡客服' });
  }

  try {
    const adminAuth = getAdminAuth();

    // 1. 確認 email 是否已註冊（Firebase Admin）
    try {
      await adminAuth.getUserByEmail(trimmedEmail);
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        // 安全考量：不透露 email 是否存在，一律回傳成功
        console.log(`[send-reset-email] email 不存在，靜默忽略: ${trimmedEmail}`);
        return res.status(200).json({ ok: true });
      }
      throw e;
    }

    // 2. 產生 Firebase 原始密碼重設連結
    //    continueUrl 只是備用，信件按鈕不會直接使用這個 Firebase action URL
    const actionCodeSettings = {
      url: `${siteUrl}/reset-password.html`,
      handleCodeInApp: false,
    };
    const firebaseResetLink = await adminAuth.generatePasswordResetLink(trimmedEmail, actionCodeSettings);

    // 3. 從 Firebase 產生的連結解析出 oobCode / apiKey / mode
    //    Firebase 原始格式：https://xxx.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=XXX&apiKey=YYY&...
    const fbUrl   = new URL(firebaseResetLink);
    const oobCode = fbUrl.searchParams.get('oobCode');
    const apiKey  = fbUrl.searchParams.get('apiKey');
    const mode    = fbUrl.searchParams.get('mode') || 'resetPassword';

    if (!oobCode) {
      console.error('[send-reset-email] Firebase 回傳連結缺少 oobCode:', firebaseResetLink);
      return res.status(500).json({ error: '無法產生重設連結，請稍後再試' });
    }

    // 4. 重組成自訂連結，直接指向 reset-password.html（跳過 Firebase 預設 action 頁）
    const customResetLink =
      `${siteUrl}/reset-password.html` +
      `?mode=${encodeURIComponent(mode)}` +
      `&oobCode=${encodeURIComponent(oobCode)}` +
      `&apiKey=${encodeURIComponent(apiKey || '')}`;

    console.log(`[send-reset-email] 自訂 reset link 產生成功，oobCode 前綴: ${oobCode.slice(0, 8)}...`);

    // 5. 使用 Resend 寄信（按鈕連結使用 customResetLink，不使用 Firebase 原始 action URL）
    const fromDisplay = `Apple911 客服中心 <${resendFrom}>`;
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from:    fromDisplay,
        to:      [trimmedEmail],
        subject: 'Apple911 密碼重設通知',
        html:    buildResetEmailHtml(customResetLink),
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.json().catch(() => ({}));
      console.error('[send-reset-email] Resend 寄信失敗:', errBody);
      return res.status(500).json({ error: '寄信失敗，請稍後再試' });
    }

    console.log(`[send-reset-email] 重設信已寄出至: ${trimmedEmail}`);
    return res.status(200).json({ ok: true });

  } catch (e) {
    console.error('[send-reset-email] 錯誤:', e.code, e.message);
    const msg =
      e.code === 'auth/invalid-email'         ? '信箱格式錯誤' :
      e.code === 'auth/invalid-credential'    ? 'Firebase Admin 憑證設定錯誤，請聯絡客服' :
      '系統錯誤，請稍後再試';
    return res.status(500).json({ error: msg });
  }
};
