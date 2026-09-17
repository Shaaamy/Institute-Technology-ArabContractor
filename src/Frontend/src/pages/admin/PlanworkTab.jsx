/**
 * PlanworkTab.jsx — FilesSection updated to match real API:
 * GET  /api/admin/AdminPlanFiles/{planId}
 *      → [{ planId, fileId, fileTitle, fileName (full blob URL), filePeriorty, planworkName }]
 * POST /api/admin/AdminPlanFiles          (FormData: planId, file, fileTitle, filePeriorty)
 * PUT  /api/admin/AdminPlanFiles/{fileId} (FormData: file?, fileTitle, filePeriorty)
 * DELETE /api/admin/AdminPlanFiles/{fileId}
 */

import React, { useState, useRef, useEffect } from 'react';
import { T } from "../../components/admin/constants";

const BASE_URL = 'https://acwebsite-icmet-test.azurewebsites.net';

// ── Auth token ────────────────────────────────────────────────────────────────
async function getToken() {
    try { if (window.Clerk?.session) return await window.Clerk.session.getToken(); } catch (_) { }
    return null;
}
async function authHeaders(isFormData = false) {
    const token = await getToken();
    const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
}

// ── Field mapping ─────────────────────────────────────────────────────────────
function apiToForm(item) {
    return {
        id: item.childId ?? item.id ?? 0,
        parentId: item.parentId ?? null,
        priority: item.priority ?? '',
        days: item.courseDays ?? '',
        name: item.serviceTitle ?? '',
        slug: item.slug ?? '',
        sku: item.sku ?? '',
        show: item.mainFlag ?? false,
        hasDetails: item.detailsFlag ?? false,
        showOnHome: item.specialFlag ?? false,
        priceOnsite: item.planCost ?? '',
        isOnline: item.isOnline ?? false,
        onlineLink: item.onlineLink ?? '',
        onlineCost: item.onlineCost ?? '',
        description: item.courseDesc ?? '',
        place: item.coursePlace ?? '',
        date: item.courseDate ?? '',
        details: item.courseContent ?? '',
    };
}

function formToApi(form) {
    return {
        parentId: form.parentId ?? null,
        serviceTitle: form.name,
        priority: Number(form.priority) || 0,
        mainFlag: !!form.show,
        detailsFlag: !!form.hasDetails,
        specialFlag: !!form.showOnHome,
        courseDesc: form.description || null,
        coursePlace: form.place || null,
        courseDate: form.date || null,
        courseDays: form.days !== '' && form.days != null ? String(form.days) : null,
        courseContent: form.details || null,
        planCost: Number(form.priceOnsite) || 0,
        isOnline: !!form.isOnline,
        onlineLink: form.onlineLink || null,
        onlineCost: Number(form.onlineCost) || 0,
        slug: form.slug || null,
        sku: form.sku || null,
    };
}

function flattenTree(nodes, acc = []) {
    nodes.forEach(n => {
        acc.push({ id: n.id, label: n.title || n.label || '' });
        if (n.children?.length) flattenTree(n.children, acc);
    });
    return acc;
}

const BLANK = {
    id: 0, parentId: null, priority: '', days: '', name: '', slug: '', sku: '',
    show: false, hasDetails: false, showOnHome: false,
    priceOnsite: '', isOnline: false, onlineLink: '', onlineCost: '',
    description: '', place: '', date: '', details: ''
};

// FILE_BLANK matches the real API shape
const FILE_BLANK = { id: 0, planId: null, title: '', priority: '', file: null, fileUrl: null };

