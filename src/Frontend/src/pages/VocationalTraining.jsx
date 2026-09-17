import React, { useEffect } from 'react';

/* ─── Design tokens ──────────────────────── */
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

/* ─── Injected styles (pseudo-elements + hover + responsive) ── */
const STYLES = `

    .voc-root { direction: rtl; font-family: ${T.font}; background: ${T.white}; overflow-x: hidden; }

    /* hero grid overlay */
    .voc-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(rgba(245,124,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,124,0,0.07) 1px, transparent 1px);
        background-size: 56px 56px;
        pointer-events: none;
    }

    /* diagonal cuts */
    .voc-hero::after {
        content: '';
        position: absolute;
        bottom: -2px; left: 0; right: 0;
        height: clamp(40px, 8vw, 110px);
        background: ${T.white};
        clip-path: polygon(0 100%, 100% 0, 100% 100%);
    }
    .voc-cards-section::after {
        content: '';
        position: absolute;
        bottom: -2px; left: 0; right: 0;
        height: clamp(40px, 8vw, 110px);
        background: ${T.blue};
        clip-path: polygon(0 100%, 100% 0, 100% 100%);
    }
    .voc-info-section::after {
        content: '';
        position: absolute;
        bottom: -2px; left: 0; right: 0;
        height: clamp(40px, 8vw, 110px);
        background: ${T.black};
        clip-path: polygon(0 100%, 100% 0, 100% 100%);
    }

    /* card hover */
    .voc-card {
        transition: transform 0.38s cubic-bezier(.4,0,.2,1),
                    box-shadow 0.38s cubic-bezier(.4,0,.2,1),
                    border-color 0.38s cubic-bezier(.4,0,.2,1);
    }
    .voc-card::before {
        content: '';
        position: absolute;
        top: 0; right: 0;
        width: 4px; height: 100%;
        background: ${T.orange};
        transform: scaleY(0);
        transform-origin: bottom;
        transition: transform 0.38s cubic-bezier(.4,0,.2,1);
        z-index: 2;
    }
    .voc-card:hover { transform: translateY(-8px) !important; box-shadow: 0 18px 48px rgba(0,0,0,0.16) !important; border-color: ${T.orange} !important; }
    .voc-card:hover::before { transform: scaleY(1); }

    /* gradient sweep bar */
    .voc-card__bar {
        height: 4px;
        background: linear-gradient(to left, ${T.orange}, ${T.blue});
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.38s cubic-bezier(.4,0,.2,1);
    }
    .voc-card:hover .voc-card__bar { transform: scaleX(1); }

    /* image zoom on card header */
    .voc-card__header-bg {
        transition: transform 0.5s cubic-bezier(.4,0,.2,1);
    }
    .voc-card:hover .voc-card__header-bg { transform: scale(1.04); }

    /* button */
    .voc-btn {
        transition: transform 0.28s, box-shadow 0.28s, background 0.28s;
        cursor: pointer;
    }
    .voc-btn:hover { transform: translateY(-3px) !important; box-shadow: 0 10px 28px rgba(245,124,0,0.38) !important; }

    /* bc link */
    .bc-link { transition: color 0.25s; }
    .bc-link:hover { color: ${T.orange} !important; }

    /* info row items */
    .voc-info-item {
        transition: transform 0.38s cubic-bezier(.4,0,.2,1),
                    box-shadow 0.38s cubic-bezier(.4,0,.2,1),
                    border-color 0.38s cubic-bezier(.4,0,.2,1);
    }
    .voc-info-item::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: linear-gradient(to left, ${T.orange}, ${T.blue});
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.38s cubic-bezier(.4,0,.2,1);
    }
    .voc-info-item:hover { transform: translateY(-6px) !important; box-shadow: 0 14px 36px rgba(8,101,168,0.15) !important; border-color: ${T.blue} !important; }
    .voc-info-item:hover::before { transform: scaleX(1); }

    /* icon circle on info */
    .voc-info-icon {
        transition: background 0.35s, box-shadow 0.35s, transform 0.35s;
    }
    .voc-info-item:hover .voc-info-icon {
        background: linear-gradient(135deg, ${T.orange}, ${T.orangeDark}) !important;
        box-shadow: 0 8px 22px rgba(245,124,0,0.38) !important;
        transform: scale(1.1);
    }

    /* responsive grid */
    .voc-grid { display: grid; gap: clamp(16px,3vw,32px); grid-template-columns: 1fr; }
    @media(min-width: 600px) { .voc-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(min-width: 1025px) { .voc-grid { grid-template-columns: repeat(2, 1fr); } }

    .voc-info-grid { display: grid; gap: clamp(14px,2.5vw,26px); grid-template-columns: 1fr; }
    @media(min-width: 600px) { .voc-info-grid { grid-template-columns: repeat(2, 1fr); } }

    /* mobile diagonal shrink */
    @media(max-width: 480px) {
        .voc-hero::after,
        .voc-cards-section::after,
        .voc-info-section::after { height: 36px; }
    }
`;

function injectStyles() {
    if (document.getElementById('voc-styles')) return;
    const el = document.createElement('style');
    el.id = 'voc-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
}

