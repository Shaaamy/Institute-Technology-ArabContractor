// ─────────────────────────────────────────────────────────────────────────────
// SettingsTab.jsx  (redesigned)
// Path: src/pages/admin/SettingsTab.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from 'react';

// ── Design tokens (same palette as the rest of the dashboard) ─────────────
const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray100: '#f0f1f2', gray200: '#e5e7eb', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
    green: '#16a34a', greenBg: '#f0fdf4', greenBorder: '#86efac',
    red: '#dc2626', redBg: '#fef2f2', redBorder: 'rgba(220,38,38,.2)',
    font: '"Noto Kufi Arabic", serif',
};

// ── All admin tabs in the system ──────────────────────────────────────────
const ADMIN_TABS = [
    { id: 'users', label: '👤 المستخدمون' },
    { id: 'courses', label: '📚 الدورات' },
    { id: 'attendance', label: '✅ الحضور' },
    { id: 'certificates', label: '📜 الشهادات' },
    { id: 'refunds', label: '💳 المستردات' },
    { id: 'finance', label: '💰 المالية' },
    { id: 'lecturers', label: '🎓 المحاضرون' },
    { id: 'news', label: '📰 الأخبار' },
    { id: 'books', label: '📖 الكتب' },
    { id: 'workplan', label: '📋 خطة العمل' },
    { id: 'settings', label: '⚙️ الإعدادات' },
];

// ── Static placeholder users (replace with API data when ready) ───────────
const STATIC_USERS = [
    { id: 1, username: 'yasmin.amaged', email: 'yasminamaged22@gmail.com' },
    { id: 2, username: 'abeer.naguib', email: 'abeer.naguib@gmail.com' },
    { id: 3, username: 'amr.shamy', email: 'amrshamy91@gmail.com' },
    { id: 4, username: 'abdelmawla', email: 'abdelmawla1642@gmail.com' },
    { id: 5, username: 'mostafa.awaad', email: 'mostafa.awaad@gmail.com' },
    { id: 6, username: 'samir.yousri', email: 'samiryousri96@gmail.com' },
    { id: 7, username: 'hana.khalil', email: 'hana.khalil@example.com' },
    { id: 8, username: 'omar.hassan', email: 'omar.hassan@example.com' },
    { id: 9, username: 'nada.ibrahim', email: 'nada.ibrahim@example.com' },
];

