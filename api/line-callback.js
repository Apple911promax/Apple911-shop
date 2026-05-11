const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const REDIRECT_URI = 'https://apple911-shop.vercel.app/api/line-callback';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  return initializeApp({ credential: cert(serviceAccount) });
}

module.exports = async function handler(req, res) {
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect('/?lineError=' + encodeURIComponent(error || 'no_code'));
  }

  try {
    // 1. 換取 LINE access token
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: process.env.LINE_CLIENT_ID,
        client_secret: process.env.LINE_CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('LINE token exchange failed:', tokenData);
      return res.redirect('/?lineError=token_failed');
    }

    // 2. 取得 LINE 用戶資料
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();
    if (!profile.userId) {
      return res.redirect('/?lineError=profile_failed');
    }

    // 3. 產生 Firebase custom token
    const app = getAdminApp();
    const uid = 'line_' + profile.userId;
    const customToken = await getAuth(app).createCustomToken(uid);

    // 4. 若會員不存在則建立基本資料
    const db = getFirestore(app);
    const memberRef = db.collection('members').doc(uid);
    const snap = await memberRef.get();
    if (!snap.exists) {
      await memberRef.set({
        uid,
        lineId: profile.userId,
        name: profile.displayName || '',
        picture: profile.pictureUrl || '',
        loginMethod: 'line',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // 5. 導回前台並帶入 token
    const params = new URLSearchParams({
      lineToken: customToken,
      lineName: profile.displayName || '',
      lineUserId: profile.userId,
      linePicture: profile.pictureUrl || '',
    });
    res.redirect('/?' + params.toString());

  } catch (e) {
    console.error('LINE callback error:', e);
    res.redirect('/?lineError=server_error');
  }
};
