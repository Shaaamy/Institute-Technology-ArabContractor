import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle, Users, Target, Lightbulb, Award, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

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

/* ─── Injected styles ────────────────────── */
const STYLES = `
* { box-sizing:border-box; }    html { scroll-behavior:smooth; }

    ::-webkit-scrollbar { width:8px; }
    ::-webkit-scrollbar-track { background:#f1f1f1; }
    ::-webkit-scrollbar-thumb { background:linear-gradient(to bottom,${T.orange},${T.blue}); border-radius:4px; }

    .flc-progress { position:fixed; top:0; left:0; right:0; height:4px; background:#e5e7eb; z-index:1001; }

    /* hero grid */
    .flc-hero::before {
        content:''; position:absolute; inset:0;
        background-image: linear-gradient(rgba(245,124,0,.07) 1px,transparent 1px), linear-gradient(90deg,rgba(245,124,0,.07) 1px,transparent 1px);
        background-size:56px 56px; pointer-events:none;
    }

    /* diagonal cuts */
    .flc-hero::after      { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.white};  clip-path:polygon(0 100%,100% 0,100% 100%); }
    .flc-about::after     { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.blue};   clip-path:polygon(0 100%,100% 0,100% 100%); }
    .flc-role::after      { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.gray50}; clip-path:polygon(0 100%,0 0,100% 100%); }
    .flc-proposals::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:clamp(40px,8vw,110px); background:${T.black};  clip-path:polygon(0 100%,100% 0,100% 100%); }

    /* stat cards */
    .flc-stat { transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s; }
    .flc-stat:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(0,0,0,.22); }

    /* responsibility card */
    .flc-resp { transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s,border-color .35s; position:relative; overflow:hidden; }
    .flc-resp::before { content:''; position:absolute; top:0; right:0; width:4px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform .38s cubic-bezier(.4,0,.2,1); }
    .flc-resp:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,.12); border-color:${T.orange} !important; }
    .flc-resp:hover::before { transform:scaleY(1); }

    /* proposal card */
    .flc-prop { transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .35s; position:relative; overflow:hidden; }
    .flc-prop-o::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:${T.orange}; transform:scaleX(0); transform-origin:right; transition:transform .38s cubic-bezier(.4,0,.2,1); }
    .flc-prop-b::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:${T.blue};   transform:scaleX(0); transform-origin:right; transition:transform .38s cubic-bezier(.4,0,.2,1); }
    .flc-prop-k::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:${T.black};  transform:scaleX(0); transform-origin:right; transition:transform .38s cubic-bezier(.4,0,.2,1); }
    .flc-prop-m::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to left,${T.orange},${T.blue}); transform:scaleX(0); transform-origin:right; transition:transform .38s cubic-bezier(.4,0,.2,1); }
    .flc-prop:hover { transform:translateY(-5px); box-shadow:0 14px 36px rgba(0,0,0,.14); }
    .flc-prop:hover::before { transform:scaleX(1); }

    /* bc link */
    .flc-bc:hover { color:${T.orange} !important; }

    /* image zoom */
    .flc-imgw { overflow:hidden; }
    .flc-imgw img { transition:transform .5s cubic-bezier(.4,0,.2,1); }
    .flc-imgw:hover img { transform:scale(1.05); }

    /* grids */
    .flc-stats-grid    { display:grid; gap:clamp(14px,2.5vw,24px); grid-template-columns:repeat(2,1fr); max-width:560px; margin:0 auto; }
    .flc-about-grid    { display:grid; grid-template-columns:1fr; }
    .flc-prop-grid     { display:grid; gap:clamp(12px,2vw,20px); grid-template-columns:1fr; }

    @media(min-width:640px)  { .flc-prop-grid  { grid-template-columns:repeat(2,1fr); } }
    @media(min-width:1024px) { .flc-about-grid { grid-template-columns:3fr 2fr; } .flc-prop-grid { grid-template-columns:repeat(3,1fr); } }
    @media(min-width:1441px) { .flc-prop-grid  { grid-template-columns:repeat(4,1fr); } }
    @media(max-width:480px)  {
        .flc-hero::after,.flc-about::after,.flc-role::after,.flc-proposals::after { height:36px; }
        .flc-stats-grid { grid-template-columns:1fr; max-width:280px; }
    }
`;

function injectStyles() {
    if (document.getElementById('flc-styles')) return;
    const el = document.createElement('style');
    el.id = 'flc-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
}

const si = { maxWidth: 'min(1280px,94vw)', margin: '0 auto' };

/* ── Shared atoms ── */
const Eyebrow = ({ light, children }) => (
    <span style={{
        display: 'inline-block',
        background: light ? 'rgba(255,255,255,0.12)' : T.orange,
        color: light ? T.orangeLight : T.white,
        fontFamily: T.font, fontSize: 'clamp(10px,1.2vw,13px)', fontWeight: 700,
        padding: '5px 18px', borderRadius: '2px', marginBottom: '10px', letterSpacing: '0.05em',
    }}>{children}</span>
);

const Bar = ({ light, center }) => (
    <div style={{ display: 'flex', justifyContent: center ? 'center' : 'flex-start', marginTop: '10px', marginBottom: 'clamp(24px,4vw,44px)' }}>
        <div style={{ width: '52px', height: '4px', background: light ? T.orangeLight : T.orange, borderRadius: '2px' }} />
    </div>
);

/* ── ResponsibilityCard ── */
const ResponsibilityCard = ({ title, items, isExpandable = false }) => {
    const [open, setOpen] = useState(!isExpandable);
    return (
        <div className="flc-resp" style={{ background: T.white, border: `1.5px solid ${T.gray100}`, marginBottom: '2px' }}>
            <div style={{ padding: 'clamp(14px,2.5vw,22px)', cursor: isExpandable ? 'pointer' : 'default' }}
                onClick={() => isExpandable && setOpen(!open)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                        <div style={{
                            width: 'clamp(36px,5vw,44px)', height: 'clamp(36px,5vw,44px)', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: `linear-gradient(135deg,${T.orange},${T.blue})`, borderRadius: '3px',
                            boxShadow: `0 4px 12px rgba(245,124,0,.28)`,
                        }}>
                            <CheckCircle size={18} color={T.white} />
                        </div>
                        <h3 style={{ fontSize: 'clamp(13px,1.8vw,17px)', fontWeight: 700, color: T.black, fontFamily: T.font, lineHeight: 1.5, paddingTop: '6px' }}>
                            {title}
                        </h3>
                    </div>
                    {isExpandable && (
                        <div style={{
                            width: '30px', height: '30px', flexShrink: 0, borderRadius: '2px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: open ? T.orange : T.gray100, transition: 'background .3s',
                        }}>
                            <ChevronDown size={16} color={open ? T.white : T.gray700}
                                style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }} />
                        </div>
                    )}
                </div>
                {open && (
                    <ul style={{ borderRight: `4px solid ${T.orange}`, paddingRight: '16px', marginTop: '14px' }}>
                        {items.map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingBottom: '8px', color: T.gray700 }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.blue, flexShrink: 0, marginTop: '6px' }} />
                                <span style={{ fontSize: 'clamp(12px,1.5vw,15px)', lineHeight: 1.85, fontFamily: T.font }}>{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

/* ── ProposalCard ── */
const colorCls = { orange: 'flc-prop-o', blue: 'flc-prop-b', black: 'flc-prop-k', mixed: 'flc-prop-m' };
const iconBgMap = {
    orange: T.orange,
    blue: T.blue,
    black: T.black,
    mixed: `linear-gradient(135deg,${T.orange},${T.blue})`,
};
const borderMap = {
    orange: 'rgba(245,124,0,.22)',
    blue: 'rgba(8,101,168,.22)',
    black: 'rgba(10,10,10,.18)',
    mixed: 'rgba(245,124,0,.22)',
};

const ProposalCard = ({ title, description, subitems, color = 'orange' }) => (
    <div className={`flc-prop ${colorCls[color]}`} style={{
        background: T.white, border: `1.5px solid ${borderMap[color]}`,
        borderRadius: '3px', padding: 'clamp(16px,3vw,24px)',
    }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
            <div style={{
                width: 'clamp(34px,4.5vw,42px)', height: 'clamp(34px,4.5vw,42px)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: iconBgMap[color], borderRadius: '3px',
                boxShadow: '0 4px 12px rgba(0,0,0,.18)',
            }}>
                <Sparkles size={16} color={T.white} />
            </div>
            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 'clamp(12px,1.6vw,15px)', fontWeight: 700, color: T.black, fontFamily: T.font, marginBottom: '6px', lineHeight: 1.5 }}>
                    {title}
                </h3>
                {description && (
                    <p style={{ fontSize: 'clamp(11px,1.4vw,13px)', color: T.gray500, fontFamily: T.font, lineHeight: 1.85 }}>
                        {description}
                    </p>
                )}
                {subitems && (
                    <ul style={{ marginTop: '8px' }}>
                        {subitems.map((item, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingBottom: '4px' }}>
                                <ArrowRight size={12} color={T.orange} style={{ marginTop: '4px', flexShrink: 0 }} />
                                <span style={{ fontSize: 'clamp(11px,1.4vw,13px)', fontFamily: T.font, lineHeight: 1.8, color: T.gray700 }}>{item}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </div>
);

/* ── Main ── */
export default function FutureLeadersCouncil() {
    const [prog, setProg] = useState(0);

    useEffect(() => {
        injectStyles();
        document.title = 'مجلس قادة المستقبل - المعهد التكنولوجي لهندسة التشييد والإدارة';
        const onScroll = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setProg((window.scrollY / total) * 100);
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const proposals = [
        { title: 'مقترح لتوفير الوقود ( بنزين - سولار )', subitems: ['تحويل الخلاطات للعمل بالغاز الطبيعي', 'تركيب أجهزة GPS', 'استخدام خلايا الهيدروجين'], color: 'orange' },
        { title: 'تفعيل قسم الجودة في جميع مراحل التصنيع', description: 'من بداية اختبار العينات وحتى خروج المصنعات', color: 'blue' },
        { title: 'إنشاء قاعدة بيانات شاملة للمشروعات', description: 'تكون بمثابة دليل مرجعي للمشروعات القادمة ( الدروس المستفادة )', color: 'black' },
        { title: 'مقترح نظام الحماية الكاملة للمعدات', description: 'من السرقة وخلافه من خلال تكنولوجيا المعلومات', color: 'mixed' },
        { title: 'عمل خطة احتياجات للموارد البشرية', subitems: ['قاعدة بيانات محدثة للفنيين', 'توفير عمالة يومية مؤقته', 'اعادة التوزيع الجغرافي للعمالة'], color: 'orange' },
        { title: 'الإهتمام بالبيئة المحيطة بالمشروعات', description: 'توفير أماكن للتخلص من المخلفات والزيوت وعمل أرضيات خرسانية مناسبة', color: 'blue' },
        { title: 'استخدام الطاقة الشمسية', description: 'وكيفية الاستفادة منها لتقليل التكاليف', color: 'black' },
        { title: 'مقترح لإيجاد مصادر أخرى لزيادة الإيراد', description: 'عن طريق تعظيم الإستفادة من الأصول العقارية والأراضي', color: 'mixed' },
        { title: 'مقترح لانشاء ورشة للسلامة', description: 'تقوم بعمل مهمات السلامة من بواقي عمليات الانشاء', color: 'orange' },
        { title: 'مقترح بانشاء تطبيق على المحمول', description: 'للدليل التنظيمي للشركة', color: 'blue' },
        { title: 'استغلال ناتج الكشط في خلاطات الاسفلت', description: 'لتوفير الخامات بنسبة توفير ٤٠٪', color: 'mixed' },
        { title: 'الاستغلال الأمثل للـ Cloud computing', description: 'في تخزين البيانات', color: 'orange' },
        { title: 'استغلال كميات هالك الكاوتش', subitems: ['انشاء مصنع لاعادة تدوير الكاوتش', 'انتاج خلطة خرسانية مطاطية'], color: 'blue' },
        { title: 'دورات في اللغة الانجليزية', description: 'عقد دورات لرفع الكفاءة اللغوية للعاملين في المشروعات المشتركة', color: 'black' },
        { title: 'تطبيق كتابة الخطابات باللغتين', description: 'العربية والانجليزية معاً لرفع مستوى اللغة', color: 'mixed' },
    ];

    return (
        <div dir="rtl" style={{ fontFamily: T.font, background: T.white, overflowX: 'hidden' }}>

            {/* scroll progress */}
            <div className="flc-progress">
                <div style={{ height: '100%', width: `${prog}%`, background: `linear-gradient(to right,${T.orange},${T.blue})`, transition: 'width .2s' }} />
            </div>

            {/* ══ FIXED OVERVIEW BAR ══════════════════ */}
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: T.font, fontSize: '1rem' }}>
                    <a href="/" className="flc-bc"
                        style={{ color: T.blue, fontWeight: 700, textDecoration: 'none', marginLeft: '8px', transition: 'color .25s' }}
                        onMouseEnter={e => e.target.style.color = T.orange}
                        onMouseLeave={e => e.target.style.color = T.blue}
                    >
                        الصفحة الرئيسية
                    </a>
                    <span style={{ color: T.gray500, margin: '0 6px' }}>•</span>
                    <span style={{ color: T.gray700, marginRight: '8px' }}>مجلس قادة المستقبل</span>
                </div>
            </div>

            {/* ══ HERO ════════════════════════════════ */}
            <section className="flc-hero" style={{
                position: 'relative', overflow: 'hidden', background: T.blueDark,
                minHeight: 'clamp(320px,46vw,540px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 'clamp(130px,16vw,180px) clamp(20px,6vw,80px) clamp(90px,13vw,150px)',
            }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 'clamp(6px,.8vw,10px)', height: '100%', background: `linear-gradient(to bottom,${T.orange},${T.orangeLight})` }} />

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', width: '100%' }}>
                    <Eyebrow>برنامج تطوير القيادات</Eyebrow>
                    <h1 style={{ fontSize: 'clamp(24px,4.5vw,58px)', fontWeight: 900, color: T.white, fontFamily: T.font, lineHeight: 1.3, margin: 'clamp(10px,2vw,18px) 0' }}>
                        مجلس قادة <span style={{ color: T.orangeLight }}>المستقبل</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(12px,1.7vw,18px)', color: 'rgba(255,255,255,.68)', fontFamily: T.font, lineHeight: 2, maxWidth: '640px', margin: '0 auto clamp(24px,4vw,40px)' }}>
                        نؤمن بأن الاستثمار في شباب الشركة هو الاستثمار في مستقبلها، من خلال برنامج متكامل لتطوير المهارات القيادية والإدارية.
                    </p>

                    <div className="flc-stats-grid">
                        {[
                            { num: '30', label: 'فرع / إدارة', accent: T.orange },
                            { num: '9', label: 'أعضاء لكل مجلس', accent: T.blueLight },
                        ].map((s, i) => (
                            <div key={i} className="flc-stat" style={{
                                background: 'rgba(255,255,255,.07)', border: `2px solid ${s.accent}`,
                                borderRadius: '3px', padding: 'clamp(16px,3vw,28px) clamp(12px,2vw,20px)', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: s.accent, fontFamily: T.font, lineHeight: 1 }}>{s.num}</div>
                                <div style={{ fontSize: 'clamp(11px,1.4vw,14px)', fontWeight: 700, color: 'rgba(255,255,255,.7)', fontFamily: T.font, marginTop: '8px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ ABOUT ═══════════════════════════════
                white bg → diagonal blue cut
            ═══════════════════════════════════════ */}
            <section className="flc-about" style={{
                position: 'relative', background: T.white,
                padding: 'clamp(56px,8vw,100px) clamp(16px,6vw,60px) clamp(100px,14vw,160px)',
            }}>
                <div style={si}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,46px)' }}>
                        <Eyebrow>نبذة عن المجلس</Eyebrow>
                        <h2 style={{ fontSize: 'clamp(20px,3vw,38px)', fontWeight: 900, color: T.black, fontFamily: T.font, lineHeight: 1.35, marginBottom: '10px' }}>
                            عن <span style={{ color: T.orange }}>المجلس</span>
                        </h2>
                        <Bar center />
                    </div>

                    <div className="flc-about-grid" style={{ border: `2px solid ${T.orange}`, borderRadius: '3px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.10)' }}>
                        {/* Text */}
                        <div style={{ padding: 'clamp(24px,4vw,48px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: 'clamp(40px,5vw,52px)', height: 'clamp(40px,5vw,52px)', background: T.blue, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Users size={22} color={T.white} />
                                </div>
                                <h2 style={{ fontSize: 'clamp(18px,2.5vw,28px)', fontWeight: 900, color: T.black, fontFamily: T.font }}>عن المجلس</h2>
                            </div>
                            <p style={{ fontSize: 'clamp(13px,1.6vw,16px)', color: T.gray700, lineHeight: 2, fontFamily: T.font }}>
                                إضافة إلى دور المعهد في المساهمة في أهداف الشركة الاستراتيجية وبالتحديد في تدريب الصف الثاني ورعاية المهارات الإدارية لشباب العاملين وتأهيلهم كقادة المستقبل، صدر قرار رئيس مجلس الإدارة رقم 352 لسنة 2016 بتاريخ 15/05/2016 بعقد مجالس قادة المستقبل.
                            </p>
                            <p style={{ fontSize: 'clamp(13px,1.6vw,16px)', color: T.gray700, lineHeight: 2, fontFamily: T.font }}>
                                يعتبر المجلس بمثابة صورة مصغرة للمجلس التنفيذي للفروع والإدارات، ويتشكل بعضوية مهندسين – ماليين – إداريين – بالإضافة إلى ممثل المؤهلات المتوسطة (مشرفي التنفيذ – المهن العمالية).
                            </p>
                            <div style={{ borderRight: `4px solid ${T.blue}`, paddingRight: '16px', background: T.gray50, padding: '16px', borderRadius: '0 3px 3px 0' }}>
                                <p style={{ fontSize: 'clamp(12px,1.5vw,15px)', color: T.gray700, lineHeight: 1.95, fontFamily: T.font }}>
                                    تم مخاطبة عدد 30 فرع / إدارة لترشيح أعضاء للمجلس بما لا يزيد عن 9 أعضاء لكل مجلس، وتكون مدة العضوية سنتين ماليتين.
                                </p>
                            </div>
                        </div>
                        {/* Image */}
                        <div className="flc-imgw" style={{ position: 'relative', minHeight: 'clamp(240px,32vw,420px)' }}>
                            <img src="/images/leaders-01.jpg" alt="Future Leaders"
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom,transparent 50%,rgba(4,68,120,.6) 100%)` }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ ROLE ════════════════════════════════
                blue bg → diagonal gray cut
            ═══════════════════════════════════════ */}
            <section className="flc-role" style={{
                position: 'relative', background: T.blue,
                padding: 'clamp(80px,12vw,150px) clamp(16px,6vw,60px) clamp(100px,14vw,160px)',
            }}>
                <div style={si}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,46px)' }}>
                        <Eyebrow light>مهام ومسؤوليات</Eyebrow>
                        <h2 style={{ fontSize: 'clamp(20px,3vw,38px)', fontWeight: 900, color: T.white, fontFamily: T.font, lineHeight: 1.35, marginBottom: '10px' }}>
                            دور المعهد <span style={{ color: T.orangeLight }}>في المجلس</span>
                        </h2>
                        <Bar light center />
                    </div>
                    <p style={{ fontSize: 'clamp(13px,1.6vw,16px)', color: 'rgba(255,255,255,.72)', fontFamily: T.font, lineHeight: 2, textAlign: 'center', marginBottom: 'clamp(24px,4vw,36px)' }}>
                        تفعيلًا لدور المعهد في الإشراف على مجالس قادة المستقبل، يقوم ممثلو المعهد بالمهام التالية:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <ResponsibilityCard
                            title="الإدارة الفعالة للاجتماعات"
                            items={["الحرص على أن ينعقد المجلس إداريًا طبقًا للأعراف والإجراءات المعمول بها (استكمال الأجندة وفقًا للنموذج الموضوع — استكمال النصاب القانوني للأعضاء — الالتزام بقرار مجلس الإدارة في هذا الصدد)."]}
                        />
                        <ResponsibilityCard
                            title="متابعة تنفيذ مهام ومسؤوليات المشاركين"
                            isExpandable={true}
                            items={[
                                "دراسة جدول الأعمال وأي وثائق أخرى والتأكد من استكمال بحث الموضوعات والاستعداد التام للاجتماع.",
                                "متابعة أهداف الاجتماع وتحديدها والتأكد من عدم انحرافها عن أجندة العمل.",
                                "متابعة الاستراتيجية المتبعة في الاجتماع والإصغاء بعناية والمساهمة في الوقت المناسب.",
                                "معرفة الإجراءات أو القواعد التي سيسير الاجتماع وفقها والسيطرة على ردود الأفعال الشخصية.",
                                "تدوين الملاحظات والمشاركة في النقاش الجاد الفعال والمساعدة في اتخاذ القرارات.",
                                "الحرص على الحيادية والتقيد بالموضوع في مناقشة مجالات الاجتماع.",
                                "تدريب أعضاء المجلس على مهارات العرض Presentation.",
                            ]}
                        />
                        <ResponsibilityCard
                            title="متابعة مقرر المجلس في تنفيذ مهامه"
                            isExpandable={true}
                            items={[
                                "التأكد من اتخاذ كافة الترتيبات الإدارية بشكل مناسب ومن سيرها بسلاسة.",
                                "تدوين ملاحظات دقيقة عن الفعاليات وكتابة محضر ليكون سجلًا دائمًا ورسميًا.",
                                "مساعدة رئيس الاجتماع طوال الاجتماع والاحتفاظ بكافة الوثائق ذات العلاقة.",
                                "إجراءات التحضير قبل الاجتماع وتجهيز أجندة الاجتماع.",
                            ]}
                        />
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            border: `2px solid ${T.orange}`, background: 'rgba(255,255,255,.07)',
                            padding: 'clamp(14px,2.5vw,20px)',
                        }}>
                            <div style={{ width: '40px', height: '40px', flexShrink: 0, background: T.orange, borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUp size={20} color={T.white} />
                            </div>
                            <span style={{ fontSize: 'clamp(13px,1.7vw,16px)', fontWeight: 700, color: T.white, fontFamily: T.font }}>
                                تقييم اجتماعات قادة المستقبل دوريًا
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ PROPOSALS ═══════════════════════════
                gray bg → diagonal black cut
            ═══════════════════════════════════════ */}
            <section className="flc-proposals" style={{
                position: 'relative', background: T.gray50,
                padding: 'clamp(80px,12vw,150px) clamp(16px,6vw,60px) clamp(100px,14vw,160px)',
            }}>
                <div style={si}>
                    <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,46px)' }}>
                        <Eyebrow>مبادرات مبتكرة</Eyebrow>
                        <h2 style={{ fontSize: 'clamp(20px,3vw,38px)', fontWeight: 900, color: T.black, fontFamily: T.font, lineHeight: 1.35, marginBottom: '6px' }}>
                            مقترحات <span style={{ color: T.orange }}>قادة المستقبل</span>
                        </h2>
                        <p style={{ fontSize: 'clamp(12px,1.5vw,15px)', color: T.gray500, fontFamily: T.font }}>
                            لتطوير العمل وتحسين الأداء
                        </p>
                        <Bar center />
                    </div>

                    <div className="flc-prop-grid">
                        {proposals.map((p, i) => <ProposalCard key={i} {...p} />)}
                    </div>
                </div>
            </section>

            {/* ══ BLACK STRIP ══════════════════════════ */}
            <div style={{ background: T.black, padding: 'clamp(50px,8vw,100px) clamp(16px,6vw,60px)', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,.3)', fontFamily: T.font, fontSize: 'clamp(11px,1.3vw,14px)' }}>
                    المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}