// ── Items per page ────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsTab({ currentUserEmail = '' }) {
    // ── UI state ────────────────────────────────────────────────────────────
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null); // user id with open tab-select panel

    // ── Per-user role state  { [userId]: { isAdmin, isManager, tabs: Set } }
    const [roles, setRoles] = useState(() => {
        const init = {};
        STATIC_USERS.forEach(u => {
            init[u.id] = { isAdmin: false, isManager: false, tabs: new Set() };
        });
        return init;
    });

    // ── Notification state ──────────────────────────────────────────────────
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3200);
    };

    // ── Filtered + paginated users ──────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return STATIC_USERS;
        return STATIC_USERS.filter(u =>
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        );
    }, [search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    // ── Role helpers ────────────────────────────────────────────────────────
    const setAdmin = (userId, checked) => {
        setRoles(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                isAdmin: checked,
                // if unchecking admin, clear tab selection; keep manager state
                tabs: checked ? prev[userId].tabs : new Set(),
            },
        }));
        if (!checked) setExpandedRow(null);
        showToast('success', checked
            ? `✅ تم منح صلاحية المدير`
            : `تم سحب صلاحية المدير`);
    };

    const setManager = (userId, checked) => {
        setRoles(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                isManager: checked,
                // manager → auto-grant all tabs; uncheck manager → keep custom tabs
                tabs: checked ? new Set(ADMIN_TABS.map(t => t.id)) : prev[userId].tabs,
            },
        }));
        showToast('success', checked
            ? `✅ تم منح صلاحية المدير العام (كل التبويبات)`
            : `تم تغيير الصلاحية`);
    };

    const toggleTab = (userId, tabId) => {
        setRoles(prev => {
            const current = new Set(prev[userId].tabs);
            current.has(tabId) ? current.delete(tabId) : current.add(tabId);
            return { ...prev, [userId]: { ...prev[userId], tabs: current } };
        });
    };

    const toggleExpanded = (userId) => {
        setExpandedRow(prev => (prev === userId ? null : userId));
    };

    const getRole = (userId) => roles[userId] || { isAdmin: false, isManager: false, tabs: new Set() };
    const isMe = (email) => email.toLowerCase() === currentUserEmail.toLowerCase();

    // ── Stats ───────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        let admins = 0, managers = 0;
        STATIC_USERS.forEach(u => {
            const r = roles[u.id];
            if (r?.isManager) managers++;
            else if (r?.isAdmin) admins++;
        });
        return { admins, managers, total: STATIC_USERS.length };
    }, [roles]);

    // ────────────────────────────────────────────────────────────────────────
    return (
        <div>
            {/* ── Section header ── */}
            <div className="adm-section-hdr">
                <div>
                    <div className="adm-section-tag">إعدادات النظام</div>
                    <div className="adm-section-title">إدارة <span>الصلاحيات</span></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <StatPill color={T.blue} icon="🛡" label="Admin" value={stats.admins} />
                    <StatPill color={T.orange} icon="👑" label="Manager" value={stats.managers} />
                    <StatPill color={T.gray500} icon="👥" label="Total" value={stats.total} />
                </div>
            </div>

            {/* ── Info banner ── */}
            <div style={infoBannerStyle}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '.78rem', color: T.blue, marginBottom: 3 }}>كيف تعمل الصلاحيات؟</div>
                    <div style={{ fontSize: '.72rem', color: T.gray700, lineHeight: 1.8 }}>
                        <b>مدير (Admin):</b> اختر التبويبات التي يمكنه الوصول إليها يدوياً.&nbsp;&nbsp;
                        <b>مدير عام (Manager):</b> يصل تلقائياً لجميع التبويبات دون قيود.
                    </div>
                </div>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div style={{
                    ...toastBase,
                    background: toast.type === 'success' ? T.greenBg : T.redBg,
                    border: `1.5px solid ${toast.type === 'success' ? T.greenBorder : T.redBorder}`,
                    borderRight: `4px solid ${toast.type === 'success' ? T.green : T.red}`,
                    color: toast.type === 'success' ? T.green : T.red,
                }}>
                    {toast.msg}
                </div>
            )}

            {/* ── Search ── */}
            <div className="adm-toolbar" style={{ marginBottom: 14 }}>
                <div className="adm-search" style={{ flex: 1 }}>
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1); setExpandedRow(null); }}
                    />
                </div>
                {search && (
                    <button className="adm-fclear" onClick={() => { setSearch(''); setCurrentPage(1); }}>✕</button>
                )}
            </div>

            {/* ── Table ── */}
            <div className="adm-card">
                {/* Table header counts */}
                <div style={{ padding: '14px 20px 10px', borderBottom: `1.5px solid ${T.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontWeight: 900, fontSize: '.88rem', color: T.black, fontFamily: T.font }}>
                        👥 قائمة المستخدمين
                    </span>
                    <span style={{ fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
                        {filtered.length} نتيجة
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
                ) : (
                    <div className="adm-tscr">
                        <table className="adm-tbl" style={{ minWidth: 680 }}>
                            <thead>
                                <tr>
                                    <th className="c" style={{ width: 36 }}>#</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th className="c" style={{ width: 110 }}>Admin</th>
                                    <th className="c" style={{ width: 110 }}>Manager</th>
                                    <th className="c" style={{ width: 100 }}>Tabs</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((user, idx) => {
                                    const rowNum = (safePage - 1) * ITEMS_PER_PAGE + idx + 1;
                                    const role = getRole(user.id);
                                    const me = isMe(user.email);
                                    const tabCount = role.tabs.size;
                                    const isOpen = expandedRow === user.id;

                                    return (
                                        <React.Fragment key={user.id}>
                                            {/* ── Main row ── */}
                                            <tr className={isOpen ? 'xopen' : ''} style={me ? { background: 'rgba(8,101,168,0.04)' } : {}}>
                                                <td style={{ textAlign: 'center', color: T.gray500, fontSize: '.68rem' }}>{rowNum}</td>

                                                {/* User */}
                                                <td>
                                                    <div className="adm-uc">
                                                        <div className="adm-av" style={{ background: role.isManager ? T.orange : role.isAdmin ? T.blue : T.gray300 }}>
                                                            {user.username[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="adm-uname">{user.username}</span>
                                                            {me && <span style={{ marginRight: 6, fontSize: '.58rem', padding: '1px 6px', borderRadius: 2, background: T.greenBg, border: `1px solid ${T.greenBorder}`, color: T.green }}>● أنت</span>}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td className="adm-email" style={{ direction: 'ltr', textAlign: 'left' }}>{user.email}</td>

                                                {/* Admin checkbox */}
                                                <td style={{ textAlign: 'center' }}>
                                                    <label style={checkLabelStyle}>
                                                        <input
                                                            type="checkbox"
                                                            checked={role.isAdmin || role.isManager}
                                                            disabled={role.isManager}
                                                            onChange={e => setAdmin(user.id, e.target.checked)}
                                                            style={{ accentColor: T.blue, width: 15, height: 15, cursor: role.isManager ? 'not-allowed' : 'pointer' }}
                                                        />
                                                        <span style={{ fontSize: '.68rem', color: (role.isAdmin || role.isManager) ? T.blue : T.gray500, fontWeight: 700, fontFamily: T.font }}>
                                                            {(role.isAdmin || role.isManager) ? 'Admin' : 'نعم'}
                                                        </span>
                                                    </label>
                                                </td>

                                                {/* Manager checkbox */}
                                                <td style={{ textAlign: 'center' }}>
                                                    <label style={checkLabelStyle}>
                                                        <input
                                                            type="checkbox"
                                                            checked={role.isManager}
                                                            onChange={e => setManager(user.id, e.target.checked)}
                                                            style={{ accentColor: T.orange, width: 15, height: 15, cursor: 'pointer' }}
                                                        />
                                                        <span style={{ fontSize: '.68rem', color: role.isManager ? T.orange : T.gray500, fontWeight: 700, fontFamily: T.font }}>
                                                            {role.isManager ? 'Manager' : 'نعم'}
                                                        </span>
                                                    </label>
                                                </td>

                                                {/* Tab access button */}
                                                <td style={{ textAlign: 'center' }}>
                                                    {role.isManager ? (
                                                        <span style={{ fontSize: '.62rem', color: T.orange, fontWeight: 700, fontFamily: T.font }}>كل التبويبات</span>
                                                    ) : role.isAdmin ? (
                                                        <span
                                                            className={`adm-pill${isOpen ? ' op' : ''}`}
                                                            onClick={() => toggleExpanded(user.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {isOpen ? '▲ إخفاء' : `▼ ${tabCount > 0 ? tabCount : 'اختر'}`}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: T.gray300 }}>—</span>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* ── Expanded tab-select panel ── */}
                                            {isOpen && role.isAdmin && !role.isManager && (
                                                <tr className="adm-xrow">
                                                    <td colSpan={6}>
                                                        <div className="adm-xin" style={{ padding: '14px 18px' }}>
                                                            <div style={{ fontWeight: 700, fontSize: '.78rem', color: T.blue, fontFamily: T.font, marginBottom: 10 }}>
                                                                🔑 التبويبات المتاحة لـ <span style={{ fontFamily: 'Courier New' }}>{user.email}</span>
                                                            </div>

                                                            {/* Quick actions */}
                                                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                                                <button
                                                                    onClick={() => setRoles(prev => ({ ...prev, [user.id]: { ...prev[user.id], tabs: new Set(ADMIN_TABS.map(t => t.id)) } }))}
                                                                    style={quickBtnStyle(T.blue)}
                                                                >
                                                                    ✅ تحديد الكل
                                                                </button>
                                                                <button
                                                                    onClick={() => setRoles(prev => ({ ...prev, [user.id]: { ...prev[user.id], tabs: new Set() } }))}
                                                                    style={quickBtnStyle(T.gray500)}
                                                                >
                                                                    ✕ إلغاء الكل
                                                                </button>
                                                            </div>

                                                            {/* Tabs grid */}
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                                {ADMIN_TABS.map(tab => {
                                                                    const checked = role.tabs.has(tab.id);
                                                                    return (
                                                                        <label
                                                                            key={tab.id}
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', gap: 6,
                                                                                padding: '7px 13px', borderRadius: 3, cursor: 'pointer',
                                                                                border: `1.5px solid ${checked ? T.blue : T.gray300}`,
                                                                                background: checked ? 'rgba(8,101,168,0.06)' : T.white,
                                                                                transition: 'all .14s',
                                                                                fontFamily: T.font,
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={checked}
                                                                                onChange={() => toggleTab(user.id, tab.id)}
                                                                                style={{ accentColor: T.blue, width: 13, height: 13 }}
                                                                            />
                                                                            <span style={{ fontSize: '.74rem', fontWeight: checked ? 700 : 500, color: checked ? T.blue : T.gray700 }}>
                                                                                {tab.label}
                                                                            </span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Summary */}
                                                            <div style={{ marginTop: 12, fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
                                                                {role.tabs.size === 0
                                                                    ? '⚠️ لم يتم تحديد أي تبويب — المدير لن يرى أي محتوى'
                                                                    : `✅ تم تحديد ${role.tabs.size} من ${ADMIN_TABS.length} تبويب`}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div style={{ padding: '10px 20px 14px', borderTop: `1.5px solid ${T.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <button
                            disabled={safePage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            style={pageBtn(safePage === 1)}
                        >›</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setCurrentPage(p)}
                                style={pageBtn(false, p === safePage)}
                            >{p}</button>
                        ))}
                        <button
                            disabled={safePage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            style={pageBtn(safePage === totalPages)}
                        >‹</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Small stat pill ───────────────────────────────────────────────────────────
function StatPill({ color, icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 3, background: `${color}10`, border: `1px solid ${color}30` }}>
            <span style={{ fontSize: '.8rem' }}>{icon}</span>
            <span style={{ fontSize: '.68rem', color, fontWeight: 700, fontFamily: '"Noto Kufi Arabic",serif' }}>{label}</span>
            <span style={{ fontFamily: 'Courier New', fontWeight: 900, fontSize: '.9rem', color }}>{value}</span>
        </div>
    );
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const infoBannerStyle = {
    background: 'rgba(8,101,168,0.05)',
    border: '1.5px solid rgba(8,101,168,0.18)',
    borderRadius: 3,
    borderRight: '4px solid #0865a8',
    padding: '12px 16px',
    marginBottom: 18,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    fontFamily: '"Noto Kufi Arabic",serif',
};

