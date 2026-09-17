import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Container, Box, Typography, Card, CardContent, CardActions, Button, Tooltip } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ComputerIcon from '@mui/icons-material/Computer';
import ScienceIcon from '@mui/icons-material/Science';
import 'swiper/css';
import 'swiper/css/navigation';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

// ── Toast ─────────────────────────────────────────────────────────────────────
const toastAnim = `
  @keyframes toastSlideIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

const ToastNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    const borderColors = { success: '#4caf50', error: '#f44336', warning: '#ff9800' };

    return (
        <>
            <style>{toastAnim}</style>
            <div style={{
                position: 'fixed', top: '100px', right: '20px', zIndex: 9999,
                backgroundColor: '#fff', padding: '14px 20px', borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center',
                gap: '10px', maxWidth: '360px', animation: 'toastSlideIn 0.3s ease-out',
                borderRight: `4px solid ${borderColors[type]}`,
                fontFamily: '"Noto Kufi Arabic", serif', direction: 'rtl'
            }}>
                <span style={{ fontSize: '20px' }}>
                    {type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}
                </span>
                <span style={{ fontSize: '14px', color: '#000', flex: 1 }}>{message}</span>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#999', lineHeight: 1 }}>×</button>
            </div>
        </>
    );
};

// ── Mode Toggle (matches CoursesPage) ─────────────────────────────────────────
const ModeToggle = ({ mode, onChange }) => {
    const base = {
        flex: 1, padding: '5px 6px', border: 'none', borderRadius: '6px',
        fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
        fontFamily: '"Noto Kufi Arabic", serif', transition: 'all .2s',
    };
    const active = {
        ...base,
        background: 'linear-gradient(135deg,#0865a8,#1a84d4)',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(8,101,168,0.3)',
    };
    const inactive = { ...base, background: '#f0f1f2', color: '#6b7280' };

    return (
        <div style={{
            display: 'flex', gap: 4, padding: '4px',
            background: '#f0f1f2', borderRadius: '8px', marginBottom: '8px',
        }}>
            <button style={mode === 'onsite' ? active : inactive} onClick={e => { e.stopPropagation(); onChange('onsite'); }}>
                🏢 حضوري
            </button>
            <button style={mode === 'online' ? active : inactive} onClick={e => { e.stopPropagation(); onChange('online'); }}>
                🌐 أونلاين
            </button>
        </div>
    );
};

// ── Icon helper ───────────────────────────────────────────────────────────────
const getCourseIcon = (index) => {
    const sz = { fontSize: '2.2rem', color: '#fff' };
    const icons = [
        <SchoolIcon sx={sz} />,
        <MenuBookIcon sx={sz} />,
        <WorkspacePremiumIcon sx={sz} />,
        <BusinessCenterIcon sx={sz} />,
        <ComputerIcon sx={sz} />,
        <ScienceIcon sx={sz} />,
    ];
    return icons[index % icons.length];
};

// ── Custom Nav Arrow ──────────────────────────────────────────────────────────
const NavArrow = ({ direction, swiperRef }) => {
    const handleClick = () => {
        if (!swiperRef.current) return;
        if (direction === 'prev') swiperRef.current.slidePrev();
        else swiperRef.current.slideNext();
    };

    return (
        <Box
            onClick={handleClick}
            sx={{
                position: 'absolute',
                [direction === 'prev' ? 'right' : 'left']: { xs: -8, sm: -16, md: -22 },
                top: '50%',
                zIndex: 10,
                cursor: 'pointer',
                bgcolor: '#0865a8',
                color: '#fff',
                borderRadius: '50%',
                width: { xs: 34, sm: 38, md: 42 },
                height: { xs: 34, sm: 38, md: 42 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'translateY(-50%)',
                fontSize: { xs: '18px', sm: '20px', md: '22px' },
                userSelect: 'none',
                boxShadow: '0 2px 10px rgba(8,101,168,0.35)',
                transition: 'background 0.2s, transform 0.2s',
                '&:hover': {
                    bgcolor: '#f57c00',
                    transform: 'translateY(-50%) scale(1.08)',
                },
                flexShrink: 0,
            }}
        >
            {direction === 'prev' ? '›' : '‹'}
        </Box>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const DynamicCoursesSection = () => {
    const navigate = useNavigate();
    const { getToken, isSignedIn, userId } = useAuth();
    const swiperRef = useRef(null);

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [addingToCart, setAddingToCart] = useState(null);
    const [ownedCourseIds, setOwnedCourseIds] = useState(new Set());
    const [certificates, setCertificates] = useState({});
    const [toast, setToast] = useState(null);

    // ── per-card mode state: { [courseId]: 'onsite' | 'online' } ─────────────
    const [courseModes, setCourseModes] = useState({});
    const getCourseMode = (id) => courseModes[id] || 'onsite';
    const handleModeChange = (id, mode) => setCourseModes(prev => ({ ...prev, [id]: mode }));

    const showToast = (message, type = 'success') => setToast({ message, type });

    const safeGetToken = useCallback(async () => {
        try { return await getToken(); } catch { return null; }
    }, [getToken]);

    // ── Fetch owned courses ───────────────────────────────────────────────────
    const fetchOwnedCourses = useCallback(async () => {
        if (!isSignedIn) { setOwnedCourseIds(new Set()); return; }
        try {
            const token = await safeGetToken();
            if (!token) return;
            const res = await fetch(`${API_BASE}/course/my-courses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            setOwnedCourseIds(new Set(data.map(e => e.childId)));
        } catch {
            setOwnedCourseIds(new Set());
        }
    }, [isSignedIn, safeGetToken]);

    // ── Fetch certificates ────────────────────────────────────────────────────
    const fetchCertificates = useCallback(async () => {
        if (!isSignedIn || !userId) return;
        try {
            const token = await safeGetToken();
            if (!token) return;
            const res = await fetch(`${API_BASE}/api/Admin/certificates/{userId}/{planworkId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            const map = {};
            (Array.isArray(data) ? data : []).forEach(c => { if (c.courseId) map[c.courseId] = c; });
            setCertificates(map);
        } catch { /* certs optional */ }
    }, [isSignedIn, safeGetToken, userId]);

    useEffect(() => { fetchOwnedCourses(); }, [fetchOwnedCourses, userId]);
    useEffect(() => { fetchCertificates(); }, [fetchCertificates, userId]);

    useEffect(() => {
        const handler = () => { fetchOwnedCourses(); fetchCertificates(); };
        window.addEventListener('enrollUpdated', handler);
        window.addEventListener('cartUpdated', handler);
        return () => {
            window.removeEventListener('enrollUpdated', handler);
            window.removeEventListener('cartUpdated', handler);
        };
    }, [fetchOwnedCourses, fetchCertificates]);

    // ── Fetch latest courses ──────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${API_BASE}/Course/latest`);
                if (!res.ok) throw new Error(`فشل تحميل الدورات: ${res.status}`);
                const data = await res.json();
                const raw = Array.isArray(data) ? data : data.courses || data.data || [];

                if (!raw.length) { setError('لا توجد دورات متاحة حالياً'); return; }

                const transformed = raw
                    .filter(c => c && c.childId)
                    .map(c => {
                        const cost = c.planCost ?? 0;
                        // Mirror CoursesPage field names exactly
                        const onlineCost = c.onlineCost ?? c.online_cost ?? null;
                        return {
                            id: c.childId,
                            slug: c.slug || String(c.childId),
                            title: c.serviceTitle || 'دورة تدريبية',
                            description: c.courseDesc || '',
                            // onsite
                            cost,
                            oldCost: c.oldCost ?? null,
                            discountPercentage: c.discountPercentage ?? 0,
                            // online
                            onlineCost,
                            onlineOldCost: c.onlineOldCost ?? null,
                            onlineDiscountPercentage: c.onlineDiscountPercentage ?? 0,
                            // meta
                            date: c.courseDate || '',
                            place: c.coursePlace || '',
                            isFree: !cost || cost === 0,
                        };
                    });

                setCourses(transformed);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ── Add to cart (mirrors CoursesPage logic) ───────────────────────────────
    const addToCart = async (course) => {
        if (!isSignedIn) {
            showToast('الرجاء تسجيل الدخول أولاً', 'warning');
            return;
        }
        const isOnline = getCourseMode(course.id) === 'online';
        const onlinePrice = course.onlineCost != null ? course.onlineCost : 0;
        const priceToUse = isOnline ? onlinePrice : (course.cost || 0);

        setAddingToCart(course.id);
        try {
            const token = await safeGetToken();
            if (!token) { showToast('انتهت الجلسة، سجل دخول مرة أخرى', 'error'); return; }

            const res = await fetch(`${API_BASE}/cart/add/${course.id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOnline }),
            });
            if (!res.ok) {
                const msgs = {
                    401: 'انتهت الجلسة، سجل دخول مرة أخرى',
                    404: 'الدورة غير موجودة',
                    409: 'الدورة موجودة بالفعل في السلة',
                    500: 'خطأ في الخادم',
                };
                throw new Error(msgs[res.status] || 'فشل إضافة الدورة');
            }

            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            if (!cartItems.some(i => i.id === course.id)) {
                cartItems.push({
                    id: course.id,
                    title: course.title,
                    instructor: course.place || 'غير محدد',
                    image: 'book',
                    currentPrice: priceToUse,
                    originalPrice: course.cost ? course.cost / 0.6 : 0,
                    quantity: 1,
                    slug: course.slug || '',
                    date: course.date || '',
                    place: course.place || '',
                    isOnline,
                    modeLabel: isOnline ? 'أونلاين' : 'حضوري',
                });
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                window.dispatchEvent(new Event('cartUpdated'));
            }
            showToast('تمت إضافة الدورة إلى السلة بنجاح', 'success');
        } catch (err) {
            showToast(err.message || 'حدث خطأ', 'error');
        } finally {
            setAddingToCart(null);
        }
    };

    // ── Enroll free course ────────────────────────────────────────────────────
    const handleEnroll = (course) => {
        const existing = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        if (!existing.some(e => e.id === course.id)) {
            existing.push({
                id: course.id, slug: course.slug, title: course.title,
                place: course.place || '', instructor: course.place || 'غير محدد',
                date: course.date || '', image: 'book', currentPrice: 0, progress: 0,
            });
            localStorage.setItem('enrolledCourses', JSON.stringify(existing));
            window.dispatchEvent(new Event('enrollUpdated'));
        }
        showToast('تم التسجيل في الدورة بنجاح', 'success');
        setTimeout(() => navigate('/my-courses'), 900);
    };

    // ── Loading / Error states ────────────────────────────────────────────────
    if (loading) return (
        <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: '"Noto Kufi Arabic", serif', color: '#0865a8' }}>
                جاري تحميل الدورات...
            </Typography>
        </Container>
    );

    if (error || courses.length === 0) return (
        <Container maxWidth="xl" sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: '"Noto Kufi Arabic", serif', color: 'error.main' }}>
                {error || 'لا توجد دورات متاحة حالياً'}
            </Typography>
        </Container>
    );

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 6, md: 10 }, bgcolor: '#fff' }}>

            {toast && (
                <ToastNotification
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <Box sx={{
                position: 'relative',
                px: { xs: '28px', sm: '32px', md: '36px', lg: '48px' },
            }}>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={1}
                    loop={false}
                    allowTouchMove={true}
                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                    breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 14 },
                        480: { slidesPerView: 1, spaceBetween: 14 },
                        580: { slidesPerView: 2, spaceBetween: 16 },
                        768: { slidesPerView: 2, spaceBetween: 18 },
                        900: { slidesPerView: 3, spaceBetween: 20 },
                        1200: { slidesPerView: 4, spaceBetween: 22 },
                    }}
                >
                    {courses.map((course, index) => {
                        const isOwned = ownedCourseIds.has(course.id);
                        const isAdding = addingToCart === course.id;
                        const isHovered = hoveredCourse === course.id;
                        const cert = certificates[course.id] || null;

                        // ── mode & price (mirrors CoursesPage exactly) ──
                        const mode = getCourseMode(course.id);
                        const onlineCost = course.onlineCost;                          // null = not available
                        const activePrice = mode === 'online'
                            ? (onlineCost != null ? onlineCost : 0)
                            : (course.cost || 0);
                        const activeOldCost = mode === 'online'
                            ? course.onlineOldCost
                            : course.oldCost;
                        const activeDiscount = mode === 'online'
                            ? course.onlineDiscountPercentage
                            : course.discountPercentage;
                        const effectivelyFree = activePrice === 0;

                        // Card header gradient
                        const headerGradient = isOwned
                            ? 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)'
                            : (course.isFree || effectivelyFree)
                                ? 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)'
                                : 'linear-gradient(135deg, #0865a8 0%, #064a7a 100%)';

                        // Badge
                        const badgeText = isOwned
                            ? '✅ مسجل'
                            : (course.isFree || effectivelyFree)
                                ? 'مجاناً'
                                : activeDiscount > 0
                                    ? `خصم ${activeDiscount}%`
                                    : null;

                        return (
                            <SwiperSlide key={course.id} style={{ height: 'auto' }}>
                                <Card
                                    onMouseEnter={() => setHoveredCourse(course.id)}
                                    onMouseLeave={() => setHoveredCourse(null)}
                                    sx={{
                                        height: cert && isOwned ? 'auto' : 'auto',
                                        minHeight: cert && isOwned ? 460 : 410,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                                        cursor: 'pointer',
                                        border: '2px solid',
                                        borderColor: isHovered
                                            ? (isOwned ? '#7b5ea7' : (course.isFree || effectivelyFree) ? '#27ae60' : '#f57c00')
                                            : '#e0e0e0',
                                        transform: isHovered ? 'translateY(-6px)' : 'none',
                                        boxShadow: isHovered
                                            ? '0 12px 28px rgba(0,0,0,0.12)'
                                            : '0 2px 8px rgba(0,0,0,0.05)',
                                    }}
                                    onClick={() => navigate(`/course/${course.slug}`)}
                                >
                                    {/* ── Card header banner ── */}
                                    <Box sx={{
                                        height: 110, flexShrink: 0,
                                        background: headerGradient,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative',
                                    }}>
                                        <Box sx={{
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255,255,255,0.15)',
                                            padding: '18px',
                                            backdropFilter: 'blur(8px)',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            zIndex: 2,
                                        }}>
                                            {getCourseIcon(index)}
                                        </Box>

                                        {/* Hover overlay */}
                                        <Box sx={{
                                            position: 'absolute', inset: 0, zIndex: 3,
                                            background: headerGradient,
                                            opacity: isHovered ? 0.92 : 0,
                                            transition: 'opacity 0.3s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Typography sx={{
                                                color: '#fff', fontFamily: '"Noto Kufi Arabic", serif',
                                                fontWeight: 700, fontSize: '0.9rem',
                                            }}>
                                                عرض التفاصيل ←
                                            </Typography>
                                        </Box>

                                        {/* Badge */}
                                        {badgeText && (
                                            <Box sx={{
                                                position: 'absolute', top: 10, right: 10, zIndex: 4,
                                                backgroundColor: '#fff',
                                                color: isOwned
                                                    ? '#4a4a8a'
                                                    : (course.isFree || effectivelyFree)
                                                        ? '#1a7a3c'
                                                        : '#f57c00',
                                                fontSize: '11px', fontWeight: 700,
                                                fontFamily: '"Noto Kufi Arabic", serif',
                                                padding: '4px 10px', borderRadius: '8px',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                            }}>
                                                {badgeText}
                                            </Box>
                                        )}

                                        {/* Cert ribbon */}
                                        {isOwned && cert && (
                                            <Box sx={{
                                                position: 'absolute', top: 10, left: 10, zIndex: 4,
                                                backgroundColor: 'rgba(124,58,237,0.88)',
                                                backdropFilter: 'blur(6px)',
                                                borderRadius: '8px',
                                                padding: '3px 8px',
                                                fontSize: '12px',
                                                fontWeight: 700,
                                                fontFamily: '"Noto Kufi Arabic", serif',
                                                color: '#fff',
                                                boxShadow: '0 2px 6px rgba(124,58,237,0.4)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                            }}>
                                                📜 شهادة
                                            </Box>
                                        )}
                                    </Box>

                                    {/* ── Card content ── */}
                                    <CardContent sx={{
                                        flexGrow: 1, p: '14px 14px 8px',
                                        display: 'flex', flexDirection: 'column', gap: '6px',
                                        overflow: 'hidden',
                                    }}>

                                        <Tooltip title={course.title} arrow placement="top">
                                            <Typography sx={{
                                                fontWeight: 700, fontFamily: '"Noto Kufi Arabic", serif',
                                                fontSize: '0.875rem', lineHeight: 1.5, color: '#111',
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                minHeight: '2.6em', direction: 'ltr',
                                            }}>
                                                {course.title}
                                            </Typography>
                                        </Tooltip>

                                        {course.description && (
                                            <Typography sx={{
                                                fontFamily: '"Noto Kufi Arabic", serif',
                                                fontSize: '0.7rem', color: '#666', lineHeight: 1.45,
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                direction: 'ltr',
                                            }}>
                                                {course.description}
                                            </Typography>
                                        )}

                                        <Box sx={{ flexGrow: 1 }} />

                                        {/* ── Mode toggle — paid + unowned only ── */}
                                        {!isOwned && !course.isFree && (
                                            <div onClick={e => e.stopPropagation()}>
                                                <ModeToggle
                                                    mode={mode}
                                                    onChange={(m) => handleModeChange(course.id, m)}
                                                />
                                            </div>
                                        )}

                                        {/* ── Price section (mirrors CoursesPage) ── */}
                                        <Box sx={{ borderTop: '1px solid #f0f0f0', pt: '8px' }}>
                                            {isOwned ? (
                                                <Typography sx={{
                                                    fontWeight: 800, fontFamily: '"Noto Kufi Arabic", serif',
                                                    fontSize: '0.95rem', color: '#4a4a8a',
                                                }}>
                                                    مسجل ✓
                                                </Typography>
                                            ) : activePrice > 0 ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    {/* Strikethrough old price */}
                                                    {activeOldCost > activePrice && (
                                                        <Typography sx={{
                                                            fontFamily: '"Noto Kufi Arabic", serif',
                                                            fontSize: '0.72rem', color: '#999',
                                                            textDecoration: 'line-through',
                                                        }}>
                                                            {activeOldCost} جنيه
                                                        </Typography>
                                                    )}
                                                    {/* Current price */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography sx={{
                                                            fontWeight: 800, fontFamily: '"Noto Kufi Arabic", serif',
                                                            fontSize: '1rem', color: '#f57c00',
                                                        }}>
                                                            {activePrice} جنيه
                                                        </Typography>
                                                        {/* Discount badge */}
                                                        {activeDiscount > 0 && (
                                                            <Box sx={{
                                                                background: '#ffeded', color: '#e53935',
                                                                px: '6px', py: '2px', borderRadius: '5px',
                                                                fontSize: '11px', fontWeight: 700,
                                                                    fontFamily: '"Noto Kufi Arabic", serif',
                                                            }}>
                                                                خصم {activeDiscount}%
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    {/* Mode label */}
                                                    <Typography sx={{
                                                            fontFamily: '"Noto Kufi Arabic", serif',
                                                        fontSize: '0.65rem', color: '#888',
                                                    }}>
                                                        {mode === 'online' ? 'السعر الأونلاين' : 'السعر الحضوري'}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography sx={{
                                                    fontWeight: 800, fontFamily: '"Noto Kufi Arabic", serif',
                                                    fontSize: '0.95rem',
                                                    color: course.isFree ? '#1a7a3c' : '#1a7a3c',
                                                }}>
                                                    مجاناً
                                                </Typography>
                                            )}
                                        </Box>

                                        {course.place && (
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '4px', direction: 'ltr' }}>
                                                <LocationOnIcon sx={{ fontSize: '0.8rem', color: '#0865a8', mt: '2px', flexShrink: 0 }} />
                                                <Typography variant="caption" sx={{
                                                    color: '#555', fontSize: '0.65rem', fontFamily: '"Noto Kufi Arabic", serif',
                                                    lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                }}>
                                                    {course.place}
                                                </Typography>
                                            </Box>
                                        )}

                                        {course.date && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', direction: 'ltr' }}>
                                                <AccessTimeIcon sx={{ fontSize: '0.8rem', color: '#0865a8', flexShrink: 0 }} />
                                                <Typography variant="caption" sx={{
                                                    color: '#555', fontSize: '0.65rem', fontFamily: '"Noto Kufi Arabic", serif',
                                                    display: '-webkit-box', WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                }}>
                                                    {course.date}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>

                                    {/* ── Action buttons ── */}
                                    <CardActions sx={{ p: '0 14px 14px', flexShrink: 0, flexDirection: 'column', gap: '8px' }}>

                                        {/* Certificate download button */}
                                        {isOwned && cert && (
                                            <Box
                                                component="a"
                                                href={cert.url}
                                                download={cert.name}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px',
                                                    py: '7px',
                                                    px: '12px',
                                                    background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)',
                                                    color: '#fff',
                                                    borderRadius: '8px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    fontFamily: '"Noto Kufi Arabic", serif',
                                                    textDecoration: 'none',
                                                    boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 14px rgba(124,58,237,0.45)',
                                                    },
                                                }}
                                            >
                                                <span>📜</span>
                                                <span>شهادتك جاهزة — تحميل</span>
                                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                                </svg>
                                            </Box>
                                        )}

                                        {isOwned ? (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={(e) => { e.stopPropagation(); navigate('/my-courses'); }}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #4a4a8a 0%, #7b5ea7 100%)',
                                                    color: '#fff', fontWeight: 700,
                                                    borderRadius: '8px', fontSize: '0.78rem',
                                                    py: '7px', fontFamily: '"Noto Kufi Arabic", serif',
                                                    border: 'none', boxShadow: 'none',
                                                    '&:hover': { background: 'linear-gradient(135deg, #3a3a7a 0%, #6b4e97 100%)', boxShadow: 'none' },
                                                }}
                                            >
                                                عرض في دوراتي
                                            </Button>
                                        ) : (course.isFree || effectivelyFree) ? (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={(e) => { e.stopPropagation(); handleEnroll(course); }}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #1a7a3c 0%, #27ae60 100%)',
                                                    color: '#fff', fontWeight: 700,
                                                    borderRadius: '8px', fontSize: '0.78rem',
                                                    py: '7px', fontFamily: '"Noto Kufi Arabic", serif',
                                                    border: 'none', boxShadow: 'none',
                                                    '&:hover': { background: 'linear-gradient(135deg, #155f30 0%, #1e8449 100%)', boxShadow: 'none' },
                                                }}
                                            >
                                                🎁 اشترك الآن — مجاناً
                                            </Button>
                                        ) : (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                disabled={isAdding}
                                                onClick={(e) => { e.stopPropagation(); addToCart(course); }}
                                                sx={{
                                                    borderColor: '#0865a8', color: '#0865a8',
                                                    fontWeight: 700, borderRadius: '8px',
                                                    fontSize: '0.78rem', py: '7px',
                                                    fontFamily: '"Noto Kufi Arabic", serif',
                                                    borderWidth: '2px',
                                                    '&:hover': { bgcolor: '#0865a8', color: '#fff', borderColor: '#0865a8' },
                                                    '&:disabled': { opacity: 0.6, borderColor: '#0865a8', color: '#0865a8' },
                                                }}
                                            >
                                                {isAdding ? 'جاري الإضافة...' : 'أضف إلى السلة'}
                                            </Button>
                                        )}
                                    </CardActions>
                                </Card>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                <NavArrow direction="prev" swiperRef={swiperRef} />
                <NavArrow direction="next" swiperRef={swiperRef} />
            </Box>
        </Container>
    );
};

export default DynamicCoursesSection;