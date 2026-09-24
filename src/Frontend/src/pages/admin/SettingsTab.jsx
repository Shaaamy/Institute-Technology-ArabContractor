// ─────────────────────────────────────────────────────────────────────────────
// SettingsTab.jsx  —  src/pages/admin/SettingsTab.jsx
//
// FIX: GET /api/UserPermissions/{id} returns permission NAMES (["Users", ...]).
// idsFromServer() now maps names → permission ids using /api/Permissions,
// so saved permissions show up as checked.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray100: '#f0f1f2', gray200: '#e5e7eb', gray300: '#d0d3d8', gray500: '#6b7280', gray700: '#374151',
    green: '#16a34a', greenBg: '#f0fdf4', greenBorder: '#86efac',
    red: '#dc2626', redBg: '#fef2f2', redBorder: 'rgba(220,38,38,.2)',
    yellow: '#b45309', yellowBg: '#fffbea',
    font: '"Noto Kufi Arabic", serif',
};

// permissionName must match Permission.Name in the database (case-insensitive).
const ADMIN_TABS = [
    { id: 'users', label: '👤 المستخدمون', permissionName: 'Users' },
    { id: 'courses', label: '📚 الدورات', permissionName: 'Courses' },
    { id: 'attendance', label: '✅ الحضور', permissionName: 'Attendance' },
    { id: 'certificates', label: '📜 الشهادات', permissionName: 'Certificates' },
    { id: 'refunds', label: '💳 المستردات', permissionName: 'Refunds' },
    { id: 'finance', label: '💰 المالية', permissionName: 'Finance' },
    { id: 'lecturers', label: '🎓 المحاضرون', permissionName: 'Lecturers' },
    { id: 'news', label: '📰 الأخبار', permissionName: 'News' },
    { id: 'books', label: '📖 الكتب', permissionName: 'Books' },
    { id: 'workplan', label: '📋 خطة العمل', permissionName: 'Workplan' },
    { id: 'settings', label: '⚙️ الإعدادات', permissionName: 'Settings' },
];

const ITEMS_PER_PAGE = 6;

const API_BASE = (import.meta.env.VITE_API_URL ?? 'https://icemt.arabcont.com/').replace(/\/$/, '');

// Accepts names ("Users"), ids (3) or objects ({ permissionId } / { name })
// and always returns permission ids.
const idsFromServer = (data, perms) => {
    if (!Array.isArray(data)) return [];
    const byName = new Map(perms.map(p => [String(p.name ?? '').trim().toLowerCase(), p.id]));
    return data
        .map(item => {
            if (typeof item === 'string') return byName.get(item.trim().toLowerCase());
            if (typeof item === 'number') return item;
            const id = item?.permissionId ?? item?.PermissionId ?? item?.id ?? item?.Id;
            if (id != null) return id;
            const name = item?.name ?? item?.Name ?? item?.permissionName;
            return name ? byName.get(String(name).trim().toLowerCase()) : undefined;
        })
        .filter(id => id != null);
};

const emptyRole = () => ({ isManager: false, tabs: new Set() });

