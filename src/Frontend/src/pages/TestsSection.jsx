import React, { useState, useEffect } from 'react';

export default function ICMETTests() {
    const [selectedImg, setSelectedImg] = useState(null);

    const externalClients = [
        { name: 'هيئة المجتمعات العمرانية', count: 226 },
        { name: 'شركة اليو مصر', count: 16 },
        { name: 'شركة دار المعمار DMC', count: 51 },
        { name: 'شركة منار الخليج', count: 181 },
        { name: 'شركة العربي', count: 655 }
    ];

    const internalTests = [
        'تعديل مهنة',
        'بدل حاسب',
        'ترقيات',
        'دواعى السفر للفروع الخارجية',
        'قادة المستقبل',
        'تعيين'
    ];

    const news = [
        'في اطار التعاون مع وزارة الاسكان والمرافق والمجتمعات العمرانية ، ولخلق كوادر للقيادات الشابة من موظفي هيئة المجتمعات العمرانية الجديدة ، تم تتعيم عدد 226 موظف لشغل وظيفة معاون نائب رئيس الهيئة او معاون رئيس جهاز مدينة ، حيث تم التقييم لمهارات ( اللغة – الحاسب الآلي – القياسات الشخصية والذكاءات ).',
        'نظرا لاسناد مشروعات جديدة للشركة وحرصا من قيادات الشركة لاتاحة فرص عمل لشباب المهندسين ، يجري حاليا عمل التقييمات اللازمة لتعيين عدد من المهندسين حديثي التخرج للانضمام لاسرة الشركة ، فتم خلال العام 2019-2020 عمل التقييمات لعدد 663 مهندس في تخصصات ( مدني – عمارة – ميكانكيكا – كهرباء – مساحة ) وذلك في قدرات ومهارات استخدام الحاسب الآلي ، وتحديد درجة اجادة اللغة ، بالاضافة الى تقييم معلومات التخصص و القياسات الشخصية والذكاءات.',
        'حرصا من المعهد على توفير سبل الراحة للسادة الممتحنين ، فقد تم تطوير معمل الاختبارات وتزويده باحدث اجهزة الحاسب الآلي وزيادة عددها لاستيعاب اعداد الممتحنين ، وذلك تحديث الاثاث المستخدم من مكاتب وكراسي.',
        'ايماناً من الشركة بأهمية اتاحة الفرصة للقيادات الشابة ، يتم عمل التقييمات لقادة المستقبل على مستوى الافرع والادارات المختلفة ، حيث يتم تقييم السادة المرشحين للانضمام لمجلس قادة المستقبل في مهارات ( اللغة – الحاسب الآلي – القياسات الشخصية والذكاءات) وتجرى التقييمات بصفة دورية ، و فيما يلي عرض موجز لمشروع قادة المستقبل.'
    ];

    useEffect(() => {
        document.title = 'الاختبارات - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <div className="rtl-layout" dir="rtl">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/earlyaccess/droidarabickufi.css');

                :root {
                    --primary: #0865a8;
                    --secondary: #f57c00;
                    --dark: #000000;
                    --light: #ffffff;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    background: #ffffff;
                    color: var(--dark);
                    line-height: 1.6;
                    font-size: 16px;
                    font-family: 'Noto Kufi Arabic', sans-serif;
                }

                .rtl-layout {
                    text-align: right;
                    direction: rtl;
                    min-height: 100vh;
                    padding-top: 0;
                    font-family: 'Noto Kufi Arabic', sans-serif;
                }

                .fixed-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    background-color: #f5f5f5;
                    border-bottom: 1px solid #d1d5db;
                    padding: 8px 16px;
                    z-index: 1000;
                    text-align: center;
                    font-size: 0.9rem;
                }

                .main-content {
                    padding-top: 45px;
                }

                .hero-section {
                    max-width: 1200px;
                    margin: 0.5rem auto 1rem auto;
                    background: #ffffff;
                    padding: 1.5rem;
                    border-radius: 24px;
                }

                .hero-title {
                    font-family: 'Noto Kufi Arabic', sans-serif;
                    font-size: clamp(1.6rem, 5vw, 2.2rem);
                    font-weight: 800;
                    color: var(--primary);
                    text-align: center;
                    margin-bottom: 1.5rem;
                    position: relative;
                    line-height: 1.3;
                }

                .hero-title::after {
                    content: '';
                    position: absolute;
                    bottom: -12px;
                    right: 50%;
                    transform: translateX(50%);
                    width: 100px;
                    height: 4px;
                    background: linear-gradient(90deg, transparent, var(--secondary), transparent);
                    border-radius: 2px;
                }

                .hero-description {
                    font-size: 1rem;
                    line-height: 1.7;
                    color: var(--dark);
                    margin-bottom: 1.2rem;
                    padding: 1.2rem;
                    background: #f9f9f9;
                    border-radius: 16px;
                    border-right: 4px solid var(--secondary);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 1.5rem;
                    margin: 2rem auto;
                    max-width: 1200px;
                    padding: 0 1.5rem;
                }

                .stat-card {
                    background: white;
                    padding: 1.2rem 0.5rem;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                    aspect-ratio: 1/1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(8,101,168,0.15);
                }

                .stat-icon { font-size: 2rem; color: var(--secondary); }
                .stat-title { font-size: 1rem; font-weight: 700; color: var(--dark); }
                .stat-number { font-size: 1.6rem; font-weight: 800; color: var(--primary); }

                .content-section {
                    max-width: 1200px;
                    margin: 3rem auto;
                    padding: 0 1.5rem;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                @media (max-width: 768px) {
                    .content-grid { grid-template-columns: 1fr; }
                    .image-grid { grid-template-columns: 1fr; }
                }

                .content-image {
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                    cursor: pointer;
                    background: #fff;
                }

                .content-image img {
                    width: 100%;
                    height: auto;
                    display: block;
                    transition: transform 0.3s ease;
                }

                .content-image:hover img { transform: scale(1.02); }

                .list-container {
                    background: white;
                    padding: 1.2rem;
                    border-radius: 20px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.05);
                    border: 1px solid #eee;
                }

                .custom-list { list-style: none; padding: 0; }

                .custom-list > li {
                    margin-bottom: 1.2rem;
                    padding-right: 2.2rem;
                    position: relative;
                    font-size: 1rem;
                    line-height: 1.6;
                }

                .custom-list > li::before {
                    content: '✓';
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 24px;
                    height: 24px;
                    background: var(--secondary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                }

                .nested-list { list-style: none; margin-top: 0.8rem; padding-right: 1.2rem; }

                .nested-list li {
                    margin-bottom: 0.6rem;
                    padding-right: 1.5rem;
                    position: relative;
                    font-size: 0.95rem;
                    color: #333;
                }

                .nested-list li::before {
                    content: '◆';
                    position: absolute;
                    right: 0;
                    color: var(--primary);
                    font-size: 0.8rem;
                }

                .image-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                    margin: 2rem 0;
                }

                .large-stats-section {
                    background: var(--primary);
                    padding: 2rem 1rem;
                    margin: 3rem 0;
                    text-align: center;
                }

                .large-stats-title { font-size: 1.6rem; color: white; margin-bottom: 1rem; font-weight: 700; }

                .large-stat-icon {
                    font-size: 2.5rem;
                    color: var(--secondary);
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%,100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                .large-stat-number { font-size: 3.2rem; font-weight: 900; color: white; line-height: 1.2; }
                .large-stat-label { font-size: 1.3rem; color: white; font-weight: 600; }

                .news-section {
                    background: white;
                    padding: 2rem;
                    border-radius: 24px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
                    margin-top: 2rem;
                }

                .section-title { color: var(--primary); font-size: 1.6rem; font-weight: bold; margin-bottom: 1.5rem; }

                .news-item {
                    padding: 1rem 2rem 1rem 1rem;
                    margin-bottom: 1.2rem;
                    background: #fcfcfc;
                    border-radius: 16px;
                    border-right: 4px solid var(--primary);
                    position: relative;
                    line-height: 1.7;
                    font-size: 0.95rem;
                }

                .news-item::before {
                    content: '✓';
                    position: absolute;
                    right: 0.8rem;
                    top: 1rem;
                    width: 20px;
                    height: 20px;
                    background: var(--secondary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    cursor: pointer;
                }

                .modal-content { max-width: 90%; max-height: 90%; position: relative; }
                .modal-content img { width: 100%; height: auto; border-radius: 12px; }
                .close-modal { position: absolute; top: -35px; left: 0; color: white; font-size: 2rem; cursor: pointer; }
            `}</style>

            {/* Fixed navigation bar */}
            <div className="fixed-nav">
                <a href="/" style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                    onMouseEnter={e => e.target.style.color = '#f57c00'}
                    onMouseLeave={e => e.target.style.color = '#0865a8'}>
                    الصفحة الرئيسية
                </a>
                <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                <span style={{ color: '#374151' }}>الاختبارات</span>
            </div>

            <div className="main-content">
                <section className="hero-section">
                    <h1 className="hero-title">الاختبارات</h1>
                    <p className="hero-description">
                        تم انشاء قسم الاختبارات بالمعهد مواكبة لاحد النظم في اختيار الموارد البشرية وايماناً من الشركة بأهمية اختيار افضل العناصر لشغل الوظائف المختلفة بالشركة وفقاً للضوابط والمعايير المطلوبة لكل وظيفة
                    </p>
                    <p className="hero-description">
                        يعد معهد الإدارة والتكنولوجيا- المقاولون العرب واحد من أوائل المعاهد في جمهورية مصر العربية ، حيث يقوم هذا القسم  باجراء عدد كبير من الاختبارات المقننة الى العملاء الخارجيين طبقا للتعاقد وجميع الفروع والإدارات داخل الشركة
                    </p>
                    <p className="hero-description">
                        كما يقوم القسم بعمل التقييمات اللازمة لتحديد مدى صلاحية الموظف لشغل الوظيفة ، معتمداً على خبرة السادة المحاضرين في عمل فنية تقييمات مناسبة لكافة الوظائف والمهن المختلفة ذات مرجعية لاختبارات الشهادات الدولية مثل ( ICDL & Toefl ) ، كذلك مستويات المهارات القومية ، واصدار النتيجة المعتمدة والمحددة لصلاحية شغل الوظيفة
                    </p>
                </section>

                <h1 className="hero-title" style={{ fontSize: '1.7rem', marginTop: '0' }}>ولم يقتصر العمل في قسم الاختبارات على العاملين بالشركة فقط ، بل امتد عمل التقييمات ليشمل العملاء خارجيين ايضاً</h1>

                <div className="stats-grid">
                    {externalClients.map((client, idx) => (
                        <div key={idx} className="stat-card">
                            <div className="stat-icon">📊</div>
                            <h3 className="stat-title">{client.name}</h3>
                            <div className="stat-number">{client.count}</div>
                        </div>
                    ))}
                </div>

                <section className="content-section">
                    <div className="content-grid">
                        <div className="content-text">
                            <div className="list-container">
                                <ul className="custom-list">
                                    <li>
                                        الاختبارات الخاصة بالعاملين بالشركة
                                        <ul className="nested-list">
                                            {internalTests.map((test, idx) => (
                                                <li key={idx}>{test}</li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="content-image" onClick={() => setSelectedImg('/images/test-01.jpg')}>
                            <img src="/images/test-01.jpg" alt="Testing facilities" />
                        </div>
                    </div>

                    <div className="image-grid">
                        <div className="content-image" onClick={() => setSelectedImg('/images/test-02.jpg')}>
                            <img src="/images/test-02.jpg" alt="Testing environment" />
                        </div>
                        <div className="content-image" onClick={() => setSelectedImg('/images/test-03.jpg')}>
                            <img src="/images/test-03.jpg" alt="Testing sessions" />
                        </div>
                    </div>
                </section>

                <section className="large-stats-section">
                    <h2 className="large-stats-title">ما تم اختباره في عام 2020-2021</h2>
                    <div className="large-stat-display">
                        <div className="large-stat-icon">👥</div>
                        <div className="large-stat-number">2315</div>
                        <div className="large-stat-label">مهندس</div>
                    </div>
                </section>

                <section className="content-section">
                    <div className="news-section">
                        <h2 className="section-title">من اخبار قسم الاختبارات</h2>
                        {news.map((item, idx) => (
                            <div key={idx} className="news-item">
                                {item}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {selectedImg && (
                <div className="modal-overlay" onClick={() => setSelectedImg(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-modal">&times;</span>
                        <img src={selectedImg} alt="Enlarged view" />
                    </div>
                </div>
            )}
        </div>
    );
}