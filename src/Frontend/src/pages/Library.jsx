import React, { useState, useEffect } from 'react';
import { BookOpen, Check, Search, Calendar, Tag, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Clock, Award, Star, Globe, Users, Building } from 'lucide-react';

export default function ModernLibrary() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        document.title = 'المكتبة - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    useEffect(() => {
        const hash = window.location.hash;
        if (!hash) return;
        const id = hash.replace('#', '');
        const attempt = (tries = 0) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            else if (tries < 10) setTimeout(() => attempt(tries + 1), 150);
        };
        attempt();
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleScroll = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            if (total > 0) setScrollProgress((window.scrollY / total) * 100);
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('resize', handleResize); window.removeEventListener('scroll', handleScroll); };
    }, []);

    const isTiny = windowWidth < 400;
    const isMobile = windowWidth <= 640;
    const isTablet = windowWidth > 640 && windowWidth <= 1024;
    const isDesktop = windowWidth > 1024;

    const stats = [
        { icon: BookOpen, label: 'كتاب متاح', value: '4200+', color: '#0865a8' },
        { icon: TrendingUp, label: 'مجال علمي', value: '23', color: '#f57c00' },
        { icon: Clock, label: 'مادة علمية', value: '2500+', color: '#0865a8' },
        { icon: Award, label: 'سنوات خبرة', value: '55+', color: '#f57c00' },
    ];

    const features = [
        { text: "تضم المكتبة أكثر من 4200 كتاب في جميع مجالات العلوم الهندسية (مدنية – معمارية – ميكانيكا – كهرباء – صحي – مساحة – طرق – مائية) إلى جانب العلوم الأخرى (الإدارة – الاقتصاد – القانون – المحاسبة – السلامة والصحة المهنية – البيئة – الحاسب الآلي).", color: '#0865a8' },
        { text: "تحتوي المكتبة على أكثر من 2500 مادة علمية متخصصة تغطي 23 مجالاً وفق مصفوفة المجالات التدريبية، تم إعدادها من قبل خبراء الشركة بهدف نقل الخبرات المختلفة إلى جميع العاملين.", color: '#f57c00' },
        { text: "جميع كتب المكتبة مصنفة وفقاً لتصنيف ديوي العشري العالمي، مع قاعدة بيانات متكاملة تتيح أنظمة البحث والاسترجاع لجميع المستفيدين.", color: '#0865a8' },
        { text: "تصدر المكتبة أدلة علمية متخصصة يُعدّها المتخصصون في مجالات الهندسة المدنية والعمارة والميكانيكا والمساحة والهندسة الصحية والمهارات الإدارية والمالية.", color: '#f57c00' },
    ];

    const platforms = [
        { name: 'Le Moniteur', icon: Globe, desc: 'منصة الإنشاء والبناء الفرنسية' },
        { name: 'Global Tenders', icon: TrendingUp, desc: 'منصة المناقصات العالمية' },
        { name: 'Construct Africa', icon: Building, desc: 'منصة التشييد الأفريقية' },
        { name: 'بوابة قوانين الشرق', icon: BookOpen, desc: '5 منظومات قانونية متخصصة لـ 3 إدارات' },
    ];

    const subscriptionInfo = [
        { label: 'خدمات لموظفي الشركة', value: 'مجاناً', color: '#0865a8' },
        { label: 'اشتراك شهري (خارجي)', value: '40 جنيه', color: '#f57c00' },
        { label: 'اشتراك سنوي (خارجي)', value: '400 جنيه', color: '#0865a8' },
        { label: 'حد الاستعارة', value: '3 كتب / 15 يوم', color: '#f57c00' },
    ];

    const books = [
        { title: "Capture and reuse of project knowledge in construction", publisher: "Willy-Blackwell", image: "https://www.arabcont.com/icemt/assets/images/Book01.jpg", url: "https://online.fliphtml5.com/cvhml/vzfl/#p=1", color: '#0865a8' },
        { title: "ICE manual of highway design and management", publisher: "Second Edition", image: "https://www.arabcont.com/icemt/assets/images/Book02.jpg", url: "https://online.fliphtml5.com/cvhml/qzxx/#p=1", color: '#f57c00' },
        { title: "Construction Dewatering and Groundwater Control", publisher: "Third Edition", image: "https://www.arabcont.com/icemt/assets/images/Book03.jpg", url: "https://online.fliphtml5.com/cvhml/wdbx/#p=1", color: '#0865a8' },
    ];

    const embassyGoals = [
        'تطوير مهارات البحث العلمي لرواد السفارة',
        'تشجيع التعلم الذاتي وتنمية المهارات في شتى المجالات',
        'تنظيم ورش عمل تفاعلية في مجالات علمية وأدبية وفنية',
        'ربط المكتبة بالتدريب وتطوير المنظومة التدريبية',
        'تزويد المتدربين بأحدث الكتب والمراجع العلمية',
        'البث المباشر للفعاليات والمؤتمرات من مكتبة الإسكندرية',
    ];

    // ── Embassy definition images (horizontal scroll) ──
    const embassyDefImages = [
        { src: '/images/library/im1.jpeg' },
        { src: '/images/library/im2.jpeg' },
        { src: '/images/library/im3.jpeg' },
    ];

    const pad = isTiny ? '28px 10px' : isMobile ? '40px 14px' : isTablet ? '60px 24px' : '80px 40px';
    const containerStyle = { maxWidth: '1400px', margin: '0 auto', width: '100%' };
    const sectionStyle = (bg = 'white') => ({ padding: pad, background: bg, boxSizing: 'border-box' });
    const sectionHeaderStyle = { textAlign: 'center', marginBottom: isMobile ? '28px' : '48px' };
    const sectionTitleStyle = { fontSize: isTiny ? '22px' : isMobile ? '26px' : isTablet ? '32px' : '38px', fontWeight: '800', color: '#000', marginBottom: '10px', lineHeight: 1.2 };
    const sectionSubStyle = { fontSize: isMobile ? '14px' : '17px', color: '#6b7280' };
    const cardBase = { background: 'white', borderRadius: isMobile ? '14px' : '20px', border: '2px solid #e5e7eb', padding: isTiny ? '14px' : isMobile ? '18px' : '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', boxSizing: 'border-box' };
    const cols = (tiny, mob, tab, desk) => isTiny ? tiny : isMobile ? mob : isTablet ? tab : desk;

    return (
        <div style={{ minHeight: '100vh', background: 'white', fontFamily: '"Noto Kufi Arabic", serif', direction: 'rtl', overflowX: 'hidden' }}>

            {/* Progress bar */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: '#e5e7eb', zIndex: 9999 }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right, #f57c00, #0865a8)', width: `${scrollProgress}%`, transition: 'width 0.3s ease' }} />
            </div>

            {/* Nav */}
            <div style={{ position: 'fixed', top: 4, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: isMobile ? '8px 12px' : '8px 20px', boxSizing: 'border-box' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic", serif', fontSize: isTiny ? '13px' : '1rem' }}>
                    <a href="/" style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>الصفحة الرئيسية</a>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151' }}>المكتبة</span>
                </div>
            </div>

            {/* ══ HERO ══ */}
            <section style={{ ...sectionStyle('white'), paddingTop: isMobile ? '72px' : '120px', textAlign: 'center' }}>
                <div style={containerStyle}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? '72px' : '100px', height: isMobile ? '72px' : '100px', background: 'linear-gradient(135deg, #0865a8, #f57c00)', borderRadius: isMobile ? '20px' : '28px', marginBottom: '20px', boxShadow: '0 16px 48px rgba(8,101,168,0.35)' }}>
                        <BookOpen style={{ width: isMobile ? '34px' : '48px', height: isMobile ? '34px' : '48px', color: 'white' }} />
                    </div>
                    <h1 style={{ fontSize: isTiny ? '28px' : isMobile ? '36px' : isTablet ? '48px' : '60px', fontWeight: '800', color: '#000', marginBottom: '14px', lineHeight: 1.15 }}>المكتبة الرئيسية</h1>
                    <div style={{ width: isMobile ? '120px' : '180px', height: '5px', background: '#e5e7eb', borderRadius: '999px', margin: '0 auto 20px', overflow: 'hidden' }}>
                        <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #0865a8, #f57c00)', borderRadius: '999px', animation: 'slide 2s infinite ease-in-out' }} />
                    </div>
                    {/* ── UPDATED: larger subtitle font ── */}
                    <p style={{ fontSize: isTiny ? '15px' : isMobile ? '17px' : isTablet ? '20px' : '22px', color: '#6b7280', lineHeight: 1.7 }}>
                        مكتبة متخصصة في التشييد والبناء • تأسست 1970 • سفارة معرفة مكتبة الإسكندرية
                    </p>
                </div>
            </section>

            {/* ══ STATS ══ */}
            <section style={sectionStyle('#f9fafb')}>
                <div style={containerStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols('2', '2', '4', '4')}, 1fr)`, gap: isTiny ? '10px' : isMobile ? '14px' : '20px' }}>
                        {stats.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} style={{ ...cardBase, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
                                    <div style={{ width: isTiny ? '40px' : '56px', height: isTiny ? '40px' : '56px', borderRadius: '14px', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={isTiny ? 18 : 26} color="white" />
                                    </div>
                                    <div style={{ fontSize: isTiny ? '20px' : isMobile ? '24px' : '32px', fontWeight: '800', color: '#000' }}>{s.value}</div>
                                    <div style={{ fontSize: isTiny ? '13px' : '15px', color: '#6b7280' }}>{s.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══ ABOUT ══ */}
            <section style={sectionStyle('white')}>
                <div style={containerStyle}>
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', '1fr', '1fr 1fr'), gap: isMobile ? '28px' : '48px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 16px', border: '2px solid #0865a8', borderRadius: '999px', color: '#0865a8', fontSize: isTiny ? '13px' : '15px', marginBottom: '16px' }}>
                                <Sparkles size={14} /> نبذة عن المكتبة
                            </div>
                            <h2 style={sectionTitleStyle}>مكتبة متخصصة منذ 1970</h2>
                            <p style={{ fontSize: isTiny ? '14px' : isMobile ? '15px' : '17px', color: '#4b5563', lineHeight: '1.9', marginBottom: '22px' }}>
                                تأسست المكتبة الرئيسية للمعهد عام 1970، وهي مكتبة متخصصة في مجال التشييد والبناء، إيماناً من شركة المقاولون العرب بأهمية القراءة والاطلاع المستمر ومعرفة كل ما هو حديث في سوق العمل. تقدم خدماتها للمجتمع الداخلي والخارجي على حد سواء.
                            </p>
                            {['محتوى محدث باستمرار', 'تغطية شاملة لجميع التخصصات', 'وصول سهل وسريع للمعلومات'].map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <div style={{ width: isTiny ? '28px' : '36px', height: isTiny ? '28px' : '36px', borderRadius: '10px', border: `2px solid ${i % 2 === 0 ? '#0865a8' : '#f57c00'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Check size={isTiny ? 14 : 18} color={i % 2 === 0 ? '#0865a8' : '#f57c00'} />
                                    </div>
                                    <span style={{ color: '#000', fontSize: isTiny ? '14px' : '16px' }}>{t}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderRadius: '20px', overflow: 'hidden', border: '3px solid #e5e7eb', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                            <img src="https://www.arabcont.com/icemt/assets/images/library-02.jpg" alt="المكتبة" style={{ width: '100%', height: isTiny ? '200px' : isMobile ? '240px' : '380px', objectFit: 'cover', display: 'block' }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ FEATURES ══ */}
            <section style={sectionStyle('#f9fafb')}>
                <div style={containerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>مميزات المكتبة</h2>
                        <p style={sectionSubStyle}>اكتشف ما يميز مكتبتنا</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', 'repeat(2,1fr)', 'repeat(2,1fr)'), gap: isTiny ? '12px' : '20px' }}>
                        {features.map((f, i) => <FeatureCard key={i} feature={f} index={i} isTiny={isTiny} isMobile={isMobile} />)}
                    </div>
                </div>
            </section>

            {/* ══ BOOKS ══ */}
            <section style={sectionStyle('white')}>
                <div style={containerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>أمثلة من الكتب</h2>
                        <p style={sectionSubStyle}>تصفح مجموعة مختارة من أفضل الكتب</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', 'repeat(2,1fr)', 'repeat(3,1fr)'), gap: isTiny ? '14px' : isMobile ? '18px' : '28px' }}>
                        {books.map((book, i) => <BookCard key={i} book={book} onClick={() => window.open(book.url, '_blank')} isMobile={isMobile} isTiny={isTiny} />)}
                    </div>
                </div>
            </section>

            {/* ══ SUBSCRIPTION ══ */}
            <section style={sectionStyle('white')}>
                <div style={containerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>خدمات واشتراكات المكتبة</h2>
                        <p style={sectionSubStyle}>خدمات متنوعة للعاملين والباحثين</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr 1fr', '1fr 1fr', 'repeat(4,1fr)', 'repeat(4,1fr)'), gap: isTiny ? '10px' : '16px', marginBottom: '32px' }}>
                        {subscriptionInfo.map((s, i) => (
                            <div key={i} style={{ ...cardBase, textAlign: 'center' }}>
                                <div style={{ fontSize: isTiny ? '15px' : isMobile ? '17px' : '22px', fontWeight: '800', color: s.color, marginBottom: '6px' }}>{s.value}</div>
                                <div style={{ fontSize: isTiny ? '12px' : '14px', color: '#6b7280' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', 'repeat(2,1fr)', 'repeat(3,1fr)'), gap: isTiny ? '12px' : '18px' }}>
                        {[
                            { title: 'خدمة البحث والاسترجاع', desc: 'البحث في قاعدة البيانات عن الكتب العلمية وفق احتياجات المستفيد من خلال استمارة خدمات المستفيدين.', icon: Search },
                            { title: 'خدمة الاستعارة والاطلاع', desc: 'استعارة حتى 3 كتب لمدة 15 يوماً للعاملين، والاطلاع داخل المكتبة لجميع المشتركين.', icon: BookOpen },
                            { title: 'الاستفسارات والتصوير', desc: 'الرد على الاستفسارات عبر الهاتف أو البريد الإلكتروني Library@arabcont.com وخدمة التصوير بحد 20 صفحة.', icon: Users },
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} style={{ ...cardBase, textAlign: 'right' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: i % 2 === 0 ? '#0865a8' : '#f57c00', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                        <Icon size={20} color="white" />
                                    </div>
                                    <h3 style={{ fontSize: isTiny ? '14px' : '16px', fontWeight: '700', color: '#000', marginBottom: '6px' }}>{s.title}</h3>
                                    <p style={{ fontSize: isTiny ? '13px' : '15px', color: '#4b5563', lineHeight: '1.7' }}>{s.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══ PLATFORMS ══ */}
            <section style={sectionStyle('#f9fafb')}>
                <div style={containerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>المنصات والمواقع الإلكترونية</h2>
                        <p style={sectionSubStyle}>اشتراكات في منصات علمية متخصصة</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', 'repeat(2,1fr)', 'repeat(2,1fr)'), gap: isTiny ? '12px' : '18px' }}>
                        {platforms.map((p, i) => {
                            const Icon = p.icon;
                            return (
                                <div key={i} style={{ ...cardBase, display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: i % 2 === 0 ? 'rgba(8,101,168,0.1)' : 'rgba(245,124,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon size={20} color={i % 2 === 0 ? '#0865a8' : '#f57c00'} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: isTiny ? '14px' : '16px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>{p.name}</h3>
                                        <p style={{ fontSize: isTiny ? '13px' : '14px', color: '#6b7280' }}>{p.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══ KNOWLEDGE EMBASSY ══ */}
            <section id="embassy" style={{ ...sectionStyle('white'), borderTop: '4px solid #0865a8' }}>
                <div style={containerStyle}>

                    <div style={sectionHeaderStyle}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: 'linear-gradient(135deg, #0865a8, #f57c00)', borderRadius: '999px', color: 'white', fontSize: isTiny ? '12px' : '14px', fontWeight: '700', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Star size={14} /> أول سفارة معرفة لشركة مقاولات في مصر
                        </div>
                        <h2 style={sectionTitleStyle}>سفارة المعرفة — مكتبة الإسكندرية</h2>
                    </div>

                    {/* Definition */}
                    <div style={{ ...cardBase, marginBottom: '20px', borderRight: '5px solid #0865a8', textAlign: 'right' }}>
                        <h3 style={{ fontSize: isTiny ? '15px' : '18px', fontWeight: '700', color: '#0865a8', marginBottom: '10px' }}>تعريف سفارة المعرفة</h3>
                        <p style={{ fontSize: isTiny ? '13px' : '15px', color: '#374151', lineHeight: '1.9' }}>
                            تسعى مكتبة الإسكندرية الجديدة إلى استعادة روح الانفتاح والبحث التي ميّزت المكتبة القديمة، فهي ليست مكتبة فحسب، بل مجمع ثقافي يقوم على نشر العلم والمعرفة. وتتلخص رسالتها في أن تكون مركزاً للتميز في إنتاج ونشر المعرفة، ومكاناً للتفاعل بين الشعوب والحضارات.
                        </p>
                    </div>

                    {/* ── NEW: Embassy definition image scroll strip ── */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', gap: isTiny ? '10px' : '14px', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', justifyContent: 'center' }}>                            {embassyDefImages.map((img, i) => (
                                <EmbassyDefImage key={i} img={img} isTiny={isTiny} isMobile={isMobile} />
                            ))}
                        </div>
                    </div>

                    {/* Concept */}
                    <div style={{ ...cardBase, marginBottom: '24px', borderRight: '5px solid #f57c00', textAlign: 'right' }}>
                        <h3 style={{ fontSize: isTiny ? '15px' : '18px', fontWeight: '700', color: '#f57c00', marginBottom: '10px' }}>مفهوم سفارات المعرفة</h3>
                        <p style={{ fontSize: isTiny ? '13px' : '15px', color: '#374151', lineHeight: '1.9', marginBottom: '14px' }}>
                            في عام <strong>2014</strong> جاء التفكير في إنشاء سفارات لمكتبة الإسكندرية في جميع المحافظات، حتى تتمكن المكتبة من تخطي البُعد الجغرافي والتوسع لتوصيل خدماتها إلى أكبر عدد ممكن من المستفيدين.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <div style={{ background: 'rgba(8,101,168,0.08)', border: '2px solid rgba(8,101,168,0.2)', borderRadius: '14px', padding: '12px 18px', textAlign: 'center', minWidth: '90px' }}>
                                <div style={{ fontSize: isTiny ? '22px' : '28px', fontWeight: '800', color: '#0865a8' }}>24</div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '3px' }}>سفارة معرفة حالياً</div>
                            </div>
                            <div style={{ background: 'rgba(245,124,0,0.08)', border: '2px solid rgba(245,124,0,0.2)', borderRadius: '14px', padding: '12px 18px', textAlign: 'center', minWidth: '90px' }}>
                                <div style={{ fontSize: isTiny ? '22px' : '28px', fontWeight: '800', color: '#f57c00' }}>2014</div>
                                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '3px' }}>سنة التأسيس</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.04)', border: '2px solid rgba(0,0,0,0.1)', borderRadius: '14px', padding: '12px 18px', flex: 1, minWidth: '180px', textAlign: 'center' }}>
                                <div style={{ fontSize: isTiny ? '13px' : '15px', fontWeight: '700', color: '#000', lineHeight: '1.5' }}>سفارة المعرفة للمكتبة الرئيسية لشركة المقاولون العرب هي <span style={{ color: '#0865a8' }}>أول سفارة معرفة لإحدى كبرى شركات المقاولات</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Goals */}
                    <div style={{ ...cardBase, marginBottom: '24px', background: 'rgba(8,101,168,0.02)', border: '2px solid rgba(8,101,168,0.12)' }}>
                        <h3 style={{ fontSize: isTiny ? '15px' : '18px', fontWeight: '700', color: '#0865a8', marginBottom: '18px', textAlign: 'center' }}>أهداف سفارات المعرفة ودورها داخل مكتبة المعهد</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', 'repeat(2,1fr)', 'repeat(2,1fr)'), gap: '10px' }}>
                            {embassyGoals.map((g, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: i % 2 === 0 ? '#0865a8' : '#f57c00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                        <Check size={12} color="white" />
                                    </div>
                                    <span style={{ fontSize: isTiny ? '13px' : '15px', color: '#1a1a1a', lineHeight: '1.75' }}>{g}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gallery */}
                    <InaugurationGallery isMobile={isMobile} isTiny={isTiny} />

                    {/* Digital services heading */}
                    <h3 style={{ fontSize: isTiny ? '17px' : '22px', fontWeight: '700', color: '#000', textAlign: 'center', marginBottom: '6px' }}>الخدمات المعرفية التي تقدمها سفارة المعرفة بالمعهد</h3>
                    <p style={{ fontSize: isTiny ? '14px' : '16px', color: '#6b7280', textAlign: 'center', marginBottom: '24px' }}>يضم موقع سفارة المعرفة الرقمي لمكتبة الإسكندرية الأقسام الآتية</p>

                    {/* DAR */}
                    <div style={{ ...cardBase, marginBottom: '18px', borderTop: '4px solid #0865a8', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                            <h4 style={{ fontSize: isTiny ? '14px' : '16px', fontWeight: '700', color: '#0865a8', margin: 0 }}>مستودع الأصول الرقمية DAR</h4>
                            <span style={{ fontSize: isTiny ? '16px' : '20px', fontWeight: '800', color: '#0865a8', background: 'rgba(8,101,168,0.08)', padding: '3px 12px', borderRadius: '10px' }}>509,089 وعاء رقمي</span>
                        </div>
                        <p style={{ fontSize: isTiny ? '13px' : '15px', color: '#4b5563', lineHeight: '1.8', marginBottom: '12px' }}>يضم هذا المستودع الرقمي وعاءً رقمياً يشمل كافة التخصصات العلمية في شتى فروع المعرفة البشرية، بالإضافة إلى:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: cols('1fr 1fr', '1fr 1fr', 'repeat(4,1fr)', 'repeat(4,1fr)'), gap: '10px' }}>
                            {[
                                { label: 'صور ووثائق تاريخية', value: '2,052 صورة' },
                                { label: 'ملفات صوتية', value: '2,447 ملف' },
                                { label: 'كتب صوتية', value: '17 كتاب' },
                                { label: 'خرائط رقمية', value: '2,777 خريطة' },
                            ].map((item, i) => (
                                <div key={i} style={{ background: 'rgba(8,101,168,0.06)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                                    <div style={{ fontSize: isTiny ? '14px' : '16px', fontWeight: '800', color: '#0865a8', marginBottom: '3px' }}>{item.value}</div>
                                    <div style={{ fontSize: isTiny ? '12px' : '13px', color: '#6b7280' }}>{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Historical archives grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', 'repeat(2,1fr)', 'repeat(2,1fr)'), gap: '16px', marginBottom: '16px' }}>
                        {[
                            { title: 'ذاكرة مصر المعاصرة', color: '#f57c00', text: 'إتاحة كافة المعلومات التاريخية الهامة لمصر منذ تولي محمد علي حكم مصر سنة 1805 وحتى نهاية عصر الرئيس الراحل محمد أنور السادات سنة 1981.' },
                            { title: 'كتاب وصف مصر', color: '#0865a8', text: 'من أعظم الكتب التاريخية في عهد الحملة الفرنسية — 20 جزءاً: منها 11 جزء رسومات وخرائط، و9 أجزاء تصف مصر باللغة الفرنسية.' },
                            { title: 'الأرشيف الرقمي للرئيس جمال عبد الناصر', color: '#f57c00', text: 'كافة المعلومات التاريخية بأشكالها المختلفة من كتب ومقالات ورسائل ومذكرات وصور وفيديوهات في فترة رئاسة الرئيس جمال عبد الناصر.' },
                            { title: 'الأرشيف الرقمي للرئيس محمد أنور السادات', color: '#0865a8', text: 'كافة المعلومات التاريخية وأفلام تسجيلية وملفات صوتية ومقتطفات من نصر حرب أكتوبر ومعلومات موثقة في فترة رئاسته.' },
                        ].map((item, i) => (
                            <div key={i} style={{ ...cardBase, borderTop: `4px solid ${item.color}`, textAlign: 'right' }}>
                                <h4 style={{ fontSize: isTiny ? '13px' : '15px', fontWeight: '700', color: item.color, marginBottom: '8px' }}>{item.title}</h4>
                                <p style={{ fontSize: isTiny ? '12px' : '14px', color: '#4b5563', lineHeight: '1.8' }}>{item.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Press archive + internet archive */}
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', 'repeat(2,1fr)', 'repeat(2,1fr)'), gap: '16px', marginBottom: '24px' }}>
                        <div style={{ ...cardBase, borderRight: '5px solid #f57c00', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                <h4 style={{ fontSize: isTiny ? '13px' : '15px', fontWeight: '700', color: '#f57c00', margin: 0 }}>أرشيف الصحافة المصرية</h4>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#f57c00', background: 'rgba(245,124,0,0.1)', padding: '2px 8px', borderRadius: '8px' }}>17,500,000 مقالة</span>
                            </div>
                            <p style={{ fontSize: isTiny ? '12px' : '14px', color: '#4b5563', lineHeight: '1.8' }}>مقالات صحفية رقمية باللغات العربية والإنجليزية والفرنسية على مدار 67 عاماً من 1950 حتى 2017.</p>
                        </div>
                        <div style={{ ...cardBase, borderRight: '5px solid #0865a8', textAlign: 'right' }}>
                            <h4 style={{ fontSize: isTiny ? '13px' : '15px', fontWeight: '700', color: '#0865a8', marginBottom: '8px' }}>أرشيف صفحات الإنترنت</h4>
                            <p style={{ fontSize: isTiny ? '12px' : '14px', color: '#4b5563', lineHeight: '1.8' }}>أرشيف شامل يضم صوراً لكافة صفحات المواقع وتطورها وتغيُّر شكلها ومحتوياتها عبر الزمن.</p>
                        </div>
                    </div>

                    {/* Beneficiaries */}
                    <div style={{ display: 'grid', gridTemplateColumns: cols('1fr', '1fr', 'repeat(2,1fr)', 'repeat(2,1fr)'), gap: '16px' }}>
                        <div style={{ ...cardBase, textAlign: 'right' }}>
                            <h3 style={{ fontSize: isTiny ? '14px' : '16px', fontWeight: '700', color: '#0865a8', marginBottom: '14px' }}>الفئات المستفيدة من سفارة المعرفة</h3>
                            {['موظفو الشركة', 'طلبة الجامعات', 'الباحثون لرسائل الماجستير والدكتوراه (داخل وخارج الشركة)'].map((f, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i % 2 === 0 ? '#0865a8' : '#f57c00', flexShrink: 0 }} />
                                    <span style={{ fontSize: isTiny ? '13px' : '15px', color: '#374151' }}>{f}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ ...cardBase, textAlign: 'right' }}>
                            <h3 style={{ fontSize: isTiny ? '14px' : '16px', fontWeight: '700', color: '#f57c00', marginBottom: '14px' }}>آليات الاستفادة من سفارة المعرفة</h3>
                            <p style={{ fontSize: isTiny ? '13px' : '15px', color: '#4b5563', lineHeight: '1.85' }}>
                                يتم حضور المستفيدين إلى مقر المكتبة الرئيسية مع تقديم كارنيه الاشتراك وتسجيل بياناتهم باستمارة خدمات المستفيدين، ثم يُوجَّهون من قبل مسؤول المكتبة للتدريب على استخدام أجهزة الحاسب الآلي الخاصة بالسفارة.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi&display=swap');
                @keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
                @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                input::placeholder{color:#9ca3af}
                *{box-sizing:border-box}
                img{max-width:100%}
                ::-webkit-scrollbar{height:4px}
                ::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}
                ::-webkit-scrollbar-thumb{background:#0865a8;border-radius:4px}
            `}</style>
        </div>
    );
}

/* ── Embassy definition image card (horizontal scroll strip) ── */
function EmbassyDefImage({ img, isTiny, isMobile }) {
    const [err, setErr] = useState(false);
    const w = isTiny ? '200px' : isMobile ? '240px' : '300px';
    const h = isTiny ? '140px' : isMobile ? '170px' : '210px';
    return (
        <div style={{ flexShrink: 0, width: w, scrollSnapAlign: 'start', borderRadius: '14px', overflow: 'hidden', border: '2px solid #e5e7eb', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            {err ? (
                <div style={{ width: '100%', height: h, background: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#9ca3af' }}>
                    <BookOpen size={28} color="#d1d5db" />
                    <span style={{ fontSize: '12px' }}>الصورة غير متاحة</span>
                </div>
            ) : (
                <img src={img.src} alt={img.caption} onError={() => setErr(true)}
                    style={{ width: '100%', height: h, objectFit: 'cover', display: 'block' }} />
            )}
            <div style={{ padding: '8px 12px', background: 'white', textAlign: 'center' }}>
                <span style={{ fontSize: isTiny ? '11px' : '13px', color: '#374151', fontWeight: '600' }}>{img.caption}</span>
            </div>
        </div>
    );
}

/* ── BookOpen needed in EmbassyDefImage ── */
const { BookOpen: _BO } = { BookOpen };

/* ─────────────────────────────────────────────────────────────── */
function FeatureCard({ feature, index, isTiny, isMobile }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{ borderRadius: '16px', border: `2px solid ${hovered ? feature.color : '#e5e7eb'}`, overflow: 'hidden', cursor: 'pointer', boxShadow: hovered ? `0 10px 28px ${feature.color}22` : '0 2px 6px rgba(0,0,0,0.04)', transition: 'all 0.4s ease', background: 'white', transform: hovered ? 'translateY(-4px)' : 'none' }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div style={{ height: '4px', background: feature.color, width: hovered ? '100%' : '35%', transition: 'width 0.4s ease' }} />
            <div style={{ padding: isTiny ? '14px' : isMobile ? '16px 18px' : '22px 26px', display: 'flex', gap: '14px', alignItems: 'flex-start', direction: 'rtl' }}>
                <div style={{ flexShrink: 0, width: isTiny ? '30px' : '38px', height: isTiny ? '30px' : '38px', borderRadius: '10px', background: hovered ? feature.color : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                    <span style={{ fontSize: isTiny ? '13px' : '15px', fontWeight: '800', color: hovered ? 'white' : feature.color }}>{index + 1}</span>
                </div>
                <p style={{ fontSize: isTiny ? '13px' : isMobile ? '14px' : '16px', lineHeight: '1.85', color: '#1a1a1a', margin: 0, flex: 1, textAlign: 'right' }}>{feature.text}</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
function BookCard({ book, onClick, isMobile, isTiny }) {
    const [hovered, setHovered] = useState(false);
    const imgH = isTiny ? '180px' : isMobile ? '220px' : '300px';
    return (
        <div style={{ background: 'white', borderRadius: '18px', overflow: 'hidden', border: '2px solid #e5e7eb', cursor: 'pointer', transform: hovered ? 'translateY(-8px) scale(1.02)' : 'none', transition: 'all 0.4s ease', boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)' }} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div style={{ position: 'relative', height: imgH, overflow: 'hidden' }}>
                <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: book.color, opacity: hovered ? 0.82 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'opacity 0.4s ease' }}>
                    <Search size={28} color="white" />
                    <div style={{ padding: '8px 22px', background: 'white', color: '#000', borderRadius: '999px', fontSize: '14px', fontWeight: '700' }}>اقرأ الآن</div>
                </div>
                <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 12px', background: book.color, borderRadius: '999px', color: 'white', fontSize: '12px', fontWeight: '700' }}>{book.publisher}</div>
            </div>
            <div style={{ padding: isTiny ? '14px' : '18px' }}>
                <h3 style={{ fontSize: isTiny ? '13px' : isMobile ? '14px' : '16px', fontWeight: '700', color: '#000', lineHeight: '1.45', marginBottom: '12px' }}>{book.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', color: book.color, fontWeight: '600' }}>تصفح الكتاب <ChevronLeft size={14} /></span>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
function InaugurationGallery({ isMobile, isTiny }) {
    const images = Array.from({ length: 16 }, (_, i) => ({
        src: `/images/library/IMG-20241012-WA00${10 + i}.jpg`,
        caption: `افتتاح سفارة المعرفة - ${i + 1}`,
    }));

    const [current, setCurrent] = useState(0);
    const [imgError, setImgError] = useState({});
    const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
    const next = () => setCurrent(c => (c + 1) % images.length);
    const maxDots = isTiny ? 4 : isMobile ? 5 : 8;
    const visibleDots = () => {
        if (images.length <= maxDots) return images.map((_, i) => i);
        let s = Math.max(0, current - Math.floor(maxDots / 2));
        let e = s + maxDots;
        if (e > images.length) { e = images.length; s = Math.max(0, e - maxDots); }
        return images.slice(s, e).map((_, i) => s + i);
    };

    return (
        <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: isTiny ? '16px' : '20px', fontWeight: '700', color: '#000', textAlign: 'center', marginBottom: '16px' }}>صور افتتاح سفارة المعرفة بالمعهد</h3>
            <div style={{ background: 'white', borderRadius: '18px', border: '2px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'relative', width: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isTiny ? '170px' : isMobile ? '220px' : '380px' }}>
                    {imgError[current] ? (
                        <div style={{ width: '100%', height: isMobile ? '220px' : '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', gap: '10px' }}>
                            <BookOpen size={40} color="#d1d5db" />
                            <span style={{ fontSize: '13px' }}>الصورة غير متاحة</span>
                        </div>
                    ) : (
                        <img key={current} src={images[current].src} alt={images[current].caption}
                            onError={() => setImgError(e => ({ ...e, [current]: true }))}
                            style={{ width: '100%', height: 'auto', maxHeight: isTiny ? '260px' : isMobile ? '360px' : '560px', objectFit: 'contain', display: 'block', transition: 'opacity 0.3s ease' }} />
                    )}
                    <button onClick={prev} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: isTiny ? '32px' : '40px', height: isTiny ? '32px' : '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none', zIndex: 2 }}>
                        <ChevronRight size={isTiny ? 16 : 20} color="#0865a8" />
                    </button>
                    <button onClick={next} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: isTiny ? '32px' : '40px', height: isTiny ? '32px' : '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none', zIndex: 2 }}>
                        <ChevronLeft size={isTiny ? 16 : 20} color="#0865a8" />
                    </button>
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.55)', borderRadius: '20px', padding: '3px 10px', color: 'white', fontSize: '13px', fontWeight: '600', zIndex: 2 }}>
                        {current + 1} / {images.length}
                    </div>
                </div>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                    <span style={{ fontSize: isTiny ? '13px' : '15px', color: '#374151', fontWeight: '600' }}>{images[current].caption}</span>
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {visibleDots().map(i => (
                            <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '22px' : '7px', height: '7px', borderRadius: '4px', background: i === current ? '#0865a8' : '#d1d5db', border: 'none', cursor: 'pointer', outline: 'none', transition: 'all 0.3s ease', padding: 0 }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', width: '100%', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
                        {images.map((img, i) => (
                            <button key={i} onClick={() => setCurrent(i)} style={{ flexShrink: 0, width: isTiny ? '44px' : isMobile ? '52px' : '64px', height: isTiny ? '34px' : isMobile ? '40px' : '48px', borderRadius: '7px', overflow: 'hidden', border: i === current ? '2px solid #0865a8' : '2px solid #e5e7eb', cursor: 'pointer', padding: 0, outline: 'none', background: '#f3f4f6', opacity: i === current ? 1 : 0.65, transition: 'all 0.2s' }}>
                                {imgError[i] ? (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BookOpen size={12} color="#d1d5db" />
                                    </div>
                                ) : (
                                    <img src={img.src} alt="" onError={() => setImgError(e => ({ ...e, [i]: true }))} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}