import React, { useState, useRef, useEffect, useCallback } from 'react';
import { T } from "../../components/admin/constants";

// ─────────────────────────────────────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api/admin';
const BOOKS_API = `${API_BASE}/AdminBook`;
const TYPES_API = `${API_BASE}/AdminBooksType`;

const PAGE_SIZE = 999;

const BLANK_BOOK = { bookId: 0, bookName: '', author: '', bookDate: '', typeId: '', typeName: '' };
const BLANK_TYPE = { typeId: 0, typeName: '' };

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return res.json();
    return res.text();
}

// ─────────────────────────────────────────────────────────────────────────────
// Cover upload zone
// ─────────────────────────────────────────────────────────────────────────────
function CoverZone({ cover, onCoverChange, onCoverRemove }) {
    const fileRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    function applyImage(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const r = new FileReader();
        r.onload = e => onCoverChange(e.target.result);
        r.readAsDataURL(file);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
                className={`bk-cover-zone${dragOver ? ' over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); applyImage(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current.click()}
            >
                {cover ? (
                    <>
                        <img src={cover} alt="غلاف" className="bk-cover-img" />
                        <div className="bk-cover-overlay">
                            <span style={{ fontSize: '1.4rem' }}>📷</span>
                            <span className="bk-cover-overlay-txt">تغيير الغلاف</span>
                        </div>
                    </>
                ) : (
                    <div className="bk-cover-placeholder">
                        <div className="bk-cover-icon">📖</div>
                        <span className="bk-cover-hint">اسحب صورة هنا<br />أو اضغط للاختيار</span>
                        <span className="bk-cover-types">JPG · PNG · WEBP</span>
                    </div>
                )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => applyImage(e.target.files[0])} />
            {cover && (
                <button className="bk-remove-cover" onClick={e => { e.stopPropagation(); onCoverRemove(); }}>
                    ✕ حذف الغلاف
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BooksTab — main component
// ─────────────────────────────────────────────────────────────────────────────
const BooksTab = () => {
    // ── Books state ──────────────────────────────────────────────────────────
    const [books, setBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(false);
    const [booksError, setBooksError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);

    // ── Book Types state ─────────────────────────────────────────────────────
    const [bookTypes, setBookTypes] = useState([]);
    const [typesLoading, setTypesLoading] = useState(false);
    const [typesError, setTypesError] = useState(null);

    // ── UI state ─────────────────────────────────────────────────────────────
    const [subPage, setSubPage] = useState('books');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // ── Books form state ─────────────────────────────────────────────────────
    const [selectedBook, setSelectedBook] = useState(null);
    const [formBook, setFormBook] = useState({ ...BLANK_BOOK, cover: null });
    const [isNewBook, setIsNewBook] = useState(false);
    const [delConfBook, setDelConfBook] = useState(false);
    const [bookSaving, setBookSaving] = useState(false);

    // ── Types form state ─────────────────────────────────────────────────────
    const [selectedType, setSelectedType] = useState(null);
    const [formType, setFormType] = useState({ ...BLANK_TYPE });
    const [isNewType, setIsNewType] = useState(true);
    const [delConfType, setDelConfType] = useState(false);
    const [typeSaving, setTypeSaving] = useState(false);

    // ── Notification ─────────────────────────────────────────────────────────
    const [notif, setNotif] = useState(null);
    const notifRef = useRef(null);

    const toast = (msg, type = 'success') => {
        clearTimeout(notifRef.current);
        setNotif({ msg, type });
        notifRef.current = setTimeout(() => setNotif(null), 3500);
    };

    // ── Debounce search ───────────────────────────────────────────────────────
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    // ── Fetch books ───────────────────────────────────────────────────────────
    const fetchBooks = useCallback(async (searchTerm = '') => {
        setBooksLoading(true);
        setBooksError(null);
        try {
            const params = new URLSearchParams({ pageIndex: 1, pageSize: PAGE_SIZE });
            if (searchTerm.trim()) params.append('search', searchTerm.trim());
            const data = await apiFetch(`${BOOKS_API}?${params}`);
            setBooks(data.data ?? []);
            setTotalItems(data.totalItems ?? 0);
        } catch (err) {
            setBooksError(err.message);
        } finally {
            setBooksLoading(false);
        }
    }, []);

    // ── Fetch types ───────────────────────────────────────────────────────────
    const fetchTypes = useCallback(async () => {
        setTypesLoading(true);
        setTypesError(null);
        try {
            const data = await apiFetch(TYPES_API);
            const list = Array.isArray(data) ? data : (data.data ?? []);
            setBookTypes(list);
            if (list.length && !selectedType) pickType(list[0]);
        } catch (err) {
            setTypesError(err.message);
        } finally {
            setTypesLoading(false);
        }
    }, []); // eslint-disable-line

    async function fetchBookById(id) {
        try { return await apiFetch(`${BOOKS_API}/${id}`); }
        catch (err) { toast(`خطأ في تحميل بيانات الكتاب: ${err.message}`, 'error'); return null; }
    }

    // ── Effects ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (subPage === 'books') fetchBooks(debouncedSearch);
    }, [subPage, debouncedSearch, fetchBooks]);

    useEffect(() => {
        if (subPage === 'types') fetchTypes();
    }, [subPage, fetchTypes]);

    useEffect(() => { fetchTypes(); }, []); // eslint-disable-line

    // ── Sub-page switch ───────────────────────────────────────────────────────
    function switchSub(page) {
        setSubPage(page);
        setSearch('');
        setDebouncedSearch('');
    }

    // ── Books helpers ─────────────────────────────────────────────────────────
    async function pickBook(b) {
        const detail = await fetchBookById(b.bookId);
        const book = detail ?? b;
        setSelectedBook({ ...book });
        setFormBook({ ...book, cover: book.cover ?? null });
        setIsNewBook(false);
        setDelConfBook(false);
    }

    function handleBookNew() {
        setFormBook({ ...BLANK_BOOK, cover: null });
        setSelectedBook(null);
        setIsNewBook(true);
        setDelConfBook(false);
    }

    async function handleBookSave() {
        if (!formBook.bookName?.trim()) { toast('اسم الكتاب مطلوب', 'error'); return; }
        setBookSaving(true);
        const payload = {
            bookName: formBook.bookName?.trim() ?? '',
            author: formBook.author?.trim() ?? '',
            bookDate: Number(formBook.bookDate) || 0,
            typeId: Number(formBook.typeId) || 0,
        };
        try {
            if (isNewBook) {
                const created = await apiFetch(BOOKS_API, { method: 'POST', body: JSON.stringify(payload) });
                toast('تم إضافة الكتاب بنجاح');
                await fetchBooks(debouncedSearch);
                if (created?.bookId) {
                    const detail = await fetchBookById(created.bookId);
                    if (detail) { setSelectedBook({ ...detail }); setFormBook({ ...detail, cover: null }); setIsNewBook(false); }
                } else { handleBookNew(); }
            } else {
                await apiFetch(`${BOOKS_API}/${formBook.bookId}`, { method: 'PUT', body: JSON.stringify(payload) });
                const detail = await fetchBookById(formBook.bookId);
                const updated = detail ?? { ...formBook };
                setSelectedBook({ ...updated });
                setFormBook({ ...updated, cover: formBook.cover });
                await fetchBooks(debouncedSearch);
                toast('تم حفظ التغييرات بنجاح');
            }
        } catch (err) {
            toast(`خطأ: ${err.message}`, 'error');
        } finally {
            setBookSaving(false);
        }
    }

    function handleBookReset() {
        setFormBook(isNewBook ? { ...BLANK_BOOK, cover: null } : { ...selectedBook, cover: selectedBook?.cover ?? null });
        setDelConfBook(false);
        toast('تم إلغاء التغييرات', 'info');
    }

    async function handleBookDelete() {
        if (!delConfBook) { setDelConfBook(true); return; }
        try {
            await apiFetch(`${BOOKS_API}/${selectedBook.bookId}`, { method: 'DELETE' });
            setDelConfBook(false);
            setSelectedBook(null);
            setFormBook({ ...BLANK_BOOK, cover: null });
            setIsNewBook(false);
            await fetchBooks('');
            setSearch('');
            setDebouncedSearch('');
            toast('✅ تم حذف الكتاب بنجاح');
        } catch (err) {
            toast(`خطأ في الحذف: ${err.message}`, 'error');
            setDelConfBook(false);
        }
    }

    // ── Types helpers ─────────────────────────────────────────────────────────
    function pickType(t) {
        setSelectedType({ ...t }); setFormType({ ...t });
        setIsNewType(false); setDelConfType(false);
    }
    function handleTypeNew() {
        setFormType({ ...BLANK_TYPE }); setSelectedType(null);
        setIsNewType(true); setDelConfType(false);
    }

    async function handleTypeSave() {
        const name = formType.typeName?.trim();
        if (!name) { toast('اسم النوع مطلوب', 'error'); return; }
        setTypeSaving(true);
        try {
            if (isNewType) {
                const created = await apiFetch(TYPES_API, { method: 'POST', body: JSON.stringify({ typeName: name }) });
                toast('تم إضافة النوع بنجاح');
                await fetchTypes();
                if (created?.typeId) pickType(created);
            } else {
                await apiFetch(`${TYPES_API}/${formType.typeId}`, { method: 'PUT', body: JSON.stringify({ typeName: name }) });
                toast('تم حفظ التغييرات بنجاح');
                await fetchTypes();
                setSelectedType({ ...formType, typeName: name });
            }
        } catch (err) {
            toast(`خطأ: ${err.message}`, 'error');
        } finally {
            setTypeSaving(false);
        }
    }

    function handleTypeReset() {
        setFormType(isNewType ? { ...BLANK_TYPE } : { ...selectedType });
        setDelConfType(false);
        toast('تم إلغاء التغييرات', 'info');
    }

    async function handleTypeDelete() {
        if (!delConfType) { setDelConfType(true); return; }
        try {
            await apiFetch(`${TYPES_API}/${selectedType.typeId}`, { method: 'DELETE' });
            setDelConfType(false);
            setSelectedType(null);
            setFormType({ ...BLANK_TYPE });
            setIsNewType(true);
            await fetchTypes();
            toast('✅ تم حذف النوع بنجاح');
        } catch (err) {
            toast(`خطأ في الحذف: ${err.message}`, 'error');
            setDelConfType(false);
        }
    }

    const filteredTypes = bookTypes.filter(t =>
        t.typeName?.toLowerCase().includes(search.toLowerCase())
    );

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER — mirrors LecturersTab layout exactly
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Notification */}
            {notif && (
                <div className={`lec-notif lec-notif-${notif.type}`} style={{ marginBottom: 12 }}>
                    <span>{notif.type === 'success' ? '✅' : notif.type === 'error' ? '❌' : 'ℹ️'}</span>
                    {notif.msg}
                </div>
            )}

            {/* Same lec-layout grid as LecturersTab */}
            <div className="lec-layout">

                {/* ══ LEFT PANEL — list (identical structure to LecturersTab) ══ */}
                <div className="lec-panel" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto', position: 'sticky', top: 0 }}>

                    {/* Sub-page tabs */}
                    <div className="bk-subtabs">
                        <button
                            className={`bk-subtab${subPage === 'books' ? ' active' : ''}`}
                            onClick={() => switchSub('books')}
                        >📚 الكتب</button>
                        <button
                            className={`bk-subtab${subPage === 'types' ? ' active' : ''}`}
                            onClick={() => switchSub('types')}
                        >🏷️ الأنواع</button>
                    </div>

                    {/* Panel header */}
                    <div className="lec-panel-hdr">
                        <span className="lec-count-badge">
                            {subPage === 'books' ? totalItems : filteredTypes.length}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '.8rem', color: '#0a0a0a', flex: 1, textAlign: 'center' }}>
                            {subPage === 'books' ? 'الكتب' : 'الأنواع'}
                        </span>
                        <button
                            className="lec-new-btn"
                            onClick={subPage === 'books' ? handleBookNew : handleTypeNew}
                        >+ جديد</button>
                    </div>

                    {/* Search */}
                    <div style={{ padding: '10px 10px 6px', position: 'relative' }}>
                        <div className="adm-search" style={{ minWidth: 'unset' }}>
                            <input
                                type="text"
                                placeholder={subPage === 'books' ? 'بحث بالعنوان أو المؤلف...' : 'بحث بالاسم...'}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ fontSize: '.76rem' }}
                            />
                            {search && (
                                <button className="lec-search-clear" onClick={() => setSearch('')}>✕</button>
                            )}
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div className="lec-list">

                        {/* Books list */}
                        {subPage === 'books' && (
                            booksLoading ? (
                                <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                    <div className="adm-emi">⏳</div><p>جاري التحميل...</p>
                                </div>
                            ) : booksError ? (
                                <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                    <p style={{ color: 'red' }}>❌ {booksError}</p>
                                </div>
                            ) : books.length === 0 ? (
                                <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                    <div className="adm-emi">🔍</div><p>لا توجد نتائج</p>
                                </div>
                            ) : books.map(b => (
                                <div
                                    key={b.bookId}
                                    className={`lec-row${selectedBook?.bookId === b.bookId && !isNewBook ? ' active' : ''}`}
                                    onClick={() => pickBook(b)}
                                >
                                    <div className="lec-avatar">
                                        <span style={{ fontSize: '1.1rem' }}>📗</span>
                                    </div>
                                    <div className="lec-row-info">
                                        <div className="lec-row-name">{b.bookName || 'بدون عنوان'}</div>
                                        <div className="lec-row-spec">{b.author || '—'}</div>
                                    </div>
                                    <div className="lec-row-id">#{b.bookId}</div>
                                </div>
                            ))
                        )}

                        {/* Types list */}
                        {subPage === 'types' && (
                            typesLoading ? (
                                <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                    <div className="adm-emi">⏳</div><p>جاري التحميل...</p>
                                </div>
                            ) : typesError ? (
                                <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                    <p style={{ color: 'red' }}>❌ {typesError}</p>
                                </div>
                            ) : filteredTypes.length === 0 ? (
                                <div className="adm-empty" style={{ padding: '32px 12px' }}>
                                    <div className="adm-emi">🔍</div><p>لا توجد نتائج</p>
                                </div>
                            ) : filteredTypes.map(t => (
                                <div
                                    key={t.typeId}
                                    className={`lec-row${selectedType?.typeId === t.typeId && !isNewType ? ' active' : ''}`}
                                    onClick={() => pickType(t)}
                                >
                                    <div className="lec-avatar">
                                        <span style={{ fontSize: '1.1rem' }}>🏷️</span>
                                    </div>
                                    <div className="lec-row-info">
                                        <div className="lec-row-name">{t.typeName}</div>
                                        <div className="lec-row-spec">{t.bookCount ?? '—'} كتاب</div>
                                    </div>
                                    <div className="lec-row-id">#{t.typeId}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ══ FORM AREA (identical structure to LecturersTab) ══ */}
                <div className="lec-form-wrap" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <div className="adm-card lec-form-card">

                        {/* ── BOOKS FORM ── */}
                        {subPage === 'books' && (<>
                            <div className="lec-form-hdr">
                                <div>
                                    <div className="adm-hero-tag" style={{ marginBottom: 6, position: 'relative', zIndex: 1 }}>
                                        {isNewBook ? 'كتاب جديد' : selectedBook ? `ID: #${selectedBook.bookId}` : '—'}
                                    </div>
                                    <h2 className="lec-form-title">
                                        {isNewBook ? '➕ إضافة كتاب جديد' : '✏️ تعديل بيانات الكتاب'}
                                    </h2>
                                    {!isNewBook && selectedBook && (
                                        <p className="lec-form-sub">{selectedBook.bookName}</p>
                                    )}
                                </div>
                                <div className="lec-stat-pill">📚 {totalItems} كتاب</div>
                            </div>

                            <div className="lec-form-body">

                                {/* Cover + fields — same top-row pattern */}
                                <div className="lec-top-row">
                                    <div className="lec-photo-col">
                                        <label className="lec-label">غلاف الكتاب</label>
                                        <CoverZone
                                            cover={formBook.cover}
                                            onCoverChange={val => setFormBook(f => ({ ...f, cover: val }))}
                                            onCoverRemove={() => setFormBook(f => ({ ...f, cover: null }))}
                                        />
                                    </div>

                                    <div className="lec-fields-grid">
                                        <div className="lec-field">
                                            <label className="lec-label">الرقم</label>
                                            <input
                                                className="lec-inp"
                                                value={isNewBook ? 'تلقائي' : (formBook.bookId || '—')}
                                                disabled
                                                style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }}
                                            />
                                        </div>
                                        <div className="lec-field">
                                            <label className="lec-label">اسم الكتاب *</label>
                                            <input
                                                className="lec-inp"
                                                name="bookName"
                                                value={formBook.bookName ?? ''}
                                                onChange={e => setFormBook(f => ({ ...f, bookName: e.target.value }))}
                                                placeholder="عنوان الكتاب..."
                                            />
                                        </div>
                                        <div className="lec-field">
                                            <label className="lec-label">المؤلف</label>
                                            <input
                                                className="lec-inp"
                                                name="author"
                                                value={formBook.author ?? ''}
                                                onChange={e => setFormBook(f => ({ ...f, author: e.target.value }))}
                                                placeholder="اسم المؤلف..."
                                            />
                                        </div>
                                        <div className="lec-field">
                                            <label className="lec-label">سنة الإصدار</label>
                                            <input
                                                className="lec-inp"
                                                name="bookDate"
                                                value={formBook.bookDate ?? ''}
                                                onChange={e => setFormBook(f => ({ ...f, bookDate: e.target.value }))}
                                                placeholder="مثال: 2023"
                                                type="number"
                                                min="1900"
                                                max="2100"
                                            />
                                        </div>
                                        <div className="lec-field" style={{ gridColumn: '1/-1' }}>
                                            <label className="lec-label">نوع الكتاب</label>
                                            <select
                                                className="lec-inp"
                                                style={{ cursor: 'pointer' }}
                                                value={formBook.typeId ?? ''}
                                                onChange={e => {
                                                    const id = Number(e.target.value);
                                                    const found = bookTypes.find(t => t.typeId === id);
                                                    setFormBook(f => ({ ...f, typeId: id, typeName: found?.typeName ?? '' }));
                                                }}
                                            >
                                                <option value="">-- اختر النوع --</option>
                                                {bookTypes.map(t => (
                                                    <option key={t.typeId} value={t.typeId}>{t.typeName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="lec-divider" />

                                {/* Actions */}
                                <div className="lec-actions">
                                    <button className="lec-act-btn save" onClick={handleBookSave} disabled={bookSaving}>
                                        {bookSaving ? '⏳ جارٍ الحفظ...' : '💾 حفظ'}
                                    </button>
                                    <button className="lec-act-btn new" onClick={handleBookNew}>➕ كتاب جديد</button>
                                    <button className="lec-act-btn reset" onClick={handleBookReset}>↩ إلغاء</button>
                                    <div style={{ flex: 1 }} />
                                    {!isNewBook && selectedBook && (
                                        delConfBook ? (
                                            <div className="lec-delete-confirm">
                                                <span className="lec-delete-warn">⚠️ هل أنت متأكد من الحذف؟</span>
                                                <button className="lec-act-btn delete" onClick={handleBookDelete}>تأكيد</button>
                                                <button className="adm-fclear" onClick={() => setDelConfBook(false)}>إلغاء</button>
                                            </div>
                                        ) : (
                                            <button className="lec-act-btn delete" onClick={handleBookDelete}>🗑 حذف الكتاب</button>
                                        )
                                    )}
                                </div>
                            </div>
                        </>)}

                        {/* ── TYPES FORM ── */}
                        {subPage === 'types' && (<>
                            <div className="lec-form-hdr">
                                <div>
                                    <div className="adm-hero-tag" style={{ marginBottom: 6, position: 'relative', zIndex: 1 }}>
                                        {isNewType ? 'نوع جديد' : `ID: #${selectedType?.typeId}`}
                                    </div>
                                    <h2 className="lec-form-title">
                                        {isNewType ? '➕ إضافة نوع جديد' : '✏️ تعديل النوع'}
                                    </h2>
                                    {!isNewType && selectedType && (
                                        <p className="lec-form-sub">{selectedType.typeName}</p>
                                    )}
                                </div>
                                <div className="lec-stat-pill">🏷️ {bookTypes.length} نوع</div>
                            </div>

                            <div className="lec-form-body">

                                <div className="lec-fields-grid" style={{ marginBottom: 20 }}>
                                    <div className="lec-field">
                                        <label className="lec-label">الرقم</label>
                                        <input
                                            className="lec-inp"
                                            value={isNewType ? 'تلقائي' : formType.typeId}
                                            disabled
                                            style={{ background: T.gray100, color: T.gray500, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="lec-field">
                                        <label className="lec-label">اسم النوع *</label>
                                        <input
                                            className="lec-inp"
                                            value={formType.typeName ?? ''}
                                            onChange={e => setFormType(f => ({ ...f, typeName: e.target.value }))}
                                            placeholder="مثال: الهندسة المدنية..."
                                        />
                                    </div>
                                </div>

                                <div className="lec-divider" />

                                {/* Types table */}
                                <div className="lec-rte-block" style={{ marginBottom: 18 }}>
                                    <div className="lec-rte-hdr">
                                        <span className="lec-rte-icon">🏷️</span>
                                        <div style={{ flex: 1 }}>
                                            <div className="lec-rte-label">قائمة أنواع الكتب</div>
                                            <div className="lec-rte-sub">اضغط على صف لتعديله</div>
                                        </div>
                                        <span style={{ fontSize: '.72rem', color: T.gray500, fontWeight: 700 }}>{bookTypes.length} نوع</span>
                                    </div>
                                    {typesLoading ? (
                                        <div style={{ padding: 20, textAlign: 'center' }}>⏳ جارٍ التحميل...</div>
                                    ) : typesError ? (
                                        <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>❌ {typesError}</div>
                                    ) : (
                                        <div className="adm-tscr" style={{ maxHeight: 320, overflowY: 'auto' }}>
                                            <table className="adm-tbl" style={{ minWidth: 0 }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: 80 }}>#</th>
                                                        <th>الاسم</th>
                                                        <th className="c" style={{ width: 100 }}>عدد الكتب</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[...bookTypes].sort((a, b) => b.typeId - a.typeId).map(t => (
                                                        <tr
                                                            key={t.typeId}
                                                            className={selectedType?.typeId === t.typeId && !isNewType ? 'xopen' : ''}
                                                            onClick={() => pickType(t)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <td>
                                                                <span style={{ fontFamily: 'Courier New', fontWeight: 900, color: T.orange, fontSize: '.78rem' }}>
                                                                    {t.typeId}
                                                                </span>
                                                            </td>
                                                            <td style={{ fontWeight: 600 }}>{t.typeName}</td>
                                                            <td style={{ textAlign: 'center' }}>
                                                                <span className="adm-cb">{t.bookCount ?? '—'}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    <div style={{
                                        background: T.gray100, padding: '8px 18px',
                                        textAlign: 'center', fontSize: '.72rem',
                                        fontWeight: 700, color: T.gray500,
                                        borderTop: `1.5px solid ${T.gray300}`
                                    }}>
                                        إجمالي الأنواع: {bookTypes.length}
                                    </div>
                                </div>

                                <div className="lec-divider" />

                                {/* Actions */}
                                <div className="lec-actions">
                                    <button className="lec-act-btn save" onClick={handleTypeSave} disabled={typeSaving}>
                                        {typeSaving ? '⏳ جارٍ الحفظ...' : '💾 حفظ'}
                                    </button>
                                    <button className="lec-act-btn new" onClick={handleTypeNew}>➕ نوع جديد</button>
                                    <button className="lec-act-btn reset" onClick={handleTypeReset}>↩ إلغاء</button>
                                    <div style={{ flex: 1 }} />
                                    {!isNewType && selectedType && (
                                        delConfType ? (
                                            <div className="lec-delete-confirm">
                                                <span className="lec-delete-warn">⚠️ هل أنت متأكد من الحذف؟</span>
                                                <button className="lec-act-btn delete" onClick={handleTypeDelete}>تأكيد</button>
                                                <button className="adm-fclear" onClick={() => setDelConfType(false)}>إلغاء</button>
                                            </div>
                                        ) : (
                                            <button className="lec-act-btn delete" onClick={handleTypeDelete}>🗑 حذف النوع</button>
                                        )
                                    )}
                                </div>
                            </div>
                        </>)}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default BooksTab;