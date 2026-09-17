// tabs/CoursesTab.jsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState } from 'react';
import logoSrc from '../../../assets/white.webp';
import { T, ITEMS_PER_PAGE } from '../constants';
import { rtlExport } from '../helpers';
import { exportExcel, exportPDF, exportWord, buildCoursesRows, withExport } from '../exportHelpers';
import { Pagination } from '../Pagination';
export function CoursesTab({ data, loading, error, searchQuery, setSearchQuery, dateFrom, setDateFrom, dateTo, setDateTo, currentPage, setCurrentPage, expandedRow, setExpandedRow, setExporting, setExportError }) {
    const exportRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const paginated = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const wrap = withExport(setExporting, setExportError, () => setMenuOpen(false));
    const doExcel = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildCoursesRows(data))); await exportExcel('الدورات-والمستخدمون.xlsx', 'تقرير الدورات والمستخدمين', headers, rows, logoSrc); });
    const doPDF = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildCoursesRows(data))); await exportPDF('تقرير-الدورات.pdf', 'تقرير الدورات والمستخدمين', headers, rows, 'ICEMT', logoSrc); });
    const doWord = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildCoursesRows(data))); await exportWord('تقرير-الدورات.docx', 'تقرير الدورات والمستخدمين', 'ICEMT', headers, rows, logoSrc); });

    return (
        <>
            <div className="adm-section-hdr">
                <div><div className="adm-section-tag">إدارة البيانات</div><div className="adm-section-title">الدورات <span>والمستخدمون</span></div></div>
            </div>
            <div className="adm-toolbar">
                <div className="adm-search">
                    <input type="text" placeholder="ابحث باسم الدورة أو الفئة..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setExpandedRow(null); }} />
                </div>
                <span style={{ fontSize: '.74rem', fontWeight: 700, color: T.gray700 }}>📅</span>
                <span style={{ fontSize: '.68rem', color: T.gray500 }}>من</span>
                <input type="date" className="adm-fdate" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setExpandedRow(null); }} />
                <span style={{ fontSize: '.68rem', color: T.gray500 }}>إلى</span>
                <input type="date" className="adm-fdate" value={dateTo} min={dateFrom} onChange={e => { setDateTo(e.target.value); setExpandedRow(null); }} />
                {(dateFrom || dateTo) && (<><span className="adm-filter-active">🔶 فلتر نشط</span><button className="adm-fclear" onClick={() => { setDateFrom(''); setDateTo(''); setExpandedRow(null); }}>✕</button></>)}
                <div className="adm-expw" ref={exportRef} style={{ marginRight: 'auto' }}>
                    <button className="adm-expbtn" onClick={() => setMenuOpen(p => !p)}>⬇ تصدير ▾</button>
                    {menuOpen && <div className="adm-expmenu"><button className="adm-expitem" onClick={doExcel}>📊 Excel (.xlsx)</button><button className="adm-expitem" onClick={doPDF}>📄 PDF</button><button className="adm-expitem" onClick={doWord}>📝 Word (.docx)</button></div>}
                </div>
            </div>
            <div className="adm-card">
                {loading ? <div className="adm-ld"><div className="adm-sp" /><p>جاري تحميل البيانات...</p></div>
                    : error ? <div className="adm-empty"><div className="adm-emi">⚠️</div><p>{error}</p></div>
                        : data.length === 0 ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج</p></div>
                            : (<>
                                <div className="adm-tscr">
                                    <table className="adm-tbl">
                                        <thead><tr>
                                            <th className="c" style={{ width: 40 }}>#</th>
                                            <th className="or">اسم الدورة</th><th className="or c">المسجّلون</th><th className="or c">تفاصيل</th>
                                        </tr></thead>
                                        <tbody>
                                            {paginated.map((c, idx) => {
                                                const rowNum = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                return (
                                                    <React.Fragment key={c.id}>
                                                        <tr className={expandedRow === c.id ? 'xopen' : ''}>
                                                            <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                            <td style={{ fontWeight: 700, color: T.blue }}>📚 {c.title}</td>
                                                            <td style={{ textAlign: 'center' }}><span className="adm-cb or">{c.enrolledUsers.length}</span></td>
                                                            <td style={{ textAlign: 'center' }}>{c.enrolledUsers.length > 0 ? <span className={`adm-pill or${expandedRow === c.id ? ' op' : ''}`} onClick={() => setExpandedRow(expandedRow === c.id ? null : c.id)}>{expandedRow === c.id ? '▲ إخفاء' : '▼ عرض'}</span> : <span style={{ color: T.gray300 }}>—</span>}</td>
                                                        </tr>
                                                        {expandedRow === c.id && (
                                                            <tr className="adm-xrow"><td colSpan={4}>
                                                                <div className="adm-xin">
                                                                    {c.enrolledUsers.map(u => (
                                                                        <div className="adm-mc" key={u.enrollmentId ?? u.email}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                                                                                <div className="adm-av or sm">{(u.firstName || u.username || '?')[0]}{(u.lastName || '')[0]}</div>
                                                                                <div><div className="adm-mt or">{u.firstName || u.username} {u.lastName}</div><div className="adm-ms">✉ {u.email}</div></div>
                                                                            </div>
                                                                            {u.date && <div className="adm-md">📅 {u.date}</div>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td></tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination currentPage={currentPage} totalItems={data.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} accentColor={T.orange} />
                            </>)}
            </div>
        </>
    );
}
export default CoursesTab;