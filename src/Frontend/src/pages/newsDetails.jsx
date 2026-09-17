import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const T = {
    orange: '#f57c00', orangeLight: '#ff9a3c', orangeDark: '#bf5200',
    blue: '#0865a8', blueLight: '#1a84d4', blueDark: '#044478',
    black: '#0a0a0a', white: '#ffffff',
    gray50: '#f8f9fa', gray100: '#f0f1f2', gray300: '#d0d3d8',
    gray500: '#6b7280', gray700: '#374151',
    font: '"Noto Kufi Arabic", serif',
};

const BASE = 'https://acwebsite-icmet-test.azurewebsites.net';

function resolveImg(url) {
    if (!url || url === 'N/A' || url === 'pending') return null;
    if (url.startsWith('http')) return url;
    return `${BASE}/${url.replace(/^\//, '')}`;
}

// ── Build a unified images array from the API response ───────────────────────
// Handles all possible shapes the backend might return:
//   Shape A (new): { imageUrl, imageUrls: ['url1', 'url2', ...] }
//   Shape B (new): { images: [{ imageUrl, isMain }, ...] }
//   Shape C (old): { imageUrl }  — single image only
function buildImagesArray(item) {
    if (!item) return [];

    // Shape B: structured array with isMain flag
    if (Array.isArray(item.images) && item.images.length > 0) {
        return [...item.images]
            .sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0))
            .map(i => resolveImg(i.imageUrl))
            .filter(Boolean);
    }

    const result = [];

    // Main image first
    const main = resolveImg(item.imageUrl);
    if (main) result.push(main);

    // Shape A: imageUrls array of extra images
    const extras = item.imageUrls ?? item.ImageUrls ?? [];
    extras.forEach(u => {
        const r = resolveImg(u);
        if (r && !result.includes(r)) result.push(r);
    });

    return result;
}

