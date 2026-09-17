import React, { useState } from 'react';
import { useEffect } from 'react';

const GesrElSuezPage = () => {
    const [activeWorkshop, setActiveWorkshop] = useState(null);
    const [modalImage, setModalImage] = useState(null);

    const workshops = [
        {
            id: 'w1',
            title: 'ورشة المبانى',
            description: 'تم تحديث الورشة واعدادها بالعدد والأدوات اللازمة للتطبيق العملية ،ويتم التدريب على استنتاج المدماك الثانى وبناء حوائط الطوبة والنصف طوبة وأعمدة المبانى وحساب الكميات المطلوبة لعمل معين .',
            images: ['wrashA1.jpg', 'wrashA2.jpg', 'wrashA3.jpg']
        },
        {
            id: 'w2',
            title: 'ورشة البياض',
            description: 'تحتوى الورشة على العدد والادوات الحديثة اللازمة لأعمال البياض ( بياض التخشين ) ويوجد بها (6 )كبائن للتدريب على مراحل البياض المختلفة ويتم التدريب على تنفيذ مراحل البياض تفصيليا بداية من الطرطشة وعمل البؤج والاوتار بالطريقة الصحيحة حتى الانتهاء من عمل بياض التخشين بالكامل بدون اى ملاحظات.',
            images: ['wrashb1.jpg', 'wrashb2.jpg', 'wrashb3.jpg']
        },
        {
            id: 'w3',
            title: 'ورشة الدهانات',
            description: 'هي ورشة فنية لاتهتم فقط بتنفيذ الدهانات التقليدية من البلاستيك واللاكيه ولكن تهتم أيضا بتنفيذ الدهانات ذات الطابع الفنى الابتكاري ( ديكور ).',
            images: ['wrashc1.jpg', 'wrashc2.jpg', 'wrashc3.jpg']
        },
        {
            id: 'w4',
            title: 'ورشة السيراميك',
            description: 'بها 3 كبائن يتم فيها التدريب على تركيب سيراميك الأرضيات والحوائط سواء بالمونة او بمادة اللصق بطريقة احترافية بها لمحة ديكورية فنية ليكون المتدرب قادرا على التطبيق بكفاءة عالية .بها 3 كبائن يتم فيها التدريب على تركيب سيراميك الأرضيات والحوائط سواء بالمونة او بمادة اللصق بطريقة احترافية بها لمحة ديكورية فنية ليكون المتدرب قادرا على التطبيق بكفاءة عالية .',
            images: ['wrashd1.jpg', 'wrashd2.jpg', 'wrashd3.jpg']
        },
        {
            id: 'w5',
            title: 'ورشة السباكة',
            description: 'يتم التدريب على اعمال التغذية باستخدام مواسير البولى بروبلين والقطع الملحقة بها وكذلك أعمال الصرف باستخدام المواسير البلاستيكية والقطع الملحقة بها وعمل تركيب للأجهزة طبقا لإشتراطات الكود وعمل الجاليتراب وغرف التفتيش طبقا لأصول الصناعة .',
            images: ['wrashe1.jpg', 'wrashe2.jpg', 'wrashe3.jpg']
        },
        {
            id: 'w6',
            title: 'ورشة الشدات المعدنية',
            description: 'يحتوى المركز على أحدث الانظمة واكثرها شيوعا" فى الشدات المعدنية للاسقف والأعمدة والحوائط ويتم التدريب على فك وتركيب الانواع المختلفة للشدات.',
            images: ['wrashf1.jpg', 'wrashf2.jpg']
        },
        {
            id: 'w7',
            title: 'ورشة النجارة المسلحة',
            description: 'وفيها يتم التدريب والتعرف على عمل الخنزيرة وتوقيع محاور اللوحات وتنفيذ جوانب القواعد المسلحة وعمل حطات الأعمدة وتقفيل جوانبها وتنفيذ الكمرات وتطبيق الأسقف طبقا للمناسيب والأبعاد الصحيحة .',
            images: ['wrashg1.jpg']
        },
        {
            id: 'w8',
            title: 'ورشة الحدادة المسلحة',
            description: 'تحتوى الورشة على اربع ماكينات لتشكيل الكانات وعدد من مقصات الحديد والعدد المطلوبة لفرد وتشكيل وتركيب حديد التسليح وسوف يكتسب المتدرب المعرفة بالطرق الاقتصادية لتشكيل حديد التسليح طبقا للرسومات وحساب اطوال الكانات بأنواعها وتشكيلها وتركيب الأسياخ والكانات بالشكل الصحيح والآمن .',
            images: ['wrashz1.jpg', 'wrashz2.jpg', 'wrashz3.jpg']
        },
        {
            id: 'w9',
            title: 'فئات المتدربين',
            description: '1. تدريب العاملين بالشركة من (مهندسين – مشرفيين – فنيين) وفقا لاحدث طرق التنفيذ المختلفة لاعمال التشييد2.       كما يتم تدريب طلبة كليات الهندسة تدريب عملى داخل ورش المركز.',
            images: []
        },
        {
            id: 'w10',
            title: 'اهداف التدريب',
            description: '1. رفع كفاءة المهندسين والمشرفيين والفنيين وذلك من خلال الدورات التدريبية داخل المركز ومواقع التنفيذ يتم عمل تدريب تحويلى للعماله العادية الى المهن المختلفة حسب احتياج الشركة من خلال مستويات المهارة المصرية ويتم اعتمادها من وزارة القوى العاملة.2. إضافة نوع تدريب للعاملين بالشركة حيث يتم تدريباصحاب المهنة الواحدة على اكثر من مهنة لتحقيق اقصى استفادة ممكنة للشركة.',
            images: []
        }
    ];

    const toggleAccordion = (id) => {
        setActiveWorkshop(activeWorkshop === id ? null : id);
    };

    const openModal = (imageSrc, title) => {
        setModalImage({ src: imageSrc, title });
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setModalImage(null);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    useEffect(() => {
        document.title = ' مركز التدريب جسر السويس - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap');

                .gesr-container * {
                    font-family: 'Noto Kufi Arabic', serif;
                }

                .gesr-workshop-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .gesr-workshop-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                }

                .gesr-accordion-button {
                    transition: all 0.3s ease;
                }

                .gesr-accordion-button:hover {
                    background-color: rgba(8, 101, 168, 0.05);
                }

                .gesr-image-thumbnail {
                    transition: all 0.3s ease;
                    object-fit: contain;
                    background-color: #f5f5f5;
                    cursor: pointer;
                }

                .gesr-image-thumbnail:hover {
                    transform: scale(1.02);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .gesr-hero-image {
                    object-fit: contain;
                    object-position: center;
                    background-color: #f5f5f5;
                }

                /* Modal Styles */
                .gesr-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 1rem;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .gesr-modal-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                    animation: scaleIn 0.3s ease;
                }

                @keyframes scaleIn {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .gesr-modal-image {
                    max-width: 100%;
                    max-height: 85vh;
                    width: auto;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    object-fit: contain;
                }

                .gesr-modal-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background-color: #f57c00;
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    font-weight: bold;
                }

                .gesr-modal-close:hover {
                    background-color: #0865a8;
                    transform: rotate(90deg);
                }

                .gesr-modal-title {
                    position: absolute;
                    bottom: -50px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    color: white;
                    font-size: 1.1rem;
                    padding: 0.5rem;
                }

                /* Responsive Styles */
                @media (max-width: 1024px) {
                    .gesr-main-content {
                        padding-left: 1.5rem !important;
                        padding-right: 1.5rem !important;
                    }

                    .gesr-hero-image {
                        height: 350px !important;
                    }
                }

                @media (max-width: 768px) {
                    .gesr-fixed-bar {
                        top: 60px !important;
                        padding: 0.4rem 1rem !important;
                    }

                    .gesr-main-content {
                        padding-top: calc(60px + 45px + 1.5rem) !important;
                        padding-left: 1rem !important;
                        padding-right: 1rem !important;
                    }

                    .gesr-header {
                        padding: 1.5rem !important;
                    }

                    .gesr-header-title {
                        font-size: 1.75rem !important;
                    }

                    .gesr-header-text {
                        font-size: 1rem !important;
                    }

                    .gesr-hero-image {
                        height: 300px !important;
                    }

                    .gesr-section-title {
                        font-size: 1.5rem !important;
                    }

                    .gesr-workshop-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .gesr-footer-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .gesr-image-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }

                    .gesr-modal-close {
                        top: -35px;
                        width: 35px;
                        height: 35px;
                        font-size: 1.3rem;
                    }

                    .gesr-modal-title {
                        font-size: 1rem;
                        bottom: -45px;
                    }
                }

                @media (max-width: 480px) {
                    .gesr-fixed-bar-text {
                        font-size: 0.875rem !important;
                    }

                    .gesr-header {
                        padding: 1rem !important;
                        border-right-width: 4px !important;
                    }

                    .gesr-header-title {
                        font-size: 1.5rem !important;
                        margin-bottom: 0.75rem !important;
                    }

                    .gesr-header-text {
                        font-size: 0.95rem !important;
                    }

                    .gesr-hero-image {
                        height: 250px !important;
                        border-radius: 12px !important;
                    }

                    .gesr-section-title {
                        font-size: 1.25rem !important;
                        margin-bottom: 1.5rem !important;
                    }

                    .gesr-workshop-title {
                        font-size: 1rem !important;
                    }

                    .gesr-workshop-description {
                        font-size: 0.9rem !important;
                    }

                    .gesr-image-grid {
                        gap: 0.5rem !important;
                    }

                    .gesr-image-thumbnail {
                        height: 100px !important;
                        border-radius: 6px !important;
                    }

                    .gesr-footer-card {
                        padding: 1.25rem !important;
                    }

                    .gesr-footer-title {
                        font-size: 1.1rem !important;
                    }

                    .gesr-footer-list {
                        font-size: 0.9rem !important;
                    }

                    .gesr-modal-overlay {
                        padding: 0.5rem;
                    }

                    .gesr-modal-close {
                        top: 10px;
                        right: 10px;
                        width: 32px;
                        height: 32px;
                        font-size: 1.2rem;
                    }

                    .gesr-modal-title {
                        position: relative;
                        bottom: auto;
                        margin-top: 1rem;
                        font-size: 0.9rem;
                    }

                    .gesr-modal-content {
                        width: 100%;
                    }
                }

                @media (max-width: 360px) {
                    .gesr-header-title {
                        font-size: 1.3rem !important;
                    }

                    .gesr-workshop-title {
                        font-size: 0.95rem !important;
                    }

                    .gesr-image-thumbnail {
                        height: 90px !important;
                    }
                }
            `}</style>

            <div className="gesr-container" style={{
                minHeight: '100vh',
                backgroundColor: '#ffffff',
                paddingBottom: '4rem',
                direction: 'rtl'
            }}>
                {/* Fixed Overview Bar */}
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
                        <span style={{ color: '#374151', marginRight: '8px' }}>مركز التدريب جسر السويس</span>
                    </div>
                </div>


                <div
                    className="gesr-main-content"
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 2rem',
                        paddingTop: 'calc(70px + 50px + 2rem)'
                    }}
                >
                    {/* Main Intro Section */}
                    <header
                        className="gesr-header"
                        style={{
                            marginBottom: '2.5rem',
                            borderRadius: '12px',
                            borderRight: '8px solid #0865a8',
                            backgroundColor: '#ffffff',
                            padding: '2rem',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                            border: '1px solid #e8e8e8'
                        }}
                    >
                        <h1
                            className="gesr-header-title"
                            style={{
                                marginBottom: '1rem',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#000000'
                            }}
                        >
                            مركز التدريب جسر السويس
                        </h1>
                        <p
                            className="gesr-header-text"
                            style={{
                                fontSize: '1.125rem',
                                lineHeight: '1.8',
                                color: '#333333'
                            }}
                        >
                            يحتوي المركز علي عدد (8) ورش تدريبية تتيح للمتدرب التعرف نظريا وعمليا علي أعمال الخرسانة والتشطيبات في مجال الانشاءات ،كل ورشة مجهزة بالعدد والأدوات والخامات اللازمة لتنفيذ العملية التدريبية (نظريا – عمليا) ، كما يحتوي المركز علي عدد من النماذج سابقة التجهيز و يمنح المركز اقصي اهتمام لاتخاذ احتياطات السلامة والصحة المهنية اللازمة لجميع الورش.

                            المناهج التدريبية تقوم علي مستويات المهارة القومية للمهن (مساعد – عامل ماهر – رئيس مهنة) والشهادات المقدمة من المركز يتم اعتمادها من وزارة القوي العاملة ووزارة الخارجية ويشارك في التدريب نخبة من المدربين المتميزين تم تدريبهم في ألمانيا بمركز تدريب فرانكفورت أودر، ويتم دعم المركز فنيا من جمهورية ألمانيا الاتحادية من خلال بروتوكول تعاون بين الشركة والغرفة الألمانية.

                            وتم دعم المركز فنياً من خلال تعاون بين الشركة والغرفة الألمانية ويضم المركز نخبة من المتدربين المتميزين الذين تم تدريبهم بجهورية المانيا الاتحادية بمركز تدريب فرانكفورت اودر.

                            كما يتم الاستعانة بمدربين من خارج المركز من السادة المهندسين ومشرفى التنفيذ العاملين بالشركة ذات الكفاءة العالية.                        </p>
                    </header>

                    {/* Hero Image */}
                    <div style={{ marginBottom: '3rem' }}>
                        <img
                            src="/images/GsrSuez1.jpg"
                            alt="Main Center View"
                            className="gesr-hero-image"
                            style={{
                                height: '400px',
                                width: '100%',
                                borderRadius: '16px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                border: '1px solid #e8e8e8'
                            }}
                        />
                    </div>

                    {/* Workshops Section */}
                    <h2
                        className="gesr-section-title"
                        style={{
                            marginBottom: '2rem',
                            textAlign: 'center',
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            color: '#0865a8',
                            textDecoration: 'underline',
                            textUnderlineOffset: '8px',
                            textDecorationColor: '#f57c00'
                        }}
                    >
                        الورش التدريبية التخصصية
                    </h2>

                    <div
                        className="gesr-workshop-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1.5rem'
                        }}
                    >
                        {workshops.map((workshop) => (
                            <div
                                key={workshop.id}
                                className="gesr-workshop-card"
                                style={{
                                    overflow: 'hidden',
                                    borderRadius: '12px',
                                    border: '1px solid #e8e8e8',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                    gridColumn: activeWorkshop === workshop.id ? '1 / -1' : 'auto'
                                }}
                            >
                                <button
                                    onClick={() => toggleAccordion(workshop.id)}
                                    className="gesr-accordion-button"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1.25rem',
                                        textAlign: 'right',
                                        fontWeight: 'bold',
                                        color: '#000000',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span
                                        className="gesr-workshop-title"
                                        style={{ fontSize: '1.125rem' }}
                                    >
                                        {workshop.title}
                                    </span>
                                    <span
                                        style={{
                                            transform: activeWorkshop === workshop.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease',
                                            color: '#f57c00',
                                            fontSize: '1.25rem'
                                        }}
                                    >
                                        ▼
                                    </span>
                                </button>

                                {activeWorkshop === workshop.id && (
                                    <div
                                        style={{
                                            borderTop: '1px solid #f0f0f0',
                                            backgroundColor: '#fafafa',
                                            padding: '1.25rem'
                                        }}
                                    >
                                        <p
                                            className="gesr-workshop-description"
                                            style={{
                                                marginBottom: '1rem',
                                                color: '#333333',
                                                lineHeight: '1.7',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            {workshop.description}
                                        </p>
                                        <div
                                            className="gesr-image-grid"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: `repeat(${Math.min(workshop.images.length, 3)}, 1fr)`,
                                                gap: '0.75rem'
                                            }}
                                        >
                                            {workshop.images.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={`/images/${img}`}
                                                    alt={`${workshop.title} - صورة ${index + 1}`}
                                                    className="gesr-image-thumbnail"
                                                    onClick={() => openModal(`/images/${img}`, workshop.title)}
                                                    style={{
                                                        height: '120px',
                                                        width: '100%',
                                                        borderRadius: '8px',
                                                        border: '2px solid #e8e8e8'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer Info Cards */}
                    <div
                        className="gesr-footer-grid"
                        style={{
                            marginTop: '4rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '2rem'
                        }}
                    >
                        <div
                            className="gesr-footer-card"
                            style={{
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #0865a8 0%, #1976d2 100%)',
                                padding: '2rem',
                                color: '#ffffff',
                                boxShadow: '0 8px 20px rgba(8, 101, 168, 0.3)'
                            }}
                        >
                            <h3
                                className="gesr-footer-title"
                                style={{
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                <span style={{ marginLeft: '0.5rem', fontSize: '1.5rem' }}>🎯</span>
                                أهداف التدريب
                            </h3>
                            <ul
                                className="gesr-footer-list"
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    opacity: 0.95,
                                    lineHeight: '2'
                                }}
                            >
                                <li>• رفع كفاءة المهندسين والمشرفيين والفنيين.</li>
                                <li>• عمل تدريب تحويلى للعمالة العادية للمهن المختلفة.</li>
                                <li>• تحقيق أقصى استفادة من الكوادر البشرية للشركة.</li>
                            </ul>
                        </div>
                        <div
                            className="gesr-footer-card"
                            style={{
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                                padding: '2rem',
                                color: '#ffffff',
                                boxShadow: '0 8px 20px rgba(245, 124, 0, 0.3)'
                            }}
                        >
                            <h3
                                className="gesr-footer-title"
                                style={{
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                <span style={{ marginLeft: '0.5rem', fontSize: '1.5rem' }}>👥</span>
                                الفئات المستهدفة
                            </h3>
                            <ul
                                className="gesr-footer-list"
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    opacity: 0.95,
                                    lineHeight: '2'
                                }}
                            >
                                <li>• مهندسي ومشرفي الشركة.</li>
                                <li>• طلبة كليات الهندسة والتعليم الفني.</li>
                                <li>• العمالة الراغبة في رفع مستوى المهارة.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Image Modal */}
                {modalImage && (
                    <div
                        className="gesr-modal-overlay"
                        onClick={closeModal}
                    >
                        <div
                            className="gesr-modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="gesr-modal-close"
                                onClick={closeModal}
                                aria-label="إغلاق"
                            >
                                ✕
                            </button>
                            <img
                                src={modalImage.src}
                                alt={modalImage.title}
                                className="gesr-modal-image"
                            />
                            <div className="gesr-modal-title">
                                {modalImage.title}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GesrElSuezPage;