const sectionInner = {
    maxWidth: 'min(1100px, 94vw)',
    margin: '0 auto',
};

/* ─── Heading pill ─── */
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

const HeadingBar = ({ light = false, align = 'center' }) => (
    <div style={{ display: 'flex', justifyContent: align, marginTop: '10px', marginBottom: 'clamp(28px,4.5vw,50px)' }}>
        <div style={{ width: '52px', height: '4px', background: light ? T.orangeLight : T.orange, borderRadius: '2px' }} />
    </div>
);

/* ─── Main Component ─── */
export default function VocationalTraining() {

    useEffect(() => {
        injectStyles();
        document.title = 'التدريب الحرفي - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    const handleNavigate = (path) => { window.location.href = path; };

    const centers = [
        {
            title: 'مركز جسر السويس',
            description: 'مركز تدريب متخصص يقدم برامج حرفية متنوعة لتطوير المهارات المهنية وتأهيل الكوادر البشرية.',
            path: '/gesr-el-suez',
            icon: '🏢',
            accent: T.orange,
        },
        {
            title: 'مركز تدريب شبرا',
            description: 'مركز تدريب حديث لتطوير المهارات الحرفية وبناء قدرات العاملين وفق أحدث المعايير.',
            path: '/shobra',
            icon: '🏛️',
            accent: T.blue,
        },
    ];

    const infoItems = [
        {
            icon: '📋',
            title: 'برامج متخصصة',
            text: 'نقدم برامج تدريبية متخصصة تهدف إلى تطوير المهارات الحرفية والمهنية.',
        },
        {
            icon: '🎯',
            title: 'معايير الجودة',
            text: 'للارتقاء بمستوى الكفاءة والاحترافية في سوق العمل وفق أعلى المعايير.',
        },
    ];

    return (
        <div className="voc-root">

            {/* ══ FIXED OVERVIEW BAR ══════════════════ */}
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                    <a
                        href="/"
                        style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}
                    >
                        الصفحة الرئيسية
                    </a>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151', marginRight: '8px' }}>التدريب الحرفي</span>
                </div>
            </div>

            {/* ══ HERO ════════════════════════════════ */}
            <section
                className="voc-hero"
                style={{
                    position: 'relative',
                    minHeight: 'clamp(300px,44vw,520px)',
                    background: T.blueDark,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: 'clamp(130px,16vw,180px) clamp(20px,6vw,80px) clamp(90px,12vw,140px)',
                }}
            >
                {/* right orange accent bar */}
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 'clamp(6px,0.8vw,10px)', height: '100%',
                    background: `linear-gradient(to bottom, ${T.orange}, ${T.orangeLight})`,
                }} />

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '720px', width: '100%' }}>
                    <span style={{
                        display: 'inline-block',
                        background: T.orange,
                        color: T.white,
                        fontFamily: T.font,
                        fontSize: 'clamp(10px,1.3vw,14px)',
                        fontWeight: 700,
                        padding: '6px 22px',
                        borderRadius: '2px',
                        marginBottom: 'clamp(12px,2.5vw,24px)',
                        letterSpacing: '0.05em',
                    }}>
                        المعهد التكنولوجي لهندسة التشييد والإدارة
                    </span>

                    <h1 style={{
                        fontSize: 'clamp(24px,4.5vw,58px)',
                        fontWeight: 900,
                        color: T.white,
                        fontFamily: T.font,
                        lineHeight: 1.3,
                        marginBottom: 'clamp(12px,2vw,20px)',
                    }}>
                        التدريب{' '}
                        <span style={{ color: T.orangeLight }}>الحرفي</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(12px,1.6vw,17px)',
                        color: 'rgba(255,255,255,0.65)',
                        fontFamily: T.font,
                        lineHeight: 1.9,
                    }}>
                        اختر المركز المناسب لك لبدء رحلتك في التدريب المهني والحرفي
                    </p>
                </div>
            </section>

            {/* ══ CENTERS CARDS ═══════════════════════
                white bg → diagonal blue cut
            ═══════════════════════════════════════ */}
            <section
                className="voc-cards-section"
                style={{
                    position: 'relative',
                    background: T.white,
                    padding: 'clamp(56px,8vw,100px) clamp(16px,6vw,60px) clamp(100px,14vw,160px)',
                }}
            >
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}>
                        <SectionLabel>مراكز التدريب</SectionLabel><br />
                        <h2 style={{
                            fontSize: 'clamp(20px,3vw,38px)',
                            fontWeight: 900,
                            color: T.black,
                            fontFamily: T.font,
                            lineHeight: 1.35,
                            marginBottom: '10px',
                        }}>
                            اختر <span style={{ color: T.orange }}>مركزك</span>
                        </h2>
                        <HeadingBar />
                    </div>

                    <div className="voc-grid" style={{ maxWidth: '860px', margin: '0 auto' }}>
                        {centers.map((center, index) => (
                            <div
                                key={index}
                                className="voc-card"
                                style={{
                                    background: T.white,
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                    border: `1.5px solid ${T.gray100}`,
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    cursor: 'pointer',
                                }}
                            >
                                {/* Colored header */}
                                <div style={{ overflow: 'hidden' }}>
                                    <div
                                        className="voc-card__header-bg"
                                        style={{
                                            background: center.accent === T.orange
                                                ? `linear-gradient(145deg, ${T.orange}, ${T.orangeDark})`
                                                : `linear-gradient(145deg, ${T.blue}, ${T.blueDark})`,
                                            padding: 'clamp(24px,4vw,40px) clamp(16px,3vw,28px)',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div style={{
                                            fontSize: 'clamp(36px,5vw,52px)',
                                            marginBottom: '12px',
                                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                                        }}>
                                            {center.icon}
                                        </div>
                                        <h2 style={{
                                            fontSize: 'clamp(16px,2vw,22px)',
                                            fontWeight: 900,
                                            color: T.white,
                                            fontFamily: T.font,
                                            margin: 0,
                                            textShadow: '0 2px 6px rgba(0,0,0,0.25)',
                                        }}>
                                            {center.title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Gradient sweep bar */}
                                <div className="voc-card__bar" />

                                {/* Body */}
                                <div style={{
                                    padding: 'clamp(18px,3vw,30px) clamp(16px,2.5vw,26px)',
                                    background: T.gray50,
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 'clamp(14px,2.5vw,24px)',
                                }}>
                                    <p style={{
                                        color: T.gray700,
                                        textAlign: 'center',
                                        lineHeight: 1.85,
                                        fontSize: 'clamp(12px,1.5vw,15px)',
                                        fontFamily: T.font,
                                        margin: 0,
                                    }}>
                                        {center.description}
                                    </p>

                                    <button
                                        className="voc-btn"
                                        onClick={() => handleNavigate(center.path)}
                                        style={{
                                            background: center.accent === T.orange
                                                ? `linear-gradient(135deg, ${T.orange}, ${T.orangeDark})`
                                                : `linear-gradient(135deg, ${T.blue}, ${T.blueDark})`,
                                            color: T.white,
                                            padding: 'clamp(10px,1.5vw,14px) clamp(22px,3vw,38px)',
                                            borderRadius: '3px',
                                            fontWeight: 700,
                                            fontSize: 'clamp(12px,1.5vw,15px)',
                                            border: 'none',
                                            fontFamily: T.font,
                                            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                                            letterSpacing: '0.03em',
                                        }}
                                    >
                                        زيارة المركز ←
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ INFO SECTION ════════════════════════
                blue bg → diagonal black cut
            ═══════════════════════════════════════ */}
            <section
                className="voc-info-section"
                style={{
                    position: 'relative',
                    background: T.blue,
                    padding: 'clamp(80px,12vw,150px) clamp(16px,6vw,60px) clamp(100px,14vw,160px)',
                }}
            >
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}>
                        <SectionLabel light>لماذا نحن</SectionLabel><br />
                        <h2 style={{
                            fontSize: 'clamp(20px,3vw,38px)',
                            fontWeight: 900,
                            color: T.white,
                            fontFamily: T.font,
                            lineHeight: 1.35,
                            marginBottom: '10px',
                        }}>
                            برامج <span style={{ color: T.orangeLight }}>متميزة</span>
                        </h2>
                        <HeadingBar light />
                    </div>

                    <div className="voc-info-grid" style={{ maxWidth: '860px', margin: '0 auto' }}>
                        {infoItems.map((item, i) => (
                            <div
                                key={i}
                                className="voc-info-item"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: '3px',
                                    padding: 'clamp(24px,4vw,38px) clamp(18px,3vw,28px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '16px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    className="voc-info-icon"
                                    style={{
                                        width: 'clamp(56px,7vw,74px)',
                                        height: 'clamp(56px,7vw,74px)',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${T.blue}, ${T.blueLight})`,
                                        border: `2px solid rgba(255,255,255,0.2)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'clamp(24px,3.5vw,34px)',
                                        boxShadow: `0 6px 18px rgba(8,101,168,0.35)`,
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.icon}
                                </div>

                                <h3 style={{
                                    fontSize: 'clamp(15px,2vw,20px)',
                                    fontWeight: 700,
                                    color: T.orangeLight,
                                    fontFamily: T.font,
                                    margin: 0,
                                }}>
                                    {item.title}
                                </h3>

                                <p style={{
                                    color: 'rgba(255,255,255,0.70)',
                                    fontSize: 'clamp(12px,1.5vw,15px)',
                                    fontFamily: T.font,
                                    lineHeight: 1.9,
                                    margin: 0,
                                }}>
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ BLACK CLOSING STRIP ══════════════════ */}
            <div style={{
                background: T.black,
                padding: 'clamp(50px,8vw,100px) clamp(16px,6vw,60px)',
                textAlign: 'center',
            }}>
                <p style={{
                    color: 'rgba(255,255,255,0.3)',
                    fontFamily: T.font,
                    fontSize: 'clamp(11px,1.3vw,14px)',
                }}>
                    المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}
                </p>
            </div>

        </div>
    );
}