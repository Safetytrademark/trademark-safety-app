const axios = require('axios');
const { getAccessToken } = require('./auth');

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';

function encodePath(p) {
  return p.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

async function graphRequest(method, url, data = null, extraHeaders = {}) {
  const token = await getAccessToken();
  const config = {
    method,
    url: `${GRAPH_BASE}${url}`,
    headers: {
      Authorization: `Bearer ${token}`,
      ...extraHeaders
    },
    maxBodyLength: 150 * 1024 * 1024,
    maxContentLength: 150 * 1024 * 1024
  };
  if (data !== null) config.data = data;
  return axios(config);
}

async function ensureFolder(folderPath) {
  const segments = folderPath.split('/').filter(Boolean);
  let builtPath = '';

  for (const segment of segments) {
    const parentPath = builtPath;
    builtPath = builtPath ? `${builtPath}/${segment}` : segment;

    // Check if folder exists
    try {
      await graphRequest('GET', `/me/drive/root:/${encodePath(builtPath)}`);
    } catch (e) {
      if (e.response?.status === 404) {
        // Create folder
        const parentUrl = parentPath
          ? `/me/drive/root:/${encodePath(parentPath)}:/children`
          : `/me/drive/root/children`;

        await graphRequest('POST', parentUrl, {
          name: segment,
          folder: {},
          '@microsoft.graph.conflictBehavior': 'ignore'
        }, { 'Content-Type': 'application/json' });
      } else {
        throw e;
      }
    }
  }
}

async function uploadFile(folderPath, fileName, fileBuffer, mimeType) {
  await ensureFolder(folderPath);

  const fullPath = `${folderPath}/${fileName}`;
  const url = `/me/drive/root:/${encodePath(fullPath)}:/content`;

  await graphRequest('PUT', url, fileBuffer, {
    'Content-Type': mimeType || 'application/octet-stream',
    'Content-Length': fileBuffer.length
  });

  return fullPath;
}

module.exports = { uploadFile, ensureFolder };