const toastBase = {
    borderRadius: 3,
    padding: '10px 14px',
    marginBottom: 14,
    fontSize: '.78rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: '"Noto Kufi Arabic",serif',
};

const checkLabelStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    cursor: 'pointer',
    userSelect: 'none',
};

const quickBtnStyle = (color) => ({
    padding: '5px 14px',
    background: `${color}12`,
    border: `1.5px solid ${color}40`,
    borderRadius: 2,
    color,
    fontFamily: '"Noto Kufi Arabic",serif',
    fontSize: '.7rem',
    fontWeight: 700,
    cursor: 'pointer',
});

const pageBtn = (disabled, active = false) => ({
    width: 30,
    height: 30,
    border: active ? '1.5px solid #0865a8' : '1.5px solid #d0d3d8',
    borderRadius: 2,
    background: active ? '#0865a8' : '#fff',
    color: active ? '#fff' : disabled ? '#d0d3d8' : '#374151',
    fontWeight: 700,
    fontSize: '.78rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
});

// ─────────────────────────────────────────────────────────────────────────────
// SettingsTab.jsx  (API-connected)
// ─────────────────────────────────────────────────────────────────────────────
// import React, { useState, useMemo, useEffect, useCallback } from 'react';

// const T = {
//     orange: '#f57c00', blue: '#0865a8', black: '#0a0a0a', white: '#ffffff',
//     gray100: '#f0f1f2', gray300: '#d0d3d8', gray500: '#6b7280', gray700: '#374151',
//     green: '#16a34a', greenBg: '#f0fdf4', greenBorder: '#86efac',
//     red: '#dc2626', redBg: '#fef2f2', redBorder: 'rgba(220,38,38,.2)',
//     font: '"Noto Kufi Arabic", serif',
// };

