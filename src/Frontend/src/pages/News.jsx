import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ─── Design tokens (mirrored from Team.jsx) ──────────────────────── */
const T = {
    orange: '#f57c00',
    orangeLight: '#ff9a3c',
    orangeDark: '#bf5200',
    blue: '#0865a8',
    blueLight: '#1a84d4',
    blueDark: '#044478',
    black: '#0a0a0a',
    white: '#ffffff',
    gray50: '#f8f9fa',
    gray100: '#f0f1f2',
    gray300: '#d0d3d8',
    gray500: '#6b7280',
    gray700: '#374151',
    font: '"Noto Kufi Arabic", serif',
};

/* ─── Keyframe / style injection ─────────────────────────────────── */
const STYLES = `

    .nw-root { direction: rtl; font-family: ${T.font}; background: ${T.white}; overflow-x: hidden; }

    .nw-hero-grid::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(rgba(245,124,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,124,0,0.07) 1px, transparent 1px);
        background-size: 56px 56px;
        pointer-events: none;
        z-index: 1;
    }

    .nw-hero-cut::after  { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.white}; clip-path:polygon(0 100%,100% 0,100% 100%); z-index:3; }
    .nw-black-cut::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.black}; clip-path:polygon(0 100%,100% 0,100% 100%); z-index:3; }

    .nw-bc-link { transition: color 0.25s; }
    .nw-bc-link:hover { color: ${T.orange} !important; }

    .nw-year-pill {
        padding: clamp(7px,1.2vw,11px) clamp(16px,2.5vw,26px);
        border-radius: 2px;
        border: 2px solid rgba(255,255,255,0.2);
        background: transparent;
        color: rgba(255,255,255,0.6);
        font-family: ${T.font};
        font-size: clamp(12px,1.5vw,16px);
        font-weight: 700;
        cursor: pointer;
        transition: background 0.28s, border-color 0.28s, color 0.28s, transform 0.28s;
        white-space: nowrap;
    }
    .nw-year-pill:hover { border-color: ${T.orangeLight}; color: ${T.orangeLight}; transform: translateY(-2px); }
    .nw-year-pill--active { background: ${T.orange}; border-color: ${T.orange}; color: ${T.white} !important; box-shadow: 0 4px 16px rgba(245,124,0,0.4); }

    .nw-arrow {
        background: rgba(255,255,255,0.1);
        border: 2px solid rgba(255,255,255,0.2);
        color: ${T.white};
        border-radius: 2px;
        width: clamp(32px,4vw,44px);
        height: clamp(32px,4vw,44px);
        display: flex; align-items: center; justify-content: center;
        font-size: clamp(18px,2.5vw,26px);
        cursor: pointer;
        flex-shrink: 0;
        transition: background 0.28s, border-color 0.28s, transform 0.28s;
        user-select: none;
    }
    .nw-arrow:hover { background: ${T.orange}; border-color: ${T.orange}; transform: scale(1.1); }

    .nw-card {
        position: relative;
        background: ${T.white};
        border-radius: 3px;
        overflow: hidden;
        border: 1.5px solid ${T.gray100};
        box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        display: flex;
        flex-direction: column;
        cursor: pointer;
        transition: transform 0.38s cubic-bezier(.4,0,.2,1), box-shadow 0.38s, border-color 0.38s;
    }
    .nw-card::before {
        content:''; position:absolute; top:0; right:0; width:4px; height:100%;
        background:${T.orange}; transform:scaleY(0); transform-origin:bottom;
        transition:transform 0.38s cubic-bezier(.4,0,.2,1); z-index:2;
    }
    .nw-card:hover { transform: translateY(-8px); box-shadow: 0 18px 48px rgba(0,0,0,0.18); border-color: ${T.orange}; }
    .nw-card:hover::before { transform: scaleY(1); }
    .nw-card:hover .nw-card__img { transform: scale(1.06); }
    .nw-card:hover .nw-card__bar { transform: scaleX(1); }
    .nw-card:hover .nw-card__title { color: ${T.orange}; }

    .nw-card__img { width:100%; height:100%; object-fit:cover; display:block; transition: transform 0.5s cubic-bezier(.4,0,.2,1); }
    .nw-card__bar { height:4px; background:linear-gradient(to left,${T.orange},${T.blue}); transform:scaleX(0); transform-origin:right; transition:transform 0.38s cubic-bezier(.4,0,.2,1); }
    .nw-card__title { transition: color 0.3s; }

    .nw-grid { display:grid; gap:clamp(16px,3vw,28px); grid-template-columns:1fr; }
    @media(min-width:480px){ .nw-grid { grid-template-columns:repeat(2,1fr); } }
    @media(min-width:900px){ .nw-grid { grid-template-columns:repeat(3,1fr); } }
    @media(min-width:1300px){ .nw-grid { grid-template-columns:repeat(4,1fr); } }

    .nw-page-btn {
        min-width: clamp(32px,4vw,42px);
        height: clamp(32px,4vw,42px);
        padding: 0 clamp(8px,1.2vw,14px);
        border-radius: 2px;
        border: 1.5px solid rgba(255,255,255,0.2);
        background: transparent;
        color: rgba(255,255,255,0.6);
        font-family: ${T.font};
        font-size: clamp(12px,1.5vw,15px);
        font-weight: 700;
        cursor: pointer;
        transition: background 0.28s, border-color 0.28s, color 0.28s, transform 0.2s;
        display: flex; align-items: center; justify-content: center;
    }
    .nw-page-btn:hover:not(:disabled) { background: ${T.orange}; border-color: ${T.orange}; color: ${T.white}; transform: translateY(-2px); }
    .nw-page-btn--active { background: ${T.orange} !important; border-color: ${T.orange} !important; color: ${T.white} !important; box-shadow: 0 4px 14px rgba(245,124,0,0.4); }
    .nw-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    @keyframes nw-spin { 0%{ transform:rotate(0deg); } 100%{ transform:rotate(360deg); } }
    .nw-spinner {
        width: 52px; height: 52px;
        border: 4px solid rgba(255,255,255,0.1);
        border-top: 4px solid ${T.orange};
        border-radius: 50%;
        animation: nw-spin 1s linear infinite;
    }

    .nw-scroller { display:flex; gap:clamp(8px,1.5vw,14px); overflow-x:auto; padding: 4px 0; scroll-behavior:smooth; }
    .nw-scroller::-webkit-scrollbar { display:none; }
    .nw-scroller { -ms-overflow-style:none; scrollbar-width:none; }
`;

