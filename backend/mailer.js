const nodemailer = require('nodemailer');

function createTransport() {
  const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;
  const service = (EMAIL_SERVICE || '').toLowerCase();

  if (service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });
  }

  if (service === 'outlook' || service === 'microsoft365' || service === 'office365') {
    return nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      tls: { ciphers: 'SSLv3', rejectUnauthorized: false }
    });
  }

  // Generic SMTP fallback
  return nodemailer.createTransport({
    host: EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(EMAIL_PORT) || 587,
    secure: false,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  });
}

async function sendSafetySubmission({ foremanName, project, submissionType, date, workersOnSite, fields, pdfBuffer, pdfName, photos }) {
  const { EMAIL_USER, EMAIL_TO } = process.env;
  const recipient = EMAIL_TO || EMAIL_USER;

  const parsedFields = typeof fields === 'string' ? JSON.parse(fields) : (fields || {});

  const fieldRows = Object.entries(parsedFields)
    .filter(([, v]) => v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== ''))
    .map(([k, v]) => {
      const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const value = Array.isArray(v) ? v.join(' • ') : String(v);
      return `
        <tr>
          <td style="padding:10px 14px;background:#fafafa;font-weight:600;color:#666;
                     font-size:12px;text-transform:uppercase;letter-spacing:0.04em;
                     border-bottom:1px solid #eee;width:38%;vertical-align:top">${label}</td>
          <td style="padding:10px 14px;color:#222;font-size:14px;
                     border-bottom:1px solid #eee;line-height:1.5">${value}</td>
        </tr>`;
    }).join('');

  const typeColors = {
    'Daily Tailgate':    '#f59e0b',
    'Safety Inspection': '#3b82f6',
    'Toolbox Talk':      '#10b981',
    'Incident Report':   '#ef4444',
    'Hazard Observation':'#f97316',
    'Site Photos Only':  '#8b5cf6'
  };
  const accentColor = typeColors[submissionType] || '#f59e0b';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0f0f0;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:580px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15)">

  <!-- Header -->
  <div style="background:#111;padding:28px 24px;display:flex;align-items:center">
    <div style="background:${accentColor};color:#000;font-weight:800;font-size:22px;
                padding:6px 14px;border-radius:8px;display:inline-block;letter-spacing:-0.5px">TM</div>
    <div style="margin-left:14px">
      <div style="color:#fff;font-size:18px;font-weight:700">Trademark Masonry</div>
      <div style="color:#888;font-size:13px;margin-top:2px">Safety Management System</div>
    </div>
  </div>

  <!-- Type Badge -->
  <div style="background:${accentColor};padding:12px 24px">
    <span style="font-weight:700;font-size:15px;color:${submissionType === 'Daily Tailgate' || submissionType === 'Site Photos Only' ? '#000' : '#fff'}">${submissionType.toUpperCase()}</span>
  </div>

  <!-- Core Info -->
  <div style="background:#fff;padding:0">
    <table style="width:100%;border-collapse:collapse">
      <tr>
        <td style="padding:12px 14px;background:#f7f7f7;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid #eee;width:38%">Foreman</td>
        <td style="padding:12px 14px;color:#111;font-size:15px;font-weight:600;border-bottom:1px solid #eee">${foremanName}</td>
      </tr>
      <tr>
        <td style="padding:12px 14px;background:#f7f7f7;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid #eee">Project</td>
        <td style="padding:12px 14px;color:#111;font-size:14px;border-bottom:1px solid #eee">${project}</td>
      </tr>
      <tr>
        <td style="padding:12px 14px;background:#f7f7f7;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid #eee">Date</td>
        <td style="padding:12px 14px;color:#111;font-size:14px;border-bottom:1px solid #eee">${date}</td>
      </tr>
      <tr>
        <td style="padding:12px 14px;background:#f7f7f7;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.04em;border-bottom:1px solid #eee">Workers on Site</td>
        <td style="padding:12px 14px;color:#111;font-size:14px;border-bottom:1px solid #eee">${workersOnSite || '—'}</td>
      </tr>
      <tr>
        <td style="padding:12px 14px;background:#f7f7f7;font-weight:600;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:0.04em">Photos</td>
        <td style="padding:12px 14px;color:#111;font-size:14px">${photos.length > 0 ? `${photos.length} photo(s) attached` : 'No photos'}</td>
      </tr>
    </table>
  </div>

  ${fieldRows ? `
  <!-- Form Details -->
  <div style="background:#fff;border-top:3px solid ${accentColor};padding:0">
    <div style="padding:14px 24px;background:#f7f7f7;font-size:11px;font-weight:700;
                text-transform:uppercase;letter-spacing:0.06em;color:#888;border-bottom:1px solid #eee">
      Form Details
    </div>
    <table style="width:100%;border-collapse:collapse">${fieldRows}</table>
  </div>` : ''}

  <!-- Footer -->
  <div style="background:#111;padding:16px 24px;text-align:center">
    <p style="color:#666;font-size:12px;margin:0">
      Trademark Masonry Safety Management System &nbsp;•&nbsp;
      PDF report ${pdfBuffer ? 'attached' : 'not generated'}
    </p>
  </div>

</div>
</body>
</html>`;

  const attachments = [];

  if (pdfBuffer) {
    attachments.push({
      filename: pdfName,
      content: Buffer.from(pdfBuffer),
      contentType: 'application/pdf'
    });
  }

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const ext = (photo.originalname || 'photo.jpg').split('.').pop().toLowerCase();
    const safeName = pdfName.replace('.pdf', '') + `_photo${String(i + 1).padStart(2, '0')}.${ext}`;
    attachments.push({
      filename: safeName,
      content: photo.buffer,
      contentType: photo.mimetype || 'image/jpeg'
    });
  }

  const transporter = createTransport();

  await transporter.sendMail({
    from: `"Trademark Safety Forms" <${EMAIL_USER}>`,
    to: recipient,
    subject: `[Safety] ${submissionType} — ${project} — ${date}`,
    html,
    attachments
  });

  return { recipient, filesAttached: attachments.length };
}

async function testConnection() {
  const transporter = createTransport();
  await transporter.verify();
}

module.exports = { sendSafetySubmission, testConnection };