// ── Permission IDs — exactly as they are in your DB right now ─────────────────
// ⚠️ Ask backend to add the missing tabs and update the IDs below
// const ADMIN_TABS = [
//     { id: 'news', label: '📰 الأخبار', permissionId: 1 }, ✅ in DB
//     { id: 'courses', label: '📚 الدورات', permissionId: 2 }, ✅ in DB
//     { id: 'lecturers', label: '🎓 المحاضرون', permissionId: 3 }, ✅ in DB
//     { id: 'books', label: '📖 الكتب', permissionId: 4 }, ✅ in DB
//     ── Below: IDs are placeholders — backend must add these to Permissions table ──
//     { id: 'users', label: '👤 المستخدمون', permissionId: 5 }, ⚠️ pending
//     { id: 'attendance', label: '✅ الحضور', permissionId: 6 }, ⚠️ pending
//     { id: 'certificates', label: '📜 الشهادات', permissionId: 7 }, ⚠️ pending
//     { id: 'refunds', label: '💳 المستردات', permissionId: 8 }, ⚠️ pending
//     { id: 'finance', label: '💰 المالية', permissionId: 9 }, ⚠️ pending
//     { id: 'workplan', label: '📋 خطة العمل', permissionId: 10 }, ⚠️ pending
//     { id: 'settings', label: '⚙️ الإعدادات', permissionId: 11 }, ⚠️ pending
// ];

// ── IsManager comes from the AppUsers table directly (not a permissionId) ─────
// The assign/remove APIs still handle tab permissions only.
// Manager toggle calls a separate endpoint — update MANAGER_ENDPOINT below.
// ⚠️ Ask backend: what endpoint toggles IsManager on AppUsers?
// const MANAGER_ENDPOINT = '/api/admin/users'; placeholder — confirm with backend

// ── Set your backend URL here ─────────────────────────────────────────────────
// Option A: hardcode for now while testing
// const API_BASE = 'https:acwebsite-icmet-test.azurewebsites.net'; ← replace this

// Option B: use .env file (recommended for prod)
// Add VITE_API_URL=https:your-backend-domain.com to your .env file
// const API_BASE = import.meta.env.VITE_API_URL ?? '';
// const ITEMS_PER_PAGE = 6;

// ─────────────────────────────────────────────────────────────────────────────
// export default function SettingsTab({ currentUserEmail = '' }) {
//     const [search, setSearch] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [expandedRow, setExpandedRow] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [roles, setRoles] = useState({});   { [userId]: { isManager, tabs: Set<permissionId> } }
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState({});   { [userId]: bool }
//     const [toast, setToast] = useState(null);

//     const showToast = (type, msg) => {
//         setToast({ type, msg });
//         setTimeout(() => setToast(null), 3200);
//     };

//     ── Load users from GET /api/admin/users ──────────────────────────────────
//     useEffect(() => {
//         const load = async () => {
//             setLoading(true);
//             try {
//                 const res = await fetch(`${API_BASE}/api/admin/users` );
//                 const data = await res.json();

//                 Response shape: [{ id, email, username, courses:[] }, ...]
//                 setUsers(data);

//                 Load permissions for all users in parallel
//                 const permsResults = await Promise.allSettled(
//                     data.map(u =>
//                         fetch(`${API_BASE}/api/UserPermissions/${u.id}` )
//                             .then(r => r.ok ? r.json() : [])
//                     )
//                 );

