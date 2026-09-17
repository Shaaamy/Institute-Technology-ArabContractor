
// src/components/admin/tabs/LecturersTab.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { T } from "../../components/admin/constants";

// ── API base ──────────────────────────────────────────────────────────────────
const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api/admin/AdminLecturer';
const IMAGE_BASE_URL = 'https://www.arabcont.com/icemt/assets/images/';

// ── Map API response → internal form shape ────────────────────────────────────
function apiToForm(apiLec) {
    console.log("API PIC:", apiLec.pic);
    return {
        id:           apiLec.id,
        name:         apiLec.name        || '',
        specialty:    apiLec.specialty   || '',
        email:        apiLec.email       || '',
        phone:        apiLec.telephone   || '',
        courses:      apiLec.course      || '',
        level:        apiLec.mainEdu     || '',
        certificates: apiLec.edu         || '',
        details:      apiLec.details     || '',
        photo:        apiLec.pic
    
    };
}
console.log();

// ── Map internal form → API POST/PUT body ─────────────────────────────────────
function formToApi(form) {
    return {
        name:     form.name,
        specialty: form.specialty,
        email:    form.email,
        phone:    form.phone,
        courses:  form.courses,
        level:    form.level,
        details:  form.details,
        edu:      form.certificates,
        course:   form.courses,
        mainEdu:  form.level,
    };
}

const BLANK = {
    id: 0, name: '', specialty: '', email: '', phone: '',
    courses: '', level: '', certificates: '', details: '', photo: null,
};

function initials(name = '') {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '؟';
}

function textToHtml(text = '') {
    if (!text) return '';
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text
        .split('\n')
        .map(line => line
            ? `<div>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`
            : '<div><br></div>'
        )
        .join('');
}

const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];


function wrapSelectionWithStyle(property, value) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const span = document.createElement('span');
    span.style[property] = value;
    try {
        range.surroundContents(span);
    } catch {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
    }
    sel.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.addRange(newRange);
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