const STYLES = `

    .nd-root { direction: rtl; font-family: ${T.font}; background: ${T.white}; overflow-x: hidden; }

    .nd-hero-grid::before {
        content: ''; position: absolute; inset: 0;
        background-image: linear-gradient(rgba(245,124,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(245,124,0,0.07) 1px, transparent 1px);
        background-size: 56px 56px; pointer-events: none; z-index: 1;
    }
    .nd-hero-cut::after  { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.white}; clip-path:polygon(0 100%,100% 0,100% 100%); z-index:3; }
    .nd-blue-cut::after  { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.blue}; clip-path:polygon(0 100%,100% 0,100% 100%); z-index:3; }
    .nd-black-cut::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.black}; clip-path:polygon(0 100%,100% 0,100% 100%); z-index:3; }

    .nd-bc-link { transition: color 0.25s; }
    .nd-bc-link:hover { color: ${T.orange} !important; }

    .nd-share-btn { transition: opacity 0.28s, transform 0.28s, box-shadow 0.28s; cursor: pointer; }
    .nd-share-btn:hover { opacity: 0.88; transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.22) !important; }

    .nd-back-btn { transition: background 0.28s, transform 0.28s, box-shadow 0.28s; cursor: pointer; }
    .nd-back-btn:hover { background: ${T.blueDark} !important; transform: translateY(-3px); box-shadow: 0 6px 16px rgba(8,101,168,0.35) !important; }

    .nd-rel-card { transition: transform 0.38s cubic-bezier(.4,0,.2,1), box-shadow 0.38s, border-color 0.38s; cursor: pointer; }
    .nd-rel-card::before { content:''; position:absolute; top:0; right:0; width:4px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform 0.38s cubic-bezier(.4,0,.2,1); z-index:2; }
    .nd-rel-card:hover { transform: translateY(-8px); box-shadow: 0 18px 48px rgba(0,0,0,0.18) !important; border-color: ${T.orange} !important; }
    .nd-rel-card:hover::before { transform: scaleY(1); }
    .nd-rel-card:hover .nd-rel-img { transform: scale(1.06); }

    .nd-bar { height:4px; background:linear-gradient(to left,${T.orange},${T.blue}); transform:scaleX(0); transform-origin:right; transition:transform 0.38s cubic-bezier(.4,0,.2,1); }
    .nd-rel-card:hover .nd-bar { transform:scaleX(1); }
    .nd-rel-img { transition: transform 0.5s cubic-bezier(.4,0,.2,1); }

    /* ── Gallery ── */
    .nd-gallery-thumb {
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s;
        aspect-ratio: 4/3;
        background: ${T.gray100};
        flex-shrink: 0;
    }
    .nd-gallery-thumb:hover { border-color: ${T.orange}; transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,0.18); }
    .nd-gallery-thumb.active { border-color: ${T.orange}; box-shadow: 0 0 0 3px rgba(245,124,0,0.25); }
    .nd-gallery-thumb img { width:100%; height:100%; object-fit:cover; display:block; }

    .nd-gallery-main-wrap {
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        background: ${T.black};
        cursor: pointer;
    }
    .nd-gallery-main-wrap:hover .nd-zoom-badge { background: rgba(8,101,168,0.85) !important; }

    /* nav arrows inside gallery */
    .nd-gal-arrow {
        position: absolute; top: 50%; transform: translateY(-50%);
        background: rgba(0,0,0,0.45); border: 2px solid rgba(255,255,255,0.25);
        color: #fff; border-radius: 50%; width: 38px; height: 38px;
        font-size: 22px; cursor: pointer; display: flex; align-items: center;
        justify-content: center; z-index: 5; transition: background 0.2s;
        line-height: 1;
    }
    .nd-gal-arrow:hover { background: ${T.orange}; border-color: ${T.orange}; }
    .nd-gal-arrow.prev { right: 10px; }
    .nd-gal-arrow.next { left: 10px; }

    @keyframes nd-fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes nd-zoomIn  { from { transform:scale(1.08); opacity:0; } to { transform:scale(1); opacity:1; } }
    @keyframes nd-slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
    @keyframes nd-spin    { 0%{ transform:rotate(0deg); } 100%{ transform:rotate(360deg); } }

    .nd-spinner { width:52px; height:52px; border:4px solid ${T.gray100}; border-top:4px solid ${T.orange}; border-radius:50%; animation:nd-spin 1s linear infinite; }

    .nd-rel-grid { display:grid; gap:clamp(16px,3vw,28px); grid-template-columns:1fr; }
    @media(min-width:600px){ .nd-rel-grid { grid-template-columns:repeat(2,1fr); } }
    @media(min-width:960px){ .nd-rel-grid { grid-template-columns:repeat(3,1fr); } }

    .nd-content-html { font-size:clamp(14px,1.8vw,17px); line-height:2; color:${T.black}; font-family:${T.font}; }
    .nd-content-html p  { margin-bottom: 1.2em; }
    .nd-content-html img { max-width:100%; border-radius:4px; margin:1em 0; }

    @media(max-width:768px){ .nd-hero-inner h1 { font-size:clamp(18px,5vw,28px) !important; } }
`;

function injectStyles() {
    if (document.getElementById('nd-styles')) return;
    const el = document.createElement('style');
    el.id = 'nd-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
}

const SectionLabel = ({ light = false, children }) => (
    <span style={{ display: 'inline-block', background: light ? 'rgba(255,255,255,0.12)' : T.orange, color: light ? T.orangeLight : T.white, fontFamily: T.font, fontSize: 'clamp(10px,1.2vw,13px)', fontWeight: 700, padding: '5px 18px', borderRadius: '2px', marginBottom: '10px', letterSpacing: '0.05em' }}>
        {children}
    </span>
);
const SectionHeading = ({ light = false, children }) => (
    <h2 style={{ fontSize: 'clamp(20px,3vw,36px)', fontWeight: 900, color: light ? T.white : T.black, fontFamily: T.font, lineHeight: 1.35, marginBottom: '10px' }}>
        {children}
    </h2>
);
const HeadingBar = ({ light = false }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: 'clamp(28px,4.5vw,50px)' }}>
        <div style={{ width: '52px', height: '4px', background: light ? T.orangeLight : T.orange, borderRadius: '2px' }} />
    </div>
);

