// Backend URL — change this if you deploy the backend somewhere else
const BACKEND_URL = 'https://trademark-safety-app-production.up.railway.app';

async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function submitToOneDrive(formData, pdfBuffer, photos) {
  const data = new FormData();

  // Core metadata
  data.append('foremanName', formData.foremanName);
  data.append('project', formData.project);
  data.append('submissionType', formData.submissionType);
  data.append('date', formData.date);
  data.append('workersOnSite', formData.workersOnSite || '');
  data.append('formFields', JSON.stringify(formData.fields));

  // PDF blob
  const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const pdfName = buildFileName(formData);
  data.append('pdf', pdfBlob, pdfName);

  // Photos
  for (let i = 0; i < photos.length; i++) {
    data.append('photos', photos[i], photos[i].name || `photo_${i + 1}.jpg`);
  }

  const res = await fetch(`${BACKEND_URL}/submit`, {
    method: 'POST',
    body: data,
    signal: AbortSignal.timeout(120000) // 2-minute timeout for large uploads
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.details || err.error || `Server error ${res.status}`);
  }

  return res.json();
}

async function downloadFallbackZip(formData, pdfBuffer, photos) {
  // Fallback: create a ZIP file for manual saving to OneDrive
  if (!window.JSZip) throw new Error('JSZip not loaded');

  const zip = new JSZip();
  const folderName = `${formData.submissionType.replace(/\s+/g, '_')}_${formData.project.substring(0, 20).replace(/\s+/g, '_')}_${formData.date}`;

  // Add PDF
  zip.file(`${folderName}/${buildFileName(formData)}`, pdfBuffer);

  // Add photos
  for (let i = 0; i < photos.length; i++) {
    const buf = await photos[i].arrayBuffer();
    const ext = photos[i].name?.split('.').pop() || 'jpg';
    zip.file(`${folderName}/Photos/photo_${String(i + 1).padStart(2, '0')}.${ext}`, buf);
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${folderName}.zip`;
  link.click();
  URL.revokeObjectURL(link.href);

  return {
    success: true,
    offline: true,
    message: `ZIP downloaded. Save it to:\nOneDrive → Safety Documents → ${formData.project} → ${TYPE_TO_FOLDER[formData.submissionType]}`
  };
}
