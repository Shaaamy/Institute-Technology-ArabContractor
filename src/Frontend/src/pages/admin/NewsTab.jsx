/**
 * NewsTab.jsx — Fixed version
 *
 * Key fixes:
 * 1. Detail GET returns images[] array with { picId, imageUrl, isMain } — parse that
 * 2. Detail GET uses publishedAt not date
 * 3. showFlag not in detail response — keep from list or default true
 * 4. Delete image uses correct picId from images[]
 * 5. buildFormData updated to match actual API fields
 *
 * API:
 * GET    /api/admin/AdminNews/getAllNews?PageIndex=1&PageSize=100
 * GET    /api/admin/AdminNews/{id}
 * POST   /api/admin/AdminNews  (FormData)
 * PUT    /api/admin/AdminNews/{id}  (FormData)
 * DELETE /api/admin/AdminNews/{id}
 * DELETE /api/admin/AdminNews/{newsId}/images/{picId}
 */

import { useState, useRef, useEffect, useCallback } from "react";

const BASE = "https://acwebsite-icmet-test.azurewebsites.net";

const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueLight: '#1a84d4', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray50: '#f8f9fa', gray100: '#f0f1f2', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
};

const BLANK = { id: 0, date: '', title: '', details: '', showFlag: true };

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDateAr(dateStr) {
    if (!dateStr) return '—';
    try { return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return dateStr; }
}
function toInputDate(dateStr) {
    if (!dateStr) return '';
    try { return new Date(dateStr).toISOString().slice(0, 10); } catch { return ''; }
}
function resolveImg(url) {
    if (!url || url === 'N/A' || url === 'pending') return null;
    if (url.startsWith('http')) return url;
    return `${BASE}/${url.replace(/^\//, '')}`;
}
function previewSnippet(text, len = 55) {
    if (!text) return '—';
    return text.length > len ? text.slice(0, len) + '…' : text;
}

// ── ActiveToggle ──────────────────────────────────────────────────────────────
function ActiveToggle({ value, onChange }) {
    return (
        <label className="nt-toggle-wrap" title={value ? 'مرئي — اضغط للإخفاء' : 'مخفي — اضغط للإظهار'}>
            <div className={`nt-toggle-track${value ? ' on' : ''}`} onClick={() => onChange(!value)}>
                <div className="nt-toggle-thumb" />
            </div>
            <span className={`nt-toggle-label${value ? ' on' : ' off'}`}>
                {value ? '👁 مرئي' : '🙈 مخفي'}
            </span>
        </label>
    );
}

// ── RichTextEditor ─────────────────────────────────────────────────────────────
const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];

