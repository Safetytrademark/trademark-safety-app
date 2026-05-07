const axios = require('axios');
const fs = require('fs');
const path = require('path');

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  // Return cached token if still valid (with 5-minute buffer)
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  const { CLIENT_ID, CLIENT_SECRET, TENANT_ID, REFRESH_TOKEN } = process.env;

  if (!CLIENT_ID || !CLIENT_SECRET || !TENANT_ID || !REFRESH_TOKEN) {
    throw new Error(
      'Missing Microsoft credentials in .env file.\n' +
      'Run: npm run setup\n' +
      'Then follow the instructions in setup/SETUP.md'
    );
  }

  const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN,
    grant_type: 'refresh_token',
    scope: 'https://graph.microsoft.com/Files.ReadWrite offline_access'
  });

  const response = await axios.post(tokenEndpoint, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000);

  // If Microsoft issued a new refresh token, save it to .env
  if (response.data.refresh_token && response.data.refresh_token !== REFRESH_TOKEN) {
    process.env.REFRESH_TOKEN = response.data.refresh_token;
    updateEnvFile('REFRESH_TOKEN', response.data.refresh_token);
  }

  return cachedToken;
}

function updateEnvFile(key, value) {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;

  try {
    let content = fs.readFileSync(envPath, 'utf8');
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
    fs.writeFileSync(envPath, content, 'utf8');
  } catch (e) {
    console.warn('Could not update .env with new refresh token:', e.message);
  }
}

module.exports = { getAccessToken };
