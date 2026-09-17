// tabs/UsersTab.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useState } from 'react';
import logoSrc from '../../../assets/white.webp';
import { T, ITEMS_PER_PAGE } from '../constants';
import { rtlExport } from '../helpers';
import { exportExcel, exportPDF, exportWord, buildUsersRows, withExport } from '../exportHelpers';
import { Pagination } from '../Pagination';
export function UsersTab({ data, loading, error, searchQuery, setSearchQuery, dateFrom, setDateFrom, dateTo, setDateTo, currentPage, setCurrentPage, expandedRow, setExpandedRow, attendance, certificates, setExporting, setExportError }) {
    const exportRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const paginated = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const wrap = withExport(setExporting, setExportError, () => setMenuOpen(false));
    const doExcel = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildUsersRows(data))); await exportExcel('المستخدمون-والدورات.xlsx', 'تقرير المستخدمين والدورات', headers, rows, logoSrc); });
    const doPDF = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildUsersRows(data))); await exportPDF('تقرير-المستخدمين.pdf', 'تقرير المستخدمين والدورات', headers, rows, 'ICEMT', logoSrc); });
    const doWord = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildUsersRows(data))); await exportWord('تقرير-المستخدمين.docx', 'تقرير المستخدمين والدورات', 'ICEMT', headers, rows, logoSrc); });

    return (
        <>
            <div className="adm-section-hdr">
                <div><div className="adm-section-tag">إدارة البيانات</div><div className="adm-section-title">المستخدمون <span>والدورات</span></div></div>
            </div>
            <div className="adm-toolbar">
                <div className="adm-search">
                    <input type="text" placeholder="ابحث باسم المستخدم أو البريد..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setExpandedRow(null); }} />
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
                        : data.length === 0 ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
                            : (<>
                                <div className="adm-tscr">
                                    <table className="adm-tbl">
                                        <thead><tr>
                                            <th className="c" style={{ width: 40 }}>#</th>
                                            <th>المستخدم</th><th>البريد الإلكتروني</th>
                                            <th className="c">الدورات</th><th className="c">تفاصيل</th>
                                        </tr></thead>
                                        <tbody>
                                            {paginated.map((u, idx) => {
                                                const rowNum = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                                return (
                                                    <React.Fragment key={u.id}>
                                                        <tr className={expandedRow === u.id ? 'xopen' : ''}>
                                                            <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                            <td><div className="adm-uc"><div className="adm-av">{(u.firstName || u.username || '?')[0]}{(u.lastName || '')[0]}</div><span className="adm-uname">{u.firstName || u.username} {u.lastName}</span></div></td>
                                                            <td className="adm-email">{u.email}</td>
                                                            <td style={{ textAlign: 'center' }}><span className="adm-cb">{u.enrolledCourses.length}</span></td>
                                                            <td style={{ textAlign: 'center' }}>{u.enrolledCourses.length > 0 ? <span className={`adm-pill${expandedRow === u.id ? ' op' : ''}`} onClick={() => setExpandedRow(expandedRow === u.id ? null : u.id)}>{expandedRow === u.id ? '▲ إخفاء' : '▼ عرض'}</span> : <span style={{ color: T.gray300 }}>—</span>}</td>
                                                        </tr>
                                                        {expandedRow === u.id && (
                                                            <tr className="adm-xrow"><td colSpan={5}>
                                                                <div className="adm-xin">
                                                                    {u.enrolledCourses.map(c => {
                                                                        const ck = String(c.enrollmentId ?? `${u.id}-${c.id}`);
                                                                        return (
                                                                            <div className="adm-mc" key={ck}>
                                                                                <div className="adm-mt">📚 {c.title}</div>
                                                                                {c.date && <div className="adm-md">📅 {c.date}</div>}
                                                                                <div style={{ marginTop: 5, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                                                                    <span className={`adm-att-badge ${attendance[String(c.enrollmentId)] ? 'on' : 'off'}`} style={{ fontSize: '.62rem' }}>{attendance[String(c.enrollmentId)] ? '✅ حضر' : '❌ غائب'}</span>
                                                                                    {(certificates[ck] ?? certificates[`${u.id}-${c.id}`]) ? <span style={{ fontSize: '.62rem', color: T.orange, fontWeight: 700 }}>📜 شهادة</span> : null}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </td></tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination currentPage={currentPage} totalItems={data.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} accentColor={T.blue} />
                            </>)}
            </div>
        </>
    );
} export default UsersTab;

