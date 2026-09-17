// tabs/RefundsTab.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useState } from 'react';
import logoSrc from '../../../assets/white.webp';
import { T, ITEMS_PER_PAGE, REFUND_STATUS_META } from '../constants';
import { rtlExport } from '../helpers';
import { exportExcel, exportPDF, exportWord, buildRefundRows, withExport } from '../exportHelpers';
import { Pagination } from '../Pagination';
export function RefundsTab({ refunds, allRefunds, loading, error, setError, search, setSearch, statusFilter, setStatusFilter, currentPage, setCurrentPage, usersData, coursesData, bankResultBanner, setBankResultBanner, onViewDetail, onAction, setExporting, setExportError }) {
    const exportRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const paginated = refunds.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const stats = {
        total: allRefunds.length,
        pending: allRefunds.filter(r => r.status === 'Pending').length,
        approved: allRefunds.filter(r => r.status === 'Approved').length,
        sent: allRefunds.filter(r => r.status === 'Sent').length,
        rejected: allRefunds.filter(r => r.status === 'Rejected').length,
        totalAmount: allRefunds.filter(r => r.status !== 'Rejected').reduce((s, r) => s + (r.amount || 0), 0),
    };

    const wrap = withExport(setExporting, setExportError, () => setMenuOpen(false));
    const doExcel = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildRefundRows(refunds, usersData, coursesData))); await exportExcel('تقرير-المستردات.xlsx', 'تقرير المستردات', headers, rows, logoSrc); });
    const doPDF = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildRefundRows(refunds, usersData, coursesData))); await exportPDF('تقرير-المستردات.pdf', 'تقرير المستردات', headers, rows, 'ICEMT', logoSrc); });
    const doWord = wrap(async () => { const { headers, rows } = rtlExport(...Object.values(buildRefundRows(refunds, usersData, coursesData))); await exportWord('تقرير-المستردات.docx', 'تقرير المستردات', 'ICEMT', headers, rows, logoSrc); });

    const STATUS_FILTERS = [
        { id: 'all', lbl: 'الكل', cls: '' },
        { id: 'Pending', lbl: '⏳ قيد المراجعة', cls: 'pend' },
        { id: 'Approved', lbl: '✅ موافق عليه', cls: 'appr' },
        { id: 'Sent', lbl: '🏦 أُرسل للبنك', cls: 'bank' },
        { id: 'Rejected', lbl: '❌ مرفوض', cls: 'rjct' },
    ];

    return (
        <>
            <div className="adm-section-hdr">
                <div><div className="adm-section-tag">إدارة المالية</div><div className="adm-section-title">طلبات <span>الاسترداد</span></div></div>
            </div>

            {bankResultBanner && (
                <div className={`rf-bank-banner ${bankResultBanner.type}`}>
                    <span>{bankResultBanner.msg}</span>
                    <button className="rf-bank-banner-close" onClick={() => setBankResultBanner(null)}>✕</button>
                </div>
            )}

            <div className="rf-stat-bar">
                {[
                    { lbl: 'إجمالي', val: stats.total, icon: '📋', bg: T.gray100, color: T.black },
                    { lbl: 'قيد المراجعة', val: stats.pending, icon: '⏳', bg: 'rgba(245,124,0,0.08)', color: T.orange },
                    { lbl: 'موافق عليها', val: stats.approved, icon: '✅', bg: '#f0fdf4', color: '#16a34a' },
                    { lbl: 'أُرسل للبنك', val: stats.sent, icon: '🏦', bg: 'rgba(8,101,168,0.06)', color: T.blue },
                    { lbl: 'مرفوضة', val: stats.rejected, icon: '❌', bg: '#fef2f2', color: '#dc2626' },
                    { lbl: 'إجمالي المبالغ', val: `${stats.totalAmount.toLocaleString()} EGP`, icon: '💰', bg: '#f0fdf4', color: '#15803d' },
                ].map(s => (
                    <div key={s.lbl} className="rf-sc">
                        <div className="rf-sc-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                        <div><div className="rf-sc-val" style={{ color: s.color, fontSize: typeof s.val === 'string' ? '.82rem' : '1.3rem' }}>{s.val}</div><div className="rf-sc-lbl">{s.lbl}</div></div>
                    </div>
                ))}
            </div>

            <div className="adm-toolbar">
                <div className="adm-search" style={{ minWidth: 200 }}>
                    <input type="text" placeholder="ابحث برقم الطلب، المبلغ، المستخدم..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="rf-filter-btns">
                    <span style={{ fontSize: '.74rem', fontWeight: 700, color: T.gray700 }}>الحالة:</span>
                    {STATUS_FILTERS.map(f => (
                        <button key={f.id} className={`rf-fbtn${statusFilter === f.id ? ` active ${f.cls}` : ''}`} onClick={() => setStatusFilter(f.id)}>{f.lbl}</button>
                    ))}
                </div>
                {search && <button className="adm-fclear" onClick={() => setSearch('')}>✕</button>}
                <div className="adm-expw" ref={exportRef} style={{ marginRight: 'auto' }}>
                    <button className="adm-expbtn" onClick={() => setMenuOpen(p => !p)}>⬇ تصدير ▾</button>
                    {menuOpen && <div className="adm-expmenu"><button className="adm-expitem" onClick={doExcel}>📊 Excel (.xlsx)</button><button className="adm-expitem" onClick={doPDF}>📄 PDF</button><button className="adm-expitem" onClick={doWord}>📝 Word (.docx)</button></div>}
                </div>
            </div>

            {error && <div className="adm-err">⚠️ {error}<button style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }} onClick={() => setError(null)}>✕</button></div>}

            <div className="adm-card">
                {loading ? <div className="adm-ld"><div className="adm-sp" /><p>جاري تحميل طلبات الاسترداد...</p></div>
                    : refunds.length === 0 ? <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد طلبات مطابقة</p></div>
                        : (<>
                            <div className="adm-tscr">
                                <table className="adm-tbl">
                                    <thead><tr>
                                        <th className="rd c" style={{ width: 36 }}>#</th>
                                        <th className="rd">رقم الطلب</th><th className="rd">المستخدم</th>
                                        <th className="rd c">المبلغ</th><th className="rd">السبب</th>
                                        <th className="rd c">الحالة</th><th className="rd">تاريخ الطلب</th>
                                        <th className="rd c">الإجراءات</th>
                                    </tr></thead>
                                    <tbody>
                                        {paginated.map((r, idx) => {
                                            const rowNum = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                            const u = usersData.find(u => u.id === r.userId) ?? { firstName: '—', lastName: '', email: '—' };
                                            const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;
                                            return (
                                                <tr key={r.id}>
                                                    <td style={{ color: T.gray500, fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                    <td><span style={{ fontFamily: 'Courier New', fontSize: '.76rem', fontWeight: 700, color: T.blue }}>{r.refNumber || r.id}</span></td>
                                                    <td><div className="adm-uc"><div className="adm-av rd">{u.firstName?.[0]}{u.lastName?.[0]}</div><div><div style={{ fontWeight: 700, fontSize: '.78rem' }}>{`${u.firstName} ${u.lastName}`.trim() || '—'}</div><div className="adm-email">{u.email}</div></div></div></td>
                                                    <td style={{ textAlign: 'center' }}><span className="rf-amount">{Number(r.amount || 0).toLocaleString()}</span><span style={{ fontSize: '.6rem', color: T.gray500, marginRight: 3 }}>{r.currency}</span></td>
                                                    <td style={{ maxWidth: 150 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '.74rem', color: T.gray500 }} title={r.reason}>{r.reason || '—'}</div></td>
                                                    <td style={{ textAlign: 'center' }}><span className="rf-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>{sm.icon} {sm.label}</span></td>
                                                    <td style={{ fontSize: '.72rem', fontFamily: 'Courier New', color: T.gray500, whiteSpace: 'nowrap' }}>{r.requestedAt || '—'}</td>
                                                    <td><div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                        <button className="rf-action-btn view" onClick={() => onViewDetail(r)}>🔍 تفاصيل</button>
                                                        {r.status === 'Pending' && <><button className="rf-action-btn approve" onClick={() => onAction(r, 'approve')}>✅</button><button className="rf-action-btn bank" onClick={() => onAction(r, 'send_to_bank')}>🏦</button><button className="rf-action-btn reject" onClick={() => onAction(r, 'reject')}>❌</button></>}
                                                        {r.status === 'Approved' && <button className="rf-action-btn bank" onClick={() => onAction(r, 'send_to_bank')}>🏦 إرسال للبنك</button>}
                                                    </div></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination currentPage={currentPage} totalItems={refunds.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} accentColor="#dc2626" />
                        </>)}
            </div>
        </>
    );
} export default RefundsTab;