import React, { useState } from 'react';
import { useEffect } from 'react';

const ShobraTrainingPage = () => {
    const [openSection, setOpenSection] = useState(null);
    const [modalImage, setModalImage] = useState(null);

    const toggleSection = (id) => {
        setOpenSection(openSection === id ? null : id);
    };

    const openModal = (imageSrc, title) => {
        setModalImage({ src: imageSrc, title });
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalImage(null);
        document.body.style.overflow = 'auto';
    };

    const workshops = [
        {
            id: 1,
            title: "ورشة المحركات",
            text: "تحتوي الورشة علي معظم أنواع محركات الديزل والبنزين المستخدمة في المعدات والسيارات للتدريب عليها في عمليات الفك والتركيب بالطرق المعتمدة في التدريب ، ويوجد في الورشة كافة العدد والأدوات المستخدمة في أعمال الفك والتجميع للوحدات تحت الإصلاح وذلك باستخدام الطرق والأساليب الفنية السليمة."
        },
        {
            id: 2,
            title: "ورشة اللحام والبرادة",
            text: "تحتوي ورشة اللحام على معظم ماكينات اللحام للتدريب علي أعمال القطع واللحام وإعداد اللحامين عملياً بالتدريب علي أعمال ومهارات اللحام بالقوس الكهربي واللحام بالاكسي استيلين مع مراعاة شروط واحتياطات السلامة والصحة المهنية. تحتوي ورشة البرادة على كافة العدد والأدوات المستخدمة في الأعمال الأساسية في قطع وتشغيل المعادن وإكساب المتدرب المهارات الأساسية اللازمة للعمل كبراد تركيبات أو مواسير أو تزجة."
        },
        {
            id: 3,
            title: "ورشة الهيدروليك",
            text: "تحتوي الورشة علي معظم أنواع الطلمبات والمواتير والصمامات الهيدروليكية المستخدمة في الدوائر الهيدروليكية للمعدات للتدريب عليها ومعرفة مكوناته وطريقة عملها، ويوجد في الورشة كافة العدد والأدوات المستخدمة في أعمال الفك والتجميع للوحدات الهيدروليكية باستخدام الطرق والأساليب الفنية السليمة."
        },
        {
            id: 4,
            title: "ورشة التركيبات الكهربائية الداخليه",
            text: "تحتوي الورشة علي مختلف أنواع دوائر التركيبات الكهربائيه الداخلية من التأسيس و التمديدات و سحب الاسلاك و توزيع الاحمال و مكوناتها و طرق التنفيذ و التوصيل و الاختبارات الخاصه بالمبانى و المنشأت ، و عمل المقايسات المطلوبة و طرق الاستلام طبقاً لمستويات المهارة القومية ، ويوجد في الورشة كافة العدد والأدوات و اجهزه القياس المستخدمة في أعمال تنفيذ التركيبات الكهربائية ."
        },
        {
            id: 5,
            title: "ورشة كهرباء المعدات",
            text: "تحتوي الورشة علي أنواع من الدوائر الكهربائية للمعدات الثقيلة و المولدات الكهربائية و كذلك المواتير الكهربائية ومكوناتها و كذلك بعض من النماذج المستخدمة في الدوائر الكهربائية للمعدات للتدريب عليها ومعرفة مكوناتها وطريقة عملها، ويوجد في الورشة كافة العدد والأدوات المستخدمة في أعمال الفك والتجميع للوحدات الكهربائية باستخدام الطرق والأساليب الفنية السليمة."
        },
        {
            id: 6,
            title: "ورشة كهرباء التحكم الالى",
            text: "تحتوي الورشة علي مكونات وادوات دوائر التحكم الالى الكلاسيكى و الاتوماتيكى Automatic Control Classic and و كذلك أجهزة ال PLC للتدريب عليها و عمل محاكاه لنظم التشغيل المختلفة ."
        }
    ];

    const mechanicsPrograms = [
        "إعداد وتأهيل ميكانيكا سيارات",
        "إعداد وتأهيل فني ميكانيكا سيارات",
        "إعداد وتأهيل ميكانيكا معدات",
        "إعداد وتأهيل فني ميكانيكا معدات",
        "إعداد وتأهيل فني ميكانيكا هيدروليك",
        "إعداد وتأهيل فني ميكانيكا محركات",
        "مجموعة نقل القدرة (Power Train)",
        "إعداد وتأهيل فني تشغيل معدات",
        "إعداد وتأهيل فني وناش ارضي",
        "دورة عامة عن سيارات الإفيكو",
        "صيانة وإصلاح الإطارات (لحام كاوتش)"
    ];

    const weldingPrograms = [
        "رفع كفاءة فني وملاحظ برادة معادن",
        "رفع كفاءة فني براد تركيبات",
        "رفع كفاءة فني و ملاحظ لحام معادن",
        "رفع كفاءة فني لحام كهرباء وأكسجين",
        "رفع كفاءة فني لحام Co2",
        "رفع كفاءة في عمليات اللحام والقطع المختلفة",
        "طرق فحص اللحام و كيفية تلافيها"
    ];

    const electricalPrograms = [
        "إعداد وتأهيل كهربائي تركيبات داخلية - المستوى الثاني",
        "إعداد وتأهيل فني / ملاحظ كهرباء تركيبات كهربائية - المستوى الثالث",
        "إعداد وتأهيل فني / ملاحظ كهرباء صيانة وتشغيل",
        "إعداد وتأهيل فني / ملاحظ كهرباء سيارات ومعدات",
        "مقدمة في التحكم المنطقي المبرمج PLC",
        "التمديدات ولوحات التوزيع الكهربائية",
        "دوائر التحكم الآلي"
    ];

    useEffect(() => {
            document.title = '    مركز تدريب شبرا - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap');

                .shobra-container * {
                    font-family: 'Noto Kufi Arabic', serif;
                }

                .shobra-accordion-button {
                    transition: all 0.3s ease;
                }

                .shobra-accordion-button:hover {
                    background-color: rgba(8, 101, 168, 0.05);
                }

                .shobra-image {
                    object-fit: contain;
                    background-color: #f5f5f5;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .shobra-image:hover {
                    transform: scale(1.02);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                /* Modal Styles */
                .shobra-modal-overlay {
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
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .shobra-modal-content {
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

                .shobra-modal-image {
                    max-width: 100%;
                    max-height: 85vh;
                    width: auto;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    object-fit: contain;
                }

                .shobra-modal-close {
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

                .shobra-modal-close:hover {
                    background-color: #0865a8;
                    transform: rotate(90deg);
                }

                .shobra-modal-title {
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
                    .shobra-main-content {
                        padding-left: 1.5rem !important;
                        padding-right: 1.5rem !important;
                    }
                }

                @media (max-width: 768px) {
                    .shobra-fixed-bar {
                        top: 60px !important;
                        padding: 0.4rem 1rem !important;
                    }

                    .shobra-main-content {
                        padding-top: calc(60px + 45px + 2rem) !important;
                        padding-left: 1rem !important;
                        padding-right: 1rem !important;
                    }

                    .shobra-header {
                        padding: 1.5rem !important;
                    }

                    .shobra-header-title {
                        font-size: 1.75rem !important;
                    }

                    .shobra-image-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .shobra-image-large {
                        height: 300px !important;
                    }

                    .shobra-image-small {
                        height: 200px !important;
                    }

                    .shobra-vision-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .shobra-programs-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .shobra-modal-close {
                        top: 10px;
                        right: 10px;
                    }

                    .shobra-modal-title {
                        position: relative;
                        bottom: auto;
                        margin-top: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .shobra-fixed-bar-text {
                        font-size: 0.875rem !important;
                    }

                    .shobra-header {
                        padding: 1rem !important;
                        border-right-width: 4px !important;
                    }

                    .shobra-header-title {
                        font-size: 1.5rem !important;
                        margin-bottom: 1rem !important;
                    }

                    .shobra-header-text {
                        font-size: 0.95rem !important;
                    }

                    .shobra-image-large {
                        height: 250px !important;
                    }

                    .shobra-image-small {
                        height: 180px !important;
                    }

                    .shobra-section-title {
                        font-size: 1.25rem !important;
                    }

                    .shobra-workshop-title {
                        font-size: 1rem !important;
                    }

                    .shobra-modal-close {
                        width: 32px;
                        height: 32px;
                        font-size: 1.2rem;
                    }

                    .shobra-modal-title {
                        font-size: 0.9rem;
                    }

                    .shobra-program-card {
                        padding: 1.25rem !important;
                    }

                    .shobra-program-title {
                        font-size: 1rem !important;
                    }

                    .shobra-program-item {
                        font-size: 0.85rem !important;
                    }
                }

                @media (max-width: 360px) {
                    .shobra-header-title {
                        font-size: 1.3rem !important;
                    }

                    .shobra-image-large {
                        height: 220px !important;
                    }
                }
            `}</style>

            <div className="shobra-container" style={{
                minHeight: '100vh',
                backgroundColor: '#ffffff',
                direction: 'rtl',
                textAlign: 'right'
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
                        <span style={{ color: '#374151', marginRight: '8px' }}> مركز تدريب شبرا</span>
                    </div>
                </div>

                <div
                    className="shobra-main-content"
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 1.5rem 2rem',
                        paddingTop: 'calc(70px + 50px + 2rem)'
                    }}
                >
                    {/* Header Section */}
                    <header
                        className="shobra-header"
                        style={{
                            marginBottom: '2rem',
                            borderRadius: '16px',
                            borderRight: '8px solid #f57c00',
                            backgroundColor: '#ffffff',
                            padding: '2rem',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                            border: '1px solid #e8e8e8'
                        }}
                    >
                        <h1
                            className="shobra-header-title"
                            style={{
                                marginBottom: '1.5rem',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#000000'
                            }}
                        >
                            مركز التدريب شبرا
                        </h1>
                        <div
                            className="shobra-header-text"
                            style={{
                                fontSize: '1.125rem',
                                lineHeight: '1.9',
                                color: '#333333'
                            }}
                        >
                            <p style={{ marginBottom: '1rem' }}>
                                إن حاجة الشركة المتزايدة للأيدي العاملة المدربة دفعها إلى إنشاء مركز متخصص لتدريب الفنيين ومساعدي فنيين وسائقي معدات بمختلف أنواعها ، وذلك لسد احتياجات الشركة في تنفيذ كافة المشروعات وتغذية الشركات الأخرى.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                ويعتبر مركز تدريب المعدات - شبرا بالمعهد التكنولوجى لهندسة التشييد و الادارة هو التدريب العملي لهذه الفئات وفقا لبرامج منتظمة ومحددة.
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                إلى جانب ذلك يقوم المركز بعمل برامج تدريب دورية للعاملين في الشركة لرفع كفاءتهم الإنتاجية أو تعديل مهنهم أو التدريب التحويلي ويقدم المركز أيضا خدماته للهيئات الخارجية كتدريب طلبة المدارس الثانوية الصناعية وطلبة المعاهد الفنية وكليات الهندسة في تدريبهم الصيفي.
                            </p>
                        </div>
                    </header>

                    {/* Image Gallery */}
                    <div
                        className="shobra-image-grid"
                        style={{
                            marginBottom: '3rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1rem'
                        }}
                    >
                        <div
                            style={{
                                gridColumn: 'span 2',
                                height: '400px',
                                overflow: 'hidden',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #e8e8e8'
                            }}
                        >
                            <img
                                src="/images/Shobra12.jpg"
                                alt="التدريبات العملية"
                                className="shobra-image shobra-image-large"
                                onClick={() => openModal('/images/Shobra12.jpg', 'التدريبات العملية')}
                                style={{
                                    height: '100%',
                                    width: '100%'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div
                                style={{
                                    height: '192px',
                                    overflow: 'hidden',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #e8e8e8'
                                }}
                            >
                                <img
                                    src="/images/Shobra8.jpg"
                                    alt="اختبار الطلبة"
                                    className="shobra-image shobra-image-small"
                                    onClick={() => openModal('/images/Shobra8.jpg', 'اختبار الطلبة')}
                                    style={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div
                                style={{
                                    height: '192px',
                                    overflow: 'hidden',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid #e8e8e8'
                                }}
                            >
                                <img
                                    src="/images/Shobra11.jpg"
                                    alt="التدريبات العملية"
                                    className="shobra-image shobra-image-small"
                                    onClick={() => openModal('/images/Shobra11.jpg', 'التدريبات العملية')}
                                    style={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vision & Mission */}
                    <div
                        className="shobra-vision-grid"
                        style={{
                            marginBottom: '3rem',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1.5rem'
                        }}
                    >
                        <div
                            style={{
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #0865a8 0%, #1976d2 100%)',
                                padding: '2rem',
                                color: '#ffffff',
                                boxShadow: '0 8px 20px rgba(8, 101, 168, 0.3)'
                            }}
                        >
                            <h3
                                style={{
                                    marginBottom: '1rem',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                👁️ الرؤية
                            </h3>
                            <p
                                style={{
                                    lineHeight: '1.8',
                                    opacity: 0.95
                                }}
                            >
                                يسعى المركز من خلال خطة تدريبية طموحة إلى تلبية كافة الاحتياجات التدريبية للشركة .
                            </p>
                        </div>
                        <div
                            style={{
                                borderRadius: '16px',
                                border: '2px solid #0865a8',
                                backgroundColor: '#ffffff',
                                padding: '2rem',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <h3
                                style={{
                                    marginBottom: '1rem',
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: '#0865a8'
                                }}
                            >
                                ✉️ الرسالة
                            </h3>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    color: '#333333',
                                    lineHeight: '1.9',
                                    fontSize: '0.95rem'
                                }}
                            >
                                <li style={{ marginBottom: '0.75rem' }}>1. تجهيز عمالة في مجالات أنشطة صيانة وإصلاح وتشغيل معدات الإنشاء بجميع أنواعها لسد احتياجات عجز العمالة بالشركة.</li>
                                <li style={{ marginBottom: '0.75rem' }}>2. رفع مستوى وكفاءة التشغيل للعمالة الحالية حتى تواكب كل من صعوبة وتعقيد المعدات الحديثة وكذلك أساليب الإنشاء الحديثة بمجالاتها التي أصبحت غاية في التنوع والتعقيد.</li>
                                <li style={{ marginBottom: '0.75rem' }}>3. عمل ربط ما بين عمالة الشركة من مهندسين وفنيين وعمال والتوكيلات المختلفة للتدريب الخاص بالمعدات كل في تخصصه.</li>
                                <li>4. إتاحة التدريب لمن يريد من خارج الشركة كنوع من التنمية لأبناء الوطن وكرسالة للشركة .</li>
                            </ul>
                        </div>
                    </div>

                    {/* Workshops Section */}
                    <h2
                        className="shobra-section-title"
                        style={{
                            marginBottom: '1.5rem',
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            color: '#0865a8',
                            borderBottom: '2px solid #f57c00',
                            paddingBottom: '0.5rem',
                            display: 'inline-block'
                        }}
                    >
                        الورش العملية بالمركز
                    </h2>
                    <div style={{ marginBottom: '3rem' }}>
                        {workshops.map((ws) => (
                            <div
                                key={ws.id}
                                style={{
                                    overflow: 'hidden',
                                    borderRadius: '12px',
                                    border: '1px solid #e8e8e8',
                                    backgroundColor: '#ffffff',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                                    marginBottom: '1rem'
                                }}
                            >
                                <button
                                    onClick={() => toggleSection(`ws${ws.id}`)}
                                    className="shobra-accordion-button"
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        textAlign: 'right',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span
                                        className="shobra-workshop-title"
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#0865a8',
                                            fontSize: '1.125rem'
                                        }}
                                    >
                                        {ws.title}
                                    </span>
                                    <span
                                        style={{
                                            color: '#f57c00',
                                            fontSize: '1.25rem',
                                            transform: openSection === `ws${ws.id}` ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    >
                                        ▼
                                    </span>
                                </button>
                                {openSection === `ws${ws.id}` && (
                                    <div
                                        style={{
                                            borderTop: '1px solid #f0f0f0',
                                            backgroundColor: '#fafafa',
                                            padding: '1.25rem',
                                            color: '#333333',
                                            lineHeight: '1.8'
                                        }}
                                    >
                                        {ws.text}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Training Programs */}
                    <h2
                        className="shobra-section-title"
                        style={{
                            marginBottom: '1.5rem',
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            color: '#000000'
                        }}
                    >
                        البرامج التدريبية
                    </h2>
                    <div
                        className="shobra-programs-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1.5rem'
                        }}
                    >
                        {/* Mechanics Programs */}
                        <div
                            className="shobra-program-card"
                            style={{
                                borderRadius: '16px',
                                borderTop: '4px solid #0865a8',
                                backgroundColor: '#ffffff',
                                padding: '1.5rem',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <h4
                                className="shobra-program-title"
                                style={{
                                    marginBottom: '1rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: '#0865a8',
                                    fontSize: '1.125rem'
                                }}
                            >
                                برامج قسم الميكانيكا
                            </h4>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0
                                }}
                            >
                                {mechanicsPrograms.map((item, index) => (
                                    <li
                                        key={index}
                                        className="shobra-program-item"
                                        style={{
                                            marginBottom: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: '#333333',
                                            lineHeight: '1.6'
                                        }}
                                    >
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Welding Programs */}
                        <div
                            className="shobra-program-card"
                            style={{
                                borderRadius: '16px',
                                borderTop: '4px solid #f57c00',
                                backgroundColor: '#ffffff',
                                padding: '1.5rem',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <h4
                                className="shobra-program-title"
                                style={{
                                    marginBottom: '1rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: '#f57c00',
                                    fontSize: '1.125rem'
                                }}
                            >
                                برامج اللحام والبرادة
                            </h4>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0
                                }}
                            >
                                {weldingPrograms.map((item, index) => (
                                    <li
                                        key={index}
                                        className="shobra-program-item"
                                        style={{
                                            marginBottom: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: '#333333',
                                            lineHeight: '1.6'
                                        }}
                                    >
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Electrical Programs */}
                        <div
                            className="shobra-program-card"
                            style={{
                                borderRadius: '16px',
                                borderTop: '4px solid #0865a8',
                                backgroundColor: '#ffffff',
                                padding: '1.5rem',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }}
                        >
                            <h4
                                className="shobra-program-title"
                                style={{
                                    marginBottom: '1rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: '#0865a8',
                                    fontSize: '1.125rem'
                                }}
                            >
                                برامج قسم الكهرباء
                            </h4>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0
                                }}
                            >
                                {electricalPrograms.map((item, index) => (
                                    <li
                                        key={index}
                                        className="shobra-program-item"
                                        style={{
                                            marginBottom: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: '#333333',
                                            lineHeight: '1.6'
                                        }}
                                    >
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Image Modal */}
                {modalImage && (
                    <div
                        className="shobra-modal-overlay"
                        onClick={closeModal}
                    >
                        <div
                            className="shobra-modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="shobra-modal-close"
                                onClick={closeModal}
                                aria-label="إغلاق"
                            >
                                ✕
                            </button>
                            <img
                                src={modalImage.src}
                                alt={modalImage.title}
                                className="shobra-modal-image"
                            />
                            <div className="shobra-modal-title">
                                {modalImage.title}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ShobraTrainingPage;