//                 const initRoles = {};
//                 permsResults.forEach((result, i) => {
//                     const userId = data[i].id;
//                     IsManager lives on the user object itself
//                     const isManager = !!data[i].isManager;
//                     if (result.status === 'fulfilled') {
//                         initRoles[userId] = parsePermissions(result.value, isManager);
//                     } else {
//                         initRoles[userId] = { isManager, tabs: new Set() };
//                     }
//                 });
//                 setRoles(initRoles);
//             } catch (err) {
//                 showToast('error', `فشل تحميل البيانات: ${err.message}`);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         load();
//     }, []);

//     ── Parse GET /api/UserPermissions/{userId} response ─────────────────────
//     Actual response shape from your Swagger sample:
//     [{ "permissionId": 1 }, { "permissionId": 2 }]  ← adjust if different
//     const parsePermissions = (data, isManager) => {
//         const ids = Array.isArray(data)
//             ? data.map(p => p.permissionId ?? p.id).filter(Boolean)
//             : [];
//         return {
//             isManager,
//             tabs: isManager
//                 ? new Set(ADMIN_TABS.map(t => t.id))
//                 : new Set(ADMIN_TABS.filter(t => ids.includes(t.permissionId)).map(t => t.id)),
//         };
//     };

//     ── API helpers ───────────────────────────────────────────────────────────
//     const assignPermission = (userId, permissionId) =>
//         fetch(`${API_BASE}/api/UserPermissions/assign`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ userId, permissionId }),
//         }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); });

//     const removePermission = (userId, permissionId) =>
//         fetch(`${API_BASE}/api/UserPermissions/remove?userId=${userId}&permissionId=${permissionId}`, {
//             method: 'DELETE',
//         }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); });

//     const withSaving = async (userId, fn) => {
//         setSaving(p => ({ ...p, [userId]: true }));
//         try { await fn(); } finally { setSaving(p => ({ ...p, [userId]: false })); }
//     };

//     ── isAdmin = has at least 1 tab permission ───────────────────────────────
//     (No separate admin permissionId in your DB — admin just means "has some tabs")
//     const isAdmin = (role) => role && (role.isManager || role.tabs.size > 0);

//     ── Manager toggle ────────────────────────────────────────────────────────
//     ⚠️ Replace the fetch URL once backend confirms the IsManager toggle endpoint
//     const setManager = useCallback(async (userId, checked) => {
//         const prev = roles[userId];
//         setRoles(p => ({
//             ...p,
//             [userId]: {
//                 isManager: checked,
//                 tabs: checked ? new Set(ADMIN_TABS.map(t => t.id)) : prev.tabs,
//             },
//         }));
//         await withSaving(userId, async () => {
//             try {
//                 ⚠️ Confirm this endpoint with backend — they may have PATCH /api/admin/users/{id}
//                 await fetch(`${API_BASE}/api/admin/users/${userId}/manager`, {
//                     method: 'PATCH',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ isManager: checked }),
//                 });
//                 also sync tab permissions
//                 if (checked) {
//                     await Promise.allSettled(ADMIN_TABS.map(t => assignPermission(userId, t.permissionId)));
//                 }
//                 showToast('success', checked ? '✅ تم منح صلاحية المدير العام' : 'تم سحب صلاحية المدير العام');
//             } catch (err) {
//                 setRoles(p => ({ ...p, [userId]: prev }));
//                 showToast('error', `فشل: ${err.message}`);
//             }
//         });
//     }, [roles]);

//     ── Tab toggle ────────────────────────────────────────────────────────────
//     const toggleTab = useCallback(async (userId, tabId) => {
//         const tab = ADMIN_TABS.find(t => t.id === tabId);
//         if (!tab) return;
//         const wasChecked = roles[userId]?.tabs.has(tabId);

//         setRoles(prev => {
//             const cur = new Set(prev[userId].tabs);
//             wasChecked ? cur.delete(tabId) : cur.add(tabId);
//             return { ...prev, [userId]: { ...prev[userId], tabs: cur } };
//         });

//         await withSaving(userId, async () => {
//             try {
//                 wasChecked
//                     ? await removePermission(userId, tab.permissionId)
//                     : await assignPermission(userId, tab.permissionId);
//             } catch (err) {
//                 setRoles(prev => {
//                     const cur = new Set(prev[userId].tabs);
//                     wasChecked ? cur.add(tabId) : cur.delete(tabId);
//                     return { ...prev, [userId]: { ...prev[userId], tabs: cur } };
//                 });
//                 showToast('error', `فشل تحديث التبويب: ${err.message}`);
//             }
//         });
//     }, [roles]);

//     const selectAllTabs = async (userId) => {
//         const prev = roles[userId];
//         setRoles(p => ({ ...p, [userId]: { ...p[userId], tabs: new Set(ADMIN_TABS.map(t => t.id)) } }));
//         await withSaving(userId, async () => {
//             try {
//                 await Promise.allSettled(ADMIN_TABS.map(t => assignPermission(userId, t.permissionId)));
//             } catch (err) {
//                 setRoles(p => ({ ...p, [userId]: prev }));
//                 showToast('error', `فشل: ${err.message}`);
//             }
//         });
//     };