export default function SettingsTab({ currentUserEmail = '' }) {
    const { getToken } = useAuth();

    // ── UI state ──
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null);

    // ── API data ──
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState({}); // roles[userId] = { isManager, tabs: Set(permissionId) }

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState({});
    const [toast, setToast] = useState(null);

    const showToast = useCallback((type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3200);
    }, []);

    // ── Authenticated fetch ──
    const apiFetch = useCallback(async (url, options = {}) => {
        const token = await getToken();
        if (!token) throw new Error('لم يتم العثور على Authentication Token');

        const headers = { Accept: 'application/json', ...(options.headers || {}), Authorization: `Bearer ${token}` };
        if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

        const response = await fetch(`${API_BASE}${url}`, { ...options, headers });

        if (!response.ok) {
            let message = `HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                if (typeof errorData === 'string') message = errorData;
                else if (errorData?.message) message = errorData.message;
                else if (errorData?.title) message = errorData.title;
            } catch { /* ignore */ }
            throw new Error(message);
        }

        if (response.status === 204) return null;
        const text = await response.text();
        if (!text) return null;
        try { return JSON.parse(text); } catch { return text; }
    }, [getToken]);

    const normalizePermission = useCallback((p) => ({
        id: p?.id ?? p?.Id ?? p?.permissionId ?? p?.PermissionId,
        name: p?.name ?? p?.Name ?? '',
    }), []);

    const getPermissionForTab = useCallback((tab) => {
        const target = tab.permissionName.trim().toLowerCase();
        return permissions.find(p => p.name?.trim().toLowerCase() === target);
    }, [permissions]);

    // ── Load everything ──
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const permissionsData = await apiFetch('/api/Permissions');
            const normalizedPermissions = Array.isArray(permissionsData) ? permissionsData.map(normalizePermission) : [];
            setPermissions(normalizedPermissions);

            const usersData = await apiFetch('/api/AdminUsers');
            const loadedUsers = Array.isArray(usersData) ? usersData : [];
            setUsers(loadedUsers);

            const results = await Promise.all(loadedUsers.map(async user => {
                try {
                    return { userId: user.id, data: await apiFetch(`/api/UserPermissions/${user.id}`) };
                } catch (error) {
                    console.error(`Failed to load permissions for user ${user.id}`, error);
                    return { userId: user.id, data: [] };
                }
            }));

            const initialRoles = {};
            results.forEach(({ userId, data }) => {
                const user = loadedUsers.find(u => u.id === userId);
                if (!user) return;
                initialRoles[userId] = {
                    isManager: !!user.isManager,
                    tabs: new Set(idsFromServer(data, normalizedPermissions)),
                };
            });
            setRoles(initialRoles);
        } catch (error) {
            console.error('Failed loading settings:', error);
            showToast('error', `فشل تحميل البيانات: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [apiFetch, normalizePermission, showToast]);

    useEffect(() => { loadData(); }, [loadData]);

    // ── Saving state ──
    const setUserSaving = useCallback((userId, value) => {
        setSaving(prev => ({ ...prev, [userId]: value }));
    }, []);
    const isSaving = useCallback(userId => !!saving[userId], [saving]);

    // ── API calls ──
    const assignPermission = useCallback(async (userId, permissionId) => {
        await apiFetch('/api/UserPermissions/assign', {
            method: 'POST',
            body: JSON.stringify({ userId, permissionId }),
        });
    }, [apiFetch]);

    const removePermission = useCallback(async (userId, permissionId) => {
        await apiFetch(
            `/api/UserPermissions/remove?userId=${encodeURIComponent(userId)}&permissionId=${encodeURIComponent(permissionId)}`,
            { method: 'DELETE' }
        );
    }, [apiFetch]);

    // Re-read the real DB state for one user (used after a failed bulk action)
    const reloadUserTabs = useCallback(async (userId, fallbackTabs) => {
        try {
            const serverPermissions = await apiFetch(`/api/UserPermissions/${userId}`);
            const serverIds = idsFromServer(serverPermissions, permissions);
            setRoles(prev => ({ ...prev, [userId]: { ...prev[userId], tabs: new Set(serverIds) } }));
        } catch {
            setRoles(prev => ({ ...prev, [userId]: { ...prev[userId], tabs: fallbackTabs } }));
        }
    }, [apiFetch, permissions]);

    // ── Manager ──
    const setManager = useCallback(async (userId, checked) => {
        const current = roles[userId] ?? emptyRole();
        const previousRole = { isManager: current.isManager, tabs: new Set(current.tabs) };

        setUserSaving(userId, true);
        try {
            await apiFetch(`/api/AdminUsers/${userId}/manager`, {
                method: 'PATCH',
                body: JSON.stringify({ isManager: checked }),
            });
            setRoles(prev => ({
                ...prev,
                [userId]: { ...prev[userId], isManager: checked, tabs: new Set(previousRole.tabs) },
            }));
            showToast('success', checked ? '✅ تم منح صلاحية المدير العام' : 'تم سحب صلاحية المدير العام');
        } catch (error) {
            setRoles(prev => ({ ...prev, [userId]: previousRole }));
            showToast('error', `فشل تغيير صلاحية المدير: ${error.message}`);
        } finally {
            setUserSaving(userId, false);
        }
    }, [roles, apiFetch, setUserSaving, showToast]);

    // ── Toggle one tab ──
    const toggleTab = useCallback(async (userId, tab) => {
        const permission = getPermissionForTab(tab);
        if (!permission) {
            showToast('error', `صلاحية "${tab.label}" غير مضافة في قاعدة البيانات`);
            return;
        }

        const current = roles[userId] ?? emptyRole();
        const wasChecked = current.tabs.has(permission.id);
        const previousTabs = new Set(current.tabs);

        setRoles(prev => {
            const tabs = new Set(prev[userId]?.tabs ?? []);
            if (wasChecked) tabs.delete(permission.id); else tabs.add(permission.id);
            return { ...prev, [userId]: { ...prev[userId], tabs } };
        });

        setUserSaving(userId, true);
        try {
            if (wasChecked) await removePermission(userId, permission.id);
            else await assignPermission(userId, permission.id);
            showToast('success', wasChecked ? `تم سحب صلاحية ${tab.label}` : `✅ تم منح صلاحية ${tab.label}`);
        } catch (error) {
            setRoles(prev => ({ ...prev, [userId]: { ...prev[userId], tabs: previousTabs } }));
            showToast('error', `فشل تحديث التبويب: ${error.message}`);
        } finally {
            setUserSaving(userId, false);
        }
    }, [roles, getPermissionForTab, assignPermission, removePermission, setUserSaving, showToast]);

    // ── Select all ──
    const selectAllTabs = useCallback(async (userId) => {
        const current = roles[userId] ?? emptyRole();
        const previousTabs = new Set(current.tabs);

        const missing = ADMIN_TABS
            .map(tab => ({ tab, permission: getPermissionForTab(tab) }))
            .filter(item => item.permission && !previousTabs.has(item.permission.id));

        if (missing.length === 0) {
            showToast('success', 'كل الصلاحيات المتاحة محددة بالفعل');
            return;
        }

        const newTabs = new Set(previousTabs);
        missing.forEach(item => newTabs.add(item.permission.id));
        setRoles(prev => ({ ...prev, [userId]: { ...prev[userId], tabs: newTabs } }));

        setUserSaving(userId, true);
        try {
            await Promise.all(missing.map(item => assignPermission(userId, item.permission.id)));
            showToast('success', `✅ تم تحديد ${missing.length} صلاحية`);
        } catch (error) {
            await reloadUserTabs(userId, previousTabs);
            showToast('error', `فشل تحديد الصلاحيات: ${error.message}`);
        } finally {
            setUserSaving(userId, false);
        }
    }, [roles, getPermissionForTab, assignPermission, reloadUserTabs, setUserSaving, showToast]);

    // ── Clear all ──
    const clearAllTabs = useCallback(async (userId) => {
        const current = roles[userId] ?? emptyRole();
        const previousTabs = new Set(current.tabs);

        if (previousTabs.size === 0) {
            showToast('success', 'لا توجد صلاحيات لإلغائها');
            return;
        }

        setRoles(prev => ({ ...prev, [userId]: { ...prev[userId], tabs: new Set() } }));

        setUserSaving(userId, true);
        try {
            await Promise.all([...previousTabs].map(pid => removePermission(userId, pid)));
            showToast('success', 'تم إلغاء جميع الصلاحيات');
        } catch (error) {
            await reloadUserTabs(userId, previousTabs);
            showToast('error', `فشل إلغاء الصلاحيات: ${error.message}`);
        } finally {
            setUserSaving(userId, false);
        }
    }, [roles, removePermission, reloadUserTabs, setUserSaving, showToast]);

    // ── Helpers ──
    const getRole = useCallback(userId => roles[userId] ?? emptyRole(), [roles]);
    const isMe = useCallback(
        email => !!email && email.toLowerCase() === currentUserEmail?.toLowerCase(),
        [currentUserEmail]
    );
    const toggleExpanded = useCallback(userId => {
        setExpandedRow(prev => (prev === userId ? null : userId));
    }, []);

    // Admin = manager or at least one permission
    const isAdmin = role => !!role?.isManager || (role?.tabs instanceof Set && role.tabs.size > 0);

    // ── Filter + pagination ──
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u =>
            [u.username, u.email, u.firstName, u.lastName].some(v => (v?.toLowerCase() ?? '').includes(q))
        );
    }, [search, users]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

    // ── Stats ──
    const stats = useMemo(() => {
        let admins = 0, managers = 0;
        users.forEach(u => {
            const role = roles[u.id];
            if (role?.isManager) managers++;
            else if (role?.tabs?.size > 0) admins++;
        });
        return { admins, managers, total: users.length };
    }, [users, roles]);

    // ── Loading ──
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0', color: T.gray500, fontFamily: T.font }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>⏳</div>
                <div>جاري تحميل الصلاحيات...</div>
            </div>
        );
    }

    const anyMissingPermission = ADMIN_TABS.some(tab => !getPermissionForTab(tab));

    return (
        <div>
            {/* Header */}
            <div className="adm-section-hdr">
                <div>
                    <div className="adm-section-tag">إعدادات النظام</div>
                    <div className="adm-section-title">إدارة <span>الصلاحيات</span></div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <StatPill color={T.blue} icon="🛡" label="Admin" value={stats.admins} />
                    <StatPill color={T.orange} icon="👑" label="Manager" value={stats.managers} />
                    <StatPill color={T.gray500} icon="👥" label="Users" value={stats.total} />
                </div>
            </div>

            {/* Info */}
            <div style={infoBannerStyle}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '.78rem', color: T.blue, marginBottom: 3 }}>
                        كيف تعمل الصلاحيات؟
                    </div>
                    <div style={{ fontSize: '.72rem', color: T.gray700, lineHeight: 1.8 }}>
                        <b>Admin:</b> اختر التبويبات التي يمكنه الوصول إليها يدوياً.
                        &nbsp;&nbsp;
                        <b>Manager:</b> يصل تلقائياً لجميع التبويبات دون قيود.
                    </div>
                </div>
            </div>

            {/* Toast */}
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

            {/* Search */}
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

            {/* Users card */}
            <div className="adm-card">
                <div style={{
                    padding: '14px 20px 10px', borderBottom: `1.5px solid ${T.gray100}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
                }}>
                    <span style={{ fontWeight: 900, fontSize: '.88rem', color: T.black, fontFamily: T.font }}>
                        👥 قائمة المستخدمين
                    </span>
                    <span style={{ fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
                        {filtered.length} نتيجة
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="adm-empty">
                        <div className="adm-emi">🔍</div>
                        <p>لا توجد نتائج مطابقة</p>
                    </div>
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
                                    const busy = isSaving(user.id);
                                    const isOpen = expandedRow === user.id;
                                    const admin = isAdmin(role);
                                    const tabCount = role.tabs.size;

                                    return (
                                        <React.Fragment key={user.id}>
                                            <tr
                                                className={isOpen ? 'xopen' : ''}
                                                style={me ? { background: 'rgba(8,101,168,0.04)' } : {}}
                                            >
                                                <td style={{ textAlign: 'center', color: T.gray500, fontSize: '.68rem' }}>
                                                    {rowNum}
                                                </td>

                                                <td>
                                                    <div className="adm-uc">
                                                        <div
                                                            className="adm-av"
                                                            style={{
                                                                background: role.isManager ? T.orange : admin ? T.blue : T.gray300,
                                                                opacity: busy ? 0.6 : 1,
                                                            }}
                                                        >
                                                            {(user.username ?? user.email ?? '?')[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="adm-uname">
                                                                {user.username ||
                                                                    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
                                                                    user.email}
                                                            </span>
                                                            {me && (
                                                                <span style={{
                                                                    marginRight: 6, fontSize: '.58rem', padding: '1px 6px', borderRadius: 2,
                                                                    background: T.greenBg, border: `1px solid ${T.greenBorder}`, color: T.green,
                                                                }}>
                                                                    ● أنت
                                                                </span>
                                                            )}
                                                            {busy && (
                                                                <span style={{ marginRight: 6, fontSize: '.58rem', color: T.gray500 }}>⏳</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="adm-email" style={{ direction: 'ltr', textAlign: 'left' }}>
                                                    {user.email}
                                                </td>

                                                {/* Admin (derived, read-only) */}
                                                <td style={{ textAlign: 'center' }}>
                                                    <label style={{ ...checkLabelStyle, opacity: busy ? 0.5 : 1 }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={admin}
                                                            disabled
                                                            readOnly
                                                            style={{ accentColor: T.blue, width: 15, height: 15, cursor: 'default' }}
                                                        />
                                                        <span style={{
                                                            fontSize: '.68rem', color: admin ? T.blue : T.gray500,
                                                            fontWeight: 700, fontFamily: T.font,
                                                        }}>
                                                            {admin ? 'Admin' : 'نعم'}
                                                        </span>
                                                    </label>
                                                </td>

                                                {/* Manager */}
                                                <td style={{ textAlign: 'center' }}>
                                                    <label style={{ ...checkLabelStyle, opacity: busy ? 0.5 : 1 }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={role.isManager}
                                                            disabled={busy}
                                                            onChange={e => setManager(user.id, e.target.checked)}
                                                            style={{
                                                                accentColor: T.orange, width: 15, height: 15,
                                                                cursor: busy ? 'not-allowed' : 'pointer',
                                                            }}
                                                        />
                                                        <span style={{
                                                            fontSize: '.68rem', color: role.isManager ? T.orange : T.gray500,
                                                            fontWeight: 700, fontFamily: T.font,
                                                        }}>
                                                            {role.isManager ? 'Manager' : 'نعم'}
                                                        </span>
                                                    </label>
                                                </td>

                                                {/* Tabs */}
                                                <td style={{ textAlign: 'center' }}>
                                                    {role.isManager ? (
                                                        <span style={{ fontSize: '.62rem', color: T.orange, fontWeight: 700, fontFamily: T.font }}>
                                                            كل التبويبات
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className={`adm-pill${isOpen ? ' op' : ''}`}
                                                            onClick={() => toggleExpanded(user.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {isOpen ? '▲ إخفاء' : `▼ ${tabCount > 0 ? tabCount : 'اختر'}`}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* Expanded permissions */}
                                            {isOpen && !role.isManager && (
                                                <tr className="adm-xrow">
                                                    <td colSpan={6}>
                                                        <div className="adm-xin" style={{ padding: '14px 18px' }}>
                                                            <div style={{
                                                                fontWeight: 700, fontSize: '.78rem', color: T.blue,
                                                                fontFamily: T.font, marginBottom: 10,
                                                            }}>
                                                                🔑 التبويبات المتاحة لـ{' '}
                                                                <span style={{ fontFamily: 'Courier New' }}>{user.email}</span>
                                                            </div>

                                                            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                                                <button
                                                                    onClick={() => selectAllTabs(user.id)}
                                                                    disabled={busy}
                                                                    style={{ ...quickBtnStyle(T.blue), opacity: busy ? 0.5 : 1 }}
                                                                >
                                                                    ✅ تحديد الكل
                                                                </button>
                                                                <button
                                                                    onClick={() => clearAllTabs(user.id)}
                                                                    disabled={busy}
                                                                    style={{ ...quickBtnStyle(T.gray500), opacity: busy ? 0.5 : 1 }}
                                                                >
                                                                    ✕ إلغاء الكل
                                                                </button>
                                                            </div>

                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                                {ADMIN_TABS.map(tab => {
                                                                    const permission = getPermissionForTab(tab);
                                                                    const exists = !!permission;
                                                                    const checked = exists && role.tabs.has(permission.id);

                                                                    return (
                                                                        <label
                                                                            key={tab.id}
                                                                            title={exists ? '' : '⚠️ هذا التبويب غير مضاف في قاعدة البيانات'}
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', gap: 6,
                                                                                padding: '7px 13px', borderRadius: 3,
                                                                                cursor: busy || !exists ? 'not-allowed' : 'pointer',
                                                                                border: `1.5px solid ${checked ? T.blue : !exists ? '#f0c040' : T.gray300}`,
                                                                                background: checked ? 'rgba(8,101,168,0.06)' : !exists ? T.yellowBg : T.white,
                                                                                transition: 'all .14s', fontFamily: T.font,
                                                                                opacity: busy ? 0.6 : 1,
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={checked}
                                                                                disabled={busy || !exists}
                                                                                onChange={() => toggleTab(user.id, tab)}
                                                                                style={{ accentColor: T.blue, width: 13, height: 13 }}
                                                                            />
                                                                            <span style={{
                                                                                fontSize: '.74rem', fontWeight: checked ? 700 : 500,
                                                                                color: checked ? T.blue : !exists ? T.yellow : T.gray700,
                                                                            }}>
                                                                                {tab.label}{!exists && ' ⚠️'}
                                                                            </span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>

                                                            {anyMissingPermission && (
                                                                <div style={{ marginTop: 10, fontSize: '.66rem', color: T.yellow, fontFamily: T.font }}>
                                                                    ⚠️ التبويبات المعلّمة بـ ⚠️ تحتاج إضافتها في جدول Permissions أولاً.
                                                                </div>
                                                            )}

                                                            <div style={{ marginTop: 6, fontSize: '.68rem', color: T.gray500, fontFamily: T.font }}>
                                                                {role.tabs.size === 0
                                                                    ? '⚠️ لم يتم تحديد أي تبويب'
                                                                    : `✅ تم تحديد ${role.tabs.size} صلاحية من الصلاحيات الموجودة في قاعدة البيانات`}
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        padding: '10px 20px 14px', borderTop: `1.5px solid ${T.gray100}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                        <button
                            disabled={safePage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            style={pageBtn(safePage === 1)}
                        >›</button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                style={pageBtn(false, page === safePage)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={safePage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            style={pageBtn(safePage === totalPages)}
                        >‹</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat pill
// ─────────────────────────────────────────────────────────────────────────────

function StatPill({ color, icon, label, value }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 3,
            background: `${color}10`, border: `1px solid ${color}30`,
        }}>
            <span style={{ fontSize: '.8rem' }}>{icon}</span>
            <span style={{ fontSize: '.68rem', color, fontWeight: 700, fontFamily: '"Noto Kufi Arabic",serif' }}>{label}</span>
            <span style={{ fontFamily: 'Courier New', fontWeight: 900, fontSize: '.9rem', color }}>{value}</span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

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

const quickBtnStyle = color => ({
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