function injectStyles() {
    if (document.getElementById('nw-styles')) return;
    const el = document.createElement('style');
    el.id = 'nw-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
}

/* ─── Shared sub-components ─────────────────────────────────────── */
const SectionLabel = ({ light = false, children }) => (
    <span style={{
        display: 'inline-block',
        background: light ? 'rgba(255,255,255,0.12)' : T.orange,
        color: light ? T.orangeLight : T.white,
        fontFamily: T.font,
        fontSize: 'clamp(10px,1.2vw,13px)',
        fontWeight: 700,
        padding: '5px 18px',
        borderRadius: '2px',
        marginBottom: '10px',
        letterSpacing: '0.05em',
    }}>
        {children}
    </span>
);

const SectionHeading = ({ light = false, children }) => (
    <h2 style={{
        fontSize: 'clamp(20px,3vw,36px)',
        fontWeight: 900,
        color: light ? T.white : T.black,
        fontFamily: T.font,
        lineHeight: 1.35,
        marginBottom: '10px',
    }}>
        {children}
    </h2>
);

const HeadingBar = ({ light = false }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: 'clamp(28px,4.5vw,50px)' }}>
        <div style={{ width: '52px', height: '4px', background: light ? T.orangeLight : T.orange, borderRadius: '2px' }} />
    </div>
);