//     const clearAllTabs = async (userId) => {
//         const prev = roles[userId];
//         setRoles(p => ({ ...p, [userId]: { ...p[userId], tabs: new Set() } }));
//         await withSaving(userId, async () => {
//             try {
//                 await Promise.allSettled(
//                     [...prev.tabs].map(tabId => {
//                         const tab = ADMIN_TABS.find(t => t.id === tabId);
//                         return tab ? removePermission(userId, tab.permissionId) : Promise.resolve();
//                     })
//                 );
//             } catch (err) {
//                 setRoles(p => ({ ...p, [userId]: prev }));
//                 showToast('error', `فشل: ${err.message}`);
//             }
//         });
//     };

//     ── Helpers ───────────────────────────────────────────────────────────────
//     const getRole = (id) => roles[id] ?? { isManager: false, tabs: new Set() };
//     const isMe = (email) => email?.toLowerCase() === currentUserEmail.toLowerCase();
//     const isSaving = (id) => !!saving[id];
//     const toggleExpanded = (id) => setExpandedRow(p => p === id ? null : id);

//     ── Filter + paginate ─────────────────────────────────────────────────────
//     const filtered = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         if (!q) return users;
//         return users.filter(u =>
//             u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
//         );
//     }, [search, users]);

//     const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//     const safePage = Math.min(currentPage, totalPages);
//     const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

//     const stats = useMemo(() => {
//         let managers = 0, admins = 0;
//         users.forEach(u => {
//             const r = roles[u.id];
//             if (r?.isManager) managers++;
//             else if (r?.tabs?.size > 0) admins++;
//         });
//         return { managers, admins, total: users.length };
//     }, [roles, users]);

//     ─────────────────────────────────────────────────────────────────────────
//     if (loading) return (
//         <div style={{ textAlign: 'center', padding: '60px 0', color: T.gray500, fontFamily: T.font }}>
//             <div style={{ fontSize: '2rem', marginBottom: 10 }}>⏳</div>
//             <div>جاري تحميل الصلاحيات...</div>
//         </div>
//     );

//     return (
//         <div>
//             <div className="adm-section-hdr">
//                 <div>
//                     <div className="adm-section-tag">إعدادات النظام</div>
//                     <div className="adm-section-title">إدارة <span>الصلاحيات</span></div>
//                 </div>
//                 <div style={{ display: 'flex', gap: 10 }}>
//                     <StatPill color={T.blue} icon="🛡" label="Admin" value={stats.admins} />
//                     <StatPill color={T.orange} icon="👑" label="Manager" value={stats.managers} />
//                     <StatPill color={T.gray500} icon="👥" label="Total" value={stats.total} />
//                 </div>
//             </div>

//             <div style={infoBannerStyle}>
//                 <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
//                 <div>
//                     <div style={{ fontWeight: 700, fontSize: '.78rem', color: T.blue, marginBottom: 3 }}>كيف تعمل الصلاحيات؟</div>
//                     <div style={{ fontSize: '.72rem', color: T.gray700, lineHeight: 1.8 }}>
//                         <b>مدير (Admin):</b> اختر التبويبات التي يمكنه الوصول إليها يدوياً.&nbsp;&nbsp;
//                         <b>مدير عام (Manager):</b> يصل تلقائياً لجميع التبويبات دون قيود.
//                     </div>
//                 </div>
//             </div>

//             {toast && (
//                 <div style={{
//                     ...toastBase,
//                     background: toast.type === 'success' ? T.greenBg : T.redBg,
//                     border: `1.5px solid ${toast.type === 'success' ? T.greenBorder : T.redBorder}`,
//                     borderRight: `4px solid ${toast.type === 'success' ? T.green : T.red}`,
//                     color: toast.type === 'success' ? T.green : T.red,
//                 }}>{toast.msg}</div>
//             )}

//             <div className="adm-toolbar" style={{ marginBottom: 14 }}>
//                 <div className="adm-search" style={{ flex: 1 }}>
//                     <input
//                         type="text"
//                         placeholder="ابحث بالاسم أو البريد الإلكتروني..."
//                         value={search}
//                         onChange={e => { setSearch(e.target.value); setCurrentPage(1); setExpandedRow(null); }}
//                     />
//                 </div>
//                 {search && <button className="adm-fclear" onClick={() => { setSearch(''); setCurrentPage(1); }}>✕</button>}
//             </div>

//             <div className="adm-card">
//                 <div style={{ padding: '14px 20px 10px', borderBottom: `1.5px solid ${T.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
//                     <span style={{ fontWeight: 900, fontSize: '.88rem', color: T.black, fontFamily: T.font }}>👥 قائمة المستخدمين</span>
//                     <span style={{ fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>{filtered.length} نتيجة</span>
//                 </div>

//                 {filtered.length === 0 ? (
//                     <div className="adm-empty"><div className="adm-emi">🔍</div><p>لا توجد نتائج مطابقة</p></div>
//                 ) : (
//                     <div className="adm-tscr">
//                         <table className="adm-tbl" style={{ minWidth: 680 }}>
//                             <thead>
//                                 <tr>
//                                     <th className="c" style={{ width: 36 }}>#</th>
//                                     <th>User</th>
//                                     <th>Email</th>
//                                     <th className="c" style={{ width: 110 }}>Admin</th>
//                                     <th className="c" style={{ width: 110 }}>Manager</th>
//                                     <th className="c" style={{ width: 100 }}>Tabs</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {paginated.map((user, idx) => {
//                                     const rowNum = (safePage - 1) * ITEMS_PER_PAGE + idx + 1;
//                                     const role = getRole(user.id);
//                                     const me = isMe(user.email);
//                                     const busy = isSaving(user.id);
//                                     const isOpen = expandedRow === user.id;
//                                     const admin = isAdmin(role);