// ── Image Gallery ─────────────────────────────────────────────────────────────
// images: string[]  (resolved URLs, index 0 = main/cover)
function NewsGallery({ images, title, onOpenModal }) {
    const [activeIdx, setActiveIdx] = useState(0);

    if (!images || images.length === 0) return null;

    const prev = () => setActiveIdx(i => Math.max(i - 1, 0));
    const next = () => setActiveIdx(i => Math.min(i + 1, images.length - 1));

    return (
        <div style={{ marginBottom: 'clamp(28px,4vw,44px)' }}>
            {/* Main image */}
            <div className="nd-gallery-main-wrap"
                style={{ marginBottom: 12, width: '100%', paddingTop: '52%' }}
                onClick={() => onOpenModal(activeIdx)}
            >
                <img
                    key={images[activeIdx]}
                    src={images[activeIdx]}
                    alt={title}
                    style={{
                        position: 'absolute', inset: 0, width: '100%', height: '100%',
                        objectFit: 'cover', display: 'block',
                        animation: 'nd-fadeIn 0.3s ease',
                    }}
                />

                {/* Zoom hint */}
                <span className="nd-zoom-badge" style={{
                    position: 'absolute', top: 12, left: 12, zIndex: 4,
                    background: 'rgba(0,0,0,0.55)', color: T.white,
                    padding: '6px 14px', borderRadius: '3px',
                    fontSize: 'clamp(11px,1.3vw,13px)', fontFamily: T.font, fontWeight: 700,
                    transition: 'background 0.28s',
                }}>
                    🔍 اضغط للتكبير
                </span>

                {/* Counter */}
                {images.length > 1 && (
                    <span style={{
                        position: 'absolute', top: 12, right: 12, zIndex: 4,
                        background: T.orange, color: T.white,
                        padding: '4px 12px', borderRadius: '3px',
                        fontSize: 'clamp(10px,1.2vw,12px)', fontFamily: T.font, fontWeight: 700,
                    }}>
                        {activeIdx + 1} / {images.length}
                    </span>
                )}

                {/* Inline prev/next arrows */}
                {activeIdx > 0 && (
                    <button className="nd-gal-arrow prev" onClick={e => { e.stopPropagation(); prev(); }}>›</button>
                )}
                {activeIdx < images.length - 1 && (
                    <button className="nd-gal-arrow next" onClick={e => { e.stopPropagation(); next(); }}>‹</button>
                )}
            </div>

            {/* Thumbnail strip — only when > 1 image */}
            {images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                    {images.map((src, i) => (
                        <div
                            key={src + i}
                            className={`nd-gallery-thumb${i === activeIdx ? ' active' : ''}`}
                            style={{ width: 'clamp(70px,9vw,100px)' }}
                            onClick={() => setActiveIdx(i)}
                        >
                            <img src={src} alt="" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
const NewsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [modalIdx, setModalIdx] = useState(null);

    // Resolved images array (strings) — index 0 is always the main/cover image
    const allImages = buildImagesArray(newsItem);
    const mainImage = allImages[0] ?? null;

    useEffect(() => {
        injectStyles();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setLoading(true);

        fetch(`${BASE}/api/news/${id}`)
            .then(r => { if (!r.ok) throw new Error('Failed to fetch'); return r.json(); })
            .then(data => {
                setNewsItem(data);
                setLoading(false);
                const year = new Date(data.publishedAt).getFullYear();
                return fetch(`${BASE}/api/News/getAllNews?year=${year}`);
            })
            .then(r => r.json())
            .then(data => {
                const filtered = (data.data || []).filter(i => i.id !== parseInt(id));
                setRelatedNews(filtered.sort(() => 0.5 - Math.random()).slice(0, 3));
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [id]);

    useEffect(() => {
        document.title = newsItem?.title
            ? `${newsItem.title} - المعهد التكنولوجي لهندسة التشييد والإدارة`
            : 'تفاصيل الخبر - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, [newsItem]);

    // Keyboard navigation in modal
    useEffect(() => {
        if (modalIdx === null) return;
        const handler = (e) => {
            if (e.key === 'Escape') setModalIdx(null);
            if (e.key === 'ArrowLeft') setModalIdx(i => Math.min(i + 1, allImages.length - 1));
            if (e.key === 'ArrowRight') setModalIdx(i => Math.max(i - 1, 0));
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [modalIdx, allImages.length]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = newsItem?.title || '';
        const map = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
        };
        if (map[platform]) window.open(map[platform], '_blank');
    };

    const sectionInner = { maxWidth: 'min(1280px,94vw)', margin: '0 auto' };

    if (loading) return (
        <div className="nd-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: T.blueDark }}>
            <div className="nd-spinner" />
            <p style={{ marginTop: '22px', color: T.orangeLight, fontFamily: T.font, fontSize: 'clamp(13px,1.6vw,17px)' }}>جارٍ تحميل التفاصيل...</p>
        </div>
    );

    if (error || !newsItem) return (
        <div className="nd-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: T.blueDark, gap: '20px' }}>
            <p style={{ color: T.orangeLight, fontFamily: T.font, fontSize: 'clamp(14px,1.8vw,18px)' }}>حدث خطأ في تحميل الخبر</p>
            <button className="nd-back-btn" onClick={() => navigate('/news')}
                style={{ padding: '12px 36px', background: T.orange, color: T.white, border: 'none', borderRadius: '3px', fontFamily: T.font, fontWeight: 700, fontSize: '1rem' }}>
                العودة للأخبار
            </button>
        </div>
    );

    const formattedDate = new Date(newsItem.publishedAt).toLocaleDateString('ar-EG', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div className="nd-root">

            {/* ══ BREADCRUMB ══ */}
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: `1px solid ${T.gray300}`, backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: T.font, fontSize: '1rem' }}>
                    <a href="/" className="nd-bc-link" style={{ color: T.gray700, fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>الصفحة الرئيسية</a>
                    <span style={{ color: T.gray500, margin: '0 6px' }}>-</span>
                    <a href="/news" className="nd-bc-link" style={{ color: T.gray700, fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>الأخبار</a>
                    <span style={{ color: T.gray500, margin: '0 6px' }}>-</span>
                    <span style={{ color: T.gray700, fontWeight: 700 }}>تفاصيل الخبر</span>
                </div>
            </div>

            {/* ══ HERO — always uses main (index 0) image ══ */}
            <section
                className="nd-hero-grid nd-hero-cut"
                style={{
                    position: 'relative', minHeight: 'clamp(340px,52vw,580px)', background: T.blueDark,
                    overflow: 'hidden', display: 'flex', alignItems: 'flex-end',
                    padding: 'clamp(130px,16vw,180px) 0 clamp(90px,13vw,150px)',
                    marginTop: '0',
                }}
            >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 'clamp(6px,0.8vw,10px)', height: '100%', background: `linear-gradient(to bottom, ${T.orange}, ${T.orangeLight})`, zIndex: 4 }} />

                {mainImage && (
                    <img src={mainImage} alt={newsItem.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'top', animation: 'nd-zoomIn 0.9s ease-out', zIndex: 0 }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(4,68,120,0.45) 0%, rgba(4,68,120,0.82) 100%)`, zIndex: 2 }} />

                <div className="nd-hero-inner" style={{ position: 'relative', zIndex: 4, padding: '0 clamp(20px,6vw,80px)', width: '100%' }}>
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>
                        <span style={{ display: 'inline-block', background: T.orange, color: T.white, fontFamily: T.font, fontSize: 'clamp(10px,1.2vw,13px)', fontWeight: 700, padding: '6px 22px', borderRadius: '2px', marginBottom: 'clamp(12px,2vw,20px)', letterSpacing: '0.05em' }}>
                            {formattedDate}
                        </span>
                        <h1 style={{ fontSize: 'clamp(20px,3.8vw,50px)', fontWeight: 900, color: T.white, fontFamily: T.font, lineHeight: 1.35, maxWidth: '820px', margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.4)', animation: 'nd-slideUp 0.65s ease-out' }}>
                            {newsItem.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* ══ ARTICLE CONTENT + GALLERY ══ */}
            <section className="nd-blue-cut" style={{ position: 'relative', background: T.white, padding: 'clamp(48px,7vw,90px) clamp(16px,6vw,60px) clamp(100px,15vw,170px)' }}>
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4.5vw,48px)' }}>
                        <SectionLabel>تفاصيل الخبر</SectionLabel><br />
                        <SectionHeading>محتوى <span style={{ color: T.orange }}>الخبر</span></SectionHeading>
                        <HeadingBar />
                    </div>

                    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                        style={{ background: T.white, border: `1.5px solid ${T.gray100}`, borderRadius: '3px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                        <div style={{ height: '4px', background: `linear-gradient(to left, ${T.orange}, ${T.blue})` }} />
                        <div style={{ padding: 'clamp(24px,4vw,48px) clamp(20px,4vw,48px)' }}>

                            {/* Gallery — all images with thumbnails + arrows */}
                            <NewsGallery
                                images={allImages}
                                title={newsItem.title}
                                onOpenModal={setModalIdx}
                            />

                            {/* Article text */}
                            <div style={{ textAlign: 'justify' }}>
                                {newsItem.details
                                    ? <div className="nd-content-html" dangerouslySetInnerHTML={{ __html: newsItem.details }} />
                                    : <p className="nd-content-html">{newsItem.description || 'لا يوجد محتوى متاح لهذا الخبر.'}</p>
                                }
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══ SHARE ══ */}
            <section className="nd-black-cut" style={{ position: 'relative', background: T.blue, padding: 'clamp(80px,12vw,140px) clamp(16px,6vw,60px) clamp(100px,15vw,170px)' }}>
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}>
                        <SectionLabel light>التفاعل مع الخبر</SectionLabel><br />
                        <SectionHeading light>شارك <span style={{ color: T.orangeLight }}>الخبر</span></SectionHeading>
                        <HeadingBar light />
                    </div>
                    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
                        style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px,2vw,20px)', justifyContent: 'center', alignItems: 'center' }}>
                        {[{ label: 'Facebook', platform: 'facebook', bg: '#1877f2' }, { label: 'WhatsApp', platform: 'whatsapp', bg: '#25d366' }, { label: 'Twitter', platform: 'twitter', bg: '#1da1f2' }].map(({ label, platform, bg }) => (
                            <button key={platform} className="nd-share-btn" onClick={() => handleShare(platform)}
                                style={{ background: bg, color: T.white, fontFamily: T.font, fontSize: 'clamp(13px,1.5vw,16px)', fontWeight: 700, padding: 'clamp(10px,1.5vw,14px) clamp(24px,3.5vw,40px)', border: 'none', borderRadius: '3px', minWidth: 'clamp(130px,14vw,170px)', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
                                {label}
                            </button>
                        ))}
                        <button className="nd-back-btn" onClick={() => navigate('/news')}
                            style={{ background: T.orange, color: T.white, fontFamily: T.font, fontSize: 'clamp(13px,1.5vw,16px)', fontWeight: 700, padding: 'clamp(10px,1.5vw,14px) clamp(24px,3.5vw,40px)', border: 'none', borderRadius: '3px', minWidth: 'clamp(160px,16vw,200px)', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
                            العودة إلى الأخبار
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ══ RELATED ══ */}
            {relatedNews.length > 0 && (
                <section style={{ background: T.black, padding: 'clamp(56px,9vw,110px) clamp(16px,6vw,60px)' }}>
                    <div style={sectionInner}>
                        <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
                            <SectionLabel light>اكتشف المزيد</SectionLabel><br />
                            <SectionHeading light>أخبار <span style={{ color: T.orangeLight }}>ذات صلة</span></SectionHeading>
                            <HeadingBar light />
                        </div>
                        <div className="nd-rel-grid">
                            {relatedNews.map((item, index) => (
                                <motion.div key={item.id} className="nd-rel-card"
                                    initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                                    onClick={() => navigate(`/news/${item.id}`)}
                                    style={{ position: 'relative', background: T.white, borderRadius: '3px', overflow: 'hidden', border: `1.5px solid ${T.gray100}`, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                                    <div style={{ position: 'relative', height: 'clamp(160px,18vw,220px)', overflow: 'hidden' }}>
                                        <img src={resolveImg(item.imageUrl)} alt={item.title} className="nd-rel-img"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    </div>
                                    <div className="nd-bar" />
                                    <div style={{ padding: 'clamp(14px,2vw,22px) clamp(12px,2vw,18px)' }}>
                                        <p style={{ fontSize: 'clamp(10px,1.2vw,13px)', color: T.orange, fontFamily: T.font, fontWeight: 700, marginBottom: '8px' }}>
                                            {new Date(item.publishedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <h3 style={{ fontSize: 'clamp(13px,1.6vw,16px)', fontWeight: 700, color: T.blue, fontFamily: T.font, lineHeight: 1.6, margin: 0 }}>
                                            {item.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ══ FOOTER STRIP ══ */}
            <div style={{ background: T.black, borderTop: `1px solid rgba(255,255,255,0.06)`, padding: 'clamp(36px,5vw,60px) clamp(16px,6vw,60px)', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: T.font, fontSize: 'clamp(11px,1.3vw,14px)' }}>
                    المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}
                </p>
            </div>

            {/* ══ IMAGE MODAL — fullscreen lightbox with prev/next ══ */}
            {modalIdx !== null && allImages.length > 0 && (
                <div onClick={() => setModalIdx(null)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', animation: 'nd-fadeIn 0.3s ease-out' }}>

                    {/* Close */}
                    <button onClick={e => { e.stopPropagation(); setModalIdx(null); }}
                        style={{ position: 'absolute', top: 20, left: 20, background: T.orange, border: 'none', borderRadius: '50%', width: 42, height: 42, fontSize: 22, cursor: 'pointer', color: T.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.4)', zIndex: 10000, fontWeight: 900 }}>
                        ×
                    </button>

                    {/* Counter */}
                    {allImages.length > 1 && (
                        <span style={{ position: 'absolute', top: 24, right: '50%', transform: 'translateX(50%)', color: 'rgba(255,255,255,0.7)', fontFamily: T.font, fontSize: 'clamp(12px,1.5vw,15px)', fontWeight: 700, zIndex: 10000 }}>
                            {modalIdx + 1} / {allImages.length}
                        </span>
                    )}

                    {/* Prev */}
                    {modalIdx > 0 && (
                        <button onClick={e => { e.stopPropagation(); setModalIdx(i => i - 1); }}
                            style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)', color: T.white, borderRadius: '50%', width: 48, height: 48, fontSize: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, transition: 'background 0.2s' }}>
                            ›
                        </button>
                    )}

                    {/* Next */}
                    {modalIdx < allImages.length - 1 && (
                        <button onClick={e => { e.stopPropagation(); setModalIdx(i => i + 1); }}
                            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.2)', color: T.white, borderRadius: '50%', width: 48, height: 48, fontSize: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, transition: 'background 0.2s' }}>
                            ‹
                        </button>
                    )}

                    {/* Modal thumbnail strip */}
                    {allImages.length > 1 && (
                        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10000 }}>
                            {allImages.map((src, i) => (
                                <div key={i} onClick={e => { e.stopPropagation(); setModalIdx(i); }}
                                    style={{ width: 54, height: 40, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === modalIdx ? T.orange : 'rgba(255,255,255,0.25)'}`, transition: 'border-color 0.2s', flexShrink: 0 }}>
                                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Full image */}
                    <img src={allImages[modalIdx]} alt={newsItem.title} onClick={e => e.stopPropagation()}
                        style={{ maxWidth: '88%', maxHeight: '78%', objectFit: 'contain', borderRadius: '3px', boxShadow: '0 12px 48px rgba(0,0,0,0.6)', animation: 'nd-zoomIn 0.35s ease-out' }} />
                </div>
            )}

        </div>
    );
};

export default NewsDetails;