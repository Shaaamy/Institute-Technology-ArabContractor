import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getLogoBase64, triggerDownload, rtlExport } from '../../components/admin/helpers';
import { exportExcel, exportPDF, exportWord } from '../../components/admin/exportHelpers';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const BASE = 'https://acwebsite-icmet-test.azurewebsites.net';
const LOGO_SRC = new URL('../../assets/black.webp', import.meta.url).href;

const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueLight: '#1a84d4', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray50: '#f8f9fa', gray100: '#f0f1f2', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
    green: '#16a34a', greenLight: '#f0fdf4', greenBorder: '#86efac',
    red: '#dc2626', purple: '#7c3aed',
    font: '"Noto Kufi Arabic",sans-serif',
};
const CHART_COLORS = [T.blue, T.orange, T.green, T.purple, '#ec4899', '#06b6d4', '#f59e0b', '#84cc16'];
const ITEMS_PER_PAGE = 15;
const REPORT_TITLE = 'التقرير المالي — إيرادات المعهد';
const FIN_HEADERS = ['#', 'اسم المستخدم', 'البريد الإلكتروني', 'الدورة', 'سعر الدورة (EGP)', 'تاريخ التسجيل', 'الحضور', 'إجمالي المستخدم (EGP)'];

// ── Auth ──
async function getToken() {
    try {
        if (window.parent?.Clerk?.session) return await window.parent.Clerk.session.getToken();
        if (window.Clerk?.session) return await window.Clerk.session.getToken();
        const m = document.cookie.match(/(?:^|;\s*)__session=([^;]+)/);
        if (m) return m[1];
    } catch { }
    return null;
}
async function apiFetch(path) {
    const token = await getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE}${path}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// ── Helpers ──
function fmtMoney(n) {
    if (n == null || isNaN(Number(n))) return '0';
    return Number(n).toLocaleString('en-US');
}
function formatDateAr(raw) {
    if (!raw) return null;
    try { return new Date(raw).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return raw; }
}
function buildExportRows(rows, grandTotal) {
    const data = [];
    let n = 1;
    rows.forEach(r => {
        r.courses.forEach((c, i) => {
            data.push(i === 0
                ? [n++, r.username, r.email, c.title, c.price, c.date || '—', c.attended == null ? '—' : c.attended ? 'حضر' : 'غائب', r.totalPaid]
                : ['', '', '', c.title, c.price, c.date || '—', c.attended == null ? '—' : c.attended ? 'حضر' : 'غائب', '']
            );
        });
    });
    data.push(['', '', '', '', '', '', 'الإجمالي الكلي', grandTotal]);
    return data;
}