// ══════════════════════════════════════════════════════════════════════════════
// ── RichTextEditor ────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function RichTextEditor({ icon, label, sub, name, value, onChange, placeholder, minHeight = 120 }) {
    const editorRef = useRef(null);
    const savedSelRef = useRef(null);
    const lastValueRef = useRef(null);

    const [fontColor, setFontColor] = useState('#0a0a0a');
    const [fontSize, setFontSize] = useState(14);
    const [urlOpen, setUrlOpen] = useState(false);
    const [urlValue, setUrlValue] = useState('');
    const urlInputRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) return;
        if (value === lastValueRef.current) return;
        editorRef.current.innerHTML = textToHtml(value);
        lastValueRef.current = value;
    }, [value]);

    useEffect(() => {
        if (urlOpen && urlInputRef.current) urlInputRef.current.focus();
    }, [urlOpen]);

    useEffect(() => {
        if (!urlOpen) return;
        const handler = (e) => {
            if (!e.target.closest('.lec-tb-url-wrap')) setUrlOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [urlOpen]);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0)
            savedSelRef.current = sel.getRangeAt(0).cloneRange();
    };
    const restoreSelection = () => {
        const sel = window.getSelection();
        if (sel && savedSelRef.current) {
            sel.removeAllRanges();
            sel.addRange(savedSelRef.current);
        }
    };

    const emitChange = () => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML;
        lastValueRef.current = html;
        onChange({ target: { name, value: html } });
    };

    const exec = (cmd, val = null) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val);
        emitChange();
    };

    const detectFormattingAtCursor = () => {
        if (!editorRef.current) return;
        const fsVal = getComputedAtCursor(editorRef.current, 'fontSize');
        if (fsVal) {
            const px = Math.round(parseFloat(fsVal));
            const closest = FONT_SIZES.reduce((prev, cur) =>
                Math.abs(cur - px) < Math.abs(prev - px) ? cur : prev
            );
            setFontSize(closest);
        }
    };

    const handleBold = () => exec('bold');
    const handleItalic = () => exec('italic');
    const handleUnderline = () => exec('underline');

    const handleFontSize = (e) => {
        const px = Number(e.target.value);
        setFontSize(px);
        restoreSelection();
        editorRef.current?.focus();
        wrapSelectionWithStyle('fontSize', `${px}px`);
        emitChange();
    };


    const handleColorChange = (e) => {
        const color = e.target.value;
        setFontColor(color);
        restoreSelection();
        exec('foreColor', color);
    };

    const openUrl = () => {
        saveSelection();
        const sel = window.getSelection();
        let existing = '';
        if (sel && sel.anchorNode) {
            let node = sel.anchorNode;
            while (node && node !== editorRef.current) {
                if (node.nodeName === 'A') { existing = node.href; break; }
                node = node.parentNode;
            }
        }
        setUrlValue(existing || 'https://');
        setUrlOpen(true);
    };

    const confirmUrl = () => {
        restoreSelection();
        const url = urlValue.trim();
        if (url && url !== 'https://') {
            exec('createLink', url);
            const sel = window.getSelection();
            if (sel && sel.anchorNode) {
                let node = sel.anchorNode;
                while (node && node !== editorRef.current) {
                    if (node.nodeName === 'A') {
                        node.target = '_blank';
                        node.rel = 'noopener noreferrer';
                        break;
                    }
                    node = node.parentNode;
                }
            }
        }
        setUrlOpen(false);
        emitChange();
    };

    const cancelUrl = () => { setUrlOpen(false); restoreSelection(); };

    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b') { e.preventDefault(); handleBold(); }
            if (e.key === 'i') { e.preventDefault(); handleItalic(); }
            if (e.key === 'u') { e.preventDefault(); handleUnderline(); }
        }
    };

    return (
        <div className="lec-rte-block">
            <div className="lec-rte-hdr">
                <span className="lec-rte-icon">{icon}</span>
                <div style={{ flex: 1 }}>
                    <div className="lec-rte-label">{label}</div>
                    {sub && <div className="lec-rte-sub">{sub}</div>}
                </div>
            </div>

            <div
                className="lec-rte-toolbar"
                onMouseDown={e => {
                    if (e.target.tagName === 'SELECT') return;
                    e.preventDefault();
                }}
            >
                <button className="lec-tb-btn bold" title="عريض (Ctrl+B)" onClick={handleBold}>B</button>
                <button className="lec-tb-btn italic" title="مائل (Ctrl+I)" onClick={handleItalic}>I</button>
                <button className="lec-tb-btn under" title="تحته خط (Ctrl+U)" onClick={handleUnderline}>U</button>
                <div className="lec-rte-sep" />
                <div className="lec-rte-sep" />
                <div className="lec-tb-size-wrap" title="حجم الخط (بالبكسل)">
                    <select className="lec-tb-select lec-tb-size-select" value={fontSize} onChange={handleFontSize} onMouseDown={saveSelection}>
                        {FONT_SIZES.map(px => <option key={px} value={px}>{px}</option>)}
                    </select>
                    <span className="lec-tb-size-unit">px</span>
                </div>
                <div className="lec-rte-sep" />
                <div className="lec-tb-color-wrap" title="لون الخط">
                    <button className="lec-tb-color-btn" onMouseDown={saveSelection}>
                        <span className="color-letter" style={{ color: fontColor }}>A</span>
                        <span className="color-bar" style={{ background: fontColor }} />
                        <input type="color" className="lec-tb-color-input" value={fontColor} onChange={handleColorChange} />
                    </button>
                </div>
                <div className="lec-rte-sep" />
                <div className="lec-tb-url-wrap">
                    <button className={`lec-tb-btn${urlOpen ? ' active' : ''}`} title="إضافة رابط" onClick={openUrl} onMouseDown={saveSelection}>🔗</button>
                    {urlOpen && (
                        <div className="lec-url-popover">
                            <input ref={urlInputRef} type="url" placeholder="https://example.com" value={urlValue}
                                onChange={e => setUrlValue(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') confirmUrl(); if (e.key === 'Escape') cancelUrl(); }} />
                            <button className="lec-url-popover-ok" onClick={confirmUrl}>إدراج</button>
                            <button className="lec-url-popover-cancel" onClick={cancelUrl}>إلغاء</button>
                        </div>
                    )}
                </div>
                <button className="lec-tb-btn" title="إزالة الرابط" onClick={() => exec('unlink')} onMouseDown={saveSelection} style={{ fontSize: '.7rem' }}>✂️</button>
            </div>

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="lec-rte-editor"
                data-placeholder={placeholder}
                style={{ minHeight }}
                onInput={emitChange}
                onKeyDown={handleKeyDown}
                onMouseUp={() => { saveSelection(); detectFormattingAtCursor(); }}
                onKeyUp={() => { saveSelection(); detectFormattingAtCursor(); }}
            />
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── LecturersTab ──────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const LecturersTab = () => {
    const [lecturers, setLecturers]       = useState([]);
    const [selected, setSelected]         = useState(null);
    const [form, setForm]                 = useState({ ...BLANK });
    const [isNew, setIsNew]               = useState(false);
    const [search, setSearch]             = useState('');
    const [notification, setNotification] = useState(null);
    const [dragOver, setDragOver]         = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [loading, setLoading]           = useState(false);
    const [listLoading, setListLoading]   = useState(true);
    const fileRef = useRef();

    const pendingPhotoRef = useRef(null);

    const toast = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setListLoading(true);
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const mapped = data.map(apiToForm);
            setLecturers(mapped);
            if (mapped.length) {
                setSelected(mapped[0]);
                setForm({ ...mapped[0] });
            }
        } catch (err) {
            toast(`فشل تحميل البيانات: ${err.message}`, 'error');
        } finally {
            setListLoading(false);
        }
    };

    const filtered = lecturers.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.specialty.toLowerCase().includes(search.toLowerCase())
    );

    const pick = (lec) => {
        setSelected(lec);
        setForm({ ...lec });
        setIsNew(false);
        setDeleteConfirm(false);
        pendingPhotoRef.current = null;
    };

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const applyPhoto = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) return;
        pendingPhotoRef.current = file;
        const reader = new FileReader();
        reader.onload = e => setForm(f => ({ ...f, photo: e.target.result }));
        reader.readAsDataURL(file);
    }, []);

    const uploadPhoto = async (id, file) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${API_BASE}/${id}/photo`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(`فشل رفع الصورة: HTTP ${res.status}`);
        try { return await res.json(); } catch { return null; }
    };

    const handleSave = async () => {
        if (!form.name.trim()) { toast('الاسم مطلوب', 'error'); return; }
        setLoading(true);
        try {
            const body = formToApi(form);

            if (isNew) {
                const res = await fetch(API_BASE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const created = await res.json();
                const newForm = apiToForm(created);

                if (pendingPhotoRef.current) {
                    await uploadPhoto(created.id, pendingPhotoRef.current);
                    pendingPhotoRef.current = null;
                    const refreshed = await fetch(`${API_BASE}/${created.id}`);
                    if (refreshed.ok) {
                        const refreshedData = await refreshed.json();
                        Object.assign(newForm, apiToForm(refreshedData));
                    }
                }

                setLecturers(prev => [newForm, ...prev]);
                setSelected(newForm);
                setForm({ ...newForm });
                setIsNew(false);
                toast('تم إضافة المحاضر بنجاح');

            } else {
                const res = await fetch(`${API_BASE}/${form.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                let updatedForm = { ...form };

                if (pendingPhotoRef.current) {
                    await uploadPhoto(form.id, pendingPhotoRef.current);
                    pendingPhotoRef.current = null;
                    const refreshed = await fetch(`${API_BASE}/${form.id}`);
                    if (refreshed.ok) {
                        const refreshedData = await refreshed.json();
                        updatedForm = apiToForm(refreshedData);
                    }
                }

                setLecturers(prev => prev.map(l => l.id === updatedForm.id ? updatedForm : l));
                setSelected(updatedForm);
                setForm({ ...updatedForm });
                toast('تم حفظ التغييرات بنجاح');
            }
        } catch (err) {
            toast(`حدث خطأ: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleNew = () => {
        setForm({ ...BLANK });
        setSelected(null);
        setIsNew(true);
        setDeleteConfirm(false);
        pendingPhotoRef.current = null;
    };

    const handleDelete = async () => {
        if (!deleteConfirm) { setDeleteConfirm(true); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/${selected.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const rest = lecturers.filter(l => l.id !== selected.id);
            setLecturers(rest);
            setDeleteConfirm(false);
            if (rest.length) pick(rest[0]); else handleNew();
            toast('تم حذف المحاضر', 'error');
        } catch (err) {
            toast(`فشل الحذف: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (isNew) setForm({ ...BLANK }); else setForm({ ...selected });
        setDeleteConfirm(false);
        pendingPhotoRef.current = null;
        toast('تم إلغاء التغييرات', 'info');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {notification && (
                <div className={`lec-notif lec-notif-${notification.type}`} style={{ marginBottom: 12 }}>
                    <span>
                        {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    {notification.msg}
                </div>
            )}

            {loading && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, fontSize: '1.4rem', color: '#fff', gap: 10,
                }}>
                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                    جاري الحفظ...
                </div>
            )}

            <div className="lec-layout">

                {/* ══ LEFT PANEL ══ */}
                <div className="lec-panel" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto', position: 'sticky', top: 0 }}>
                    <div className="lec-panel-hdr">
                        <span className="lec-count-badge">{filtered.length}</span>
                        <span style={{ fontWeight: 800, fontSize: '.8rem', color: '#0a0a0a', flex: 1, textAlign: 'center' }}>
                            المحاضرون
                        </span>
                        <button className="lec-new-btn" onClick={handleNew}>+ جديد</button>
                    </div>

                    <div style={{ padding: '10px 10px 6px', position: 'relative' }}>
                        <div className="adm-search" style={{ minWidth: 'unset' }}>
                            <input
                                type="text"
                                placeholder="بحث بالاسم أو التخصص..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ fontSize: '.76rem' }}
                            />
                            {search && (
                                <button className="lec-search-clear" onClick={() => setSearch('')}>✕</button>
                            )}
                        </div>
                    </div>

                    <div className="lec-list">
                        {listLoading ? (
                            <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                <div className="adm-emi">⏳</div>
                                <p>جاري التحميل...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                <div className="adm-emi">🔍</div>
                                <p>لا توجد نتائج</p>
                            </div>
                        ) : (
                            filtered.map(lec => (
                                <div
                                    key={lec.id}
                                    className={`lec-row${selected?.id === lec.id ? ' active' : ''}`}
                                    onClick={() => pick(lec)}
                                >
                                    <div className="lec-avatar">
                                        {lec.photo
                                            ? <img src={lec.photo} alt="" />
                                            : <span>{initials(lec.name)}</span>
                                        }
                                    </div>
                                    <div className="lec-row-info">
                                        <div className="lec-row-name">{lec.name || 'بدون اسم'}</div>
                                        <div className="lec-row-spec">{lec.specialty || lec.courses || '—'}</div>
                                    </div>
                                    <div className="lec-row-id">#{lec.id}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ══ FORM AREA ══ */}
                <div className="lec-form-wrap" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <div className="adm-card lec-form-card">

                        <div className="lec-form-hdr">
                            <div>
                                <div className="adm-hero-tag" style={{ marginBottom: 6, position: 'relative', zIndex: 1 }}>
                                    {isNew ? 'محاضر جديد' : `ID: #${selected?.id}`}
                                </div>
                                <h2 className="lec-form-title">
                                    {isNew ? '➕ إضافة محاضر جديد' : '✏️ تعديل بيانات المحاضر'}
                                </h2>
                                {!isNew && selected && (
                                    <p className="lec-form-sub">{selected.name}</p>
                                )}
                            </div>
                            <div className="lec-stat-pill">📋 {lecturers.length} محاضر</div>
                        </div>

                        <div className="lec-form-body">

                            <div className="lec-top-row">

                                {/* Photo */}
                                <div className="lec-photo-col">
                                    <label className="lec-label">صورة المحاضر</label>
                                    <div
                                        className={`lec-photo-zone${dragOver ? ' over' : ''}`}
                                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={e => { e.preventDefault(); setDragOver(false); applyPhoto(e.dataTransfer.files[0]); }}
                                        onClick={() => fileRef.current.click()}
                                    >
                                        {form.photo ? (
                                            <>
                                                <img src={form.photo} alt="محاضر" className="lec-photo-img" />
                                                <div className="lec-photo-overlay">
                                                    <span style={{ fontSize: '1.6rem' }}>📷</span>
                                                    <span className="lec-photo-overlay-txt">تغيير الصورة</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="lec-photo-placeholder">
                                                <div className="lec-photo-icon">👤</div>
                                                <span className="lec-photo-hint">اسحب صورة هنا<br />أو اضغط للاختيار</span>
                                                <span className="lec-photo-types">JPG · PNG · WEBP</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileRef} type="file" accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={e => applyPhoto(e.target.files[0])}
                                    />
                                    {form.photo && (
                                        <button
                                            className="lec-remove-photo"
                                            onClick={() => {
                                                setForm(f => ({ ...f, photo: null }));
                                                pendingPhotoRef.current = null;
                                            }}
                                        >
                                            ✕ حذف الصورة
                                        </button>
                                    )}
                                </div>

                                {/* Fields grid */}
                                <div className="lec-fields-grid">
                                    <div className="lec-field">
                                        <label className="lec-label">الرقم</label>
                                        <input
                                            className="lec-inp"
                                            value={isNew ? 'تلقائي' : form.id}
                                            disabled
                                            style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">الاسم الكامل *</label>
                                        <input className="lec-inp" name="name" value={form.name} onChange={handleChange} placeholder="د. / م. / أ. الاسم الكامل..." />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">التخصص</label>
                                        <input className="lec-inp" name="specialty" value={form.specialty} onChange={handleChange} placeholder="مجال التخصص الرئيسي..." />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">الكورسات والمؤهلات</label>
                                        <input className="lec-inp" name="courses" value={form.courses} onChange={handleChange} placeholder="المؤهلات العلمية..." />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">رقم الهاتف</label>
                                        <input className="lec-inp" name="phone" value={form.phone} onChange={handleChange} placeholder="01xxxxxxxxx" style={{ direction: 'ltr', textAlign: 'right' }} />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">البريد الإلكتروني</label>
                                        <input className="lec-inp" name="email" value={form.email} onChange={handleChange} placeholder="example@domain.com" style={{ direction: 'ltr', textAlign: 'right' }} />
                                    </div>
                                    <div className="lec-field" style={{ gridColumn: '1/-1' }}>
                                        <label className="lec-label">المستوى العلمي</label>
                                        <input className="lec-inp" name="level" value={form.level} onChange={handleChange} placeholder="بكالوريوس / ماجستير / دكتوراه في ..." />
                                    </div>
                                </div>
                            </div>

                            <div className="lec-divider" />

                            <RichTextEditor
                                icon="🎓"
                                label="الشهادات والمؤهلات"
                                sub="حدد النص أولاً ثم اختر الخط أو الحجم أو اللون من شريط الأدوات"
                                name="certificates"
                                value={form.certificates}
                                onChange={handleChange}
                                placeholder="حاصل على بكالوريوس الهندسة – قسم ميكانيكا&#10;حاصل على درجة الماجستير بتقدير امتياز&#10;حاصل على درجة الدكتوراه – جامعة القاهرة"
                                minHeight={120}
                            />

                            <RichTextEditor
                                icon="📋"
                                label="التفاصيل والخبرات العملية"
                                sub="حدد النص أولاً ثم اختر الخط أو الحجم أو اللون — يمكن إضافة روابط للمشاريع"
                                name="details"
                                value={form.details}
                                onChange={handleChange}
                                placeholder="أشراف على مشاريع وزارة الشباب والرياضة&#10;أشراف على مستشفى القاهرة الجديد&#10;مبنى مشروع تطوير معمار العرفة"
                                minHeight={140}
                            />

                            {/* Actions */}
                            <div className="lec-actions">
                                <button className="lec-act-btn save" onClick={handleSave} disabled={loading}>
                                    {loading ? '⏳ جاري الحفظ...' : '💾 حفظ'}
                                </button>
                                <button className="lec-act-btn new" onClick={handleNew} disabled={loading}>➕ محاضر جديد</button>
                                <button className="lec-act-btn reset" onClick={handleReset} disabled={loading}>↩ إلغاء</button>
                                <div style={{ flex: 1 }} />
                                {!isNew && (
                                    deleteConfirm ? (
                                        <div className="lec-delete-confirm">
                                            <span className="lec-delete-warn">⚠️ هل أنت متأكد من الحذف؟</span>
                                            <button className="lec-act-btn delete" onClick={handleDelete} disabled={loading}>تأكيد الحذف</button>
                                            <button className="adm-fclear" onClick={() => setDeleteConfirm(false)}>إلغاء</button>
                                        </div>
                                    ) : (
                                        <button className="lec-act-btn delete" onClick={handleDelete} disabled={loading}>🗑 حذف المحاضر</button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LecturersTab;