import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

import { ADMIN_EMAILS, API_BASE, API_HOST, ITEMS_PER_PAGE, T } from '../../components/admin/constants';
import { injectAdminStyles } from '../../components/admin/styles';
import { fmtDate, toStatusKey } from '../../components/admin/helpers';
import { normalizeUser, normalizeCourse, normalizeRefund } from '../../components/admin/normalizers';
import { withExport, buildUsersRows, buildCoursesRows, buildAttRows, buildCertRows, buildRefundRows } from '../../components/admin/exportHelpers';

import Sidebar from '../../components/admin/Sidebar';
import PageHero from '../../components/admin/PageHero';
import StatCards from '../../components/admin/StatCards';
import FinancialTab from './FinancialTab';

import UsersTab from '../../components/admin/tabs/UsersTab';
import CoursesTab from '../../components/admin/tabs/CoursesTab';
import AttendanceTab from '../../components/admin/tabs/AttendanceTab';
import CertificatesTab from '../../components/admin/tabs/CertificatesTab';
import RefundsTab from '../../components/admin/tabs/RefundsTab';

import CertUploadModal from '../../components/admin/modals/CertUploadModal';
import RefundDetailModal from '../../components/admin/modals/RefundDetailModal';
import RefundActionModal from '../../components/admin/modals/RefundActionModal';
import LecturersTab from './mohadren';
import NewsTab from './NewsTab';
import BooksTab from './BooksTab';
import PlanworkTab from './PlanworkTab';
import SettingsTab from './SettingsTab';

const TABS = [
    { id: 'users', label: 'المستخدمون', icon: '👤' },
    { id: 'courses', label: 'الدورات', icon: '📚' },
    { id: 'attendance', label: 'الحضور', icon: '✅' },
    { id: 'certificates', label: 'الشهادات', icon: '📜' },
    { id: 'refunds', label: 'المستردات', icon: '💳' },
    { id: 'financial', label: 'المالية', icon: '💰' },
    { id: 'lecturers', label: 'المحاضرون', icon: '🎓' },
    { id: 'news', label: 'الأخبار', icon: '📰' },
    { id: 'books', label: 'الكتب', icon: '📖' },
    { id: 'planwork', label: 'خطة العمل', icon: '📋' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
];

const AdminDashboard = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();

    // ── Tab / UI state ──
    const [activeTab, setActiveTab] = useState('users');
    const [expandedRow, setExpandedRow] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState(null);

    // ── Data state ──
    const [usersData, setUsersData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [apiStats, setApiStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Attendance state ──
    const [attendance, setAttendance] = useState({});
    const [attendanceSaving, setAttendanceSaving] = useState({});
    const [attError, setAttError] = useState(null);
    const [attCourseFilter, setAttCourseFilter] = useState('all');
    const [attUserSearch, setAttUserSearch] = useState('');

    // ── Certificate state ──
    const [certificates, setCertificates] = useState({});
    const [certUploading, setCertUploading] = useState({});
    const [certDeleting, setCertDeleting] = useState({});
    const [certError, setCertError] = useState(null);
    const [certModal, setCertModal] = useState(null);
    const [certSearch, setCertSearch] = useState('');
    const [certStatusFilter, setCertStatusFilter] = useState('all');

    // ── Refund state ──
    const [refunds, setRefunds] = useState([]);
    const [refundsLoading, setRefundsLoading] = useState(false);
    const [refundsError, setRefundsError] = useState(null);
    const [refundStatusFilter, setRefundStatusFilter] = useState('all');
    const [refundSearch, setRefundSearch] = useState('');
    const [refundDetailModal, setRefundDetailModal] = useState(null);
    const [refundActionModal, setRefundActionModal] = useState(null);
    const [refundActionNote, setRefundActionNote] = useState('');
    const [refundActionSaving, setRefundActionSaving] = useState(false);
    const [refundActionError, setRefundActionError] = useState('');
    const [bankResultBanner, setBankResultBanner] = useState(null);

    // ── Search / filter ──
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // ── Books state ──
    const [booksData, setBooksData] = useState([]);
    const [booksPage, setBooksPage] = useState(1);
    const [booksSearch, setBooksSearch] = useState('');

    // ── Pagination ──
    const [usersPage, setUsersPage] = useState(1);
    const [coursesPage, setCoursesPage] = useState(1);
    const [attPage, setAttPage] = useState(1);
    const [certPage, setCertPage] = useState(1);
    const [refundPage, setRefundPage] = useState(1);

    // ── Effects ──
    useEffect(() => { injectAdminStyles(); }, []);
    useEffect(() => {
        setUsersPage(1); setCoursesPage(1); setBooksPage(1); setExpandedRow(null);
    }, [activeTab]);
    useEffect(() => { setUsersPage(1); setExpandedRow(null); }, [searchQuery, dateFrom, dateTo]);
    useEffect(() => { setAttPage(1); }, [attCourseFilter, attUserSearch]);
    useEffect(() => { setCertPage(1); }, [certSearch, certStatusFilter]);
    useEffect(() => { setRefundPage(1); }, [refundSearch, refundStatusFilter]);

    useEffect(() => {
        if (!isLoaded || !user) return;
        if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase()))
            navigate('/');
    }, [isLoaded, user, navigate]);

    // ── Auth fetch helpers ──
    const authFetch = useCallback(async (url, options = {}) => {
        let token = null;
        try { token = await getToken(); } catch (_) { }
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });
    }, [getToken]);

    const authFetchForm = useCallback(async (url, formData) => {
        let token = null;
        try { token = await getToken(); } catch (_) { }
        return fetch(url, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });
    }, [getToken]);

    // ── FIX 1: Standalone loadStats so it can be called after any mutation ──
    const loadStats = useCallback(async () => {
        try {
            const sRes = await authFetch(`${API_BASE}/Admin/stats`);
            if (sRes.ok) setApiStats(await sRes.json());
        } catch (_) { }
    }, [authFetch]);

    // ── Books loader ──
    const loadBooks = useCallback(async () => {
        try {
            const res = await authFetch(`${API_BASE}/Admin/books`);
            if (res.ok) {
                const data = await res.json();
                setBooksData(Array.isArray(data) ? data : data.result || []);
            }
        } catch (err) {
            console.error('Failed to load books:', err);
        }
    }, [authFetch]);

    useEffect(() => {
        if (activeTab === 'books') loadBooks();
    }, [activeTab, loadBooks]);

    // ── Load main data ──
    useEffect(() => {
        const load = async () => {
            setLoading(true); setError(null);
            try {
                const [uRes, cRes, sRes] = await Promise.all([
                    authFetch(`${API_BASE}/Admin/users`),
                    authFetch(`${API_BASE}/Admin/planworks`),
                    authFetch(`${API_BASE}/Admin/stats`),
                ]);
                let usersRaw = [], coursesRaw = [], statsRaw = null;
                if (uRes.ok) {
                    const j = await uRes.json();
                    usersRaw = Array.isArray(j) ? j : j?.data ?? j?.users ?? j?.result ?? [];
                } else {
                    const t = await uRes.text().catch(() => '');
                    setError(`Users API ${uRes.status}: ${t.slice(0, 200)}`);
                }
                if (cRes.ok) {
                    const j = await cRes.json();
                    coursesRaw = Array.isArray(j) ? j : j?.data ?? j?.planWorks ?? j?.courses ?? j?.result ?? [];
                }
                if (sRes.ok) statsRaw = await sRes.json();

                const normUsers = usersRaw.map(normalizeUser).filter(u => u.id != null);
                const normCourses = coursesRaw.map(normalizeCourse).filter(c => c.id != null);
                setUsersData(normUsers);
                setCoursesData(normCourses);
                setApiStats(statsRaw);
                seedAttendance(normUsers);
                await loadCertificatesFromApi();
            } catch (err) {
                setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };
        if (isLoaded && user) load();
    }, [isLoaded, user, authFetch]); // eslint-disable-line

    useEffect(() => {
        if (activeTab === 'refunds') fetchRefunds(refundStatusFilter);
    }, [activeTab, refundStatusFilter]); // eslint-disable-line

    useEffect(() => {
        if (activeTab === 'certificates') refreshCertificates();
    }, [activeTab]); // eslint-disable-line

    // ── Attendance helpers ──
    const seedAttendance = useCallback((users) => {
        const map = {};
        users.forEach(u =>
            u.enrolledCourses.forEach(c => {
                if (c.enrollmentId != null) map[String(c.enrollmentId)] = !!c.attended;
            })
        );
        setAttendance(map);
    }, []);

    // ── FIX 2: Call loadStats() after toggling attendance ──
    const toggleAttendance = async (enrollmentId, currentVal) => {
        if (enrollmentId == null) { setAttError('لا يوجد enrollmentId لهذا التسجيل'); return; }
        const k = String(enrollmentId);
        const newVal = !currentVal;
        setAttendance(p => ({ ...p, [k]: newVal }));
        setAttendanceSaving(p => ({ ...p, [k]: true }));
        setAttError(null);
        try {
            const res = await authFetch(
                `${API_BASE}/Admin/enrollments/${enrollmentId}/attendance`,
                { method: 'PATCH', body: JSON.stringify(newVal) }
            );
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message ?? `HTTP ${res.status}`);
            }
            // Refresh stats so the "attended" card updates immediately
            await loadStats();
        } catch (err) {
            setAttendance(p => ({ ...p, [k]: currentVal }));
            setAttError('فشل تحديث الحضور: ' + err.message);
        } finally {
            setAttendanceSaving(p => ({ ...p, [k]: false }));
        }
    };

    // ── Certificate helpers ──
    const loadCertificatesFromApi = useCallback(async () => {
        try {
            const res = await authFetch(`${API_BASE}/Admin/certificates`);
            if (!res.ok) return;
            const json = await res.json();
            const arr = Array.isArray(json) ? json : json?.data ?? json?.certificates ?? json?.result ?? [];
            const map = {};
            arr.forEach(raw => {
                const certId = raw.id ?? raw.Id ?? null;
                const userId = raw.userId ?? raw.UserId ?? null;
                const planworkId = raw.planworkId ?? raw.PlanworkId ?? null;
                const rawFileUrl = raw.fileUrl ?? raw.FileUrl ?? raw.filePath ?? raw.FilePath ?? null;
                const fileName = raw.fileName ?? raw.FileName ?? (rawFileUrl ? rawFileUrl.split('/').pop().split('?')[0] : 'certificate');
                const uploadedAt = fmtDate(raw.uploadedAt ?? raw.UploadedAt ?? null);
                let fileUrl = null;
                if (rawFileUrl && rawFileUrl !== 'uploaded')
                    fileUrl = rawFileUrl.startsWith('http') ? rawFileUrl : `${API_BASE.replace('/api', '')}${rawFileUrl}`;
                if (!certId || userId == null || planworkId == null) return;
                const key = `${Number(userId)}-${Number(planworkId)}`;
                map[key] = { certId, name: fileName, url: fileUrl, rawUrl: rawFileUrl, size: null, fromDb: true, uploadedAt, userId, planworkId };
            });
            setCertificates(map);
        } catch (err) {
            console.warn('[Certs] load failed:', err.message);
        }
    }, [authFetch]);

    // ── FIX 3: refreshCertificates also calls loadStats so cert card updates immediately ──
    const refreshCertificates = useCallback(async () => {
        await loadCertificatesFromApi();
        await loadStats();
    }, [loadCertificatesFromApi, loadStats]);

    const handleCertFile = async (enrollmentId, userId, planworkId, file) => {
        if (!file) return;
        const key = `${Number(userId)}-${Number(planworkId)}`;
        setCertUploading(p => ({ ...p, [key]: true }));
        setCertError(null);
        try {
            const existing = certificates[key];
            let res, text;
            if (existing?.certId != null) {
                const fd = new FormData();
                fd.append('CertificateId', Number(existing.certId));
                fd.append('File', file, file.name);
                let token = null;
                try { token = await getToken(); } catch (_) { }
                res = await fetch(`${API_BASE}/Admin/certificates`, {
                    method: 'PUT',
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: fd,
                });
                text = await res.text();
            } else {
                const fd = new FormData();
                if (userId != null) fd.append('UserId', Number(userId));
                if (planworkId != null) fd.append('PlanworkId', Number(planworkId));
                if (enrollmentId != null) fd.append('EnrollmentId', Number(enrollmentId));
                fd.append('File', file, file.name);
                res = await authFetchForm(`${API_BASE}/Admin/upload`, fd);
                text = await res.text();
            }
            if (!res.ok) {
                let msg = `HTTP ${res.status}`;
                try {
                    const j = JSON.parse(text);
                    msg = j?.message ?? j?.error ?? j?.title ?? j?.detail ?? msg;
                } catch {
                    if (text.trim().length < 400) msg = text.trim();
                }
                throw new Error(msg);
            }
            // refreshCertificates now also calls loadStats internally
            await refreshCertificates();
        } catch (err) {
            setCertError('فشل رفع الشهادة: ' + err.message);
        } finally {
            setCertUploading(p => ({ ...p, [key]: false }));
            setCertModal(null);
        }
    };

    const deleteCert = useCallback(async (ck, altKey = null) => {
        const cert = certificates[ck] ?? (altKey ? certificates[altKey] : undefined);
        if (!window.confirm('هل تريد حذف هذه الشهادة؟')) return;
        setCertDeleting(p => ({ ...p, [ck]: true }));
        setCertError(null);
        try {
            if (cert?.certId != null) {
                const res = await authFetch(`${API_BASE}/Admin/certificates/${cert.certId}`, { method: 'DELETE' });
                if (!res.ok && res.status !== 404) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j?.message ?? j?.title ?? `HTTP ${res.status}`);
                }
            }
            // refreshCertificates now also calls loadStats internally
            await refreshCertificates();
        } catch (err) {
            setCertError('فشل حذف الشهادة: ' + err.message);
        } finally {
            setCertDeleting(p => ({ ...p, [ck]: false }));
        }
    }, [authFetch, certificates, refreshCertificates]);

    const viewCert = useCallback(async (certId, url, rawUrl, filename, userId, planworkId) => {
        let token = null;
        try { token = await getToken(); } catch (_) { }
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        let fileUrl = null;
        if (userId != null && planworkId != null) {
            try {
                const r = await fetch(`${API_BASE}/Admin/certificates/${userId}/${planworkId}`, { headers: authHeaders });
                if (r.ok) {
                    const meta = await r.json();
                    const obj = Array.isArray(meta) ? meta[0] : meta;
                    const fu = obj?.fileUrl ?? obj?.FileUrl ?? obj?.url ?? obj?.Url ?? null;
                    if (fu && fu !== 'uploaded')
                        fileUrl = fu.startsWith('http') ? fu : `${API_BASE.replace('/api', '')}${fu}`;
                }
            } catch (_) { }
        }
        if (!fileUrl && url && url !== 'uploaded') fileUrl = url;
        if (!fileUrl && rawUrl) fileUrl = rawUrl.startsWith('http') ? rawUrl : `${API_BASE.replace('/api', '')}${rawUrl}`;
        if (fileUrl) { window.open(fileUrl, '_blank'); return; }
        setCertError('تعذّر فتح الشهادة — تأكد من صلاحية الجلسة');
    }, [getToken]);

    // ── Refund helpers ──
    const fetchRefunds = useCallback(async (statusFilter = 'all') => {
        setRefundsLoading(true); setRefundsError(null);
        try {
            const qs = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
            const res = await authFetch(`${API_BASE}/refund/admin/all${qs}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const raw = Array.isArray(json) ? json : json?.data ?? json?.items ?? [];
            setRefunds(raw.map(normalizeRefund));
        } catch (err) {
            setRefundsError('فشل تحميل طلبات الاسترداد: ' + err.message);
        } finally {
            setRefundsLoading(false);
        }
    }, [authFetch]);

    const commitRefundAction = async () => {
        if (!refundActionModal) return;
        const { refund: r, action } = refundActionModal;
        if (action === 'reject' && !refundActionNote.trim()) return;
        setRefundActionSaving(true); setRefundActionError('');
        try {
            const endpoint = {
                approve: `${API_BASE}/refund/${r.id}/approve`,
                reject: `${API_BASE}/refund/${r.id}/reject`,
                send_to_bank: `${API_BASE}/refund/${r.id}/sent`,
            }[action];
            const body = {};
            if (action === 'reject') body.rejectionReason = refundActionNote.trim();
            if (action === 'approve') body.adminNote = refundActionNote.trim();
            if (action === 'send_to_bank') body.adminNote = refundActionNote.trim();
            const res = await authFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message ?? j?.error ?? `HTTP ${res.status}`);
            }
            const normalized = normalizeRefund(await res.json());
            if (action === 'send_to_bank') {
                const br = normalized.bankResult;
                if (br === 'SUCCESS' || br === 'success')
                    setBankResultBanner({ type: 'success', msg: `✅ نجح التحويل البنكي (${r.refNumber || r.id})` });
                else if (br === 'FAILED' || br === 'failed')
                    setBankResultBanner({ type: 'failed', msg: `⚠️ فشل التحويل — يتم التحويل يدوياً على IBAN: ${r.iban || '—'}` });
                setTimeout(() => setBankResultBanner(null), 12000);
            }
            setRefundActionModal(null);
            setRefundActionNote('');
            setRefundDetailModal(null);
            await fetchRefunds(refundStatusFilter);
            // Also refresh stats so refunds-pending card stays accurate
            await loadStats();
        } catch (err) {
            setRefundActionError(err.message || 'حدث خطأ');
        } finally {
            setRefundActionSaving(false);
        }
    };

    // ── Derived data ──
    const inRange = d => {
        if (!dateFrom && !dateTo) return true;
        if (!d) return false;
        const dt = new Date(d);
        if (isNaN(dt)) return false;
        if (dateFrom && dt < new Date(dateFrom)) return false;
        if (dateTo) { const e = new Date(dateTo); e.setDate(e.getDate() + 1); if (dt >= e) return false; }
        return true;
    };

    const q = searchQuery.toLowerCase();

    const filteredUsers = usersData
        .map(u => ({ ...u, enrolledCourses: u.enrolledCourses.filter(c => inRange(c.date)) }))
        .filter(u => {
            const m = `${u.firstName} ${u.lastName} ${u.email} ${u.username}`.toLowerCase().includes(q);
            return (dateFrom || dateTo) ? m && u.enrolledCourses.length > 0 : m;
        });

    const filteredCourses = coursesData
        .map(c => ({ ...c, enrolledUsers: c.enrolledUsers.filter(u => inRange(u.date)) }))
        .filter(c => {
            const m = `${c.title} ${c.category}`.toLowerCase().includes(q);
            return (dateFrom || dateTo) ? m && c.enrolledUsers.length > 0 : m;
        });

    const attRows = usersData
        .flatMap(u => u.enrolledCourses
            .filter(c => c.enrollmentId != null)
            .map(c => ({ user: u, course: c }))
        )
        .filter(r =>
            (attCourseFilter === 'all' || r.course.id === Number(attCourseFilter)) &&
            `${r.user.firstName} ${r.user.lastName} ${r.user.email} ${r.user.username}`
                .toLowerCase().includes(attUserSearch.toLowerCase())
        );

    const certsByUser = {};
    Object.values(certificates).forEach(ce => {
        if (!ce || ce.userId == null) return;
        const uid = Number(ce.userId);
        (certsByUser[uid] = certsByUser[uid] || []).push(ce);
    });

    const certRows = usersData.flatMap(u => u.enrolledCourses.map(c => {
        const mc = coursesData.find(cd => cd.title === c.title || cd.title === c._titleRaw);
        const planworkId = c.id ?? mc?.id ?? null;

        const numericUserId = u.databaseId ?? u.dbId ?? u.userId ?? u.internalId ?? (!isNaN(Number(u.id)) ? Number(u.id) : null);
        const userCerts = numericUserId ? (certsByUser[numericUserId] ?? []) : [];

        const titleMatch = userCerts.find(ce => {
            const cd = coursesData.find(x => Number(x.id) === Number(ce.planworkId));
            return cd && (cd.title === c.title || cd.title === c._titleRaw);
        });

        const certKey = planworkId != null && numericUserId
            ? `${numericUserId}-${Number(planworkId)}`
            : (titleMatch && numericUserId ? `${numericUserId}-${Number(titleMatch.planworkId)}` : `${u.id}-unknown`);

        const altKey = titleMatch && numericUserId
            ? `${numericUserId}-${Number(titleMatch.planworkId)}`
            : null;

        return {
            user: u, course: c, certKey, altKey,
            enrollmentId: c.enrollmentId,
            userId: numericUserId,
            planworkId: planworkId ?? titleMatch?.planworkId ?? null,
        };
    })).filter(r => {
        const hasCert = !!(certificates[r.certKey] ?? (r.altKey ? certificates[r.altKey] : undefined));
        const isAtt = !!attendance[String(r.enrollmentId)];
        const matchSearch = `${r.user.firstName} ${r.user.lastName} ${r.user.email} ${r.course.title}`
            .toLowerCase().includes(certSearch.toLowerCase());
        const matchStatus = certStatusFilter === 'all' ? true
            : certStatusFilter === 'uploaded' ? hasCert
                : certStatusFilter === 'pending' ? (!hasCert && isAtt)
                    : !isAtt;
        return matchSearch && matchStatus;
    });

    const totalCerts = (() => {
        const seen = new Set();
        Object.values(certificates).forEach(v => { if (v) seen.add(v.certId ?? Math.random()); });
        return seen.size;
    })();

    const gs = (fields, fb) => {
        if (!apiStats) return fb;
        for (const f of fields) { if (apiStats[f] != null) return apiStats[f]; }
        return fb;
    };

    // ── FIX 4: totalCerts from live local state always wins over stale apiStats ──
    const displayStats = {
        users: gs(['usersCount'], usersData.length),
        courses: gs(['planworksCount'], coursesData.length),
        enrollments: gs(['enrollmentsCount'], usersData.reduce((s, u) => s + u.enrolledCourses.length, 0)),
        attended: gs(['attendanceCount'], attRows.filter(r => !!attendance[String(r.course.enrollmentId)]).length),
        certificates: totalCerts > 0 ? totalCerts : gs(['certificatesCount'], 0),
        refundsPending: gs(['refundsCount'], refunds.filter(r => r.status === 'Pending').length),
    };

    const refundSearch_q = refundSearch.toLowerCase();
    const filteredRefunds = refunds.filter(r => {
        const u = usersData.find(u => u.id === r.userId);
        const c = coursesData.find(c => c.id === r.courseId);
        const matchStatus = refundStatusFilter === 'all' || r.status === toStatusKey(refundStatusFilter);
        const matchSearch = !refundSearch_q || [r.refNumber, r.orderId, r.reason,
        u ? `${u.firstName} ${u.lastName}` : '', c?.title ?? '', String(r.amount)]
            .join(' ').toLowerCase().includes(refundSearch_q);
        return matchStatus && matchSearch;
    });

    // ── Early returns ──
    if (!isLoaded || !user) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: T.gray100 }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: `3px solid ${T.gray300}`, borderTopColor: T.blue, borderRadius: '50%', animation: 'adm-spin .7s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: T.blue, fontFamily: T.font, fontSize: '.9rem' }}>جاري التحقق...</p>
            </div>
        </div>
    );
    if (!ADMIN_EMAILS.includes((user.primaryEmailAddress?.emailAddress || '').toLowerCase())) return null;

    return (
        <>
            {/* Loading overlay */}
            {exporting && (
                <div className="adm-ovl">
                    <div className="adm-ovlb">
                        <div className="adm-sp" />
                        <p>جاري تصدير الملف... يرجى الانتظار</p>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="adm-bc">
                <a href="/">الصفحة الرئيسية</a>
                <span className="sep">•</span>
                <span className="cur">لوحة الإدارة</span>
            </div>

            {/* Modals */}
            {certModal && (
                <CertUploadModal
                    modal={certModal}
                    uploading={certUploading[certModal.certKey]}
                    onClose={() => setCertModal(null)}
                    onFile={handleCertFile}
                />
            )}
            {refundDetailModal && (
                <RefundDetailModal
                    refund={refunds.find(x => x.id === refundDetailModal.id) || refundDetailModal}
                    usersData={usersData}
                    coursesData={coursesData}
                    onClose={() => setRefundDetailModal(null)}
                    onAction={(refund, action) => { setRefundDetailModal(null); setRefundActionModal({ refund, action }); }}
                />
            )}
            {refundActionModal && (
                <RefundActionModal
                    modal={refundActionModal}
                    note={refundActionNote}
                    saving={refundActionSaving}
                    error={refundActionError}
                    usersData={usersData}
                    onNoteChange={setRefundActionNote}
                    onConfirm={commitRefundAction}
                    onClose={() => { setRefundActionModal(null); setRefundActionNote(''); setRefundActionError(''); }}
                />
            )}

            <div className="adm-root">
                <Sidebar
                    user={user} activeTab={activeTab} tabs={TABS}
                    totalCerts={totalCerts}
                    pendingRefunds={refunds.filter(r => r.status === 'Pending').length}
                    onTabChange={id => { setActiveTab(id); setExpandedRow(null); setSearchQuery(''); }}
                />

                <main className="adm-main">
                    <PageHero activeTab={activeTab} />

                    <div className="adm-content">
                        {!loading && !error && <StatCards stats={displayStats} />}

                        {exportError && (
                            <div className="adm-err">⚠️ {exportError}
                                <button
                                    style={{ marginRight: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }}
                                    onClick={() => setExportError(null)}
                                >✕</button>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <UsersTab
                                data={filteredUsers} loading={loading} error={error}
                                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                                dateFrom={dateFrom} setDateFrom={setDateFrom}
                                dateTo={dateTo} setDateTo={setDateTo}
                                currentPage={usersPage} setCurrentPage={p => { setUsersPage(p); setExpandedRow(null); }}
                                expandedRow={expandedRow} setExpandedRow={setExpandedRow}
                                attendance={attendance} certificates={certificates}
                                setExporting={setExporting} setExportError={setExportError}
                            />
                        )}

                        {activeTab === 'courses' && (
                            <CoursesTab
                                data={filteredCourses} loading={loading} error={error}
                                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                                dateFrom={dateFrom} setDateFrom={setDateFrom}
                                dateTo={dateTo} setDateTo={setDateTo}
                                currentPage={coursesPage} setCurrentPage={p => { setCoursesPage(p); setExpandedRow(null); }}
                                expandedRow={expandedRow} setExpandedRow={setExpandedRow}
                                setExporting={setExporting} setExportError={setExportError}
                            />
                        )}

                        {activeTab === 'attendance' && (
                            <AttendanceTab
                                rows={attRows} loading={loading}
                                attendance={attendance} attendanceSaving={attendanceSaving}
                                error={attError} setError={setAttError}
                                courseFilter={attCourseFilter} setCourseFilter={setAttCourseFilter}
                                userSearch={attUserSearch} setUserSearch={setAttUserSearch}
                                currentPage={attPage} setCurrentPage={setAttPage}
                                coursesData={coursesData}
                                toggleAttendance={toggleAttendance}
                                setExporting={setExporting} setExportError={setExportError}
                            />
                        )}

                        {activeTab === 'certificates' && (
                            <CertificatesTab
                                rows={certRows} loading={loading}
                                certificates={certificates} certUploading={certUploading} certDeleting={certDeleting}
                                error={certError} setError={setCertError}
                                search={certSearch} setSearch={setCertSearch}
                                statusFilter={certStatusFilter} setStatusFilter={setCertStatusFilter}
                                currentPage={certPage} setCurrentPage={setCertPage}
                                attendance={attendance}
                                onOpenModal={setCertModal}
                                onViewCert={viewCert}
                                onDeleteCert={deleteCert}
                                setExporting={setExporting} setExportError={setExportError}
                            />
                        )}

                        {activeTab === 'refunds' && (
                            <RefundsTab
                                refunds={filteredRefunds} allRefunds={refunds}
                                loading={refundsLoading} error={refundsError} setError={setRefundsError}
                                search={refundSearch} setSearch={setRefundSearch}
                                statusFilter={refundStatusFilter} setStatusFilter={setRefundStatusFilter}
                                currentPage={refundPage} setCurrentPage={setRefundPage}
                                usersData={usersData} coursesData={coursesData}
                                bankResultBanner={bankResultBanner} setBankResultBanner={setBankResultBanner}
                                onViewDetail={setRefundDetailModal}
                                onAction={(refund, action) => setRefundActionModal({ refund, action })}
                                setExporting={setExporting} setExportError={setExportError}
                            />
                        )}

                        {activeTab === 'financial' && (
                            <FinancialTab
                                usersData={usersData}
                                coursesData={coursesData}
                                authFetch={authFetch}
                                API_BASE={API_BASE}
                                API_HOST={API_HOST}
                            />
                        )}

                        {activeTab === 'lecturers' && <LecturersTab />}

                        {activeTab === 'news' && <NewsTab />}

                        {activeTab === 'books' && (
                            <BooksTab
                                data={booksData}
                                loading={loading}
                                search={booksSearch}
                                setSearch={setBooksSearch}
                                currentPage={booksPage}
                                setCurrentPage={setBooksPage}
                                authFetch={authFetch}
                                onRefresh={loadBooks}
                            />
                        )}

                        {activeTab === 'planwork' && <PlanworkTab />}

                        {activeTab === 'settings' && (
                            <SettingsTab
                                currentUserEmail={user?.primaryEmailAddress?.emailAddress || ''}
                            />
                        )}
                    </div>

                    <div className="adm-footer">
                        <p>المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}</p>
                    </div>
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;