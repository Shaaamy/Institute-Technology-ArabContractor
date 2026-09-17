// MyCourses.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useUser, useAuth } from '@clerk/clerk-react';
import { Button } from '@mui/material';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

function resolveCertUrl(url) {
    if (!url) return null;
    if (url === 'uploaded') return null;
    if (url.startsWith('https://') || url.startsWith('http://')) return url;
    if (url.startsWith('/')) return `${API_BASE.replace('/api', '')}${url}`;
    return null;
}

// Normalise a raw cert object from the API
function normaliseCert(raw) {
    if (!raw) return null;
    const rawUrl = raw.fileUrl ?? raw.url ?? raw.filePath ?? raw.path ?? null;
    const url = resolveCertUrl(rawUrl);
    if (!url) return null;
    return {
        ...raw,
        url,
        rawUrl,
        name: raw.fileName ?? raw.filename ?? raw.name ?? null,
    };
}

const BookIcon = () => (
    <svg width="48" height="48" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
);

// Helper: enroll in free course
export const enrollFreeCourse = async (planworkId, getToken) => {
    const token = await getToken();
    const res = await fetch(`${API_BASE}/course/enroll-free/${planworkId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'فشل التسجيل في الكورس');
    return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const MyCourses = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken, isSignedIn } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [search, setSearch] = useState('');

    // certificates map: { [courseId]: normalisedCert | null }
    const [certificates, setCertificates] = useState({});
    const [certsLoading, setCertsLoading] = useState({});

    const userName = user?.firstName || user?.fullName?.split(' ')[0] || '';

    // ── Fetch enrollments ────────────────────────────────────────────────────
    const fetchMyCourses = useCallback(async () => {
        if (!isSignedIn) return [];
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/course/my-courses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('فشل تحميل الدورات');
            const data = await res.json();
            const mapped = data.map(e => ({
                id: e.childId,
                // Store userId so we can use /certificates/{userId}/{planworkId}
                userId: e.userId ?? e.UserId ?? null,
                slug: e.slug || '',
                title: e.serviceTitle || e.title || '',
                place: e.coursePlace || e.place || '',
                date: e.courseDate || e.date || '',
                enrolledAt: e.enrolledAt || '',
                isFree: e.isFree === true ||
                    (e.orderId === null || e.orderId === undefined) ||
                    (!e.cost && !e.price && !e.amount),
            }));
            setCourses(mapped);
            return mapped;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, getToken]);

    // ── UPDATED: fetch cert using /certificates/{userId}/{planworkId} ────────
    // This is the endpoint that returns a full blob URL in fileUrl (confirmed in screenshot 2).
    // Falls back to /certificates/{planworkId} if userId is unknown.
    const fetchCertForCourse = useCallback(async (courseId, userId) => {
        if (!isSignedIn) return;
        setCertsLoading(prev => ({ ...prev, [courseId]: true }));
        try {
            const token = await getToken();

            let raw = null;

            // Primary: use the per-user endpoint if we have userId
            if (userId) {
                const res = await fetch(
                    `${API_BASE}/Admin/certificates/${userId}/${courseId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.ok) {
                    const data = await res.json();
                    raw = Array.isArray(data) ? data[0] : data;
                }
            }

            // Fallback: planworkId-only
            if (!raw) {
                const res = await fetch(
                    `${API_BASE}/Admin/certificates/${courseId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.ok) {
                    const data = await res.json();
                    // Filter by planworkId to get this specific course's cert
                    const list = Array.isArray(data) ? data : [data];
                    raw = list.find(c => String(c.planworkId ?? c.PlanworkId ?? '') === String(courseId)) ?? list[0] ?? null;
                }
            }

            const normalised = normaliseCert(raw);
            setCertificates(prev => ({ ...prev, [courseId]: normalised }));
        } catch {
            setCertificates(prev => ({ ...prev, [courseId]: null }));
        } finally {
            setCertsLoading(prev => ({ ...prev, [courseId]: false }));
        }
    }, [isSignedIn, getToken]);

    // ── Fetch all certs in parallel after courses load ───────────────────────
    const fetchAllCerts = useCallback(async (courseList) => {
        if (!courseList?.length) return;
        await Promise.allSettled(courseList.map(c => fetchCertForCourse(c.id, c.userId)));
    }, [fetchCertForCourse]);

    // Initial load
    useEffect(() => {
        if (isSignedIn) {
            fetchMyCourses().then(list => fetchAllCerts(list));
        }
    }, [isSignedIn, fetchMyCourses, fetchAllCerts]);

    // Refresh on enroll/cart events
    useEffect(() => {
        const onUpdate = () => fetchMyCourses().then(list => fetchAllCerts(list));
        window.addEventListener('enrollUpdated', onUpdate);
        window.addEventListener('cartUpdated', onUpdate);
        return () => {
            window.removeEventListener('enrollUpdated', onUpdate);
            window.removeEventListener('cartUpdated', onUpdate);
        };
    }, [fetchMyCourses, fetchAllCerts]);

    const filtered = courses.filter(c =>
        search.trim() === '' ||
        (c.title || '').toLowerCase().includes(search.toLowerCase())
    );

    const certCount = Object.values(certificates).filter(v => v !== null).length;

    const stats = [
        { label: 'إجمالي الدورات', value: courses.length, icon: '📚' },
        { label: 'الدورات المسجلة', value: courses.length, icon: '🎓' },
        { label: 'الشهادات', value: certCount, icon: '📜' },
    ];

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{css}</style>
            <div dir="rtl" style={styles.page}>

                {/* Breadcrumb */}
                <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                    <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                        <a href="/" style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                            onMouseEnter={e => e.target.style.color = '#f57c00'}
                            onMouseLeave={e => e.target.style.color = '#0865a8'}>
                            الصفحة الرئيسية
                        </a>
                        <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                        <span style={{ color: '#374151', marginRight: '8px' }}>دوراتي التدريبية</span>
                    </div>
                </div>

                <SignedOut>
                    <div style={styles.authGate}>
                        <div style={styles.authGateCard}>
                            <div style={styles.authGateIcon}>🔒</div>
                            <h2 style={styles.authGateTitle}>تسجيل الدخول مطلوب</h2>
                            <p style={styles.authGateSub}>يجب تسجيل الدخول أولاً لعرض دوراتك التدريبية</p>
                            <SignInButton mode="modal">
                                <Button variant="contained" sx={{ fontFamily: '"Noto Kufi Arabic", serif', fontSize: '1rem', bgcolor: '#0865a8', color: '#ffffff', px: 4, py: 1.5, borderRadius: 5, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#f57c00' } }}>
                                    تسجيل دخول
                                </Button>
                            </SignInButton>
                            <button style={styles.btnBrowse} onClick={() => navigate('/')}>
                                استعرض الدورات بدون تسجيل
                            </button>
                        </div>
                    </div>
                </SignedOut>

                <SignedIn>
                    {/* Hero */}
                    <div style={styles.hero} className="mc-hero">
                        <div style={styles.heroDeco1} />
                        <div style={styles.heroDeco2} />
                        <div style={styles.heroDeco3} />
                        <div style={styles.heroInner}>
                            <div style={styles.heroTopRow} className="mc-hero-top">
                                <div style={styles.heroAvatar}>📚</div>
                                <div>
                                    <p style={styles.heroGreeting}>مرحباً {userName}،</p>
                                    <h1 style={styles.heroTitle}>دوراتك التدريبية</h1>
                                </div>
                            </div>
                            <p style={styles.heroSub}>تابع رحلتك التعليمية — كل دوراتك في مكان واحد</p>
                            <div style={styles.heroDivider} />
                            <div style={styles.statsRow} className="mc-stats-row">
                                {stats.map((s, i) => (
                                    <div key={i} style={styles.statCard} className="mc-stat-card">
                                        <span style={styles.statIcon}>{s.icon}</span>
                                        <span style={styles.statValue}>{s.value}</span>
                                        <span style={styles.statLabel}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main */}
                    <div style={styles.main} className="mc-main">
                        <div style={styles.toolbar} className="mc-toolbar">
                            <div style={styles.searchWrap}>
                                <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                                </svg>
                                <input
                                    style={styles.searchInput}
                                    placeholder="ابحث في دوراتك..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => fetchMyCourses().then(list => fetchAllCerts(list))}
                                style={styles.refreshBtn}
                            >
                                🔄 تحديث
                            </button>
                        </div>

                        {loading ? (
                            <div style={styles.loadingWrap}>
                                <div style={styles.spinner} />
                                <p style={styles.loadingText}>جاري تحميل دوراتك...</p>
                            </div>
                        ) : error ? (
                            <div style={styles.errorWrap}>
                                <div style={styles.emptyIcon}>⚠️</div>
                                <h3 style={styles.emptyTitle}>{error}</h3>
                                <button style={styles.emptyBtn} onClick={fetchMyCourses}>إعادة المحاولة</button>
                            </div>
                        ) : filtered.length === 0 ? (
                            <EmptyState search={search} navigate={navigate} />
                        ) : (
                            <div style={styles.grid} className="mc-grid">
                                {filtered.map(course => {
                                    const cert = certificates[course.id];   // normalised or null
                                    const isCertLoading = certsLoading[course.id];
                                    const hasCert = !!cert;
                                    const certUrl = cert?.url ?? '';

                                    return (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            cert={cert}
                                            certUrl={certUrl}
                                            hasCert={hasCert}
                                            isCertLoading={isCertLoading}
                                            hovered={hoveredCard === course.id}
                                            onHover={() => setHoveredCard(course.id)}
                                            onLeave={() => setHoveredCard(null)}
                                            navigate={navigate}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </SignedIn>
            </div>
        </>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Course Card
// ─────────────────────────────────────────────────────────────────────────────
const CourseCard = ({
    course, cert, certUrl, hasCert, isCertLoading,
    hovered, onHover, onLeave, navigate,
}) => {
    // cert.name comes from normaliseCert (prefers fileName → filename → name)
    const certName = cert?.name || `شهادة_${course.title || 'الدورة'}.pdf`;

    return (
        <div
            style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className="mc-card"
        >
            <div style={styles.cardHeader}>
                <div style={{
                    ...styles.cardImgPlaceholder,
                    background: course.isFree
                        ? 'linear-gradient(135deg, #1a7a4a 0%, #34c77b 100%)'
                        : 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
                }}>
                    <div style={styles.iconWrapper}><BookIcon /></div>
                </div>
                <span style={{ ...styles.badge, ...(course.isFree ? styles.badgeFree : styles.badgePaid) }}>
                    ✅ {course.isFree ? 'مجاني - مسجل' : 'مسجل'}
                </span>
                {hasCert && (
                    <div style={styles.certRibbon}>📜 شهادة جاهزة</div>
                )}
            </div>

            <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{course.title}</h3>

                {course.place && (
                    <div style={styles.metaRow}>
                        <svg style={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span style={styles.metaText}>{course.place}</span>
                    </div>
                )}
                {course.date && (
                    <div style={styles.metaRow}>
                        <svg style={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span style={styles.metaText}>{course.date}</span>
                    </div>
                )}
                {course.enrolledAt && (
                    <div style={styles.metaRow}>
                        <svg style={styles.metaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span style={styles.metaText}>
                            تسجيل: {new Date(course.enrolledAt).toLocaleDateString('ar-EG')}
                        </span>
                    </div>
                )}

                {/* Certificate section */}
                <div style={{ ...styles.certSection, backgroundColor: hasCert ? '#faf5ff' : '#f9fafb', borderColor: hasCert ? '#e8d8ff' : '#e5e7eb' }}>
                    <div style={{ ...styles.certSectionHeader, color: hasCert ? '#7c3aed' : '#6b7280' }}>
                        <svg width="16" height="16" fill="none" stroke={hasCert ? '#7c3aed' : '#9ca3af'} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span style={{ ...styles.certSectionTitle, color: hasCert ? '#7c3aed' : '#6b7280' }}>
                            {isCertLoading
                                ? 'جاري التحقق من الشهادة...'
                                : hasCert
                                    ? 'شهادة الإتمام جاهزة 🎉'
                                    : 'الشهادة لم تُضاف بعد'}
                        </span>
                    </div>

                    {/* Download & open — only when cert exists with a valid URL */}
                    {hasCert && !isCertLoading && certUrl && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            {/* Open in new tab */}
                            <a
                                href={certUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ ...styles.certDownloadBtn, background: 'rgba(124,58,237,0.1)', color: '#7c3aed', boxShadow: 'none', border: '1.5px solid rgba(124,58,237,0.3)' }}
                                onClick={e => e.stopPropagation()}
                            >
                                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
                                <span>فتح</span>
                            </a>
                            {/* Download */}
                            <a
                                href={certUrl}
                                download={certName}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mc-cert-download-btn"
                                style={styles.certDownloadBtnFull}
                                onClick={e => e.stopPropagation()}
                            >
                                <DownloadIcon />
                                <span>تحميل الشهادة</span>
                            </a>
                        </div>
                    )}
                </div>

                <button
                    style={{ ...styles.ctaBtn, ...(hovered ? styles.ctaBtnHover : {}) }}
                    onClick={() => { if (course.slug) navigate(`/course/${course.slug}`); }}
                >
                    ابدأ الدورة
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        style={{ marginRight: '8px', transform: 'rotate(180deg)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

const EmptyState = ({ search, navigate }) => (
    <div style={styles.emptyWrap}>
        <div style={styles.emptyIcon}>{search ? '🔍' : '📭'}</div>
        <h3 style={styles.emptyTitle}>
            {search ? 'لا توجد دورات تطابق بحثك' : 'لم تنضم إلى أي دورة بعد'}
        </h3>
        <p style={styles.emptySub}>
            {search ? 'جرّب كلمات بحث مختلفة' : 'استعرض الدورات المتاحة وابدأ رحلتك التعليمية'}
        </p>
        {!search && (
            <button style={styles.emptyBtn} onClick={() => navigate('/')}>استعرض الدورات</button>
        )}
    </div>
);

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f7f8fc', fontFamily: '"Noto Kufi Arabic", serif', direction: 'rtl' },
    hero: { position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #05416d 0%, #0865a8 45%, #c96000 100%)', paddingTop: '116px', paddingBottom: '52px', paddingLeft: '24px', paddingRight: '24px' },
    heroDeco1: { position: 'absolute', top: '-60px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' },
    heroDeco2: { position: 'absolute', bottom: '-80px', right: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(245,124,0,0.18)', pointerEvents: 'none' },
    heroDeco3: { position: 'absolute', top: '40px', right: '30%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' },
    heroInner: { maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 },
    heroTopRow: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' },
    heroAvatar: { width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '2.5px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' },
    heroGreeting: { margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff', fontFamily: '"Noto Kufi Arabic", serif' },
    heroTitle: { margin: '4px 0 0', fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Noto Kufi Arabic", serif' },
    heroSub: { fontSize: '16px', color: 'rgba(255,255,255,0.8)', margin: '0 0 24px', fontFamily: '"Noto Kufi Arabic", serif' },
    heroDivider: { width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)', marginBottom: '28px' },
    statsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
    statCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '16px', padding: '18px 32px', minWidth: '130px' },
    statIcon: { fontSize: '26px' },
    statValue: { fontSize: '32px', fontWeight: 'bold', color: '#fff', fontFamily: '"Noto Kufi Arabic", serif', lineHeight: 1 },
    statLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.82)', fontFamily: '"Noto Kufi Arabic", serif' },
    main: { maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 60px' },
    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', backgroundColor: '#fff', borderRadius: '14px', padding: '16px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1.5px solid #ebebeb' },
    searchWrap: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px', backgroundColor: '#f7f8fc', borderRadius: '10px', padding: '8px 14px', border: '1.5px solid #e0e0e0' },
    searchIcon: { width: '18px', height: '18px', color: '#aaa', flexShrink: 0 },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontFamily: '"Noto Kufi Arabic", serif', color: '#333', flex: 1, direction: 'rtl' },
    refreshBtn: { padding: '8px 20px', borderRadius: '10px', border: '1.5px solid #e0e0e0', backgroundColor: '#fff', color: '#555', fontSize: '14px', fontFamily: '"Noto Kufi Arabic", serif', cursor: 'pointer' },
    loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '20px' },
    spinner: { width: '48px', height: '48px', border: '4px solid #e0e0e0', borderTopColor: '#0865a8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadingText: { fontSize: '16px', color: '#666', fontFamily: '"Noto Kufi Arabic", serif' },
    errorWrap: { textAlign: 'center', padding: '80px 20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', border: '2px solid #f0f0f0', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' },
    cardHover: { transform: 'translateY(-7px)', boxShadow: '0 14px 28px rgba(0,0,0,0.13)', borderColor: '#0865a8' },
    cardHeader: { position: 'relative', height: '160px', overflow: 'hidden' },
    cardImgPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    iconWrapper: { borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', padding: '24px', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)' },
    badge: { position: 'absolute', top: '12px', right: '12px', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic", serif' },
    badgePaid: { backgroundColor: '#0865a8', color: '#fff', boxShadow: '0 2px 8px rgba(8,101,168,0.35)' },
    badgeFree: { backgroundColor: '#1a7a4a', color: '#fff', boxShadow: '0 2px 8px rgba(26,122,74,0.35)' },
    certRibbon: { position: 'absolute', bottom: '12px', left: '12px', background: 'linear-gradient(135deg, #7c3aed, #9f67f5)', color: '#fff', borderRadius: '8px', padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic", serif', boxShadow: '0 2px 8px rgba(124,58,237,0.4)' },
    cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#111', fontFamily: '"Noto Kufi Arabic", serif', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 },
    metaRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', fontFamily: '"Noto Kufi Arabic", serif' },
    metaIcon: { width: '15px', height: '15px', flexShrink: 0, color: '#0865a8' },
    metaText: { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
    certSection: { borderRadius: '12px', border: '1.5px solid', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' },
    certSectionHeader: { display: 'flex', alignItems: 'center', gap: '8px' },
    certSectionTitle: { fontSize: '13px', fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic", serif' },
    certDownloadBtnFull: { flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 14px', background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic", serif', textDecoration: 'none', cursor: 'pointer', boxShadow: '0 3px 10px rgba(124,58,237,0.3)', transition: 'all 0.2s ease' },
    certDownloadBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic", serif', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s ease' },
    ctaBtn: { marginTop: 'auto', width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic", serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' },
    ctaBtnHover: { transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(8,101,168,0.32)' },
    emptyWrap: { textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '2px dashed #d0dce8' },
    emptyIcon: { fontSize: '64px', marginBottom: '16px' },
    emptyTitle: { fontSize: '22px', fontWeight: 'bold', color: '#222', fontFamily: '"Noto Kufi Arabic", serif', margin: '0 0 10px' },
    emptySub: { fontSize: '15px', color: '#777', fontFamily: '"Noto Kufi Arabic", serif', margin: '0 0 28px' },
    emptyBtn: { padding: '13px 36px', background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic", serif', cursor: 'pointer' },
    authGate: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '120px 20px 60px' },
    authGateCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '52px 44px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    authGateIcon: { fontSize: '64px' },
    authGateTitle: { fontSize: '26px', fontWeight: 'bold', color: '#111', fontFamily: '"Noto Kufi Arabic", serif', margin: 0 },
    authGateSub: { fontSize: '15px', color: '#666', fontFamily: '"Noto Kufi Arabic", serif', margin: 0 },
    btnBrowse: { marginTop: '4px', width: '100%', padding: '10px 24px', backgroundColor: 'transparent', color: '#888', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: '"Noto Kufi Arabic", serif', cursor: 'pointer' },
};

const css = `
  * { font-family: "Noto Kufi Arabic", serif !important; box-sizing: border-box; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .mc-cert-download-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  @media (max-width: 640px) {
    .mc-hero { padding-top: 100px !important; }
    .mc-main { padding: 24px 14px 48px !important; }
    .mc-toolbar { flex-direction: column !important; }
    .mc-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .mc-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
  @media (min-width: 1025px) {
    .mc-grid { grid-template-columns: repeat(3, 1fr) !important; }
  }
`;

export default MyCourses;