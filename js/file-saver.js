// ── FileSaver ─────────────────────────────────────────────────────────────────
// Auto-saves PDFs to a user-chosen local folder (e.g. OneDrive) using the
// File System Access API. Persists the folder handle in IndexedDB so the user
// only has to pick once.
//
// Folder structure:
//   [Root]/[Project Name]/[Form Type]/YYYY-MM-DD_Form-Type.pdf
//
// Supported: Chrome 86+, Edge 86+. Falls back silently on Safari / Firefox.

const FileSaver = (() => {
  const DB_NAME    = 'tm-filesaver';
  const DB_VERSION = 1;
  const STORE      = 'handles';
  const KEY        = 'rootDir';

  let _dirHandle = null;   // in-memory cache

  // ── IndexedDB helpers ────────────────────────────────────────────────────────
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
      req.onsuccess       = e => resolve(e.target.result);
      req.onerror         = e => reject(e.target.error);
    });
  }

  async function storeHandle(handle) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(handle, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror    = e  => reject(e.target.error);
    });
  }

  async function loadHandle() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = e => resolve(e.target.result || null);
      req.onerror   = e => reject(e.target.error);
    });
  }

  async function clearHandle() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(KEY);
      tx.oncomplete = () => resolve();
      tx.onerror    = e  => reject(e.target.error);
    });
  }

  // ── Permission helpers ───────────────────────────────────────────────────────
  async function verifyPermission(handle) {
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    return (await handle.requestPermission(opts)) === 'granted';
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  /** Is the File System Access API available? */
  function isSupported() {
    return typeof window.showDirectoryPicker === 'function';
  }

  /** Return the cached directory handle (null if not set). */
  function getHandle() { return _dirHandle; }

  /** Friendly name of the chosen root folder (null if not set). */
  function getLabel() { return _dirHandle ? _dirHandle.name : null; }

  /**
   * Restore the persisted handle on app startup.
   * Returns true if a handle with granted permission was found.
   */
  async function init() {
    if (!isSupported()) return false;
    try {
      const handle = await loadHandle();
      if (!handle) return false;
      _dirHandle = handle;
      // Check silently — don't prompt on load
      const perm = await handle.queryPermission({ mode: 'readwrite' });
      return perm === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Open the system folder picker.
   * Returns the chosen folder name, or throws on cancel / unsupported.
   */
  async function pick() {
    if (!isSupported()) {
      throw new Error('Auto-save requires Chrome or Edge. Your browser does not support folder access.');
    }
    const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
    _dirHandle = handle;
    await storeHandle(handle);
    return handle.name;
  }

  /** Remove the saved folder (user opt-out). */
  async function forget() {
    _dirHandle = null;
    await clearHandle();
  }

  /**
   * Save a PDF to:
   *   [root] / [projectName] / [formType] / YYYY-MM-DD_Form-Type.pdf
   *
   * @param {ArrayBuffer|Uint8Array} pdfBuffer  Raw PDF bytes
   * @param {string} formType      e.g. "Daily Tailgate"
   * @param {string} projectName   e.g. "King & Spadina"
   * @param {string} date          ISO date string "YYYY-MM-DD"
   * @returns {string|null}  Display path, or null if no folder is set / unsupported
   */
  async function save(pdfBuffer, formType, projectName, date) {
    if (!isSupported() || !_dirHandle) return null;

    // Re-verify permission (may prompt user after a page reload)
    const ok = await verifyPermission(_dirHandle);
    if (!ok) throw new Error('Permission to write to the save folder was denied.');

    // Sanitize names — remove characters Windows disallows in paths
    const san = s => (s || 'Unknown').replace(/[\\/:*?"<>|]/g, '-').trim().slice(0, 80);

    const projectFolder = san(projectName);
    const typeFolder    = san(formType);
    const safeName      = san(formType).replace(/\s+/g, '-');
    const fileName      = `${date || 'undated'}_${safeName}.pdf`;

    // Create subdirectories (no-op if they already exist)
    const projDir = await _dirHandle.getDirectoryHandle(projectFolder, { create: true });
    const typeDir = await projDir.getDirectoryHandle(typeFolder,    { create: true });

    // Write the PDF
    const fileHandle = await typeDir.getFileHandle(fileName, { create: true });
    const writable   = await fileHandle.createWritable();
    await writable.write(pdfBuffer);
    await writable.close();

    return `${_dirHandle.name}/${projectFolder}/${typeFolder}/${fileName}`;
  }

  return { isSupported, init, pick, forget, save, getHandle, getLabel };
})();