// ── Helpers ───────────────────────────────────────────────────────────────────
function textToHtml(text = '') {
    if (!text) return '';
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text.split('\n').map(l =>
        l ? `<div>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : '<div><br></div>'
    ).join('');
}
function wrapSelectionWithStyle(prop, val) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0), span = document.createElement('span');
    span.style[prop] = val;
    try { range.surroundContents(span); }
    catch { const f = range.extractContents(); span.appendChild(f); range.insertNode(span); }
    sel.removeAllRanges();
    const nr = document.createRange(); nr.selectNodeContents(span); sel.addRange(nr);
}
function getComputedAtCursor(editorEl, cssProp) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node = sel.anchorNode;
    while (node && node !== editorEl) {
        if (node.nodeType === 1) { const v = window.getComputedStyle(node)[cssProp]; if (v) return v; }
        node = node.parentNode;
    }
    return null;
}
function toSlug(str) {
    return str.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '').replace(/-+/g, '-').slice(0, 60);
}

const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];

// ── RichTextEditor (unchanged) ────────────────────────────────────────────────
function RichTextEditor({ icon, label, sub, name, value, onChange, placeholder, minHeight = 120 }) {
    const editorRef = useRef(null);
    const savedSelRef = useRef(null);
    const lastValueRef = useRef(null);
    const urlInputRef = useRef(null);
    const [fontColor, setFontColor] = useState('#0a0a0a');
    const [fontSize, setFontSize] = useState(14);
    const [urlOpen, setUrlOpen] = useState(false);
    const [urlValue, setUrlValue] = useState('');

    useEffect(() => {
        if (!editorRef.current || value === lastValueRef.current) return;
        editorRef.current.innerHTML = textToHtml(value);
        lastValueRef.current = value;
    }, [value]);
    useEffect(() => { if (urlOpen && urlInputRef.current) urlInputRef.current.focus(); }, [urlOpen]);
    useEffect(() => {
        if (!urlOpen) return;
        const h = e => { if (!e.target.closest('.lec-tb-url-wrap')) setUrlOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [urlOpen]);

    const saveSelection = () => { const s = window.getSelection(); if (s?.rangeCount > 0) savedSelRef.current = s.getRangeAt(0).cloneRange(); };
    const restoreSelection = () => { const s = window.getSelection(); if (s && savedSelRef.current) { s.removeAllRanges(); s.addRange(savedSelRef.current); } };
    const emitChange = () => { if (!editorRef.current) return; const h = editorRef.current.innerHTML; lastValueRef.current = h; onChange({ target: { name, value: h } }); };
    const exec = (cmd, val = null) => { editorRef.current?.focus(); document.execCommand(cmd, false, val); emitChange(); };
    const detectFontSize = () => {
        const fsVal = getComputedAtCursor(editorRef.current, 'fontSize');
        if (fsVal) { const px = Math.round(parseFloat(fsVal)); setFontSize(FONT_SIZES.reduce((p, c) => Math.abs(c - px) < Math.abs(p - px) ? c : p)); }
    };
    const handleFontSize = e => { const px = Number(e.target.value); setFontSize(px); restoreSelection(); editorRef.current?.focus(); wrapSelectionWithStyle('fontSize', `${px}px`); emitChange(); };
    const confirmUrl = () => {
        restoreSelection();
        const url = urlValue.trim();
        if (url && url !== 'https://') {
            exec('createLink', url);
            const sel = window.getSelection();
            if (sel?.anchorNode) { let node = sel.anchorNode; while (node && node !== editorRef.current) { if (node.nodeName === 'A') { node.target = '_blank'; node.rel = 'noopener noreferrer'; break; } node = node.parentNode; } }
        }
        setUrlOpen(false); emitChange();
    };

    return (
        <div className="lec-rte-block">
            <div className="lec-rte-hdr">
                <span className="lec-rte-icon">{icon}</span>
                <div style={{ flex: 1 }}><div className="lec-rte-label">{label}</div>{sub && <div className="lec-rte-sub">{sub}</div>}</div>
            </div>
            <div className="lec-rte-toolbar" onMouseDown={e => { if (e.target.tagName === 'SELECT') return; e.preventDefault(); }}>
                <button className="lec-tb-btn bold" onClick={() => exec('bold')}>B</button>
                <button className="lec-tb-btn italic" onClick={() => exec('italic')}>I</button>
                <button className="lec-tb-btn under" onClick={() => exec('underline')}>U</button>
                <div className="lec-rte-sep" />
                <div className="lec-tb-size-wrap">
                    <select className="lec-tb-select" value={fontSize} onChange={handleFontSize} onMouseDown={saveSelection}>
                        {FONT_SIZES.map(px => <option key={px} value={px}>{px}</option>)}
                    </select>
                    <span className="lec-tb-size-unit">px</span>
                </div>
                <div className="lec-rte-sep" />
                <div className="lec-tb-color-wrap">
                    <button className="lec-tb-color-btn" onMouseDown={saveSelection}>
                        <span className="color-letter" style={{ color: fontColor }}>A</span>
                        <span className="color-bar" style={{ background: fontColor }} />
                        <input type="color" className="lec-tb-color-input" value={fontColor} onChange={e => { const c = e.target.value; setFontColor(c); restoreSelection(); exec('foreColor', c); }} />
                    </button>
                </div>
                <div className="lec-rte-sep" />
                <div className="lec-tb-url-wrap">
                    <button className={`lec-tb-btn${urlOpen ? ' active' : ''}`} onClick={() => { saveSelection(); setUrlValue('https://'); setUrlOpen(true); }} onMouseDown={saveSelection}>🔗</button>
                    {urlOpen && (
                        <div className="lec-url-popover">
                            <input ref={urlInputRef} type="url" placeholder="https://example.com" value={urlValue} onChange={e => setUrlValue(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') confirmUrl(); if (e.key === 'Escape') { setUrlOpen(false); restoreSelection(); } }} />
                            <button className="lec-url-popover-ok" onClick={confirmUrl}>إدراج</button>
                            <button className="lec-url-popover-cancel" onClick={() => { setUrlOpen(false); restoreSelection(); }}>إلغاء</button>
                        </div>
                    )}
                </div>
                <button className="lec-tb-btn" onClick={() => exec('unlink')} onMouseDown={saveSelection} style={{ fontSize: '.7rem' }}>✂️</button>
            </div>
            <div ref={editorRef} contentEditable suppressContentEditableWarning className="lec-rte-editor"
                data-placeholder={placeholder} style={{ minHeight }} onInput={emitChange}
                onKeyDown={e => { if (e.ctrlKey || e.metaKey) { if (e.key === 'b') { e.preventDefault(); exec('bold'); } if (e.key === 'i') { e.preventDefault(); exec('italic'); } if (e.key === 'u') { e.preventDefault(); exec('underline'); } } }}
                onMouseUp={() => { saveSelection(); detectFontSize(); }} onKeyUp={() => { saveSelection(); detectFontSize(); }} />
        </div>
    );
}

// ── TreeNode (unchanged) ──────────────────────────────────────────────────────
function TreeNode({ node, selectedId, onSelect, depth = 0 }) {
    const [open, setOpen] = useState(depth === 0);
    const hasChildren = node.children && node.children.length > 0;
    const label = node.title || node.label || '';
    const depthClass = ['pw-tree-d0', 'pw-tree-d1', 'pw-tree-d2', 'pw-tree-d3'][Math.min(depth, 3)];
    return (
        <div>
            <div className={`pw-tree-row ${depthClass}${selectedId === node.id ? ' active' : ''}`}
                style={{ paddingRight: 10 + depth * 14 }}
                onClick={e => { e.stopPropagation(); onSelect(node); if (hasChildren) setOpen(o => !o); }}>
                <span className="pw-tree-toggle">{hasChildren ? (open ? '⊟' : '⊞') : ''}</span>
                <span className="pw-tree-label">{label}</span>
            </div>
            {hasChildren && open && (
                <div className={`pw-tree-children pw-children-d${Math.min(depth, 2)}`}>
                    {node.children.map(child => (
                        <TreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// FilesSection — UPDATED to match real API
// GET  /api/admin/AdminPlanFiles/{planId}
//   → [{ planId, fileId, fileTitle, fileName (full blob URL), filePeriorty, planworkName }]
// POST /api/admin/AdminPlanFiles
//   FormData: planId (int), File (binary), FileTitle, FilePeriorty
// PUT  /api/admin/AdminPlanFiles/{fileId}
//   FormData: File? (binary), FileTitle, FilePeriorty
// DELETE /api/admin/AdminPlanFiles/{fileId}
// ══════════════════════════════════════════════════════════════════════════════
function FilesSection({ planworkId, planworkName }) {
    const [files, setFiles] = useState([]);
    const [fileForm, setFileForm] = useState({ ...FILE_BLANK });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isNewFile, setIsNewFile] = useState(true);
    const [fileNotif, setFileNotif] = useState(null);
    const [fileDelConfirm, setFileDelConfirm] = useState(false);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [savingFile, setSavingFile] = useState(false);
    const [deletingFile, setDeletingFile] = useState(false);
    const fileInputRef = useRef(null);

    // Normalize raw API item → internal shape
    const normalize = raw => ({
        id: raw.fileId ?? raw.id,
        planId: raw.planId ?? planworkId,
        title: raw.fileTitle ?? raw.title ?? '',
        // fileName from API is already the full blob URL
        fileUrl: raw.fileName ?? raw.fileUrl ?? raw.url ?? null,
        priority: raw.filePeriorty ?? raw.filePriority ?? raw.priority ?? 1,
        file: null,
    });

    const loadFiles = async () => {
        setLoadingFiles(true);
        try {
            const res = await fetch(`${BASE_URL}/api/admin/AdminPlanFiles/${planworkId}`, {
                headers: await authHeaders(),
            });
            if (res.status === 404 || res.status === 204) { setFiles([]); return; }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setFiles((Array.isArray(data) ? data : []).map(normalize));
        } catch (_) {
            setFiles([]);
        } finally {
            setLoadingFiles(false);
        }
    };

    useEffect(() => {
        setFileForm({ ...FILE_BLANK, planId: planworkId });
        setSelectedFile(null);
        setIsNewFile(true);
        setFileDelConfirm(false);
        loadFiles();
    }, [planworkId]);

    const fileToast = (msg, type = 'success') => {
        setFileNotif({ msg, type });
        setTimeout(() => setFileNotif(null), 3000);
    };

    const pickFile = rec => {
        setSelectedFile(rec);
        setFileForm({ ...rec });
        setIsNewFile(false);
        setFileDelConfirm(false);
    };

    const handleFileInput = e => {
        const f = e.target.files[0];
        if (!f) return;
        setFileForm(prev => ({ ...prev, file: f }));
        e.target.value = '';
    };

    const handleFileSave = async () => {
        if (!fileForm.file && isNewFile) { fileToast('يجب اختيار ملف للرفع', 'error'); return; }
        if (!fileForm.title.trim()) { fileToast('عنوان الملف مطلوب', 'error'); return; }

        setSavingFile(true);
        try {
            const fd = new FormData();
            fd.append('FileTitle', fileForm.title.trim());
            fd.append('FilePeriorty', String(fileForm.priority || files.length + 1));

            if (isNewFile) {
                // POST — new file
                fd.append('planId', String(planworkId));
                if (fileForm.file) fd.append('File', fileForm.file);

                const res = await fetch(`${BASE_URL}/api/admin/AdminPlanFiles`, {
                    method: 'POST',
                    headers: await authHeaders(true),
                    body: fd,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                // Re-fetch to get the real fileId + blob URL
                await loadFiles();
                setFileForm({ ...FILE_BLANK, planId: planworkId });
                setSelectedFile(null);
                setIsNewFile(true);
                fileToast('تم رفع الملف بنجاح');
            } else {
                // PUT — update existing file
                if (fileForm.file) fd.append('File', fileForm.file);

                const res = await fetch(`${BASE_URL}/api/admin/AdminPlanFiles/${fileForm.id}`, {
                    method: 'PUT',
                    headers: await authHeaders(true),
                    body: fd,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                await loadFiles();
                fileToast('تم تحديث الملف بنجاح');
            }
        } catch (e) {
            fileToast('فشل الحفظ: ' + e.message, 'error');
        } finally {
            setSavingFile(false);
        }
    };

    const handleFileDelete = async () => {
        if (!fileDelConfirm) { setFileDelConfirm(true); return; }
        setDeletingFile(true);
        try {
            const res = await fetch(`${BASE_URL}/api/admin/AdminPlanFiles/${selectedFile.id}`, {
                method: 'DELETE',
                headers: await authHeaders(),
            });
            if (res.status !== 200 && res.status !== 204) throw new Error(`HTTP ${res.status}`);
            setFiles(prev => prev.filter(f => f.id !== selectedFile.id));
            setFileDelConfirm(false);
            setFileForm({ ...FILE_BLANK, planId: planworkId });
            setSelectedFile(null);
            setIsNewFile(true);
            fileToast('تم الحذف', 'error');
        } catch (e) {
            fileToast('فشل الحذف: ' + e.message, 'error');
        } finally {
            setDeletingFile(false);
        }
    };

    const sorted = [...files].sort((a, b) => Number(a.priority) - Number(b.priority));

    return (
        <div className="pw-files-section">
            <div className="pw-files-hdr">
                <span className="pw-files-icon">📎</span>
                <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <div className="pw-files-title">ملفات الخطة التدريبية</div>
                    <div className="pw-files-sub">{planworkName}</div>
                </div>
                <button onClick={loadFiles} disabled={loadingFiles} title="تحديث الملفات"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem', opacity: .6, marginLeft: 6 }}>
                    {loadingFiles ? '⏳' : '🔄'}
                </button>
                <span className="lec-count-badge" style={{ position: 'relative', zIndex: 1 }}>{files.length}</span>
            </div>

            {fileNotif && (
                <div className={`lec-notif lec-notif-${fileNotif.type}`} style={{ margin: '10px 14px 0' }}>
                    <span>{fileNotif.type === 'success' ? '✅' : fileNotif.type === 'error' ? '❌' : 'ℹ️'}</span>
                    {fileNotif.msg}
                </div>
            )}

            <div className="pw-files-body">
                {/* ── Form ── */}
                <div className="pw-files-form">

                    <div className="lec-field">
                        <label className="lec-label">الرقم</label>
                        <input className="lec-inp" value={isNewFile ? 'تلقائي' : fileForm.id} disabled
                            style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed', fontFamily: "'Courier New',monospace", fontSize: '.74rem' }} />
                    </div>

                    {/* File picker */}
                    <div className="lec-field">
                        <label className="lec-label">الملف {isNewFile && <span style={{ color: '#dc2626' }}>*</span>}</label>
                        <button className="pw-select-file-btn" onClick={() => fileInputRef.current.click()}
                            style={{ width: '100%', padding: '9px 14px', borderRadius: 3, border: `1.5px dashed ${T.gray300}`, background: T.gray50, cursor: 'pointer', fontFamily: 'inherit', fontSize: '.78rem', color: T.gray700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'border-color .18s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#f57c00'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = T.gray300}>
                            📂 {fileForm.file ? fileForm.file.name : 'اختر ملف للرفع'}
                        </button>
                        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileInput} />

                        {/* New file info */}
                        {fileForm.file && (
                            <div style={{ marginTop: 5, padding: '6px 10px', background: '#eff6ff', borderRadius: 4, fontSize: '.72rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #bfdbfe' }}>
                                <span>📄</span>
                                <span style={{ fontWeight: 600, flex: 1 }}>{fileForm.file.name}</span>
                                <span style={{ color: '#6b7280' }}>({(fileForm.file.size / 1024).toFixed(1)} KB)</span>
                                <button onClick={() => setFileForm(f => ({ ...f, file: null }))}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '.85rem', padding: 0 }}>✕</button>
                            </div>
                        )}

                        {/* Existing server file link */}
                        {!fileForm.file && fileForm.fileUrl && (
                            <div style={{ marginTop: 5, padding: '6px 10px', background: '#f0fdf4', borderRadius: 4, fontSize: '.72rem', color: '#059669', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>🔗</span>
                                <a href={fileForm.fileUrl} target="_blank" rel="noopener noreferrer"
                                    style={{ color: '#059669', textDecoration: 'underline', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    عرض الملف الحالي
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="lec-field">
                        <label className="lec-label">عنوان الملف <span style={{ color: '#dc2626' }}>*</span></label>
                        <input className="lec-inp" name="title" value={fileForm.title}
                            onChange={e => setFileForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="عنوان الملف..." />
                    </div>

                    <div className="lec-field">
                        <label className="lec-label">الترتيب</label>
                        <input className="lec-inp" name="priority" type="number" min="1" value={fileForm.priority}
                            onChange={e => setFileForm(f => ({ ...f, priority: e.target.value }))}
                            placeholder={`${files.length + 1}`} />
                    </div>

                    <div className="pw-files-actions">
                        <button className="lec-act-btn save" onClick={handleFileSave} disabled={savingFile}
                            style={{ padding: '7px 16px', fontSize: '.76rem' }}>
                            {savingFile ? '⏳ جاري الرفع...' : '💾 حفظ'}
                        </button>
                        <button className="lec-act-btn new"
                            onClick={() => { setFileForm({ ...FILE_BLANK, planId: planworkId }); setSelectedFile(null); setIsNewFile(true); setFileDelConfirm(false); }}
                            style={{ padding: '7px 16px', fontSize: '.76rem' }}>
                            ➕ جديد
                        </button>
                        {!isNewFile && (
                            fileDelConfirm
                                ? <>
                                    <button className="lec-act-btn delete" onClick={handleFileDelete} disabled={deletingFile}
                                        style={{ padding: '7px 14px', fontSize: '.74rem' }}>
                                        {deletingFile ? '⏳...' : 'تأكيد'}
                                    </button>
                                    <button className="adm-fclear" onClick={() => setFileDelConfirm(false)}>إلغاء</button>
                                </>
                                : <button className="lec-act-btn delete" onClick={handleFileDelete}
                                    style={{ padding: '7px 16px', fontSize: '.76rem' }}>
                                    🗑 حذف
                                </button>
                        )}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="pw-files-table-wrap">
                    {loadingFiles ? (
                        <div className="adm-empty" style={{ padding: '28px 12px' }}>
                            <div className="adm-emi">⏳</div><p>جاري تحميل الملفات...</p>
                        </div>
                    ) : sorted.length === 0 ? (
                        <div className="adm-empty" style={{ padding: '28px 12px' }}>
                            <div className="adm-emi">📂</div><p>لا توجد ملفات</p>
                        </div>
                    ) : (
                        <table className="pw-files-tbl">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>الترتيب</th>
                                    <th>العنوان</th>
                                    <th>الملف</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map(f => (
                                    <tr key={f.id} className={selectedFile?.id === f.id ? 'active' : ''} onClick={() => pickFile(f)}>
                                        <td style={{ fontFamily: "'Courier New',monospace", fontWeight: 900, color: T.blue }}>{f.id}</td>
                                        <td style={{ textAlign: 'center', color: T.gray500, fontSize: '.72rem' }}>{f.priority}</td>
                                        <td>{f.title || '—'}</td>
                                        <td>
                                            {f.fileUrl
                                                ? <a href={f.fileUrl} target="_blank" rel="noopener noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    style={{ color: T.blue, textDecoration: 'underline', fontSize: '.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <span>📄</span>
                                                    <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                                        {decodeURIComponent(f.fileUrl.split('/').pop().split('?')[0])}
                                                    </span>
                                                </a>
                                                : <span style={{ color: T.gray300, fontSize: '.7rem' }}>لا يوجد ملف</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── ParentSelector (unchanged) ────────────────────────────────────────────────
function ParentSelector({ parentId, onChange, allTreeNodes }) {
    return (
        <div className="pw-parent-wrap">
            <div style={{ flex: '0 0 80px' }}>
                <select className="lec-inp pw-parent-id-sel" value={parentId ?? ''}
                    onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}>
                    <option value="">—</option>
                    {allTreeNodes.map(m => <option key={m.id} value={m.id}>{m.id}</option>)}
                </select>
            </div>
            <div style={{ flex: 1 }}>
                <select className="lec-inp" value={parentId ?? ''}
                    onChange={e => { const found = allTreeNodes.find(m => m.id === Number(e.target.value)); onChange(found ? found.id : null); }}>
                    <option value="">— بدون أب (رئيسي) —</option>
                    {allTreeNodes.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
            </div>
            {parentId != null && <button className="pw-parent-clear" onClick={() => onChange(null)}>✕</button>}
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// PlanworkTab (main — unchanged logic, only FilesSection updated above)
// ══════════════════════════════════════════════════════════════════════════════
const PlanworkTab = () => {
    const [tree, setTree] = useState([]);
    const [allTreeNodes, setAllTreeNodes] = useState([]);
    const [records, setRecords] = useState([]);
    const [loadingTree, setLoadingTree] = useState(true);
    const [treeError, setTreeError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ ...BLANK });
    const [isNew, setIsNew] = useState(true);
    const [search, setSearch] = useState('');
    const [notification, setNotification] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [treeSelected, setTreeSelected] = useState(null);
    const [loadingRecord, setLoadingRecord] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadTree = async () => {
        setLoadingTree(true); setTreeError(null);
        try {
            const res = await fetch(`${BASE_URL}/api/admin/AdminPlanwork/tree`, { headers: await authHeaders() });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setTree(data); setAllTreeNodes(flattenTree(data));
        } catch (e) { setTreeError('فشل تحميل الشجرة: ' + e.message); }
        finally { setLoadingTree(false); }
    };
    useEffect(() => { loadTree(); }, []);

    const filtered = records.filter(r =>
        (r.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.description || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.place || '').toLowerCase().includes(search.toLowerCase())
    );

    const toast = (msg, type = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3500); };
    const pick = rec => { setSelected(rec); setForm({ ...rec }); setIsNew(false); setDeleteConfirm(false); };

    const handleTreeSelect = async (node) => {
        setTreeSelected(node);
        const cached = records.find(r => r.id === node.id);
        if (cached) { pick(cached); return; }
        setLoadingRecord(true);
        try {
            const res = await fetch(`${BASE_URL}/api/admin/AdminPlanwork/${node.id}`, { headers: await authHeaders() });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const rec = apiToForm(await res.json());
            setRecords(prev => [...prev, rec]);
            pick(rec);
        } catch (e) { toast('فشل تحميل البيانات: ' + e.message, 'error'); }
        finally { setLoadingRecord(false); }
    };

    const handleNew = () => {
        const parentId = treeSelected ? treeSelected.id : null;
        setForm({ ...BLANK, parentId }); setSelected(null); setIsNew(true); setDeleteConfirm(false);
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => {
            const updated = { ...f, [name]: type === 'checkbox' ? checked : value };
            if (name === 'name' && !f._slugManual) updated.slug = toSlug(value);
            if (name === 'slug') updated._slugManual = value.length > 0;
            return updated;
        });
    };

    const handleSave = async () => {
        if (!form.name.trim()) { toast('الأسم مطلوب', 'error'); return; }
        const clean = { ...form }; delete clean._slugManual;
        setSaving(true);
        try {
            if (isNew) {
                const res = await fetch(`${BASE_URL}/api/admin/AdminPlanwork`, {
                    method: 'POST', headers: await authHeaders(), body: JSON.stringify(formToApi(clean)),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const created = await res.json().catch(() => ({}));
                const newId = typeof created === 'number' ? created : (created?.childId ?? created?.id ?? created?.Id ?? null);
                let newRec;
                if (newId) {
                    const fresh = await fetch(`${BASE_URL}/api/admin/AdminPlanwork/${newId}`, { headers: await authHeaders() });
                    newRec = apiToForm(await fresh.json());
                } else { newRec = apiToForm({ ...formToApi(clean), ...created }); }
                setRecords(prev => [...prev, newRec]); pick(newRec);
                setTreeSelected({ id: newRec.id, title: newRec.name });
                toast('تم الإضافة'); await loadTree();
            } else {
                const res = await fetch(`${BASE_URL}/api/admin/AdminPlanwork/${clean.id}`, {
                    method: 'PUT', headers: await authHeaders(), body: JSON.stringify(formToApi(clean)),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const fresh = await fetch(`${BASE_URL}/api/admin/AdminPlanwork/${clean.id}`, { headers: await authHeaders() });
                const rec = apiToForm(await fresh.json());
                setRecords(prev => prev.map(r => r.id === rec.id ? rec : r)); pick(rec);
                toast('تم الحفظ'); await loadTree();
            }
        } catch (e) { toast('فشل الحفظ: ' + e.message, 'error'); }
        finally { setSaving(false); }
    };

    const handleReset = () => { if (isNew) setForm({ ...BLANK }); else setForm({ ...selected }); setDeleteConfirm(false); toast('تم الإلغاء', 'info'); };

    const handleDelete = async () => {
        if (!deleteConfirm) { setDeleteConfirm(true); return; }
        setDeleting(true);
        try {
            const res = await fetch(`${BASE_URL}/api/admin/AdminPlanwork/${selected.id}`, { method: 'DELETE', headers: await authHeaders() });
            if (res.status !== 200 && res.status !== 204) throw new Error(`HTTP ${res.status}`);
            setRecords(records.filter(r => r.id !== selected.id));
            setDeleteConfirm(false); setSelected(null); setForm({ ...BLANK }); setIsNew(true); setTreeSelected(null);
            toast('تم الحذف', 'error'); await loadTree();
        } catch (e) { toast('فشل الحذف: ' + e.message, 'error'); setDeleteConfirm(false); }
        finally { setDeleting(false); }
    };

    const parentName = form.parentId != null ? (allTreeNodes.find(n => n.id === form.parentId)?.label || `#${form.parentId}`) : null;
    const Field = ({ label, children, full }) => (
        <div className="lec-field" style={full ? { gridColumn: '1/-1' } : {}}>
            <label className="lec-label">{label}</label>{children}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {notification && (
                <div className={`lec-notif lec-notif-${notification.type}`} style={{ marginBottom: 12 }}>
                    <span>{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
                    {notification.msg}
                </div>
            )}
            <div className="lec-layout" style={{ alignItems: 'stretch' }}>

                {/* LEFT PANEL */}
                <div className="lec-panel pw-left-panel" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div className="lec-panel-hdr" style={{ flexShrink: 0 }}>
                        <span className="lec-count-badge">{filtered.length}</span>
                        <span style={{ fontWeight: 800, fontSize: '.8rem', color: '#0a0a0a', flex: 1, textAlign: 'center' }}>خطة العمل</span>
                        <button className="lec-new-btn" onClick={handleNew}>+ جديد</button>
                    </div>
                    <div className="pw-tree-panel" style={{ borderTop: 'none', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div className="pw-tree-header" style={{ flexShrink: 0 }}>
                            خطه المعهد
                            {treeSelected && (
                                <span className="pw-tree-selected-badge">
                                    ← {(treeSelected.title || treeSelected.label || '').slice(0, 22)}
                                    {(treeSelected.title || treeSelected.label || '').length > 22 ? '…' : ''}
                                </span>
                            )}
                            <button onClick={loadTree} disabled={loadingTree} title="تحديث"
                                style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.8rem', opacity: .6 }}>
                                {loadingTree ? '⏳' : '🔄'}
                            </button>
                        </div>
                        {treeError && (
                            <div style={{ padding: '10px 14px', color: '#dc2626', fontSize: '.76rem', flexShrink: 0 }}>
                                {treeError}
                                <button onClick={loadTree} style={{ marginRight: 8, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.76rem' }}>إعادة المحاولة</button>
                            </div>
                        )}
                        <div className="pw-tree-scroll" style={{ flex: 1, overflowY: 'auto' }}>
                            {loadingTree
                                ? <div style={{ padding: 24, textAlign: 'center', color: '#6b7280', fontSize: '.8rem' }}>⏳ جاري التحميل...</div>
                                : tree.map(node => <TreeNode key={node.id} node={node} selectedId={treeSelected?.id} onSelect={handleTreeSelect} />)}
                        </div>
                        {treeSelected && (
                            <div className="pw-tree-footer" style={{ flexShrink: 0 }}>
                                <span style={{ fontSize: '.7rem', color: '#6b7280' }}>الأب المحدد:</span>
                                <span className="pw-tree-footer-name">{treeSelected.title || treeSelected.label || ''}</span>
                                <button className="pw-tree-footer-clear" onClick={() => setTreeSelected(null)}>✕ إلغاء</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* FORM AREA */}
                <div className="lec-form-wrap" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <div className="adm-card lec-form-card">
                        <div className="lec-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6, position: 'relative', zIndex: 1 }}>
                                    {isNew ? 'سجل جديد' : `ID: #${selected?.id}`}
                                    {form.parentId != null && <span style={{ marginRight: 8, fontSize: '.72rem', opacity: .8 }}>↳ {parentName}</span>}
                                </div>
                                <h2 className="lec-form-title">{isNew ? '➕ إضافة سجل جديد' : '✏️ تعديل بيانات خطة العمل'}</h2>
                                {!isNew && selected && <p className="lec-form-sub">{selected.name}</p>}
                            </div>
                            <div className="lec-stat-pill">📋 {records.length} سجل</div>
                        </div>

                        {loadingRecord ? (
                            <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>⏳ جاري تحميل البيانات...</div>
                        ) : (
                            <div className="lec-form-body">
                                <div className="lec-fields-grid" style={{ marginBottom: 20 }}>
                                    <Field label="الرقم">
                                        <input className="lec-inp" value={isNew ? 'تلقائي' : form.id} disabled style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }} />
                                    </Field>
                                    <div className="lec-field pw-parent-field">
                                        <label className="lec-label">أساسى (الأب)</label>
                                        <ParentSelector parentId={form.parentId} onChange={v => setForm(f => ({ ...f, parentId: v }))} allTreeNodes={allTreeNodes} />
                                    </div>
                                    <Field label="الأولويه"><input className="lec-inp" name="priority" type="number" min="1" value={form.priority} onChange={handleChange} placeholder="الأولويه..." /></Field>
                                    <Field label="عدد الأيام"><input className="lec-inp" name="days" type="number" min="1" value={form.days} onChange={handleChange} placeholder="عدد الأيام..." /></Field>
                                    <Field label="الأسم" full><input className="lec-inp" name="name" value={form.name} onChange={handleChange} placeholder="الأسم..." /></Field>
                                    <Field label="Slug" full>
                                        <input className="lec-inp" name="slug" value={form.slug || ''} onChange={handleChange} placeholder="auto-generated-slug"
                                            style={{ direction: 'ltr', textAlign: 'right', fontFamily: "'Courier New',monospace", fontSize: '.76rem' }} />
                                    </Field>
                                    <Field label="SKU">
                                        <input className="lec-inp" name="sku" value={form.sku || ''} onChange={handleChange} placeholder="SKU-001"
                                            style={{ direction: 'ltr', textAlign: 'right', fontFamily: "'Courier New',monospace", fontSize: '.76rem' }} />
                                    </Field>
                                    <Field label="السعر (حضوري)">
                                        <input className="lec-inp" name="priceOnsite" type="number" min="0" value={form.priceOnsite} onChange={handleChange} placeholder="السعر الحضوري..." />
                                    </Field>
                                    <Field label="أونلاين">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1.5px solid #d0d3d8', borderRadius: 3, background: '#fff' }}>
                                            <input type="checkbox" name="isOnline" checked={!!form.isOnline} onChange={handleChange}
                                                style={{ width: 16, height: 16, accentColor: T.orange, cursor: 'pointer' }} />
                                            <label style={{ fontSize: '.8rem', fontWeight: 700, color: '#374151', cursor: 'pointer' }}>متاح أونلاين</label>
                                        </div>
                                    </Field>
                                    {form.isOnline && (
                                        <>
                                            <Field label="رابط الأونلاين" full>
                                                <input className="lec-inp" name="onlineLink" value={form.onlineLink || ''} onChange={handleChange}
                                                    placeholder="https://zoom.us/..." style={{ direction: 'ltr', textAlign: 'right' }} />
                                            </Field>
                                            <Field label="السعر (أونلاين)">
                                                <input className="lec-inp" name="onlineCost" type="number" min="0" value={form.onlineCost} onChange={handleChange} placeholder="السعر الأونلاين..." />
                                            </Field>
                                        </>
                                    )}
                                    <Field label="المكان"><input className="lec-inp" name="place" value={form.place} onChange={handleChange} placeholder="المكان..." /></Field>
                                    <Field label="التاريخ">
                                        <input className="lec-inp" name="date" type="date" value={form.date} onChange={handleChange} style={{ direction: 'ltr', textAlign: 'right' }} />
                                    </Field>
                                    <Field label="الوصف" full><input className="lec-inp" name="description" value={form.description} onChange={handleChange} placeholder="الوصف..." /></Field>
                                    <div className="lec-field" style={{ gridColumn: '1/-1' }}>
                                        <label className="lec-label">الخيارات</label>
                                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: '10px 12px', border: '1.5px solid #d0d3d8', borderRadius: 3, background: '#fff' }}>
                                            {[{ name: 'show', label: 'عرض' }, { name: 'hasDetails', label: 'له تفاصيل' }, { name: 'showOnHome', label: 'عرض على الصفحه الرئيسيه' }].map(cb => (
                                                <label key={cb.name} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: '.8rem', fontWeight: 700, color: '#374151' }}>
                                                    <input type="checkbox" name={cb.name} checked={!!form[cb.name]} onChange={handleChange}
                                                        style={{ width: 16, height: 16, accentColor: T.orange, cursor: 'pointer' }} />
                                                    {cb.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="lec-divider" />
                                <RichTextEditor icon="📄" label="تفاصيل الكورس"
                                    sub="حدد النص أولاً ثم اختر الحجم أو اللون من شريط الأدوات"
                                    name="details" value={form.details} onChange={handleChange}
                                    placeholder="أدخل تفاصيل الكورس هنا..." minHeight={150} />

                                <div className="lec-actions">
                                    <button className="lec-act-btn save" onClick={handleSave} disabled={saving || deleting}>{saving ? '⏳ جاري الحفظ...' : '💾 حفظ'}</button>
                                    <button className="lec-act-btn new" onClick={handleNew}>➕ سجل جديد</button>
                                    <button className="lec-act-btn reset" onClick={handleReset}>↩ إلغاء</button>
                                    <div style={{ flex: 1 }} />
                                    {!isNew && (
                                        deleteConfirm
                                            ? <div className="lec-delete-confirm">
                                                <span className="lec-delete-warn">⚠️ هل أنت متأكد؟</span>
                                                <button className="lec-act-btn delete" onClick={handleDelete} disabled={deleting}>{deleting ? '⏳...' : 'تأكيد الحذف'}</button>
                                                <button className="adm-fclear" onClick={() => setDeleteConfirm(false)}>إلغاء</button>
                                            </div>
                                            : <button className="lec-act-btn delete" onClick={handleDelete}>🗑 حذف السجل</button>
                                    )}
                                </div>

                                <div className="lec-divider" style={{ marginTop: 8 }} />
                                {!isNew && selected && <FilesSection planworkId={selected.id} planworkName={selected.name} />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanworkTab;