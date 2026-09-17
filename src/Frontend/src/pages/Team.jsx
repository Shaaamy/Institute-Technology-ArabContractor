import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

/* ─── Keyframe injection (one-time) ─────── */
const STYLES = `

    .team-root { direction: rtl; font-family: ${T.font}; background: ${T.white}; overflow-x: hidden; }

    /* hero grid overlay */
    .team-hero-grid::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(rgba(245,124,0,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,124,0,0.07) 1px, transparent 1px);
        background-size: 56px 56px;
        pointer-events: none;
    }

    /* card hover effects */
    .team-card { transition: transform 0.38s cubic-bezier(.4,0,.2,1), box-shadow 0.38s cubic-bezier(.4,0,.2,1), border-color 0.38s cubic-bezier(.4,0,.2,1); }
    .team-card:hover { transform: translateY(-8px) !important; box-shadow: 0 18px 48px rgba(0,0,0,0.18) !important; border-color: ${T.orange} !important; }
    .team-card--large:hover { border-color: ${T.blue} !important; box-shadow: 0 20px 56px rgba(8,101,168,0.22) !important; }

    /* right accent bar */
    .team-card::before { content: ''; position: absolute; top:0; right:0; width:4px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform 0.38s cubic-bezier(.4,0,.2,1); z-index:2; border-radius:0; }
    .team-card--large::before { background:${T.blue}; }
    .team-card:hover::before { transform: scaleY(1); }

    /* gradient bar between image and body */
    .team-card__bar { height:4px; background:linear-gradient(to left,${T.orange},${T.blue}); transform:scaleX(0); transform-origin:right; transition:transform 0.38s cubic-bezier(.4,0,.2,1); }
    .team-card:hover .team-card__bar { transform:scaleX(1); }

    /* image zoom */
    .team-card__img { transition: transform 0.5s cubic-bezier(.4,0,.2,1); }
    .team-card:hover .team-card__img { transform:scale(1.06); }

    /* image overlay fade */
    .team-card__overlay { transition: opacity 0.38s cubic-bezier(.4,0,.2,1); }
    .team-card:hover .team-card__overlay { opacity:1 !important; }

    /* name color flip */
    .team-card__name { transition: color 0.3s; }
    .team-card:hover .team-card__name { color:${T.orange} !important; }

    /* social btn */
    .social-btn { transition: background 0.28s, border-color 0.28s, color 0.28s, transform 0.28s; cursor:pointer; }
    .social-btn:hover { background:${T.orange} !important; border-color:${T.orange} !important; color:${T.white} !important; transform:scale(1.18); }

    /* strategy-item hover */
    .strat-item { transition: background 0.35s, border-color 0.35s, transform 0.35s, box-shadow 0.35s; }
    .strat-item::before { content:''; position:absolute; top:0; right:0; width:3px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform 0.38s cubic-bezier(.4,0,.2,1); }
    .strat-item:hover { transform:translateX(5px) !important; background:rgba(255,255,255,0.11) !important; border-color:rgba(245,124,0,0.45) !important; box-shadow:0 8px 28px rgba(0,0,0,0.25) !important; }
    .strat-item:hover::before { transform:scaleY(1); }

    /* breadcrumb link */
    .bc-link { transition:color 0.25s; }
    .bc-link:hover { color:${T.orange} !important; }

    /* responsive grid */
    .team-grid { display:grid; gap:clamp(16px,3vw,32px); justify-items:center; grid-template-columns:1fr; }
    @media(min-width:480px){ .team-grid { grid-template-columns:repeat(2,1fr); } }
    @media(min-width:900px){ .team-grid { grid-template-columns:repeat(3,1fr); } }
    @media(min-width:1441px){ .team-grid { gap:40px; } }

    /* hero diagonal */
    .hero-cut::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.white}; clip-path:polygon(0 100%,100% 0,100% 100%); }
    .chairman-cut::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.blue}; clip-path:polygon(0 100%,100% 0,100% 100%); }
    .team-cut::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.black}; clip-path:polygon(0 100%,100% 0,100% 100%); }
`;

function injectStyles() {
    if (document.getElementById('team-styles')) return;
    const el = document.createElement('style');
    el.id = 'team-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
}

/* ─── Sub-components ─────────────────────── */

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
        fontSize: 'clamp(20px,3vw,38px)',
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

/* ─── Member Card ────────────────────────── */
const MemberCard = ({ member, large = false }) => (
    <motion.div
        className={`team-card ${large ? 'team-card--large' : ''}`}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
            width: '100%',
            maxWidth: large ? '340px' : '300px',
            background: T.white,
            borderRadius: '3px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: T.font,
            position: 'relative',
            border: large ? `2px solid ${T.orange}` : `1.5px solid ${T.gray100}`,
            boxShadow: large
                ? `0 10px 36px rgba(8,101,168,0.18)`
                : `0 2px 12px rgba(0,0,0,0.07)`,
        }}
    >
        {/* Image */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '100%', overflow: 'hidden' }}>
            <img
                src={member.image}
                alt={member.name}
                className="team-card__img"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
                className="team-card__overlay"
                style={{
                    position: 'absolute', inset: 0, opacity: 0,
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(4,68,120,0.55) 100%)',
                }}
            />
        </div>

        {/* Gradient bar */}
        <div className="team-card__bar" />

        {/* Body */}
        <div style={{ padding: 'clamp(14px,2.5vw,22px) clamp(12px,2vw,18px) 8px', textAlign: 'center', flex: 1 }}>
            <h3
                className="team-card__name"
                style={{
                    fontSize: large ? 'clamp(16px,2vw,20px)' : 'clamp(14px,1.8vw,18px)',
                    fontWeight: 700,
                    color: T.blue,
                    fontFamily: T.font,
                    marginBottom: '6px',
                }}
            >
                {member.name}
            </h3>
            <p style={{
                fontSize: 'clamp(11px,1.4vw,14px)',
                color: T.gray500,
                fontFamily: T.font,
                lineHeight: 1.65,
                minHeight: '38px',
            }}>
                {member.role}
            </p>
        </div>

        {/* Social icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '10px 12px 16px' }}>
            {['f', '✉', '📞'].map((icon, i) => (
                <span
                    key={i}
                    className="social-btn"
                    style={{
                        width: 'clamp(28px,3.5vw,34px)',
                        height: 'clamp(28px,3.5vw,34px)',
                        borderRadius: '50%',
                        background: T.white,
                        border: `1.5px solid ${T.gray300}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'clamp(11px,1.4vw,14px)',
                        color: T.gray700,
                    }}
                >
                    {icon}
                </span>
            ))}
        </div>
    </motion.div>
);

/* ─── Main Component ─────────────────────── */
const Team = () => {

    useEffect(() => {
        injectStyles();
        document.title = 'فريق العمل - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    const chairman = {
        name: 'أحمد العصار',
        role: 'رئيس مجلس الإدارة',
        image: '/images/team4.jpg',
    };

    const teamMembers = [
        { name: 'شريف حمدي', role: 'مدير المعهد', image: '/images/team1.jpg' },
        { name: 'هبه عادل', role: 'نائب مدير المعهد للشئون العلمية والجودة', image: '/images/team2.jpg' },
        { name: 'طارق منصور', role: 'نائب مدير المعهد للشئون الفنية والاختبارات', image: '/images/team3.jpg' },
    ];

    const sectionInner = {
        maxWidth: 'min(1280px, 94vw)',
        margin: '0 auto',
    };

    return (
        <div className="team-root">

            {/* ══ FIXED OVERVIEW BAR ══════════════════ */}
            <div style={{
                position: 'fixed',
                top: 70,
                zIndex: 40,
                width: '100%',
                borderBottom: `1px solid ${T.gray300}`,
                backgroundColor: '#f5f5f5',
                padding: '8px 16px',
                fontFamily: T.font,
            }}>
                <div style={{ textAlign: 'center' }}>
                    <span>
                        <a href="/" style={{ fontWeight: 700, textDecoration: 'none', color: T.gray700, marginLeft: '12px' }}>الصفحة الرئيسية</a>
                        <span style={{ color: T.gray500, margin: '0 6px' }}> - </span>
                        <span style={{ color: T.gray700, marginRight: '12px' }}>فريق العمل</span>
                    </span>
                </div>
            </div>

            {/* ══ HERO ════════════════════════════════ */}
            <section
                className="team-hero-grid hero-cut"
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
                        فريق{' '}
                        <span style={{ color: T.orangeLight }}>العمل</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(12px,1.6vw,17px)',
                        color: 'rgba(255,255,255,0.65)',
                        fontFamily: T.font,
                        lineHeight: 1.9,
                    }}>
                        لدينا فريق عمل على أعلى مستوى من الكفاءة والخبرة
                    </p>
                </div>
            </section>

            {/* ══ CHAIRMAN SECTION ════════════════════
                white bg → diagonal blue cut
            ═══════════════════════════════════════ */}
            <section
                className="chairman-cut"
                style={{
                    position: 'relative',
                    background: T.white,
                    padding: 'clamp(56px,8vw,100px) clamp(16px,6vw,60px) clamp(100px,14vw,160px)',
                }}
            >
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
                        <SectionLabel>القيادة العليا</SectionLabel><br />
                        <SectionHeading>
                            رئيس <span style={{ color: T.orange }}>مجلس الإدارة</span>
                        </SectionHeading>
                        <HeadingBar />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <MemberCard member={chairman} large={true} />
                    </div>
                </div>
            </section>

            {/* ══ ORG CONNECTOR ════════════════════════ */}
            <div style={{
                position: 'relative', zIndex: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                marginTop: '-28px', marginBottom: '-28px',
                pointerEvents: 'none',
            }}>
                <div style={{
                    width: '2px',
                    height: 'clamp(40px,6vw,70px)',
                    background: `linear-gradient(to bottom, ${T.white}, ${T.orangeLight})`,
                    opacity: 0.7,
                }} />
                <div style={{
                    width: '12px', height: '12px',
                    borderRadius: '50%',
                    background: T.orange,
                    boxShadow: `0 0 0 4px rgba(245,124,0,0.25)`,
                }} />
            </div>

            {/* ══ TEAM MEMBERS SECTION ════════════════
                blue bg → diagonal black cut
            ═══════════════════════════════════════ */}
            <section
                className="team-cut"
                style={{
                    position: 'relative',
                    background: T.blue,
                    padding: 'clamp(80px,12vw,150px) clamp(16px,6vw,60px) clamp(100px,14vw,160px)',
                }}
            >
                <div style={sectionInner}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,56px)' }}>
                        <SectionLabel light>الإدارة التنفيذية</SectionLabel><br />
                        <SectionHeading light>
                            القيادات{' '}
                            <span style={{ color: T.orangeLight }}>التنفيذية</span>
                        </SectionHeading>
                        <HeadingBar light />
                    </div>

                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <MemberCard key={index} member={member} />
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
};

export default Team;