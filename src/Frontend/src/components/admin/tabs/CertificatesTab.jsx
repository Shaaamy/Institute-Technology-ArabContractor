// tabs/CertificatesTab.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useState } from 'react';
import logoSrc from '../../../assets/white.webp';
import { T, ITEMS_PER_PAGE } from '../constants';
import { rtlExport, normaliseCert } from '../helpers';
import { exportExcel, exportPDF, exportWord, buildCertRows, withExport } from '../exportHelpers';
import { Pagination } from '../Pagination';

export function CertificatesTab({
    rows, loading, certificates, certUploading, certDeleting,
    error, setError, search, setSearch, statusFilter, setStatusFilter,
    currentPage, setCurrentPage, attendance,
    onOpenModal, onViewCert, onDeleteCert, setExporting, setExportError,
}) {
    const exportRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const paginated = rows.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const wrap = withExport(setExporting, setExportError, () => setMenuOpen(false));
    const doExcel = wrap(async () => { const { headers, rows: r } = rtlExport(...Object.values(buildCertRows(rows, certificates, attendance))); await exportExcel('تقرير-الشهادات.xlsx', 'تقرير الشهادات', headers, r, logoSrc); });
    const doPDF = wrap(async () => { const { headers, rows: r } = rtlExport(...Object.values(buildCertRows(rows, certificates, attendance))); await exportPDF('تقرير-الشهادات.pdf', 'تقرير الشهادات', headers, r, 'ICEMT', logoSrc); });
    const doWord = wrap(async () => { const { headers, rows: r } = rtlExport(...Object.values(buildCertRows(rows, certificates, attendance))); await exportWord('تقرير-الشهادات.docx', 'تقرير الشهادات', 'ICEMT', headers, r, logoSrc); });

    // ── helper: get normalised cert for a row ────────────────────────────────
    // certificates map now stores already-normalised objects (see parent loader)
    const getCert = (row) =>
        certificates[row.certKey] ?? (row.altKey ? certificates[row.altKey] : undefined);

    // summary numbers
    const uploaded = rows.filter(r => !!getCert(r)?.url).length;
    const withUrl = uploaded; // every cert with a resolved URL is viewable
    const attendedTotal = rows.filter(r => !!attendance[String(r.enrollmentId)]).length;
    const pendingUp = rows.filter(r => !getCert(r)?.url && !!attendance[String(r.enrollmentId)]).length;
    const notAttended = rows.filter(r => !attendance[String(r.enrollmentId)]).length;
    const pct = attendedTotal > 0 ? Math.round(uploaded / attendedTotal * 100) : 0;

    const STATUS_FILTERS = [
        { id: 'all', label: 'الكل', icon: '📋' },
        { id: 'uploaded', label: 'مرفوعة', icon: '✅' },
        { id: 'pending', label: 'حضر / لم تُرفع', icon: '📄' },
        { id: 'not-attended', label: 'لم يحضر', icon: '🚫' },
    ];

    return (
        <>
            <div className="adm-section-hdr">
                <div>
                    <div className="adm-section-tag">إدارة الشهادات</div>
                    <div className="adm-section-title"><span>الشهادات</span> الإلكترونية</div>
                </div>
            </div>

            <div className="adm-toolbar">
                <div className="adm-search" style={{ minWidth: 210 }}>
                    <input
                        type="text"
                        placeholder="ابحث باسم المستخدم أو الدورة..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                {search && <button className="adm-fclear" onClick={() => setSearch('')}>✕</button>}

                <div style={{ display: 'flex', gap: 5, marginRight: 'auto', flexWrap: 'wrap' }}>
                    {STATUS_FILTERS.map(f => (
                        <button
                            key={f.id}
                            style={{
                                padding: '5px 12px', borderRadius: 2, border: '1.5px solid',
                                fontFamily: T.font, fontSize: '.7rem', fontWeight: 700,
                                cursor: 'pointer', transition: 'all .14s',
                                background: statusFilter === f.id ? (f.id === 'uploaded' ? '#f0fdf4' : 'rgba(8,101,168,0.08)') : T.gray100,
                                borderColor: statusFilter === f.id ? (f.id === 'uploaded' ? '#86efac' : 'rgba(8,101,168,0.3)') : T.gray300,
                                color: statusFilter === f.id ? (f.id === 'uploaded' ? '#15803d' : T.blue) : T.gray500,
                            }}
                            onClick={() => setStatusFilter(f.id)}
                        >
                            {f.icon} {f.label}
                        </button>
                    ))}
                </div>

                <div className="adm-expw" ref={exportRef}>
                    <button className="adm-expbtn" onClick={() => setMenuOpen(p => !p)}>⬇ تصدير ▾</button>
                    {menuOpen && (
                        <div className="adm-expmenu">
                            <button className="adm-expitem" onClick={doExcel}>📊 Excel (.xlsx)</button>
                            <button className="adm-expitem" onClick={doPDF}>📄 PDF</button>
                            <button className="adm-expitem" onClick={doWord}>📝 Word (.docx)</button>
                        </div>
                    )}
                </div>
            </div>

            {!loading && (
                <div className="adm-cert-sum">
                    <span style={{ fontSize: '.76rem', fontWeight: 900, color: T.black }}>📜 ملخص الشهادات</span>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                        {[
                            { label: `✅ مرفوعة: ${uploaded}${withUrl > 0 ? ` (${withUrl} قابلة للعرض)` : ''}`, bg: '#f0fdf4', color: '#15803d', border: '#86efac' },
                            { label: `📄 حضر ولم تُرفع: ${pendingUp}`, bg: 'rgba(8,101,168,0.06)', color: T.blue, border: 'rgba(8,101,168,0.2)' },
                            { label: `🚫 لم يحضر: ${notAttended}`, bg: T.gray100, color: T.gray500, border: T.gray300 },
                            { label: `📋 الإجمالي: ${rows.length}`, bg: 'rgba(8,101,168,0.06)', color: T.blue, border: 'rgba(8,101,168,0.2)' },
                        ].map(b => (
                            <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 11px', borderRadius: 2, background: b.bg, border: `1.5px solid ${b.border}`, color: b.color, fontSize: '.7rem', fontWeight: 700 }}>
                                {b.label}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
                        <div style={{ flex: 1, height: 6, background: T.gray300, borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg,${T.orange},${T.orangeLight})`, borderRadius: 3, transition: 'width .5s ease' }} />
                        </div>
                        <span style={{ fontSize: '.68rem', fontWeight: 700, color: T.orange, minWidth: 32 }}>{pct}٪</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="adm-err">
                    ⚠️ {error}
                    <button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setError(null)}>✕</button>
                </div>
            )}

            <div className="adm-card">
                {loading
                    ? <div className="adm-ld"><div className="adm-sp" /><p>جاري التحميل...</p></div>
                    : rows.length === 0
                        ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج</p></div>
                        : (
                            <>
                                <div className="adm-cert-grid">
                                    {paginated.map(row => {
                                        const ck = row.certKey;
                                        const cert = getCert(row);           // normalised cert object
                                        const certUrl = cert?.url ?? null;      // resolved absolute URL
                                        const uploading = certUploading[ck];
                                        const deleting = !!certDeleting[ck];
                                        const isAtt = !!attendance[String(row.enrollmentId)];
                                        const hasCert = !!certUrl;

                                        return (
                                            <div
                                                className={`adm-cert-card${hasCert ? ' has-cert' : ''}`}
                                                key={ck}
                                                style={{ opacity: !isAtt && !hasCert ? 0.75 : 1 }}
                                            >
                                                <div className="adm-cert-card-top">
                                                    <div className={`adm-cert-icon${hasCert ? ' has' : !isAtt ? ' grey' : ''}`}>
                                                        {hasCert ? '📜' : isAtt ? '📄' : '🚫'}
                                                    </div>
                                                    <div className="adm-cert-info">
                                                        <div className="adm-cert-name">{row.user.firstName || row.user.username} {row.user.lastName}</div>
                                                        <div className="adm-cert-course">📚 {row.course.title}</div>
                                                        <div className="adm-cert-badges">
                                                            <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 2, background: isAtt ? '#f0fdf4' : T.gray100, color: isAtt ? '#15803d' : T.gray500, border: `1px solid ${isAtt ? '#86efac' : T.gray300}` }}>
                                                                {isAtt ? '✅ حضر' : '❌ غائب'}
                                                            </span>
                                                            {hasCert && (
                                                                <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 2, background: '#f0fdf4', color: '#15803d', border: '1px solid #86efac' }}>
                                                                    📜 {cert.name && cert.name !== 'uploaded' ? (cert.name.length > 20 ? cert.name.slice(0, 20) + '…' : cert.name) : 'مرفوعة'}
                                                                </span>
                                                            )}
                                                            {!hasCert && isAtt && (
                                                                <span style={{ fontSize: '.6rem', color: T.orange, padding: '2px 8px', borderRadius: 2, background: 'rgba(245,124,0,0.06)', border: '1px solid rgba(245,124,0,0.2)' }}>
                                                                    لم تُرفع بعد
                                                                </span>
                                                            )}
                                                            {!hasCert && !isAtt && (
                                                                <span style={{ fontSize: '.6rem', color: T.gray500, padding: '2px 8px', borderRadius: 2, background: T.gray100, border: `1px solid ${T.gray300}` }}>
                                                                    يجب تسجيل الحضور أولاً
                                                                </span>
                                                            )}
                                                            {cert?.uploadedAt && (
                                                                <span style={{ fontSize: '.58rem', color: T.gray500, padding: '2px 6px', borderRadius: 2, background: T.gray100, border: `1px solid ${T.gray300}` }}>
                                                                    🗓 {cert.uploadedAt}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="adm-cert-actions">
                                                    {hasCert ? (
                                                        <>
                                                            {/* View button — passes the resolved URL directly */}
                                                            <button
                                                                className="adm-cert-btn dl"
                                                                onClick={() => onViewCert(cert.id, certUrl, cert.rawUrl, cert.name, row.userId, row.planworkId)}
                                                            >
                                                                👁 عرض
                                                            </button>
                                                            <button
                                                                className="adm-cert-btn up"
                                                                disabled={uploading}
                                                                onClick={() => onOpenModal({ enrollmentId: row.enrollmentId, userId: row.userId, planworkId: row.planworkId, certKey: ck, userName: `${row.user.firstName || row.user.username} ${row.user.lastName}`, courseTitle: row.course.title })}
                                                            >
                                                                {uploading ? '⏳' : '🔄 تحديث'}
                                                            </button>
                                                            <button
                                                                className="adm-cert-btn rm"
                                                                disabled={deleting}
                                                                onClick={() => onDeleteCert(ck, row.altKey)}
                                                            >
                                                                {deleting ? '⏳' : '🗑'}
                                                            </button>
                                                        </>
                                                    ) : isAtt ? (
                                                        <button
                                                            className="adm-cert-btn up full"
                                                            disabled={uploading}
                                                            onClick={() => onOpenModal({ enrollmentId: row.enrollmentId, userId: row.userId, planworkId: row.planworkId, certKey: ck, userName: `${row.user.firstName || row.user.username} ${row.user.lastName}`, courseTitle: row.course.title })}
                                                        >
                                                            {uploading ? '⏳ جاري الرفع...' : '⬆ رفع شهادة'}
                                                        </button>
                                                    ) : (
                                                        <span style={{ fontSize: '.62rem', color: T.gray300, width: '100%', textAlign: 'center' }}>
                                                            سجّل الحضور أولاً لرفع الشهادة
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalItems={rows.length}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={setCurrentPage}
                                    accentColor={T.orange}
                                />
                            </>
                        )}
            </div>
        </>
    );
}

export default CertificatesTab;