/* ─── News Card ─────────────────────────────────────────────────── */
const NewsCard = ({ item, index }) => {
    const imgSrc = item.imageUrl || (Array.isArray(item.imageUrls) && item.imageUrls[0]) || null;
    return (
        <motion.a
            href={`/news/${item.id}`}
            className="nw-card"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
            style={{ textDecoration: 'none' }}
        >
            <div style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden', background: T.gray100 }}>
                {imgSrc && (
                    <img
                        src={imgSrc}
                        alt={item.title}
                        className="nw-card__img"
                        style={{ position: 'absolute', inset: 0 }}
                    />
                )}
                <span style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                    background: T.orange, color: T.white, fontFamily: T.font,
                    fontSize: 'clamp(9px,1.1vw,12px)', fontWeight: 700,
                    padding: '4px 12px', borderRadius: '2px',
                }}>
                    {new Date(item.publishedAt).toLocaleDateString('ar-EG', {
                        day: '2-digit', month: 'long', year: 'numeric',
                    })}
                </span>
            </div>
            <div className="nw-card__bar" />
            <div style={{ padding: 'clamp(12px,2vw,18px) clamp(12px,2vw,18px) clamp(14px,2.5vw,22px)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                    className="nw-card__title"
                    style={{
                        fontSize: 'clamp(13px,1.5vw,16px)', fontWeight: 700,
                        color: T.blue, fontFamily: T.font,
                        lineHeight: 1.65, margin: 0, flex: 1,
                    }}
                >
                    {item.title}
                </h3>
            </div>
        </motion.a>
    );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [years, setYears] = useState(null);   // null = loading
    const [selectedYear, setSelectedYear] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const scrollRef = useRef(null);
    const sectionInner = { maxWidth: 'min(1280px,94vw)', margin: '0 auto' };
    const BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api/News';

    /* ── styles + title ── */
    useEffect(() => {
        injectStyles();
        document.title = 'الأخبار - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    /* ── 1. GET /api/News/years → [2026, 2025, ...] ── */
    useEffect(() => {
        fetch(`${BASE}/years`)
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => {
                const list = Array.isArray(data)
                    ? data.map(String).sort((a, b) => Number(b) - Number(a))
                    : [];
                setYears(list);
                setSelectedYear(list[0] ?? null);
            })
            .catch(() => {
                setYears([]);
                setSelectedYear(null);
            });
    }, []);

    /* ── reset page when year changes ── */
    useEffect(() => { setCurrentPage(1); }, [selectedYear]);

    /* ── 2. GET /api/News/getAllNews?year=&pageIndex= ── */
    useEffect(() => {
        if (!selectedYear) return;
        setLoading(true);
        setError(null);

        fetch(`${BASE}/getAllNews?year=${selectedYear}&pageIndex=${currentPage}`)
            .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
            .then(res => {
                setNews(res.data ?? []);
                setTotalPages(res.totalPages ?? 0);
                setLoading(false);
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [selectedYear, currentPage]);

    const handleScroll = (dir) => {
        if (scrollRef.current)
            scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const yearsReady = years !== null && selectedYear !== null;

    return (
        <div className="nw-root">

            {/* ══ BREADCRUMB ══ */}
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: `1px solid ${T.gray300}`, backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: T.font, fontSize: '1rem' }}>
                    <a href="/" className="nw-bc-link" style={{ color: T.gray700, fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>الصفحة الرئيسية</a>
                    <span style={{ color: T.gray500, margin: '0 6px' }}>-</span>
                    <span style={{ color: T.gray700, fontWeight: 700 }}>الأخبار</span>
                </div>
            </div>

            {/* ══ HERO ══ */}
            <section
                className="nw-hero-grid nw-hero-cut"
                style={{
                    position: 'relative', minHeight: 'clamp(300px,44vw,520px)',
                    background: T.blueDark, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column', overflow: 'hidden',
                    padding: 'clamp(130px,16vw,180px) clamp(20px,6vw,80px) clamp(90px,12vw,140px)',
                }}
            >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 'clamp(6px,0.8vw,10px)', height: '100%', background: `linear-gradient(to bottom, ${T.orange}, ${T.orangeLight})`, zIndex: 4 }} />

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '720px', width: '100%', marginBottom: 'clamp(32px,5vw,56px)' }}>
                    <span style={{ display: 'inline-block', background: T.orange, color: T.white, fontFamily: T.font, fontSize: 'clamp(10px,1.3vw,14px)', fontWeight: 700, padding: '6px 22px', borderRadius: '2px', marginBottom: 'clamp(12px,2.5vw,24px)', letterSpacing: '0.05em' }}>
                        المعهد التكنولوجي لهندسة التشييد والإدارة
                    </span>
                    <h1 style={{ fontSize: 'clamp(24px,4.5vw,58px)', fontWeight: 900, color: T.white, fontFamily: T.font, lineHeight: 1.3, marginBottom: 'clamp(12px,2vw,20px)' }}>
                        آخر{' '}<span style={{ color: T.orangeLight }}>الأخبار</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(12px,1.6vw,17px)', color: 'rgba(255,255,255,0.65)', fontFamily: T.font, lineHeight: 1.9 }}>
                        تابع أحدث أخبار وفعاليات المعهد
                    </p>
                </div>

                {/* Year pills */}
                <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 'min(900px,90vw)', display: 'flex', alignItems: 'center', gap: 'clamp(8px,1.5vw,14px)' }}>
                    <button className="nw-arrow" onClick={() => handleScroll('right')}>«</button>
                    <div ref={scrollRef} className="nw-scroller" style={{ flex: 1 }}>
                        {yearsReady
                            ? years.map(year => (
                                <button
                                    key={year}
                                    className={`nw-year-pill${selectedYear === year ? ' nw-year-pill--active' : ''}`}
                                    onClick={() => setSelectedYear(year)}
                                >
                                    {year}
                                </button>
                            ))
                            : Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} style={{ width: 'clamp(52px,7vw,72px)', height: 'clamp(30px,4vw,42px)', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                            ))
                        }
                    </div>
                    <button className="nw-arrow" onClick={() => handleScroll('left')}>»</button>
                </div>
            </section>

            {/* ══ NEWS GRID ══ */}
            <section
                className="nw-black-cut"
                style={{ position: 'relative', background: T.white, padding: 'clamp(56px,8vw,100px) clamp(16px,6vw,60px) clamp(100px,15vw,170px)' }}
            >
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}>
                        <SectionLabel>أخبار {selectedYear}</SectionLabel><br />
                        <SectionHeading>أبرز <span style={{ color: T.orange }}>الأخبار</span></SectionHeading>
                        <HeadingBar />
                    </div>

                    {loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', gap: '20px' }}>
                            <div className="nw-spinner" />
                            <p style={{ color: T.blue, fontFamily: T.font, fontSize: 'clamp(13px,1.6vw,16px)' }}>جارٍ تحميل الأخبار...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: T.orange, fontFamily: T.font, fontSize: 'clamp(13px,1.6vw,16px)' }}>
                            حدث خطأ في تحميل الأخبار
                        </div>
                    )}

                    {!loading && !error && news.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: T.gray500, fontFamily: T.font, fontSize: 'clamp(13px,1.6vw,16px)' }}>
                            لا توجد أخبار لعام {selectedYear}
                        </div>
                    )}

                    {!loading && !error && news.length > 0 && (
                        <div className="nw-grid">
                            {news.map((item, index) => (
                                <NewsCard key={item.id} item={item} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ══ PAGINATION ══ */}
            {!loading && totalPages > 1 && (
                <section style={{ background: T.black, padding: 'clamp(40px,6vw,70px) clamp(16px,6vw,60px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(6px,1vw,10px)', flexWrap: 'wrap' }}>
                        <button className="nw-page-btn" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>‹</button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`nw-page-btn${currentPage === i + 1 ? ' nw-page-btn--active' : ''}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button className="nw-page-btn" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>›</button>
                    </div>
                </section>
            )}

            {/* ══ FOOTER STRIP ══ */}
            <div style={{ background: T.black, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: 'clamp(36px,5vw,60px) clamp(16px,6vw,60px)', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: T.font, fontSize: 'clamp(11px,1.3vw,14px)' }}>
                    المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}
                </p>
            </div>

        </div>
    );
};

export default News;