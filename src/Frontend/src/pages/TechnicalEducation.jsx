import React, { useState, useEffect } from "react";

export default function TechnicalEducationAlt() {
    const [modalImage, setModalImage] = useState(null);

    const openModal = (imageSrc, title) => {
        setModalImage({ src: imageSrc, title });
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalImage(null);
        document.body.style.overflow = 'auto';
    };

    useEffect(() => {
        document.title = ' تطوير التعليم الفني - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <div className="tech-page-wrapper">
            <style>{`

                :root {
                    --primary-color: #0865a8;
                    --secondary-color: #f57c00;
                    --bg-light: #F5F7E1;
                    --text-dark: #333333;
                    --border-color: #e8e8e8;
                    --transition-speed: 0.3s;
                }

                .tech-page-wrapper {
                    direction: rtl;
                    background: #ffffff;
                    min-height: 100vh;
                    font-family: 'Noto Kufi Arabic', serif;
                    color: var(--text-dark);
                }

                .tech-page-wrapper * {
                    font-family: 'Noto Kufi Arabic', serif;
                    box-sizing: border-box;
                }

                .tech-fixed-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background-color: var(--bg-light);
                    border-bottom: 2px solid #e0e0e0;
                    padding: 0.75rem 1rem;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }

                .tech-fixed-bar-content {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.95rem;
                    flex-wrap: wrap;
                }

                .tech-nav-link {
                    color: #000;
                    text-decoration: none;
                    font-weight: bold;
                    transition: color var(--transition-speed);
                }

                .tech-nav-link:hover {
                    color: var(--secondary-color);
                }

                .tech-nav-sep {
                    color: #666;
                }

                .tech-main-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 120px 5% 60px;
                }

                .tech-card {
                    background: #fff;
                    border-radius: 18px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    border: 1px solid var(--border-color);
                    margin-bottom: 30px;
                    overflow: hidden;
                    transition: transform var(--transition-speed), box-shadow var(--transition-speed);
                }

                .tech-header-card {
                    padding: 40px 30px;
                    text-align: center;
                }

                .tech-title {
                    font-size: clamp(1.5rem, 4vw, 2.2rem);
                    color: var(--primary-color);
                    font-weight: bold;
                    margin-bottom: 15px;
                }

                .tech-title-underline {
                    width: 70px;
                    height: 4px;
                    background: var(--secondary-color);
                    border-radius: 6px;
                    margin: 0 auto 25px;
                }

                .tech-subtitle {
                    font-size: clamp(1rem, 2vw, 1.1rem);
                    font-weight: 600;
                    margin-bottom: 20px;
                }

                .tech-description {
                    line-height: 1.9;
                    font-size: clamp(0.9rem, 1.8vw, 1rem);
                    max-width: 900px;
                    margin: 0 auto;
                }

                .tech-role-card {
                    padding: 30px;
                }

                .tech-role-title {
                    color: var(--primary-color);
                    font-weight: bold;
                    margin-bottom: 20px;
                    font-size: clamp(1.2rem, 3vw, 1.5rem);
                }

                .tech-role-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .tech-role-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 15px;
                    line-height: 1.8;
                    font-size: clamp(0.9rem, 1.8vw, 1rem);
                }

                .tech-check-icon {
                    color: var(--secondary-color);
                    font-weight: bold;
                    flex-shrink: 0;
                    margin-top: 4px;
                }

                /* ✅ FIXED: Always 2 columns grid */
                .tech-grid {
                    display: grid;
                    gap: 25px;
                    margin-bottom: 40px;
                }

                .tech-grid-2 {
                    grid-template-columns: repeat(2, 1fr);
                }

                .school-card {
                    padding: 25px;
                    border-top: 4px solid var(--primary-color);
                    height: 100%;
                    margin-bottom: 0;
                }

                .school-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 24px rgba(8, 101, 168, 0.15);
                }

                .school-card-title {
                    color: var(--primary-color);
                    font-weight: bold;
                    margin-bottom: 12px;
                    font-size: clamp(1rem, 2vw, 1.1rem);
                    line-height: 1.5;
                }

                .school-card-text {
                    font-size: clamp(0.85rem, 1.6vw, 0.95rem);
                    line-height: 1.8;
                    margin: 0;
                }

                .image-card {
                    height: clamp(250px, 40vh, 450px);
                    cursor: pointer;
                }

                .image-card img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .image-card:hover img {
                    transform: scale(1.05);
                }

                .tech-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background-color: rgba(0, 0, 0, 0.9);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 20px;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                .tech-modal-content {
                    position: relative;
                    max-width: 95%;
                    max-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .tech-modal-image {
                    max-width: 100%;
                    max-height: 80vh;
                    border-radius: 8px;
                    object-fit: contain;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }

                .tech-modal-close {
                    position: absolute;
                    top: -50px;
                    right: 0;
                    background: var(--secondary-color);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background var(--transition-speed);
                }

                .tech-modal-close:hover {
                    background: var(--primary-color);
                }

                .tech-modal-title {
                    color: white;
                    margin-top: 15px;
                    font-size: 1.1rem;
                    text-align: center;
                }

                @media (min-width: 1920px) {
                    .tech-main-container {
                        max-width: 1600px;
                    }
                    .tech-grid-2 {
                        gap: 40px;
                    }
                }

                /* ✅ Stack to 1 column on mobile */
                @media (max-width: 768px) {
                    .tech-main-container {
                        padding-top: 100px;
                    }
                    .tech-header-card {
                        padding: 30px 20px;
                    }
                    .tech-grid-2 {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 480px) {
                    .tech-main-container {
                        padding: 90px 15px 40px;
                    }
                    .tech-fixed-bar {
                        padding: 0.5rem;
                    }
                    .tech-fixed-bar-content {
                        font-size: 0.8rem;
                    }
                    .tech-modal-close {
                        top: -45px;
                        width: 35px;
                        height: 35px;
                    }
                    .image-card {
                        height: 220px;
                    }
                }

                @media (max-width: 320px) {
                    .tech-title {
                        font-size: 1.3rem;
                    }
                    .tech-nav-link {
                        font-size: 0.75rem;
                    }
                }
            `}</style>

            
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
                    <span style={{ color: '#374151', marginRight: '8px' }}>تطوير التعليم الفني</span>
                </div>
            </div>

            <main className="tech-main-container">
                {/* Header Section */}
                <section className="tech-card tech-header-card">
                    <h1 className="tech-title">تطوير التعليم الفني</h1>
                    <div className="tech-title-underline"></div>
                    <p className="tech-subtitle">بروتوكول التعاون بين وزارة التربية والتعليم وشركة المقاولون العرب</p>
                    <p className="tech-description">
                        الهدف من هذا البروتوكول إنشاء جيل جديد من خريجي المدارس الثانوية الصناعية يتميز بالجدية في العمل وقادر على تحمل المسئولية والتعامل مع التكنولوجيا الحديثة بمواقع العمل المختلفة للشركة من خلال توفير العمالة الفنية المدربة.
                    </p>
                </section>

                {/* Strategy Section */}
                <section className="tech-card tech-role-card">
                    <h3 className="tech-role-title">دور الشركة في ثلاثة محاور</h3>
                    <ul className="tech-role-list">
                        <li className="tech-role-item">
                            <span className="tech-check-icon">✔</span>
                            <span>المحور الأول يتضمن إختيار أفضل العناصر المتقدمة لهذه المدارس ورعايتهم عملياً وصحياً وأخلاقياً وفي نهاية المرحلة يتم إعطاءه شهادات خبرة للخريجين معتمدة من الشركة.</span>
                        </li>
                        <li className="tech-role-item">
                            <span className="tech-check-icon">✔</span>
                            <span>المحور الثاني هو رفع كفاءة الكوادر البشرية بالمدارس بعمل دورات تدريبية للمدرسين في التخصصات المختلفة وفي النواحي الإدارية.</span>
                        </li>
                        <li className="tech-role-item">
                            <span className="tech-check-icon">✔</span>
                            <span>المحور الثالث هو قيام الشركة بتطوير الورش بهذه المدارس وإمدادها بالمعدات والأدوات المطلوبة وصيانتها.</span>
                        </li>
                    </ul>
                </section>

                {/* Schools Grid — ✅ now always 2×2 */}
                <section className="tech-grid tech-grid-2">
                    <SchoolCard
                        title="مدرسة المعدات الثقيلة الصناعية بالإسماعيلية"
                        text="يتم التدريب الطلاب على ميكانيكا المعدات بورش فرع سيناء يوم السبت من كل أسبوع مع توفير أتوبيس لنقلهم من المدرسة إلى موقع التدريب و العودة بعد انتهاء اليوم التدريبي مع منسق الأمن بالشركة لعدد (20) طالب."
                    />
                    <SchoolCard
                        title="مدرسة أبو رواش الثانوية الصناعية المشتركة"
                        text="يتم تدريب الطلاب على ميكانيكا المعدات بواقع يومان (الأربعاء و الخميس) من كل أسبوع بالمعهد التكنولوجى - مركز تدريب شبرا من بدء العام الدراسي لعدد (18) طالب."
                    />
                    <SchoolCard
                        title="مدرسة الشاطبي الثانوية الصناعية"
                        text="يتم تدريب الطلاب بورش العامرية المركزية بالإسكندرية قسم اللحام لعدد (19) طالب."
                    />
                    <SchoolCard
                        title="مدرسة مدينة نصر الثانوية الصناعية"
                        text="التدريب يوم السبت من كل أسبوع بمركز تدريب شبرا / قسم الكهرباء لعدد (20) طالب."
                    />
                </section>

                {/* Images Grid */}
                <section className="tech-grid tech-grid-2">
                    <ImageCard
                        src="/images/tech-02.jpg"
                        alt="صورة تعليم فني 1"
                        onClick={() => openModal("/images/tech-02.jpg", "صورة تعليم فني 1")}
                    />
                    <ImageCard
                        src="/images/tech-03.jpg"
                        alt="صورة تعليم فني 2"
                        onClick={() => openModal("/images/tech-03.jpg", "صورة تعليم فني 2")}
                    />
                </section>
            </main>

            {modalImage && (
                <div className="tech-modal-overlay" onClick={closeModal}>
                    <div className="tech-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="tech-modal-close" onClick={closeModal}>✕</button>
                        <img src={modalImage.src} alt={modalImage.title} className="tech-modal-image" />
                        <div className="tech-modal-title">{modalImage.title}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SchoolCard({ title, text }) {
    return (
        <div className="tech-card school-card">
            <h4 className="school-card-title">{title}</h4>
            <p className="school-card-text">{text}</p>
        </div>
    );
}

function ImageCard({ src, alt, onClick }) {
    return (
        <div className="tech-card image-card" onClick={onClick}>
            <img src={src} alt={alt} />
        </div>
    );
}