// helpers.js
// ─────────────────────────────────────────────────────────────────────────────
import { API_HOST } from './constants';

export function fmtDate(val) {
    if (!val) return '';
    try {
        const d = new Date(val);
        if (isNaN(d.getTime())) return String(val);
        return d.toISOString().split('T')[0];
    } catch { return String(val); }
}

export function toStatusKey(s) {
    if (!s) return 'Pending';
    const map = {
        pending: 'Pending',
        approved: 'Approved',
        sent: 'Sent',
        sent_to_bank: 'Sent',
        rejected: 'Rejected',
    };
    return map[String(s).toLowerCase()] ?? s;
}

/**
 * Resolves a certificate URL from the API.
 *
 * The backend now returns fileUrl in two forms:
 *   1. Absolute blob URL  → "https://acwebappbackup.blob.core.windows.net/icemt/certificates/..."
 *      (from GET /api/Admin/certificates/{userId}/{planworkId})
 *   2. Relative API path  → "/api/Admin/certificates/download/{guid}.jpg"
 *      (from GET /api/Admin/certificates  — all certs list)
 *
 * Both must resolve to a usable URL for <img>, <iframe>, and download links.
 */
export function resolveCertUrl(url) {
    if (!url) return null;
    if (url === 'uploaded') return null;                          // legacy sentinel — no real URL
    if (url.startsWith('https://') || url.startsWith('http://')) return url;  // already absolute (blob URL)
    if (url.startsWith('/')) return `${API_HOST}${url}`;          // relative path → prepend host
    return `${API_HOST}/${url}`;                                  // safety fallback
}

/** Normalise a raw cert object from the API into a consistent shape. */
export function normaliseCert(raw) {
    if (!raw) return null;
    // The API uses fileUrl as the primary field (confirmed from Swagger screenshots)
    const rawUrl = raw.fileUrl ?? raw.url ?? raw.filePath ?? raw.path ?? raw.downloadUrl ?? null;
    const url = resolveCertUrl(rawUrl);
    return {
        ...raw,
        url,          // resolved, always-absolute URL (or null)
        rawUrl,       // original value from API
        name: raw.fileName ?? raw.filename ?? raw.name ?? null,
        uploadedAt: raw.uploadedAt ? fmtDate(raw.uploadedAt) : null,
    };
}

/** Reverse both headers and every row so Excel/PDF exports read RTL. */
export function rtlExport(headers, rows) {
    return {
        headers: [...headers].reverse(),
        rows: rows.map(r => [...r].reverse()),
    };
}

export function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

let _logoCache = null;
export function getLogoBase64(logoSrc) {
    return new Promise(resolve => {
        if (_logoCache) { resolve(_logoCache); return; }
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const c = document.createElement('canvas');
                c.width = img.naturalWidth || 300;
                c.height = img.naturalHeight || 200;
                c.getContext('2d').drawImage(img, 0, 0);
                _logoCache = c.toDataURL('image/png');
                resolve(_logoCache);
            } catch { resolve(null); }
        };
        img.onerror = () => resolve(null);
        img.src = logoSrc;
    });
}