//                                     return (
//                                         <React.Fragment key={user.id}>
//                                             <tr className={isOpen ? 'xopen' : ''} style={me ? { background: 'rgba(8,101,168,0.04)' } : {}}>
//                                                 <td style={{ textAlign: 'center', color: T.gray500, fontSize: '.68rem' }}>{rowNum}</td>

//                                                 <td>
//                                                     <div className="adm-uc">
//                                                         <div className="adm-av" style={{ background: role.isManager ? T.orange : admin ? T.blue : T.gray300, opacity: busy ? 0.6 : 1 }}>
//                                                             {(user.username ?? user.email ?? '?')[0].toUpperCase()}
//                                                         </div>
//                                                         <div>
//                                                             <span className="adm-uname">{user.username ?? user.email}</span>
//                                                             {me && <span style={{ marginRight: 6, fontSize: '.58rem', padding: '1px 6px', borderRadius: 2, background: T.greenBg, border: `1px solid ${T.greenBorder}`, color: T.green }}>● أنت</span>}
//                                                             {busy && <span style={{ marginRight: 6, fontSize: '.58rem', color: T.gray500 }}>⏳</span>}
//                                                         </div>
//                                                     </div>
//                                                 </td>

//                                                 <td className="adm-email" style={{ direction: 'ltr', textAlign: 'left' }}>{user.email}</td>

//                                                 {/* Admin — derived from having any tab permissions */}
//                                                 <td style={{ textAlign: 'center' }}>
//                                                     <label style={{ ...checkLabelStyle, opacity: busy ? 0.5 : 1 }}>
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={admin}
//                                                             disabled={role.isManager || busy}
//                                                             onChange={e => {
//                                                                 if (!e.target.checked) clearAllTabs(user.id);
//                                                                 else setExpandedRow(user.id); open tab selector
//                                                             }}
//                                                             style={{ accentColor: T.blue, width: 15, height: 15, cursor: (role.isManager || busy) ? 'not-allowed' : 'pointer' }}
//                                                         />
//                                                         <span style={{ fontSize: '.68rem', color: admin ? T.blue : T.gray500, fontWeight: 700, fontFamily: T.font }}>
//                                                             {admin ? 'Admin' : 'نعم'}
//                                                         </span>
//                                                     </label>
//                                                 </td>

//                                                 {/* Manager — maps to IsManager on AppUsers */}
//                                                 <td style={{ textAlign: 'center' }}>
//                                                     <label style={{ ...checkLabelStyle, opacity: busy ? 0.5 : 1 }}>
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={role.isManager}
//                                                             disabled={busy}
//                                                             onChange={e => setManager(user.id, e.target.checked)}
//                                                             style={{ accentColor: T.orange, width: 15, height: 15, cursor: busy ? 'not-allowed' : 'pointer' }}
//                                                         />
//                                                         <span style={{ fontSize: '.68rem', color: role.isManager ? T.orange : T.gray500, fontWeight: 700, fontFamily: T.font }}>
//                                                             {role.isManager ? 'Manager' : 'نعم'}
//                                                         </span>
//                                                     </label>
//                                                 </td>

//                                                 <td style={{ textAlign: 'center' }}>
//                                                     {role.isManager ? (
//                                                         <span style={{ fontSize: '.62rem', color: T.orange, fontWeight: 700, fontFamily: T.font }}>كل التبويبات</span>
//                                                     ) : admin ? (
//                                                         <span className={`adm-pill${isOpen ? ' op' : ''}`} onClick={() => toggleExpanded(user.id)} style={{ cursor: 'pointer' }}>
//                                                             {isOpen ? '▲ إخفاء' : `▼ ${role.tabs.size > 0 ? role.tabs.size : 'اختر'}`}
//                                                         </span>
//                                                     ) : (
//                                                         <span style={{ color: T.gray300 }}>—</span>
//                                                     )}
//                                                 </td>
//                                             </tr>

