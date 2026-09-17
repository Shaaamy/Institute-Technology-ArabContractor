// tabs/AttendanceTab.jsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState } from 'react';
import logoSrc from '../../../assets/white.webp';
import { T, ITEMS_PER_PAGE } from '../constants';
import { rtlExport } from '../helpers';
import { exportExcel, exportPDF, exportWord, buildAttRows, withExport } from '../exportHelpers';
import { Pagination } from '../Pagination';
export function AttendanceTab({ rows, loading, attendance, attendanceSaving, error, setError, courseFilter, setCourseFilter, userSearch, setUserSearch, currentPage, setCurrentPage, coursesData, toggleAttendance, setExporting, setExportError }) {
    const exportRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const paginated = rows.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const presentCount = rows.filter(r => !!attendance[String(r.course.enrollmentId)]).length;

    const wrap = withExport(setExporting, setExportError, () => setMenuOpen(false));
    const doExcel = wrap(async () => { const { headers, rows: r } = rtlExport(...Object.values(buildAttRows(rows, attendance))); await exportExcel('تقرير-الحضور.xlsx', 'تقرير الحضور', headers, r, logoSrc); });
    const doPDF = wrap(async () => { const { headers, rows: r } = rtlExport(...Object.values(buildAttRows(rows, attendance))); await exportPDF('تقرير-الحضور.pdf', 'تقرير الحضور', headers, r, 'ICEMT', logoSrc); });
    const doWord = wrap(async () => { const { headers, rows: r } = rtlExport(...Object.values(buildAttRows(rows, attendance))); await exportWord('تقرير-الحضور.docx', 'تقرير الحضور', 'ICEMT', headers, r, logoSrc); });

    return (
        <>
            <div className="adm-section-hdr">
                <div><div className="adm-section-tag">متابعة الحضور</div><div className="adm-section-title">سجل <span>الحضور</span></div></div>
            </div>
            <div className="adm-toolbar">
                <span style={{ fontSize: '.74rem', fontWeight: 700, color: T.gray700 }}>🎓 الدورة:</span>
                <select className="adm-fsel" value={courseFilter} onChange={e => setCourseFilter(e.target.value)}>
                    <option value="all">جميع الدورات</option>
                    {coursesData.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <div className="adm-search" style={{ minWidth: 170 }}>
                    <input type="text" placeholder="ابحث باسم المستخدم..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                </div>
                {userSearch && <button className="adm-fclear" onClick={() => setUserSearch('')}>✕ مسح</button>}
                <div className="adm-expw" ref={exportRef} style={{ marginRight: 'auto' }}>
                    <button className="adm-expbtn" onClick={() => setMenuOpen(p => !p)}>⬇ تصدير ▾</button>
                    {menuOpen && <div className="adm-expmenu"><button className="adm-expitem" onClick={doExcel}>📊 Excel (.xlsx)</button><button className="adm-expitem" onClick={doPDF}>📄 PDF</button><button className="adm-expitem" onClick={doWord}>📝 Word (.docx)</button></div>}
                </div>
            </div>

            <div className="adm-att-sum">
                <span>✅ {presentCount} حضر</span>
                <span>❌ {rows.length - presentCount} غائب</span>
                <span>📋 {rows.length} إجمالي</span>
                {rows.length > 0 && (() => { const pct = Math.round(presentCount / rows.length * 100); return (<><span>{pct}٪ حضور</span><div className="adm-prog-wrap"><div className="adm-prog-fill" style={{ width: `${pct}%` }} /></div></>); })()}
            </div>

            {error && <div className="adm-err">⚠️ {error}<button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setError(null)}>✕</button></div>}

            <div className="adm-card">
                {loading ? <div className="adm-ld"><div className="adm-sp" /><p>جاري التحميل...</p></div>
                    : rows.length === 0 ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج</p></div>
                        : (<>
                            <div className="adm-tscr">
                                <table className="adm-tbl">
                                    <thead><tr>
                                        <th className="c" style={{ width: 40 }}>#</th>
                                        <th>المستخدم</th><th>البريد الإلكتروني</th><th>الدورة</th>
                                        <th className="gr c">تسجيل الحضور</th><th className="gr c">الحالة</th>
                                    </tr></thead>
                                    <tbody>
                                        {paginated.map((row, idx) => {
                                            const rowNum = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                            const eid = row.course.enrollmentId;
                                            const k = String(eid);
                                            const attended = !!attendance[k];
                                            const saving = !!attendanceSaving[k];
                                            return (
                                                <tr key={k + idx}>
                                                    <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                    <td><div className="adm-uc"><div className="adm-av">{(row.user.firstName || row.user.username || '?')[0]}{(row.user.lastName || '')[0]}</div><span className="adm-uname">{row.user.firstName || row.user.username} {row.user.lastName}</span></div></td>
                                                    <td className="adm-email">{row.user.email}</td>
                                                    <td style={{ color: T.blue, fontWeight: 700 }}>{row.course.title}</td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <div className={`adm-chk${saving ? ' spin' : attended ? ' on' : ''}`} onClick={() => !saving && toggleAttendance(eid, attended)}>{!saving && attended && '✓'}</div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}><span className={`adm-att-badge ${attended ? 'on' : 'off'}`}>{attended ? '✅ حضر' : '❌ غائب'}</span></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination currentPage={currentPage} totalItems={rows.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} accentColor="#16a34a" />
                        </>)}
            </div>
        </>
    );
}
export default AttendanceTab;