// ── Styles ──
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700;900&display=swap');
.fin-wrap{direction:rtl;font-family:"Noto Kufi Arabic",sans-serif;}
.fin-income-hero{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;background:linear-gradient(135deg,#044478 0%,#073f6e 50%,#0a3a5c 100%);border-radius:6px;padding:clamp(20px,3vw,32px) clamp(20px,3.5vw,40px);margin-bottom:clamp(18px,2.5vw,24px);position:relative;overflow:hidden;box-shadow:0 8px 32px rgba(4,68,120,0.35);border:1.5px solid rgba(245,124,0,0.3);}
.fin-income-hero::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(245,124,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,0.06) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;}
.fin-income-hero::after{content:'';position:absolute;top:0;right:0;width:5px;height:100%;background:linear-gradient(to bottom,#f57c00,#ff9a3c);}
.fin-total-label{font-size:clamp(.72rem,1.3vw,.82rem);color:rgba(255,255,255,.55);font-weight:700;margin-bottom:6px;}
.fin-total-amount{font-size:clamp(2rem,4.5vw,3.2rem);font-weight:900;color:#fff;line-height:1;letter-spacing:-1px;text-shadow:0 2px 12px rgba(245,124,0,0.35);}
.fin-total-amount .fin-currency{font-size:clamp(.9rem,1.8vw,1.3rem);color:#ff9a3c;margin-right:6px;font-weight:700;}
.fin-total-sub{font-size:clamp(.65rem,1.15vw,.74rem);color:rgba(255,255,255,.4);margin-top:4px;}
.fin-income-pills{display:flex;gap:10px;flex-wrap:wrap;position:relative;z-index:1;}
.fin-ip{display:flex;flex-direction:column;align-items:center;padding:12px 18px;border-radius:6px;min-width:110px;background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.12);transition:all .2s;}
.fin-ip:hover{background:rgba(255,255,255,0.12);border-color:rgba(245,124,0,0.5);transform:translateY(-2px);}
.fin-ip-val{font-size:clamp(1rem,2.2vw,1.4rem);font-weight:900;color:#fff;}
.fin-ip-lbl{font-size:clamp(.58rem,1vw,.65rem);color:rgba(255,255,255,.5);margin-top:3px;font-weight:700;text-align:center;}
.fin-kpi-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:22px;}
@media(max-width:1100px){.fin-kpi-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:680px){.fin-kpi-grid{grid-template-columns:repeat(2,1fr);}}
.fin-kpi{background:#fff;border-radius:6px;border:1.5px solid #d0d3d8;padding:16px;display:flex;flex-direction:column;gap:6px;box-shadow:0 2px 10px rgba(0,0,0,0.06);position:relative;overflow:hidden;transition:transform .25s,box-shadow .25s;}
.fin-kpi::after{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;}
.fin-kpi.orange::after{background:#f57c00;}.fin-kpi.blue::after{background:#0865a8;}.fin-kpi.green::after{background:#16a34a;}.fin-kpi.red::after{background:#dc2626;}.fin-kpi.purple::after{background:#7c3aed;}
.fin-kpi:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.1);}
.fin-kpi-icon{font-size:1.6rem;line-height:1;}
.fin-kpi-val{font-size:clamp(1rem,2.5vw,1.4rem);font-weight:900;line-height:1.1;word-break:break-all;}
.fin-kpi-lbl{font-size:.68rem;color:#6b7280;font-weight:700;}
.fin-kpi-sub{font-size:.62rem;color:#6b7280;}
.fin-charts-grid{display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:22px;}
@media(max-width:900px){.fin-charts-grid{grid-template-columns:1fr;}}
.fin-charts-row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:22px;}
@media(max-width:800px){.fin-charts-row{grid-template-columns:1fr;}}
.fin-chart-card{background:#fff;border-radius:6px;border:1.5px solid #d0d3d8;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);}
.fin-chart-hdr{padding:14px 20px 10px;border-bottom:1px solid #f0f1f2;}
.fin-chart-title{font-weight:900;font-size:.88rem;color:#0a0a0a;}
.fin-chart-sub{font-size:.65rem;color:#6b7280;}
.fin-chart-body{padding:14px 8px 8px;}
.fin-cb-row{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
.fin-cb-name{font-size:.74rem;font-weight:700;color:#0a0a0a;min-width:clamp(100px,22vw,180px);max-width:clamp(100px,22vw,180px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right;}
.fin-cb-track{flex:1;height:8px;background:#f0f1f2;border-radius:4px;overflow:hidden;}
.fin-cb-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#f57c00,#ff9a3c);transition:width .8s cubic-bezier(.4,0,.2,1);}
.fin-cb-fill.blue{background:linear-gradient(90deg,#0865a8,#1a84d4);}
.fin-cb-amt{font-size:.72rem;font-weight:900;color:#f57c00;min-width:75px;text-align:left;}
.fin-cb-count{font-size:.62rem;color:#6b7280;min-width:48px;text-align:left;}
.fin-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:18px;background:#fff;border:1.5px solid #d0d3d8;border-radius:6px;padding:12px 18px;box-shadow:0 2px 8px rgba(0,0,0,0.06);}
.fin-search-input{padding:9px 14px;border-radius:6px;border:1.5px solid #d0d3d8;background:#f0f1f2;color:#0a0a0a;font-family:"Noto Kufi Arabic",sans-serif;font-size:.8rem;outline:none;direction:rtl;transition:border .18s,box-shadow .18s;min-width:220px;}
.fin-search-input:focus{border-color:#f57c00;background:#fff;box-shadow:0 0 0 3px rgba(245,124,0,0.1);}
.fin-search-input::placeholder{color:#6b7280;}
.fin-sort-sel{padding:9px 12px;border-radius:6px;border:1.5px solid #d0d3d8;background:#f0f1f2;color:#0a0a0a;font-family:"Noto Kufi Arabic",sans-serif;font-size:.78rem;outline:none;cursor:pointer;}
.fin-expw{position:relative;}
.fin-expbtn{display:flex;align-items:center;gap:6px;padding:9px 20px;background:#f57c00;color:#fff;border:none;border-radius:6px;font-family:"Noto Kufi Arabic",sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .22s;box-shadow:0 4px 14px rgba(245,124,0,0.3);}
.fin-expbtn:hover{background:#bf5200;transform:translateY(-2px);}
.fin-expbtn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.fin-expmenu{position:absolute;top:calc(100% + 6px);left:0;background:#fff;border:1.5px solid #d0d3d8;border-radius:6px;box-shadow:0 10px 32px rgba(0,0,0,0.12);overflow:hidden;z-index:400;min-width:200px;border-top:3px solid #f57c00;animation:fin-slide .15s ease;}
@keyframes fin-slide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.fin-expitem{display:flex;align-items:center;gap:9px;width:100%;padding:12px 18px;background:none;border:none;border-bottom:1px solid #f0f1f2;font-family:"Noto Kufi Arabic",sans-serif;font-size:.8rem;font-weight:700;color:#374151;direction:rtl;cursor:pointer;transition:background .12s,color .12s;}
.fin-expitem:last-child{border-bottom:none;}
.fin-expitem:hover{background:rgba(245,124,0,0.06);color:#f57c00;}
.fin-table-wrap{overflow-x:auto;}
.fin-tbl{width:100%;border-collapse:collapse;min-width:700px;}
.fin-tbl thead th{background:#044478;color:#fff;padding:14px 16px;font-family:"Noto Kufi Arabic",sans-serif;font-size:.76rem;font-weight:700;text-align:right;white-space:nowrap;border-bottom:3px solid #f57c00;}
.fin-tbl thead th.c{text-align:center;}
.fin-tbl thead th.gr{background:#16a34a;border-bottom-color:#86efac;}
.fin-tbl thead th.or{background:#f57c00;border-bottom-color:rgba(255,255,255,0.3);}
.fin-tbl tbody tr{border-bottom:1px solid #f0f1f2;transition:background .12s;}
.fin-tbl tbody tr:hover{background:rgba(8,101,168,0.04);}
.fin-tbl tbody tr:nth-child(even){background:#fafbfc;}
.fin-tbl td{padding:11px 16px;font-family:"Noto Kufi Arabic",sans-serif;font-size:.76rem;color:#374151;vertical-align:middle;}
.fin-tbl td.c{text-align:center;}
.fin-tbl .fin-xrow td{padding:0!important;border:none;}
.fin-xin{padding:14px 20px;background:rgba(8,101,168,0.03);border-top:2px solid rgba(8,101,168,0.08);}
.fin-course-chip{display:inline-flex;align-items:center;gap:7px;background:#fff;border:1.5px solid #d0d3d8;border-radius:4px;padding:7px 12px;margin:4px;font-size:.72rem;transition:border-color .15s;}
.fin-course-chip:hover{border-color:#f57c00;}
.fin-course-chip-name{font-weight:700;color:#0a0a0a;}
.fin-course-chip-price{font-weight:900;color:#16a34a;font-size:.78rem;}
.fin-user-total{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:3px;background:#f0fdf4;border:1.5px solid #86efac;font-size:.78rem;font-weight:900;color:#16a34a;}
.fin-pill{display:inline-block;padding:4px 12px;border-radius:3px;font-size:.7rem;font-weight:700;cursor:pointer;border:1.5px solid rgba(8,101,168,0.3);color:#0865a8;background:rgba(8,101,168,0.07);user-select:none;transition:all .14s;font-family:"Noto Kufi Arabic",sans-serif;}
.fin-pill:hover,.fin-pill.op{background:rgba(8,101,168,0.14);border-color:rgba(8,101,168,0.55);}
.fin-av{width:36px;height:36px;border-radius:6px;background:#0865a8;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:.68rem;flex-shrink:0;}
.fin-uc{display:flex;align-items:center;gap:9px;}
.fin-uname{font-weight:700;color:#0a0a0a;font-size:.8rem;}
.fin-email{font-size:.68rem;color:#6b7280;direction:ltr;display:block;}
.fin-pg{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:14px 18px;border-top:1.5px solid #d0d3d8;background:#f0f1f2;font-family:"Noto Kufi Arabic",sans-serif;direction:rtl;}
.fin-pg-info{font-size:.72rem;color:#6b7280;font-weight:700;}
.fin-pg-info strong{color:#0a0a0a;}
.fin-card{background:#fff;border-radius:6px;border:1.5px solid #d0d3d8;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);position:relative;}
.fin-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to left,#f57c00,#0865a8);z-index:2;}
.fin-section-hdr{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #f57c00;}
.fin-section-tag{display:inline-block;background:#0865a8;color:#fff;font-size:11px;font-weight:700;padding:4px 14px;border-radius:3px;margin-bottom:4px;}
.fin-section-title{font-size:clamp(15px,2vw,20px);font-weight:900;color:#0a0a0a;}
.fin-section-title span{color:#f57c00;}
.fin-err{background:#fef2f2;border:1.5px solid rgba(220,38,38,.3);color:#dc2626;border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:.76rem;display:flex;align-items:center;gap:9px;border-right:4px solid #dc2626;font-family:"Noto Kufi Arabic",sans-serif;}
.fin-ld{text-align:center;padding:60px 20px;}
.fin-sp{width:40px;height:40px;border:3px solid #d0d3d8;border-top-color:#0865a8;border-radius:50%;animation:fin-spin .7s linear infinite;margin:0 auto 16px;}
@keyframes fin-spin{to{transform:rotate(360deg)}}
.fin-ld p,.fin-empty p{color:#6b7280;font-size:.8rem;font-family:"Noto Kufi Arabic",sans-serif;text-align:center;padding:60px 20px;}
`;
function injectStyles() {
    if (document.getElementById('fin-styles-v4')) return;
    const el = document.createElement('style'); el.id = 'fin-styles-v4'; el.textContent = CSS;
    document.head.appendChild(el);
}

// ── Tooltips ──
const CustomTooltip = ({ active, payload, label, suffix = 'EGP' }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#fff', border: '1.5px solid #d0d3d8', borderRadius: 6, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontFamily: '"Noto Kufi Arabic",sans-serif', direction: 'rtl', minWidth: 140 }}>
            <div style={{ fontWeight: 900, fontSize: '.78rem', color: '#0a0a0a', marginBottom: 6 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ fontSize: '.74rem', color: p.color, fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />{fmtMoney(p.value)} {suffix}
                </div>
            ))}
        </div>
    );
};
const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div style={{ background: '#fff', border: '1.5px solid #d0d3d8', borderRadius: 6, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontFamily: '"Noto Kufi Arabic",sans-serif', direction: 'rtl' }}>
            <div style={{ fontWeight: 900, fontSize: '.76rem', color: '#0a0a0a', marginBottom: 4 }}>{d.name}</div>
            <div style={{ fontSize: '.74rem', color: d.payload.fill, fontWeight: 700 }}>{fmtMoney(d.value)} EGP</div>
            <div style={{ fontSize: '.65rem', color: '#6b7280' }}>{d.payload.percent}% من الإجمالي</div>
        </div>
    );
};

// ── Pagination ──
const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    const start = (currentPage - 1) * itemsPerPage + 1, end = Math.min(currentPage * itemsPerPage, totalItems);
    const pages = []; const delta = 2;
    for (let i = 1; i <= totalPages; i++) { if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) pages.push(i); }
    const result = []; let prev = null;
    for (const p of pages) { if (prev !== null && p - prev > 1) result.push('...'); result.push(p); prev = p; }
    const btn = (label, onClick, isActive, isDisabled) => (
        <button key={label + Math.random()} onClick={onClick} disabled={isDisabled}
            style={{ minWidth: 34, height: 34, padding: '0 8px', borderRadius: 4, border: isActive ? '2px solid #0865a8' : '1.5px solid #d0d3d8', background: isActive ? '#0865a8' : isDisabled ? '#f0f1f2' : '#fff', color: isActive ? '#fff' : isDisabled ? '#d0d3d8' : '#374151', fontFamily: '"Noto Kufi Arabic",sans-serif', fontSize: '.78rem', fontWeight: 700, cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {label}
        </button>
    );
    return (
        <div className="fin-pg">
            <span className="fin-pg-info">عرض <strong>{start}</strong>–<strong>{end}</strong> من <strong style={{ color: '#0865a8' }}>{totalItems}</strong></span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {btn('«', () => onPageChange(1), false, currentPage === 1)}
                {btn('‹', () => onPageChange(currentPage - 1), false, currentPage === 1)}
                {result.map((p, i) => p === '...' ? <span key={'el' + i} style={{ padding: '0 4px', color: '#d0d3d8' }}>…</span> : btn(p, () => onPageChange(p), p === currentPage, false))}
                {btn('›', () => onPageChange(currentPage + 1), false, currentPage === totalPages)}
                {btn('»', () => onPageChange(totalPages), false, currentPage === totalPages)}
            </div>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function FinancialTab() {
    injectStyles();

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [planworks, setPlanworks] = useState([]);
    const [refunds, setRefunds] = useState([]);
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('total_desc');
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [exportMenu, setExportMenu] = useState(false);
    const [exportError, setExportError] = useState(null);
    const exportRef = useRef(null);

    useEffect(() => {
        const h = e => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportMenu(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        const errs = [];
        Promise.allSettled([
            apiFetch('/api/Admin/users'),
            apiFetch('/api/Admin/planworks'),
            apiFetch('/api/Refund/admin/all'),
            apiFetch('/api/Admin/stats'),
        ]).then(([u, p, r, s]) => {
            if (u.status === 'fulfilled' && Array.isArray(u.value)) setUsersData(u.value);
            else errs.push('فشل تحميل بيانات المستخدمين');
            if (p.status === 'fulfilled' && Array.isArray(p.value)) setPlanworks(p.value);
            else errs.push('فشل تحميل بيانات الدورات');
            if (r.status === 'fulfilled') {
                setRefunds(Array.isArray(r.value) ? r.value : (r.value?.data ?? []));
            } else errs.push('فشل تحميل المرتجعات');
            if (s.status === 'fulfilled' && s.value) setStats(s.value);
            setErrors(errs);
            setLoading(false);
        });
    }, []);

    // ── Rows ──
    const allRows = useMemo(() =>
        usersData.filter(u => u.courses?.length > 0).map(u => ({
            id: u.id, username: u.username || '', email: u.email || '',
            courses: u.courses.map(c => ({
                title: c.title || '—', price: Number(c.coursePrice || 0),
                date: formatDateAr(c.enrolledAt), rawDate: c.enrolledAt, attended: c.attended,
            })),
            totalPaid: u.courses.reduce((s, c) => s + Number(c.coursePrice || 0), 0),
        }))
        , [usersData]);

    // ── KPIs ──
    const grandTotal = allRows.reduce((s, r) => s + r.totalPaid, 0);
    const totalRefunds = refunds.filter(r => r.status === 'Approved' || r.status === 'Sent').reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const netRevenue = grandTotal - totalRefunds;
    const totalEnrollments = stats?.enrollmentsCount ?? allRows.reduce((s, r) => s + r.courses.length, 0);
    const avgPerUser = allRows.length > 0 ? Math.round(netRevenue / allRows.length) : 0;
    const maxPayer = allRows.length > 0 ? allRows.reduce((a, b) => a.totalPaid > b.totalPaid ? a : b) : null;

    // ── Course revenue ──
    const courseRevenue = useMemo(() =>
        [...planworks].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
            .map(p => ({ title: p.serviceTitle || '—', total: Number(p.totalRevenue || 0), count: Number(p.usersCount || 0) }))
        , [planworks]);
    const maxCourseRev = courseRevenue[0]?.total || 1;

    // ── Pie ──
    const pieData = useMemo(() => {
        const top5 = courseRevenue.slice(0, 5);
        const oth = courseRevenue.slice(5).reduce((s, c) => s + c.total, 0);
        const all = oth > 0 ? [...top5, { title: 'أخرى', total: oth, count: 0 }] : top5;
        return all.map((c, i) => ({ name: c.title, value: c.total, fill: CHART_COLORS[i % CHART_COLORS.length], percent: grandTotal > 0 ? Math.round(c.total / grandTotal * 100) : 0 }));
    }, [courseRevenue, grandTotal]);

    // ── Monthly ──
    const monthlyData = useMemo(() => {
        const MN = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const map = {};
        allRows.forEach(r => r.courses.forEach(c => {
            if (!c.rawDate) return;
            const d = new Date(c.rawDate); if (isNaN(d.getTime())) return;
            const k = MN[d.getMonth()];
            if (!map[k]) map[k] = { month: k, revenue: 0, enrollments: 0, order: d.getMonth() };
            map[k].revenue += c.price; map[k].enrollments += 1;
        }));
        return Object.values(map).sort((a, b) => a.order - b.order);
    }, [allRows]);

    // ── Filter / sort / paginate ──
    const q = search.toLowerCase();
    const filtered = allRows.filter(r => `${r.username} ${r.email}`.toLowerCase().includes(q) || r.courses.some(c => c.title.toLowerCase().includes(q)));
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'total_desc') return b.totalPaid - a.totalPaid;
        if (sortBy === 'total_asc') return a.totalPaid - b.totalPaid;
        if (sortBy === 'courses_desc') return b.courses.length - a.courses.length;
        return a.username.localeCompare(b.username, 'ar');
    });
    const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // ── Exports ──
    const doExport = fn => async () => {
        setExporting(true); setExportMenu(false); setExportError(null);
        try { await fn(); }
        catch (e) { setExportError('فشل التصدير: ' + (e?.message || 'خطأ')); }
        finally { setExporting(false); }
    };
    const rows4export = () => buildExportRows(sorted, netRevenue);
    const handleExcel = () => exportExcel('التقرير-المالي.xlsx', REPORT_TITLE, FIN_HEADERS, rows4export(), LOGO_SRC);
    const handlePDF = () => {
        const { headers, rows } = rtlExport(FIN_HEADERS, rows4export());
        return exportPDF('التقرير-المالي.pdf', REPORT_TITLE, headers, rows, '', LOGO_SRC);
    };
    const handleWord = () => exportWord('التقرير-المالي.docx', REPORT_TITLE, '', FIN_HEADERS, rows4export(), LOGO_SRC);

    const kpis = [
        { icon: '💰', val: `${fmtMoney(grandTotal)} EGP`, lbl: 'إجمالي الإيرادات', sub: 'قبل المرتجعات', cls: 'orange', color: '#f57c00' },
        { icon: '🔻', val: `${fmtMoney(totalRefunds)} EGP`, lbl: 'إجمالي المرتجعات', sub: `${refunds.length} طلب مرتجع`, cls: 'red', color: '#dc2626' },
        { icon: '✅', val: `${fmtMoney(netRevenue)} EGP`, lbl: 'صافي الإيرادات', sub: 'بعد خصم المرتجعات', cls: 'green', color: '#16a34a' },
        { icon: '📚', val: totalEnrollments, lbl: 'إجمالي الاشتراكات', sub: `عبر ${courseRevenue.length} دورة`, cls: 'blue', color: '#0865a8' },
        { icon: '👥', val: allRows.length, lbl: 'العملاء الدافعون', sub: `متوسط ${fmtMoney(avgPerUser)} EGP`, cls: 'purple', color: '#7c3aed' },
    ];

    if (loading) return <div className="fin-wrap"><div className="fin-ld"><div className="fin-sp" /><p>جاري تحميل البيانات المالية...</p></div></div>;

    return (
        <div className="fin-wrap">
            {/* Header */}
            <div className="fin-section-hdr">
                <div>
                    <div className="fin-section-tag">التقارير المالية</div>
                    <div className="fin-section-title">إيرادات <span>المعهد</span></div>
                </div>
            </div>

            {errors.map((e, i) => <div className="fin-err" key={i}>⚠️ {e}</div>)}

            {/* ── Hero: shows NET revenue after refunds ── */}
            <div className="fin-income-hero">
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="fin-total-label">✅ صافي الإيرادات الكلية (بعد المرتجعات)</div>
                    <div className="fin-total-amount"><span className="fin-currency">EGP</span>{fmtMoney(netRevenue)}</div>
                    <div className="fin-total-sub">من {allRows.length} مستخدم · {totalEnrollments} تسجيل</div>
                </div>
                <div className="fin-income-pills">
                    {[
                        { label: 'المستخدمون الدافعون', val: allRows.length, icon: '👤' },
                        { label: 'إجمالي التسجيلات', val: totalEnrollments, icon: '📚' },
                        { label: 'متوسط لكل مستخدم', val: `${fmtMoney(avgPerUser)} EGP`, icon: '📊' },
                        { label: 'إجمالي قبل المرتجعات', val: `${fmtMoney(grandTotal)} EGP`, icon: '📋' },
                        { label: 'إجمالي المرتجعات', val: `${fmtMoney(totalRefunds)} EGP`, icon: '🔻' },
                        ...(maxPayer ? [{ label: 'أعلى دافع', val: maxPayer.username, icon: '🏆' }] : []),
                    ].map(p => (
                        <div className="fin-ip" key={p.label}>
                            <div className="fin-ip-val">{p.icon} {p.val}</div>
                            <div className="fin-ip-lbl">{p.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* KPIs */}
            <div className="fin-kpi-grid">
                {kpis.map(k => (
                    <div key={k.lbl} className={`fin-kpi ${k.cls}`}>
                        <div className="fin-kpi-icon">{k.icon}</div>
                        <div className="fin-kpi-val" style={{ color: k.color }}>{k.val}</div>
                        <div className="fin-kpi-lbl">{k.lbl}</div>
                        <div className="fin-kpi-sub">{k.sub}</div>
                    </div>
                ))}
            </div>

            {/* Charts row 1 */}
            {monthlyData.length > 0 && (
                <div className="fin-charts-grid">
                    <div className="fin-chart-card">
                        <div className="fin-chart-hdr">
                            <div className="fin-chart-title">📈 الإيرادات الشهرية</div>
                            <div className="fin-chart-sub">تطور الإيرادات عبر الأشهر</div>
                        </div>
                        <div className="fin-chart-body">
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f2" />
                                    <XAxis dataKey="month" tick={{ fontFamily: '"Noto Kufi Arabic",sans-serif', fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => fmtMoney(v)} width={65} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="revenue" stroke="#0865a8" strokeWidth={2.5} dot={{ fill: '#0865a8', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#f57c00' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="fin-chart-card">
                        <div className="fin-chart-hdr">
                            <div className="fin-chart-title">🥧 توزيع إيرادات الدورات</div>
                            <div className="fin-chart-sub">نسبة كل دورة من الإجمالي</div>
                        </div>
                        <div className="fin-chart-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                                        {pieData.map((e, i) => <Cell key={i} fill={e.fill} stroke="none" />)}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: '0 10px 10px' }}>
                                {pieData.map(d => (
                                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.62rem', fontFamily: '"Noto Kufi Arabic",sans-serif', color: '#374151' }}>
                                        <span style={{ width: 10, height: 10, borderRadius: 2, background: d.fill, display: 'inline-block', flexShrink: 0 }} />
                                        {d.name.slice(0, 18)}{d.name.length > 18 ? '…' : ''} ({d.percent}%)
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Charts row 2 */}
            <div className="fin-charts-row">
                {monthlyData.length > 0 && (
                    <div className="fin-chart-card">
                        <div className="fin-chart-hdr">
                            <div className="fin-chart-title">📊 الاشتراكات الشهرية</div>
                            <div className="fin-chart-sub">عدد التسجيلات لكل شهر</div>
                        </div>
                        <div className="fin-chart-body">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f2" />
                                    <XAxis dataKey="month" tick={{ fontFamily: '"Noto Kufi Arabic",sans-serif', fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip suffix="تسجيل" />} />
                                    <Bar dataKey="enrollments" fill="#f57c00" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
                <div className="fin-chart-card">
                    <div className="fin-chart-hdr">
                        <div className="fin-chart-title">📉 الإيرادات vs المرتجعات</div>
                        <div className="fin-chart-sub">مقارنة الصافي بالمرتجعات</div>
                    </div>
                    <div className="fin-chart-body">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={[{ name: 'الإيرادات', value: grandTotal }, { name: 'المرتجعات', value: totalRefunds }, { name: 'الصافي', value: netRevenue }]} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f2" />
                                <XAxis dataKey="name" tick={{ fontFamily: '"Noto Kufi Arabic",sans-serif', fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => fmtMoney(v)} width={65} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    <Cell fill="#0865a8" /><Cell fill="#dc2626" /><Cell fill="#16a34a" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Course bars */}
            {courseRevenue.length > 0 && (
                <div className="fin-card" style={{ marginBottom: 22 }}>
                    <div style={{ padding: '16px 20px 4px', borderBottom: '1.5px solid #f0f1f2' }}>
                        <span style={{ fontWeight: 900, fontSize: '.9rem', color: '#0a0a0a', fontFamily: '"Noto Kufi Arabic",sans-serif' }}>📊 إيرادات الدورات</span>
                        <span style={{ fontSize: '.68rem', color: '#6b7280', marginRight: 10, fontFamily: '"Noto Kufi Arabic",sans-serif' }}>أعلى {Math.min(courseRevenue.length, 8)} دورات</span>
                    </div>
                    <div style={{ padding: '16px 20px' }}>
                        {courseRevenue.slice(0, 8).map((c, i) => (
                            <div className="fin-cb-row" key={c.title}>
                                <div className="fin-cb-name" title={c.title}>{c.title}</div>
                                <div className="fin-cb-track"><div className={`fin-cb-fill${i % 2 === 0 ? '' : ' blue'}`} style={{ width: `${Math.round(c.total / maxCourseRev * 100)}%` }} /></div>
                                <div className="fin-cb-amt">{fmtMoney(c.total)} EGP</div>
                                <div className="fin-cb-count">{c.count} مسجّل</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="fin-toolbar">
                <input className="fin-search-input" type="text" placeholder="ابحث باسم المستخدم أو الدورة..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                {search && <button style={{ padding: '7px 12px', borderRadius: 4, border: '1.5px solid #d0d3d8', background: '#f0f1f2', cursor: 'pointer', color: '#6b7280', fontFamily: '"Noto Kufi Arabic",sans-serif', fontSize: '.72rem', fontWeight: 700 }} onClick={() => { setSearch(''); setPage(1); }}>✕ مسح</button>}
                <select className="fin-sort-sel" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
                    <option value="total_desc">الأعلى دفعًا</option>
                    <option value="total_asc">الأقل دفعًا</option>
                    <option value="courses_desc">الأكثر دورات</option>
                    <option value="name">الاسم أبجديًا</option>
                </select>
                <div className="fin-expw" ref={exportRef} style={{ marginRight: 'auto' }}>
                    <button className="fin-expbtn" disabled={exporting} onClick={() => setExportMenu(p => !p)}>
                        {exporting ? '⏳ جاري التصدير...' : '⬇ تصدير التقرير ▾'}
                    </button>
                    {exportMenu && (
                        <div className="fin-expmenu">
                            <button className="fin-expitem" onClick={doExport(handleExcel)}>📊 Excel (.xlsx)</button>
                            <button className="fin-expitem" onClick={doExport(handlePDF)}>📄 PDF (.pdf)</button>
                            <button className="fin-expitem" onClick={doExport(handleWord)}>📝 Word (.docx)</button>
                        </div>
                    )}
                </div>
            </div>

            {exportError && <div className="fin-err">⚠️ {exportError}</div>}

            {/* Table */}
            <div className="fin-card">
                {sorted.length === 0
                    ? <div className="fin-empty"><p>لا توجد نتائج مطابقة</p></div>
                    : <>
                        <div className="fin-table-wrap">
                            <table className="fin-tbl">
                                <thead>
                                    <tr>
                                        <th className="c" style={{ width: 40 }}>#</th>
                                        <th>المستخدم</th>
                                        <th>البريد الإلكتروني</th>
                                        <th className="c">عدد الدورات</th>
                                        <th className="gr c">إجمالي المدفوع (EGP)</th>
                                        <th className="or c">تفاصيل</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map((r, idx) => {
                                        const rowNum = (page - 1) * ITEMS_PER_PAGE + idx + 1;
                                        const isOpen = expanded === r.id;
                                        return (
                                            <React.Fragment key={r.id}>
                                                <tr style={{ background: isOpen ? 'rgba(8,101,168,0.05)' : undefined }}>
                                                    <td style={{ color: '#6b7280', fontSize: '.68rem', textAlign: 'center' }}>{rowNum}</td>
                                                    <td>
                                                        <div className="fin-uc">
                                                            <div className="fin-av">{(r.username || '?')[0].toUpperCase()}</div>
                                                            <div className="fin-uname">{r.username}</div>
                                                        </div>
                                                    </td>
                                                    <td><span className="fin-email">{r.email}</span></td>
                                                    <td className="c">
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 28, height: 28, borderRadius: 4, background: 'rgba(8,101,168,0.08)', border: '1.5px solid rgba(8,101,168,0.25)', color: '#0865a8', fontSize: '.76rem', fontWeight: 900, padding: '0 6px' }}>{r.courses.length}</span>
                                                    </td>
                                                    <td className="c"><span className="fin-user-total">{fmtMoney(r.totalPaid)} EGP</span></td>
                                                    <td className="c">
                                                        <span className={`fin-pill${isOpen ? ' op' : ''}`} onClick={() => setExpanded(isOpen ? null : r.id)}>
                                                            {isOpen ? '▲ إخفاء' : '▼ الدورات'}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {isOpen && (
                                                    <tr className="fin-xrow">
                                                        <td colSpan={6}>
                                                            <div className="fin-xin">
                                                                <div style={{ marginBottom: 10, fontSize: '.72rem', fontWeight: 900, color: '#0865a8', fontFamily: '"Noto Kufi Arabic",sans-serif' }}>
                                                                    📚 دورات {r.username} ({r.courses.length} دورة)
                                                                </div>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                                    {r.courses.map((c, ci) => (
                                                                        <div className="fin-course-chip" key={ci}>
                                                                            <span className="fin-course-chip-name">📖 {c.title}</span>
                                                                            <span style={{ width: 1, height: 14, background: '#d0d3d8', display: 'inline-block', margin: '0 4px' }} />
                                                                            <span className="fin-course-chip-price">{fmtMoney(c.price)} EGP</span>
                                                                            {c.date && <span style={{ fontSize: '.62rem', color: '#6b7280' }}>📅 {c.date}</span>}
                                                                            {c.attended != null && (
                                                                                <span style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 3, background: c.attended ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)', color: c.attended ? '#16a34a' : '#dc2626', border: `1px solid ${c.attended ? '#86efac' : 'rgba(220,38,38,0.3)'}` }}>
                                                                                    {c.attended ? '✓ حضر' : '✗ غائب'}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                    <span style={{ fontSize: '.74rem', fontWeight: 700, color: '#374151', fontFamily: '"Noto Kufi Arabic",sans-serif' }}>المجموع:</span>
                                                                    <span className="fin-user-total">{fmtMoney(r.totalPaid)} EGP</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr style={{ background: '#044478' }}>
                                        <td colSpan={4} style={{ padding: '12px 16px', fontWeight: 900, color: '#fff', fontSize: '.82rem', fontFamily: '"Noto Kufi Arabic",sans-serif' }}>
                                            ✅ صافي الإيرادات الكلية (بعد المرتجعات)
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <span style={{ fontWeight: 900, fontSize: '1rem', color: '#ff9a3c' }}>{fmtMoney(netRevenue)} EGP</span>
                                        </td>
                                        <td />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <Pagination currentPage={page} totalItems={sorted.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={p => { setPage(p); setExpanded(null); }} />
                    </>
                }
            </div>
        </div>
    );
}