//                                             {isOpen && !role.isManager && (
//                                                 <tr className="adm-xrow">
//                                                     <td colSpan={6}>
//                                                         <div className="adm-xin" style={{ padding: '14px 18px' }}>
//                                                             <div style={{ fontWeight: 700, fontSize: '.78rem', color: T.blue, fontFamily: T.font, marginBottom: 10 }}>
//                                                                 🔑 التبويبات المتاحة لـ <span style={{ fontFamily: 'Courier New' }}>{user.email}</span>
//                                                             </div>
//                                                             <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
//                                                                 <button onClick={() => selectAllTabs(user.id)} style={quickBtnStyle(T.blue)}>✅ تحديد الكل</button>
//                                                                 <button onClick={() => clearAllTabs(user.id)} style={quickBtnStyle(T.gray500)}>✕ إلغاء الكل</button>
//                                                             </div>
//                                                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                                                                 {ADMIN_TABS.map(tab => {
//                                                                     const checked = role.tabs.has(tab.id);
//                                                                     const pending = tab.permissionId > 4; not yet in DB
//                                                                     return (
//                                                                         <label key={tab.id} title={pending ? '⚠️ هذا التبويب لم يُضف بعد في قاعدة البيانات' : ''} style={{
//                                                                             display: 'flex', alignItems: 'center', gap: 6,
//                                                                             padding: '7px 13px', borderRadius: 3,
//                                                                             cursor: (busy || pending) ? 'not-allowed' : 'pointer',
//                                                                             border: `1.5px solid ${checked ? T.blue : pending ? '#f0c040' : T.gray300}`,
//                                                                             background: checked ? 'rgba(8,101,168,0.06)' : pending ? '#fffbea' : T.white,
//                                                                             transition: 'all .14s', fontFamily: T.font,
//                                                                             opacity: busy ? 0.6 : 1,
//                                                                         }}>
//                                                                             <input
//                                                                                 type="checkbox"
//                                                                                 checked={checked}
//                                                                                 disabled={busy || pending}
//                                                                                 onChange={() => toggleTab(user.id, tab.id)}
//                                                                                 style={{ accentColor: T.blue, width: 13, height: 13 }}
//                                                                             />
//                                                                             <span style={{ fontSize: '.74rem', fontWeight: checked ? 700 : 500, color: checked ? T.blue : pending ? '#b45309' : T.gray700 }}>
//                                                                                 {tab.label}{pending ? ' ⚠️' : ''}
//                                                                             </span>
//                                                                         </label>
//                                                                     );
//                                                                 })}
//                                                             </div>
//                                                             <div style={{ marginTop: 10, fontSize: '.66rem', color: '#b45309', fontFamily: T.font }}>
//                                                                 ⚠️ التبويبات المعلّمة بـ ⚠️ تحتاج إضافتها في قاعدة البيانات أولاً
//                                                             </div>
//                                                             <div style={{ marginTop: 6, fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
//                                                                 {role.tabs.size === 0
//                                                                     ? '⚠️ لم يتم تحديد أي تبويب — المدير لن يرى أي محتوى'
//                                                                     : `✅ تم تحديد ${role.tabs.size} من ${ADMIN_TABS.length} تبويب`}
//                                                             </div>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             )}
//                                         </React.Fragment>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 {totalPages > 1 && (
//                     <div style={{ padding: '10px 20px 14px', borderTop: `1.5px solid ${T.gray100}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
//                         <button disabled={safePage === 1} onClick={() => setCurrentPage(p => p - 1)} style={pageBtn(safePage === 1)}>›</button>
//                         {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
//                             <button key={p} onClick={() => setCurrentPage(p)} style={pageBtn(false, p === safePage)}>{p}</button>
//                         ))}
//                         <button disabled={safePage === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={pageBtn(safePage === totalPages)}>‹</button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// function StatPill({ color, icon, label, value }) {
//     return (
//         <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 3, background: `${color}10`, border: `1px solid ${color}30` }}>
//             <span style={{ fontSize: '.8rem' }}>{icon}</span>
//             <span style={{ fontSize: '.68rem', color, fontWeight: 700, fontFamily: '"Noto Kufi Arabic",serif' }}>{label}</span>
//             <span style={{ fontFamily: 'Courier New', fontWeight: 900, fontSize: '.9rem', color }}>{value}</span>
//         </div>
//     );
// }

// const infoBannerStyle = {
//     background: 'rgba(8,101,168,0.05)', border: '1.5px solid rgba(8,101,168,0.18)',
//     borderRadius: 3, borderRight: '4px solid #0865a8', padding: '12px 16px',
//     marginBottom: 18, display: 'flex', alignItems: 'flex-start', gap: 10,
//     fontFamily: '"Noto Kufi Arabic",serif',
// };
// const toastBase = {
//     borderRadius: 3, padding: '10px 14px', marginBottom: 14, fontSize: '.78rem',
//     display: 'flex', alignItems: 'center', gap: 8, fontFamily: '"Noto Kufi Arabic",serif',
// };
// const checkLabelStyle = { display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer', userSelect: 'none' };
// const quickBtnStyle = (c) => ({
//     padding: '5px 14px', background: `${c}12`, border: `1.5px solid ${c}40`,
//     borderRadius: 2, color: c, fontFamily: '"Noto Kufi Arabic",serif', fontSize: '.7rem', fontWeight: 700, cursor: 'pointer',
// });
// const pageBtn = (disabled, active = false) => ({
//     width: 30, height: 30,
//     border: active ? '1.5px solid #0865a8' : '1.5px solid #d0d3d8',
//     borderRadius: 2, background: active ? '#0865a8' : '#fff',
//     color: active ? '#fff' : disabled ? '#d0d3d8' : '#374151',
//     fontWeight: 700, fontSize: '.78rem', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
// });