function textToHtml(text = '') {
    if (!text) return '';
    // Already HTML — don't double-wrap
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text.split('\n').map(line =>
        line ? `<div>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : '<div><br></div>'
    ).join('');
}
function wrapSelectionWithStyle(property, value) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style[property] = value;
    try { range.surroundContents(span); }
    catch { const f = range.extractContents(); span.appendChild(f); range.insertNode(span); }
    sel.removeAllRanges();
    const nr = document.createRange();
    nr.selectNodeContents(span);
    sel.addRange(nr);
}
function getComputedAtCursor(editorEl, cssProp) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node = sel.anchorNode;
    while (node && node !== editorEl) {
        if (node.nodeType === 1) {
            const val = window.getComputedStyle(node)[cssProp];
            if (val) return val;
        }
        node = node.parentNode;
    }
    return null;
}

function RichTextEditor({ icon, label, sub, name, value, onChange, placeholder, minHeight = 180 }) {
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
        const h = e => { if (!e.target.closest('.nt-rte-url-wrap')) setUrlOpen(false); };
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
        <div className="nt-rte-block">
            <div className="nt-rte-hdr">
                <span className="nt-rte-icon">{icon}</span>
                <div style={{ flex: 1 }}><div className="nt-rte-label">{label}</div>{sub && <div className="nt-rte-sub">{sub}</div>}</div>
            </div>
            <div className="nt-rte-toolbar" onMouseDown={e => { if (e.target.tagName === 'SELECT') return; e.preventDefault(); }}>
                <button className="nt-tb-btn bold" onClick={() => exec('bold')}>B</button>
                <button className="nt-tb-btn italic" onClick={() => exec('italic')}>I</button>
                <button className="nt-tb-btn under" onClick={() => exec('underline')}>U</button>
                <div className="nt-rte-sep" />
                <div className="nt-tb-size-wrap">
                    <select className="nt-tb-select" value={fontSize} onChange={handleFontSize} onMouseDown={saveSelection}>
                        {FONT_SIZES.map(px => <option key={px} value={px}>{px}</option>)}
                    </select>
                    <span className="nt-tb-size-unit">px</span>
                </div>
                <div className="nt-rte-sep" />
                <div className="nt-tb-color-wrap">
                    <button className="nt-tb-color-btn" onMouseDown={saveSelection}>
                        <span className="nt-color-letter" style={{ color: fontColor }}>A</span>
                        <span className="nt-color-bar" style={{ background: fontColor }} />
                        <input type="color" className="nt-tb-color-input" value={fontColor}
                            onChange={e => { const c = e.target.value; setFontColor(c); restoreSelection(); exec('foreColor', c); }} />
                    </button>
                </div>
                <div className="nt-rte-sep" />
                <div className="nt-rte-url-wrap">
                    <button className={`nt-tb-btn${urlOpen ? ' active' : ''}`}
                        onClick={() => { saveSelection(); setUrlValue('https://'); setUrlOpen(true); }}
                        onMouseDown={saveSelection}>🔗</button>
                    {urlOpen && (
                        <div className="nt-url-popover">
                            <input ref={urlInputRef} type="url" placeholder="https://example.com" value={urlValue}
                                onChange={e => setUrlValue(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') confirmUrl(); if (e.key === 'Escape') { setUrlOpen(false); restoreSelection(); } }} />
                            <button className="nt-url-ok" onClick={confirmUrl}>إدراج</button>
                            <button className="nt-url-cancel" onClick={() => { setUrlOpen(false); restoreSelection(); }}>إلغاء</button>
                        </div>
                    )}
                </div>
                <button className="nt-tb-btn" onClick={() => exec('unlink')} onMouseDown={saveSelection} style={{ fontSize: '.7rem' }}>✂️</button>
            </div>
            <div ref={editorRef} contentEditable suppressContentEditableWarning className="nt-rte-editor"
                data-placeholder={placeholder} style={{ minHeight }} onInput={emitChange}
                onKeyDown={e => { if (e.ctrlKey || e.metaKey) { if (e.key === 'b') { e.preventDefault(); exec('bold'); } if (e.key === 'i') { e.preventDefault(); exec('italic'); } if (e.key === 'u') { e.preventDefault(); exec('underline'); } } }}
                onMouseUp={() => { saveSelection(); detectFontSize(); }} onKeyUp={() => { saveSelection(); detectFontSize(); }} />
        </div>
    );
}

// ── MultiImageUploader ────────────────────────────────────────────────────────
function MultiImageUploader({ images, onChange, newsId, onServerImageDeleted }) {
    const fileRef = useRef();
    const [dragOver, setDragOver] = useState(false);
    const [deletingPicId, setDeletingPicId] = useState(null);

    const addFiles = (files) => {
        const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (!valid.length) return;
        onChange([...images, ...valid.map(file => ({ file, previewSrc: URL.createObjectURL(file), serverUrl: null, picId: null }))]);
    };

    const removeImage = async (idx) => {
        const img = images[idx];
        // New unsaved file — remove locally only
        if (img.file || !img.picId || !newsId) {
            onChange(images.filter((_, i) => i !== idx));
            return;
        }
        // Persisted image — DELETE /api/admin/AdminNews/{newsId}/images/{picId}
        setDeletingPicId(img.picId);
        try {
            await apiFetch(`/api/admin/AdminNews/${newsId}/images/${img.picId}`, { method: 'DELETE' });
            onChange(images.filter((_, i) => i !== idx));
            if (onServerImageDeleted) onServerImageDeleted('تم حذف الصورة بنجاح');
        } catch (e) {
            if (onServerImageDeleted) onServerImageDeleted('فشل حذف الصورة: ' + e.message, 'error');
        } finally {
            setDeletingPicId(null);
        }
    };

    const setMain = (idx) => {
        if (idx === 0) return;
        const next = [...images];
        const [picked] = next.splice(idx, 1);
        next.unshift(picked);
        onChange(next);
    };
    const replaceFile = (idx, file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const next = [...images];
        next[idx] = { file, previewSrc: URL.createObjectURL(file), serverUrl: null, picId: null };
        onChange(next);
    };

    return (
        <div className="nt-multi-img-wrap">
            <div className="nt-label" style={{ marginBottom: 8 }}>
                صور الخبر
                <span style={{ marginRight: 8, fontSize: '.65rem', color: T.gray500, fontWeight: 400 }}>
                    الصورة الأولى هي الصورة الرئيسية
                </span>
            </div>
            {images.length > 0 && (
                <div className="nt-imgs-grid">
                    {images.map((img, idx) => (
                        <MultiImageSlot key={idx} img={img} idx={idx} isMain={idx === 0}
                            isDeleting={deletingPicId === img.picId && img.picId != null}
                            onRemove={() => removeImage(idx)}
                            onSetMain={() => setMain(idx)}
                            onReplace={(file) => replaceFile(idx, file)} />
                    ))}
                </div>
            )}
            <div className={`nt-img-zone${dragOver ? ' over' : ''}`}
                style={{ minHeight: 72, marginTop: images.length ? 12 : 0 }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                onClick={() => fileRef.current.click()}>
                <div className="nt-img-placeholder" style={{ padding: '14px 12px' }}>
                    <div style={{ fontSize: '1.6rem' }}>🖼️</div>
                    <span className="nt-img-hint">{images.length === 0 ? 'اسحب الصور هنا أو اضغط للاختيار' : '+ إضافة صور أخرى'}</span>
                    <span className="nt-img-types">JPG · PNG · WEBP</span>
                </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
        </div>
    );
}

function MultiImageSlot({ img, idx, isMain, isDeleting, onRemove, onSetMain, onReplace }) {
    const fileRef = useRef();
    return (
        <div className={`nt-img-slot${isMain ? ' main' : ''}${isDeleting ? ' deleting' : ''}`}>
            {isDeleting && <div className="nt-slot-deleting-overlay">⏳</div>}
            <img src={img.previewSrc} alt={`صورة ${idx + 1}`} className="nt-slot-img" />
            {isMain && <div className="nt-main-badge">⭐ رئيسية</div>}
            {img.file && <div className="nt-new-badge-slot">جديدة</div>}
            {!img.file && img.serverUrl && <div className="nt-server-badge-slot">{isMain ? '⭐ محفوظة' : 'محفوظة'}</div>}
            <div className="nt-slot-actions">
                {!isMain && <button className="nt-slot-btn promote" onClick={onSetMain} disabled={isDeleting}>⭐</button>}
                <button className="nt-slot-btn replace" onClick={() => fileRef.current.click()} disabled={isDeleting}>🔄</button>
                <button className="nt-slot-btn remove" onClick={onRemove} disabled={isDeleting}>✕</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { onReplace(e.target.files[0]); e.target.value = ''; }} />
        </div>
    );
}

// ── CSS ────────────────────────────────────────────────────────────────────────
const CSS = `
.nt-layout {
    display: flex;
    direction: rtl;
    gap: 16px;
    align-items: stretch;
}
.nt-left-panel {
    width: clamp(230px, 26vw, 290px);
    flex-shrink: 0;
    background: #fff;
    border-radius: 3px;
    border: 1.5px solid #d0d3d8;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 120px);
    overflow-y: auto;
}
.nt-form-wrap {
    flex: 1;
    min-width: 0;
    height: calc(100vh - 120px);
    overflow-y: auto;
}
.nt-left-panel::-webkit-scrollbar,
.nt-form-wrap::-webkit-scrollbar { width: 4px; }
.nt-left-panel::-webkit-scrollbar-thumb,
.nt-form-wrap::-webkit-scrollbar-thumb { background: rgba(245,124,0,.35); border-radius: 2px; }

.nt-panel-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px 10px;
    border-bottom: 1.5px solid #f0f1f2;
    flex-shrink: 0;
    gap: 8px;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 5;
}
.nt-brand-icon {
    width: 36px; height: 36px; border-radius: 3px;
    background: linear-gradient(135deg, #0865a8, #1a84d4);
    display: flex; align-items: center; justify-content: center;
    font-size: .9rem; color: #bfdbfe;
    border: 1.5px solid rgba(8,101,168,.25); flex-shrink: 0;
}
.nt-brand-name { font-size: .78rem; font-weight: 800; color: #0a0a0a; }
.nt-brand-sub { font-size: .64rem; color: #6b7280; margin-top: 2px; }

.nt-search-wrap { padding: 10px 12px 6px; flex-shrink: 0; position: relative; }
.nt-search-wrap input {
    width: 100%; padding: 8px 32px 8px 12px;
    background: #fff; border: 1.5px solid #d0d3d8;
    border-radius: 3px; color: #0a0a0a;
    font-family: inherit; font-size: .76rem;
    direction: rtl; outline: none; box-sizing: border-box;
}
.nt-search-wrap input::placeholder { color: #6b7280; }
.nt-search-wrap input:focus { border-color: #f57c00; box-shadow: 0 0 0 3px rgba(245,124,0,.1); }
.nt-search-icon { position: absolute; right: 22px; top: 50%; transform: translateY(-50%); font-size: .75rem; opacity: .4; pointer-events: none; }
.nt-search-clear { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #6b7280; font-size: 1rem; padding: 2px; }

.nt-list-hdr {
    padding: 4px 14px 8px;
    display: flex; align-items: center; justify-content: space-between;
    flex-shrink: 0;
}
.nt-count-badge {
    background: rgba(8,101,168,.1); color: #0865a8;
    border: 1.5px solid rgba(8,101,168,.25); border-radius: 2px;
    padding: 1px 9px; font-size: .66rem; font-weight: 900;
    font-family: 'Courier New', monospace;
}
.nt-new-btn {
    background: rgba(245,124,0,.1); color: #f57c00;
    border: 1.5px solid rgba(245,124,0,.35); border-radius: 2px;
    padding: 4px 12px; font-size: .72rem; font-weight: 800;
    cursor: pointer; font-family: inherit; transition: all .16s;
}
.nt-new-btn:hover { background: rgba(245,124,0,.18); }

.nt-list { flex: 1; overflow-y: auto; padding: 4px 8px 12px; }
.nt-list::-webkit-scrollbar { width: 4px; }
.nt-list::-webkit-scrollbar-thumb { background: rgba(245,124,0,.35); border-radius: 2px; }
.nt-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 3px; margin-bottom: 3px;
    cursor: pointer; border: 1.5px solid transparent;
    transition: background .13s, border-color .13s;
}
.nt-row:hover { background: rgba(8,101,168,.05); border-color: rgba(8,101,168,.12); }
.nt-row.active { background: rgba(245,124,0,.09); border-color: rgba(245,124,0,.35); border-right: 3px solid #f57c00; }
.nt-row-icon {
    width: 38px; height: 38px; border-radius: 3px;
    background: linear-gradient(135deg, #0865a8, #1a84d4);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; flex-shrink: 0;
    border: 1.5px solid rgba(8,101,168,.3); overflow: hidden;
}
.nt-row-info { overflow: hidden; flex: 1; }
.nt-row-title { color: #0a0a0a; font-size: .75rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nt-row-date { color: #6b7280; font-size: .63rem; margin-top: 2px; }
.nt-row-id {
    background: #f0f1f2; color: #6b7280; font-size: .6rem;
    padding: 2px 7px; border-radius: 2px; flex-shrink: 0;
    font-weight: 700; font-family: 'Courier New', monospace;
}
.nt-row-status { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; }
.nt-row-status.on { background: #16a34a; }
.nt-row-status.off { background: #d0d3d8; }
.nt-sidebar-footer {
    padding: 10px 14px; border-top: 1.5px solid #f0f1f2;
    text-align: center; font-size: .6rem; color: #6b7280;
    background: #fff; flex-shrink: 0;
}

.nt-form-card {
    background: #fff;
    border: 1.5px solid #d0d3d8;
    border-radius: 3px;
    margin-bottom: 0;
}
.nt-form-hdr {
    background: #044478; padding: 20px 26px;
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px;
    flex-wrap: wrap; position: relative; overflow: hidden;
}
.nt-form-hdr::before {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(245,124,0,.07) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(245,124,0,.07) 1px, transparent 1px);
    background-size: 36px 36px; pointer-events: none;
}
.nt-form-tag {
    display: inline-block; background: #f57c00; color: #fff;
    font-size: .7rem; font-weight: 700; padding: 4px 14px;
    border-radius: 2px; margin-bottom: 6px; position: relative; z-index: 1;
}
.nt-form-title { font-size: 1.1rem; font-weight: 900; color: #fff; margin: 0; position: relative; z-index: 1; }
.nt-form-sub { font-size: .72rem; color: rgba(255,255,255,.4); margin: 4px 0 0; position: relative; z-index: 1; }
.nt-stat-pill {
    display: inline-flex; align-items: center;
    padding: 5px 14px; border-radius: 2px;
    background: rgba(255,255,255,.08); border: 1.5px solid rgba(255,255,255,.15);
    color: rgba(255,255,255,.72); font-size: .72rem; font-weight: 700;
    position: relative; z-index: 1;
}
.nt-form-body { padding: 26px; }
.nt-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px; margin-bottom: 22px; }
.nt-field { display: flex; flex-direction: column; gap: 5px; }
.nt-label { font-size: .72rem; font-weight: 700; color: #374151; }
.nt-inp {
    border: 1.5px solid #d0d3d8; border-radius: 3px;
    padding: 9px 12px; font-size: .8rem; color: #0a0a0a;
    width: 100%; background: #fff; direction: rtl;
    font-family: inherit; transition: border .18s, box-shadow .18s;
    outline: none; box-sizing: border-box;
}
.nt-inp:focus { border-color: #f57c00; box-shadow: 0 0 0 3px rgba(245,124,0,.1); }
.nt-inp::placeholder { color: #6b7280; }
.nt-inp:disabled { background: #f0f1f2; color: #6b7280; cursor: not-allowed; }
.nt-divider { height: 1px; background: #f0f1f2; margin: 4px 0 20px; }

.nt-toggle-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; padding: 6px 0; }
.nt-toggle-track {
    width: 46px; height: 26px; border-radius: 13px;
    background: #d0d3d8; border: 1.5px solid #d0d3d8;
    position: relative; transition: background .22s, border-color .22s; flex-shrink: 0;
}
.nt-toggle-track.on { background: #16a34a; border-color: #16a34a; }
.nt-toggle-thumb {
    position: absolute; top: 2px; right: 2px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.25);
    transition: transform .22s cubic-bezier(.4,0,.2,1);
}
.nt-toggle-track.on .nt-toggle-thumb { transform: translateX(-20px); }
.nt-toggle-label { font-size: .76rem; font-weight: 800; }
.nt-toggle-label.on { color: #16a34a; }
.nt-toggle-label.off { color: #6b7280; }

.nt-img-zone {
    width: 100%; border-radius: 6px; border: 2px dashed #d0d3d8;
    background: #f8f9fa; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    cursor: pointer; position: relative;
    transition: border-color .18s, background .18s;
    box-sizing: border-box;
}
.nt-img-zone:hover, .nt-img-zone.over { border-color: #f57c00; background: rgba(245,124,0,.03); }
.nt-img-placeholder { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px 12px; }
.nt-img-hint { color: #6b7280; font-size: .68rem; font-weight: 600; text-align: center; }
.nt-img-types { color: #d0d3d8; font-size: .62rem; background: #f0f1f2; padding: 2px 10px; border-radius: 2px; }
.nt-multi-img-wrap { margin-bottom: 4px; }
.nt-imgs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px,1fr)); gap: 10px; margin-bottom: 4px; }
.nt-img-slot {
    position: relative; border-radius: 6px; overflow: hidden;
    border: 2px solid #d0d3d8; background: #000;
    aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center;
    transition: border-color .2s, box-shadow .2s;
}
.nt-img-slot.main { border-color: #f57c00; box-shadow: 0 0 0 3px rgba(245,124,0,.2); }
.nt-img-slot.deleting { opacity: .5; pointer-events: none; }
.nt-slot-deleting-overlay {
    position: absolute; inset: 0; z-index: 10;
    background: rgba(0,0,0,.5); display: flex;
    align-items: center; justify-content: center; font-size: 1.4rem;
}
.nt-slot-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nt-main-badge { position: absolute; top: 5px; right: 5px; background: #f57c00; color: #fff; font-size: .55rem; font-weight: 800; padding: 2px 8px; border-radius: 3px; pointer-events: none; z-index: 2; }
.nt-new-badge-slot { position: absolute; top: 5px; left: 5px; background: #f59e0b; color: #fff; font-size: .52rem; font-weight: 800; padding: 2px 6px; border-radius: 3px; pointer-events: none; z-index: 2; }
.nt-server-badge-slot { position: absolute; top: 5px; left: 5px; background: #0865a8; color: #fff; font-size: .52rem; font-weight: 800; padding: 2px 6px; border-radius: 3px; pointer-events: none; z-index: 2; }
.nt-slot-actions { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,.65); display: flex; align-items: center; justify-content: center; gap: 4px; padding: 5px; opacity: 0; transition: opacity .18s; }
.nt-img-slot:hover .nt-slot-actions { opacity: 1; }
.nt-slot-btn { border: none; border-radius: 3px; padding: 4px 7px; font-size: .7rem; cursor: pointer; font-family: inherit; font-weight: 700; line-height: 1; }
.nt-slot-btn.promote { background: #f57c00; color: #fff; }
.nt-slot-btn.replace { background: #0865a8; color: #fff; }
.nt-slot-btn.remove { background: #dc2626; color: #fff; }
.nt-slot-btn:disabled { opacity: .4; cursor: not-allowed; }

.nt-rte-block { border-radius: 3px; border: 1.5px solid #d0d3d8; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.nt-rte-hdr { background: #f8f9fa; padding: 10px 16px; border-bottom: 1.5px solid #f0f1f2; display: flex; align-items: center; gap: 9px; }
.nt-rte-icon { font-size: 1.1rem; }
.nt-rte-label { font-weight: 800; font-size: .8rem; color: #0a0a0a; }
.nt-rte-sub { font-size: .65rem; color: #6b7280; margin-top: 2px; }
.nt-rte-toolbar { display: flex; align-items: center; gap: 4px; padding: 7px 12px; background: #fff; border-bottom: 1.5px solid #f0f1f2; flex-wrap: wrap; }
.nt-rte-sep { width: 1px; height: 20px; background: #e5e7eb; margin: 0 2px; flex-shrink: 0; }
.nt-tb-btn { min-width: 30px; height: 28px; padding: 0 7px; border-radius: 4px; border: 1.5px solid #d0d3d8; background: #f8f9fa; color: #374151; font-size: .78rem; font-weight: 700; cursor: pointer; transition: all .14s; font-family: inherit; }
.nt-tb-btn:hover, .nt-tb-btn.active { background: #f57c00; color: #fff; border-color: #f57c00; }
.nt-tb-btn.bold { font-weight: 900; }
.nt-tb-btn.italic { font-style: italic; }
.nt-tb-btn.under { text-decoration: underline; }
.nt-tb-size-wrap { display: flex; align-items: center; gap: 3px; }
.nt-tb-select { padding: 4px 6px; border-radius: 4px; border: 1.5px solid #d0d3d8; background: #f8f9fa; color: #374151; font-family: inherit; font-size: .74rem; cursor: pointer; outline: none; }
.nt-tb-select:focus { border-color: #f57c00; }
.nt-tb-size-unit { font-size: .65rem; color: #6b7280; font-weight: 700; }
.nt-tb-color-wrap { position: relative; }
.nt-tb-color-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 3px 6px; border-radius: 4px; border: 1.5px solid #d0d3d8; background: #f8f9fa; cursor: pointer; position: relative; }
.nt-color-letter { font-size: .9rem; font-weight: 900; line-height: 1; }
.nt-color-bar { width: 14px; height: 3px; border-radius: 2px; }
.nt-tb-color-input { position: absolute; inset: 0; opacity: 0; width: 100%; height: 100%; cursor: pointer; border: none; padding: 0; }
.nt-rte-url-wrap { position: relative; }
.nt-url-popover {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: #fff; border: 1.5px solid #d0d3d8;
    border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,.12);
    padding: 10px; z-index: 500;
    display: flex; gap: 6px; min-width: 320px;
    border-top: 3px solid #f57c00;
}
.nt-url-popover input { flex: 1; padding: 7px 10px; border: 1.5px solid #d0d3d8; border-radius: 4px; font-family: inherit; font-size: .76rem; direction: ltr; outline: none; }
.nt-url-popover input:focus { border-color: #f57c00; }
.nt-url-ok { padding: 7px 14px; background: #f57c00; color: #fff; border: none; border-radius: 4px; font-family: inherit; font-size: .74rem; font-weight: 700; cursor: pointer; }
.nt-url-cancel { padding: 7px 10px; background: #f0f1f2; color: #374151; border: 1.5px solid #d0d3d8; border-radius: 4px; font-family: inherit; font-size: .74rem; font-weight: 700; cursor: pointer; }
.nt-rte-editor {
    padding: 12px 16px; outline: none;
    font-family: inherit; font-size: .82rem; color: #0a0a0a;
    line-height: 1.9; direction: rtl; background: #fff;
    overflow-wrap: break-word; word-break: break-word; white-space: pre-wrap;
}
.nt-rte-editor:empty::before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; }
.nt-rte-editor a { color: #0865a8; text-decoration: underline; }

.nt-actions {
    display: flex; gap: 9px; margin-top: 24px;
    padding-top: 18px; border-top: 2px solid #f0f1f2;
    flex-wrap: wrap; align-items: center;
}
.nt-act-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 20px; border-radius: 3px;
    font-family: inherit; font-size: .8rem; font-weight: 800;
    cursor: pointer; border: none;
    transition: all .2s cubic-bezier(.4,0,.2,1); white-space: nowrap;
}
.nt-act-btn:hover { transform: translateY(-2px); }
.nt-act-btn:active { transform: translateY(0); }
.nt-act-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.nt-act-btn.save { background: #16a34a; color: #fff; box-shadow: 0 3px 12px rgba(22,163,74,.3); }
.nt-act-btn.save:hover { background: #15803d; }
.nt-act-btn.new { background: #0865a8; color: #fff; box-shadow: 0 3px 12px rgba(8,101,168,.3); }
.nt-act-btn.new:hover { background: #044478; }
.nt-act-btn.reset { background: #f57c00; color: #fff; box-shadow: 0 3px 12px rgba(245,124,0,.3); }
.nt-act-btn.reset:hover { background: #bf5200; }
.nt-act-btn.delete { background: #dc2626; color: #fff; box-shadow: 0 3px 12px rgba(220,38,38,.3); }
.nt-act-btn.delete:hover { background: #b91c1c; }
.nt-act-btn.cancel { background: #f0f1f2; color: #6b7280; border: 1.5px solid #d0d3d8; box-shadow: none; }
.nt-act-btn.cancel:hover { border-color: #0a0a0a; color: #0a0a0a; }
.nt-delete-confirm {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    background: #fef2f2; border: 1.5px solid rgba(220,38,38,.3);
    border-radius: 3px; padding: 9px 14px; border-right: 4px solid #dc2626;
}
.nt-delete-warn { font-size: .78rem; color: #dc2626; font-weight: 700; }

.nt-notif {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px; border-radius: 3px;
    font-size: .8rem; font-weight: 700;
    border-right: 4px solid;
    margin-bottom: 12px;
    animation: nt-notif-in .3s cubic-bezier(.34,1.56,.64,1);
}
.nt-notif-success { background: #f0fdf4; border-color: #16a34a; color: #15803d; }
.nt-notif-error { background: #fef2f2; border-color: #dc2626; color: #dc2626; }
.nt-notif-info { background: rgba(8,101,168,.06); border-color: #0865a8; color: #0865a8; }
@keyframes nt-notif-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

.nt-skeleton { background: linear-gradient(90deg, #f0f1f2 25%, #e0e2e5 50%, #f0f1f2 75%); background-size: 200% 100%; animation: nt-shimmer 1.4s infinite; border-radius: 3px; }
@keyframes nt-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.nt-loading-row { display: flex; align-items: center; gap: 10px; padding: 9px 10px; margin-bottom: 3px; }

.nt-empty { text-align: center; padding: 40px 12px; color: #6b7280; }
.nt-empty-icon { font-size: 2rem; margin-bottom: 10px; opacity: .35; }

@media (max-width: 900px) {
    .nt-layout { flex-direction: column; }
    .nt-left-panel { width: 100%; height: 260px; }
    .nt-form-wrap { height: auto; }
    .nt-fields-grid { grid-template-columns: 1fr; }
}
`;

function injectStyles() {
    if (document.getElementById('nt-styles')) return;
    const el = document.createElement('style');
    el.id = 'nt-styles';
    el.textContent = CSS;
    document.head.appendChild(el);
}

// ── API helpers ───────────────────────────────────────────────────────────────
function getToken() {
    return window.__clerkToken || null;
}

async function apiFetch(path, opts = {}) {
    const token = getToken();
    const headers = { ...(opts.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE}${path}`, { ...opts, headers });
    if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try {
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                const json = await res.json();
                errMsg += ' — ' + (json?.title || json?.message || JSON.stringify(json));
            } else {
                const txt = await res.text();
                if (txt) errMsg += ' — ' + txt.slice(0, 200);
            }
        } catch { }
        throw new Error(errMsg);
    }
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json') || ct.includes('text/plain')) {
        try { return await res.json(); } catch { return null; }
    }
    return null;
}

// ── FormData builder ──────────────────────────────────────────────────────────
// API fields: Id, Title, Details, Date, ShowFlag, Images (files), ImageUrl, ImageUrls
function buildFormData(form, images, isNew) {
    const fd = new FormData();
    fd.append('Id', isNew ? '0' : String(form.id));
    fd.append('Title', form.title || '');
    fd.append('Details', form.details || '');
    fd.append('Date', form.date ? `${form.date}T00:00:00.000Z` : '');
    fd.append('ShowFlag', String(form.showFlag));

    // Separate new file uploads from existing server URLs
    const newFiles = images.filter(img => img.file);
    const serverImgs = images.filter(img => !img.file && img.serverUrl);

    // All new file uploads go as Images[]
    newFiles.forEach(img => fd.append('Images', img.file));

    // Main image URL (first server image that is marked main, or first server image)
    const mainServer = serverImgs.find(img => img.isMain) || serverImgs[0];
    fd.append('ImageUrl', mainServer?.serverUrl || 'pending');

    // Extra server image URLs
    const extraServerImgs = serverImgs.filter(img => img !== mainServer);
    extraServerImgs.forEach(img => fd.append('ImageUrls', img.serverUrl));

    return fd;
}

// ════════════════════════════════════════════════════════════════════════════════
// NewsTab
// ════════════════════════════════════════════════════════════════════════════════
export default function NewsTab() {
    injectStyles();

    const [news, setNews] = useState([]);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ ...BLANK });
    const [images, setImages] = useState([]);
    const [isNew, setIsNew] = useState(false);
    const [search, setSearch] = useState('');
    const [notification, setNotif] = useState(null);
    const [deleteConfirm, setDelConf] = useState(false);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailL] = useState(false);
    const [saving, setSaving] = useState(false);

    // Track selected id separately so we can re-select after list reload
    const selectedIdRef = useRef(null);

    // showFlag is NOT returned by getAllNews — persist it in localStorage so it survives page refresh.
    // Shape stored: { "164": false, "163": true, ... }
    const STORAGE_KEY = 'nt_showflag_map';
    const showFlagMapRef = useRef(null);
    if (!showFlagMapRef.current) {
        try { showFlagMapRef.current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
        catch { showFlagMapRef.current = {}; }
    }
    const setFlag = (id, val) => {
        showFlagMapRef.current[id] = val;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(showFlagMapRef.current)); } catch { }
    };

    const toast = (msg, type = 'success') => {
        setNotif({ msg, type });
        setTimeout(() => setNotif(null), 3500);
    };

    // ── Load list ─────────────────────────────────────────────────────────────
    const loadList = useCallback(async (keepSelectionId = null) => {
        setLoading(true);
        try {
            const data = await apiFetch(`/api/admin/AdminNews/getAllNews?PageIndex=1&PageSize=200`);
            const items = data?.data ?? [];
            setNews(items);
            setTotal(data?.totalItems ?? items.length);

            // After reload, re-select the same item if we had one
            const targetId = keepSelectionId ?? selectedIdRef.current;
            if (targetId) {
                const found = items.find(i => i.id === targetId);
                if (found) { pickById(found.id, found); return; }
            }
            // Otherwise select first item
            if (items.length && !selectedIdRef.current) {
                pickById(items[0].id, items[0]);
            }
        } catch (e) {
            toast('فشل تحميل الأخبار: ' + e.message, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadList(); }, [loadList]);

    // ── Fetch single ──────────────────────────────────────────────────────────
    // Detail GET response shape:
    // {
    //   id, title, details, publishedAt, imageUrl, imageUrls,
    //   images: [ { picId, imageUrl, isMain }, ... ]
    // }
    // Note: showFlag is NOT in detail response — keep from list or form state
    const pickById = async (id, listItem) => {
        setDetailL(true);
        setDelConf(false);
        setIsNew(false);
        selectedIdRef.current = id;

        // Optimistic update from list data while detail loads
        if (listItem) {
            setSelected(prev => ({ ...(prev || {}), id: listItem.id, title: listItem.title || '' }));
            // Prefer value already known from map (set by previous detail load or save)
            const knownFlag = showFlagMapRef.current[listItem.id];
            const resolvedFlag = knownFlag !== undefined ? knownFlag
                : (listItem.showFlag ?? listItem.isActive ?? true);
            setForm(f => ({
                ...f,
                id: listItem.id,
                title: listItem.title || '',
                date: toInputDate(listItem.publishedAt),
                showFlag: resolvedFlag,
            }));

            // Show main image immediately from list
            const mainUrl = resolveImg(listItem.imageUrl);
            if (mainUrl) {
                setImages([{ file: null, previewSrc: mainUrl, serverUrl: listItem.imageUrl, picId: null, isMain: true }]);
            } else {
                setImages([]);
            }
        }

        try {
            const item = await apiFetch(`/api/admin/AdminNews/${id}`);
            if (!item) return;

            const mapped = {
                id: item.id,
                title: item.title || '',
                details: item.details || '',
                // publishedAt is the date field in detail response
                date: toInputDate(item.publishedAt || item.date),
                // showFlag not returned by GET detail — use our local map (set on save) or default true
                showFlag: showFlagMapRef.current[item.id] ?? item.showFlag ?? item.isActive ?? true,
            };
            // Persist so sidebar dot survives page refresh
            setFlag(mapped.id, mapped.showFlag);
            setSelected(mapped);
            setForm(mapped);

            // ── Parse images[] array — this is the correct structure ──
            // images: [ { picId, imageUrl, isMain }, ... ]
            const imagesArr = item.images ?? [];

            let slots = [];
            if (imagesArr.length > 0) {
                // Sort: main first, then others in order
                const sorted = [...imagesArr].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
                slots = sorted
                    .map(img => {
                        const resolved = resolveImg(img.imageUrl);
                        if (!resolved) return null;
                        return {
                            file: null,
                            previewSrc: resolved,
                            serverUrl: img.imageUrl,
                            picId: img.picId ?? null,
                            isMain: img.isMain ?? false,
                        };
                    })
                    .filter(Boolean);
            } else {
                // Fallback: use imageUrl + imageUrls if images[] is empty
                const mainResolved = resolveImg(item.imageUrl);
                if (mainResolved) {
                    slots.push({ file: null, previewSrc: mainResolved, serverUrl: item.imageUrl, picId: null, isMain: true });
                }
                const extras = Array.isArray(item.imageUrls) ? item.imageUrls : [];
                extras.forEach(u => {
                    const r = resolveImg(u);
                    if (r) slots.push({ file: null, previewSrc: r, serverUrl: u, picId: null, isMain: false });
                });
            }

            setImages(slots);
        } catch (e) {
            toast('فشل تحميل تفاصيل الخبر: ' + e.message, 'error');
        } finally {
            setDetailL(false);
        }
    };

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    // ── Save ──────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.title.trim()) { toast('عنوان الخبر مطلوب', 'error'); return; }
        if (!form.date) { toast('التاريخ مطلوب', 'error'); return; }
        if (images.length === 0) { toast('صورة الخبر مطلوبة', 'error'); return; }
        if (!form.details || !form.details.trim() || form.details === '<div><br></div>') {
            toast('تفاصيل الخبر مطلوبة', 'error'); return;
        }
        setSaving(true);
        try {
            const fd = buildFormData(form, images, isNew);
            if (isNew) {
                await apiFetch('/api/admin/AdminNews', { method: 'POST', body: fd });
                toast('تم إضافة الخبر بنجاح');
                setIsNew(false);
                await loadList();
            } else {
                await apiFetch(`/api/admin/AdminNews/${form.id}`, { method: 'PUT', body: fd });
                // Persist saved showFlag immediately so sidebar dot reflects the change on refresh too
                setFlag(form.id, form.showFlag);
                toast('تم حفظ التغييرات بنجاح');
                // Re-fetch detail to get updated images list
                await loadList(form.id);
            }
        } catch (e) {
            toast('فشل الحفظ: ' + e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleNew = () => {
        setForm({ ...BLANK });
        setSelected(null);
        setIsNew(true);
        setDelConf(false);
        setImages([]);
        selectedIdRef.current = null;
    };

    const handleDelete = async () => {
        if (!deleteConfirm) { setDelConf(true); return; }
        setSaving(true);
        try {
            await apiFetch(`/api/admin/AdminNews/${form.id}`, { method: 'DELETE' });
            toast('تم حذف الخبر', 'error');
            setDelConf(false);
            setSelected(null);
            selectedIdRef.current = null;
            setForm({ ...BLANK });
            setImages([]);
            setIsNew(false);
            await loadList();
        } catch (e) {
            toast('فشل الحذف: ' + e.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        if (isNew) {
            setForm({ ...BLANK });
            setImages([]);
        } else if (selectedIdRef.current) {
            pickById(selectedIdRef.current, null);
        }
        setDelConf(false);
        toast('تم إلغاء التغييرات', 'info');
    };

    const filtered = news.filter(n =>
        (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
        formatDateAr(n.publishedAt).includes(search)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Notification */}
            {notification && (
                <div className={`nt-notif nt-notif-${notification.type}`} style={{ marginBottom: 12 }}>
                    <span>{notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}</span>
                    {notification.msg}
                </div>
            )}

            <div className="nt-layout">

                {/* ════ LEFT PANEL ════ */}
                <div className="nt-left-panel">

                    <div className="nt-panel-hdr">
                        <div className="nt-brand-icon">📰</div>
                        <div style={{ flex: 1 }}>
                            <div className="nt-brand-name">ICEMT</div>
                            <div className="nt-brand-sub">إدارة الأخبار</div>
                        </div>
                        <span className="nt-count-badge">{filtered.length}</span>
                    </div>

                    <div className="nt-search-wrap" style={{ position: 'relative' }}>
                        <input type="text" placeholder="بحث بالعنوان أو التاريخ..."
                            value={search} onChange={e => setSearch(e.target.value)} />
                        <span className="nt-search-icon">🔍</span>
                        {search && <button className="nt-search-clear" onClick={() => setSearch('')}>✕</button>}
                    </div>

                    <div className="nt-list-hdr">
                        <span style={{ color: '#374151', fontSize: '.68rem', fontWeight: 700 }}>الأخبار</span>
                        <button className="nt-new-btn" onClick={handleNew}>+ جديد</button>
                    </div>

                    <div className="nt-list">
                        {loading && [1, 2, 3].map(i => (
                            <div className="nt-loading-row" key={i}>
                                <div className="nt-skeleton" style={{ width: 38, height: 38, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div className="nt-skeleton" style={{ height: 12, marginBottom: 6 }} />
                                    <div className="nt-skeleton" style={{ height: 10, width: '60%' }} />
                                </div>
                            </div>
                        ))}
                        {!loading && filtered.length === 0 && (
                            <div className="nt-empty">
                                <div className="nt-empty-icon">🔍</div>
                                <p style={{ fontSize: '.74rem' }}>لا توجد نتائج</p>
                            </div>
                        )}
                        {!loading && filtered.map(item => {
                            const imgSrc = resolveImg(item.imageUrl);
                            // Use our local map if available (updated on save/detail-load), else item field, else true
                            const isVisible = showFlagMapRef.current[item.id] !== undefined
                                ? showFlagMapRef.current[item.id]
                                : (item.showFlag ?? item.isActive ?? true);
                            return (
                                <div key={item.id}
                                    className={`nt-row${selectedIdRef.current === item.id ? ' active' : ''}`}
                                    onClick={() => pickById(item.id, item)}>
                                    <div className="nt-row-icon">
                                        {imgSrc
                                            ? <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            : '📰'}
                                    </div>
                                    <div className="nt-row-info">
                                        <div className="nt-row-title">{item.title || 'بدون عنوان'}</div>
                                        <div className="nt-row-date">{formatDateAr(item.publishedAt)}</div>
                                    </div>
                                    <div className={`nt-row-status ${isVisible ? 'on' : 'off'}`}
                                        title={isVisible ? 'مرئي' : 'مخفي'} />
                                    <div className="nt-row-id">#{item.id}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="nt-sidebar-footer">ICEMT © {new Date().getFullYear()}</div>
                </div>

                {/* ════ FORM AREA ════ */}
                <div className="nt-form-wrap">
                    <div className="nt-form-card">

                        <div className="nt-form-hdr">
                            <div>
                                <div className="nt-form-tag">{isNew ? 'خبر جديد' : `ID: #${form.id}`}</div>
                                <h2 className="nt-form-title">
                                    {detailLoading ? '⏳ جاري التحميل...' : isNew ? '➕ إضافة خبر جديد' : '✏️ تعديل بيانات الخبر'}
                                </h2>
                                {!isNew && form.title && <p className="nt-form-sub">{previewSnippet(form.title, 60)}</p>}
                            </div>
                            <div className="nt-stat-pill">📰 {total} خبر</div>
                        </div>

                        {detailLoading ? (
                            <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>⏳ جاري تحميل البيانات...</div>
                        ) : (
                            <div className="nt-form-body">

                                <div className="nt-fields-grid">
                                    <div className="nt-field">
                                        <label className="nt-label">الرقم</label>
                                        <input className="nt-inp" value={isNew ? 'تلقائي' : form.id} disabled
                                            style={{ background: '#f0f1f2', color: '#6b7280', cursor: 'not-allowed', fontFamily: "'Courier New',monospace", fontSize: '.74rem' }} />
                                    </div>
                                    <div className="nt-field">
                                        <label className="nt-label">التاريخ <span style={{ color: '#dc2626' }}>*</span></label>
                                        <input className="nt-inp" type="date" name="date" value={form.date}
                                            onChange={handleChange} style={{ direction: 'ltr', textAlign: 'right' }} />
                                    </div>

                                    {/* ShowFlag toggle — full width */}
                                    <div className="nt-field" style={{ gridColumn: '1/-1' }}>
                                        <label className="nt-label">حالة الظهور</label>
                                        <ActiveToggle value={!!form.showFlag} onChange={val => setForm(f => ({ ...f, showFlag: val }))} />
                                    </div>

                                    {/* Title — full width */}
                                    <div className="nt-field" style={{ gridColumn: '1/-1' }}>
                                        <label className="nt-label">عنوان الخبر <span style={{ color: '#dc2626' }}>*</span></label>
                                        <input className="nt-inp" name="title" value={form.title}
                                            onChange={handleChange} placeholder="أدخل عنوان الخبر هنا..." />
                                    </div>
                                </div>

                                {/* Multi-image uploader */}
                                <div style={{ marginBottom: 20 }}>
                                    <MultiImageUploader
                                        images={images}
                                        onChange={setImages}
                                        newsId={!isNew ? form.id : null}
                                        onServerImageDeleted={(msg, type = 'success') => toast(msg, type)}
                                    />
                                </div>

                                <div className="nt-divider" />

                                <RichTextEditor
                                    icon="📝"
                                    label="تفاصيل الخبر *"
                                    sub="حدد النص أولاً ثم اختر التنسيق من شريط الأدوات"
                                    name="details"
                                    value={form.details}
                                    onChange={handleChange}
                                    placeholder="أدخل تفاصيل الخبر هنا..."
                                    minHeight={200}
                                />

                                <div className="nt-actions">
                                    <button className="nt-act-btn save" onClick={handleSave} disabled={saving}>
                                        {saving ? '⏳ جاري الحفظ...' : '💾 حفظ'}
                                    </button>
                                    <button className="nt-act-btn new" onClick={handleNew} disabled={saving}>➕ خبر جديد</button>
                                    <button className="nt-act-btn reset" onClick={handleReset} disabled={saving}>↩ إلغاء</button>
                                    <div style={{ flex: 1 }} />
                                    {!isNew && (
                                        deleteConfirm ? (
                                            <div className="nt-delete-confirm">
                                                <span className="nt-delete-warn">⚠️ هل أنت متأكد من حذف هذا الخبر؟</span>
                                                <button className="nt-act-btn delete" onClick={handleDelete} disabled={saving}>تأكيد الحذف</button>
                                                <button className="nt-act-btn cancel" onClick={() => setDelConf(false)}>إلغاء</button>
                                            </div>
                                        ) : (
                                            <button className="nt-act-btn delete" onClick={handleDelete} disabled={saving}>🗑 حذف الخبر</button>
                                        )
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}