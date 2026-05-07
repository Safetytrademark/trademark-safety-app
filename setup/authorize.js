/**
 * Trademark Safety App — Microsoft Authorization Setup
 * Run this once to generate a refresh token for the backend.
 * Usage: node setup/authorize.js
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Try to load .env
const envPath = path.join(__dirname, '../backend/.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
const REDIRECT_URI = 'http://localhost:8888/callback';
const SCOPES = 'https://graph.microsoft.com/Files.ReadWrite offline_access';

if (!CLIENT_ID || !CLIENT_SECRET || !TENANT_ID ||
    CLIENT_ID === 'your-client-id-here') {
  console.error('\n❌ ERROR: Azure credentials not found in backend/.env');
  console.error('   Please follow SETUP.md steps 1-3 first.\n');
  process.exit(1);
}

const authUrl =
  `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize` +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&response_mode=query` +
  `&prompt=consent`;

console.log('\n╔══════════════════════════════════════════════╗');
console.log('║   Trademark Safety — Microsoft Authorization ║');
console.log('╚══════════════════════════════════════════════╝\n');
console.log('Opening your browser for Microsoft login...');
console.log('If the browser does not open, go to:\n');
console.log(authUrl);
console.log('\nWaiting for authorization...\n');

// Open browser
const { exec } = require('child_process');
exec(`start "" "${authUrl}"`);

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/callback')) {
    res.end('Waiting for authorization...');
    return;
  }

  const url = new URL(req.url, 'http://localhost:8888');
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.end(`<h1>Error: ${error}</h1><p>${url.searchParams.get('error_description')}</p>`);
    console.error(`\n❌ Authorization failed: ${error}`);
    server.close();
    return;
  }

  if (!code) {
    res.end('<h1>No code received. Please try again.</h1>');
    server.close();
    return;
  }

  try {
    const axios = require('axios');

    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        scope: SCOPES
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { refresh_token, access_token } = tokenResponse.data;

    // Verify we can access OneDrive
    const profileRes = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const userEmail = profileRes.data.mail || profileRes.data.userPrincipalName;

    // Save to .env
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      if (/^REFRESH_TOKEN=/m.test(envContent)) {
        envContent = envContent.replace(/^REFRESH_TOKEN=.*$/m, `REFRESH_TOKEN=${refresh_token}`);
      } else {
        envContent += `\nREFRESH_TOKEN=${refresh_token}`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log('✅ REFRESH_TOKEN saved to backend/.env automatically!\n');
    }

    const html = `
<!DOCTYPE html><html><head><style>
body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; padding: 40px; text-align: center; }
.card { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 32px; max-width: 500px; margin: 0 auto; }
h1 { color: #f59e0b; } p { color: #aaa; } code { background: #111; padding: 4px 8px; border-radius: 4px; color: #f59e0b; font-size: 12px; word-break: break-all; }
</style></head><body>
<div class="card">
  <h1>✅ Authorization Successful!</h1>
  <p>Logged in as: <strong>${userEmail}</strong></p>
  <p>The refresh token has been saved to <code>backend/.env</code> automatically.</p>
  <p>You can close this window and start the backend server.</p>
</div></body></html>`;

    res.end(html);

    console.log(`✅ Authorization successful!`);
    console.log(`   Account: ${userEmail}`);
    console.log('\n▶ Next step: Start the backend server');
    console.log('   Double-click: backend/start.bat\n');

  } catch (err) {
    const errMsg = err.response?.data?.error_description || err.message;
    res.end(`<h1>Error exchanging token</h1><p>${errMsg}</p>`);
    console.error('\n❌ Token exchange failed:', errMsg);
  }

  server.close();
});

server.listen(8888, () => {
  // Server is ready, browser was opened above
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('\n❌ Port 8888 is already in use. Close the other app and try again.');
    process.exit(1);
  }
});
