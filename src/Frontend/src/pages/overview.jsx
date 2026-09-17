import React, { useEffect } from "react";
import './overview.css';
import {
    FaHardHat,
    FaCalendarAlt,
    FaUsers,
    FaLaptop,
    FaGraduationCap,
    FaCogs,
} from 'react-icons/fa';

function Overview() {

    useEffect(() => {
        document.title = 'نبذة عامة - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <div className="page-root" style={{ fontFamily: '"Noto Kufi Arabic", serif' }}>

            {/* ══════════════════════════════════════
                FIXED OVERVIEW BAR
            ══════════════════════════════════════ */}
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
                    <span style={{ color: '#374151', marginRight: '8px' }}>نبذة عامة</span>
                </div>
            </div>

            {/* ══════════════════════════════════════
                HERO
            ══════════════════════════════════════ */}
            <section className="hero">
                <div className="hero-accent-bar" />
                <div className="hero-content">
                    <span className="hero-eyebrow">منذ عام 1978</span>
                    <h1 className="hero-title">
                        المعهد التكنولوجى<br />
                        <em>لهندسة التشييد والإدارة</em>
                    </h1>
                    <p className="hero-body">
                        إيمانًا من شركة المقاولون العرب بأهمية التدريب لتنمية المعارف والمهارات للموارد البشرية،
                        كانت أولى شركات المقاولات في منطقة الشرق الأوسط التي أنشأت معهدًا للتدريب منذ أكثر من
                        40 عامًا لمواكبة التطورات المستمرة في مجال التشييد والبناء.
                    </p>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 2 — TRAINING PROGRAMS
            ══════════════════════════════════════ */}
            <section className="section_2">
                <div className="section-inner">
                    <h2 className="section-heading">
                        لدينا القدرة على عمل <span>برامج تدريبية متنوعة</span>
                    </h2>
                    <div className="heading-bar" />

                    <div className="section_2_cards">
                        <div className="section_2_card">
                            <h3 className="txt_card_sec_2">برامج للتدريب التحويلى</h3>
                        </div>
                        <div className="section_2_card">
                            <h3 className="txt_card_sec_2">برامج لتكوين فرق التنفيذ الذاتى</h3>
                        </div>
                        <div className="section_2_card">
                            <h3 className="txt_card_sec_2">وضع الحلول التدريبية المتكاملة للمشروعات</h3>
                        </div>
                        <div className="section_2_card">
                            <h3 className="txt_card_sec_2">التدريب فى موقع العمل</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 3 — STATS
            ══════════════════════════════════════ */}
            <section className="section_3">
                <div className="section-inner">
                    <h2 className="section-heading">
                        أرقام <span>تتحدث عن نفسها</span>
                    </h2>
                    <div className="heading-bar" />

                    <div className="cards_sec_3">
                        <div className="card_sec_3">
                            <h2 className="h1_card_sec3">أكثر من 60 عميل</h2>
                            <p className="p_sec_3">
                                نساهم في تطوير صناعة التشييد فنتيح لجميع الوزارات والهيئات الحكومية والخاصة
                                الاستفادة من إمكانيات الإدارة في التدريب.
                            </p>
                        </div>

                        <div className="card_sec_3">
                            <h2 className="h1_card_sec3">أكثر من 2500 مادة تدريبية</h2>
                            <p className="p_sec_3">
                                نمتلك العديد من المواد العلمية والتدريبية موضوعة من خلال مجموعة منتقاة
                                من الخبراء وأساتذة الجامعات.
                            </p>
                        </div>

                        <div className="card_sec_3">
                            <h2 className="h1_card_sec3">بدأنا منذ 1978</h2>
                            <p className="p_sec_3">
                                تم تأسيس المعهد التكنولوجى لهندسة التشييد والإدارة منذ أكثر من 40 عامًا
                                لمواكبة التطورات المستمرة في مجال التشييد والبناء.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 4 — FIRST COURSE
            ══════════════════════════════════════ */}
            <section className="section_4">
                <div className="section-inner">
                    <h2 className="h1_sec_4">أول دورة بالمعهد</h2>
                    <div className="heading-bar" />

                    <div className="content_sec_4">
                        <div className="cards_sec_4">

                            <div className="card_sec_4">
                                <div className="icon_sec_4">
                                    <FaUsers size={28} color="white" />
                                </div>
                                <div className="content_icon_sec_4">
                                    <p className="txt_content_icon_sec_4">إجمالى عدد المتدربين منذ إنشاء المعهد وحتى الآن</p>
                                    <p className="txt_content_icon_sec_4" style={{ fontSize: 'clamp(14px,2vw,18px)', fontWeight: 900 }}>
                                        176,418 متدرب
                                    </p>
                                </div>
                            </div>

                            <div className="card_sec_4">
                                <div className="icon_sec_4">
                                    <FaUsers size={28} color="white" />
                                </div>
                                <div className="content_icon_sec_4">
                                    <p className="txt_content_icon_sec_4">العدد</p>
                                    <p className="txt_content_icon_sec_4" style={{ fontSize: 'clamp(14px,2vw,18px)', fontWeight: 900 }}>
                                        9 مدربين
                                    </p>
                                </div>
                            </div>

                            <div className="card_sec_4">
                                <div className="icon_sec_4">
                                    <FaCalendarAlt size={28} color="white" />
                                </div>
                                <div className="content_icon_sec_4">
                                    <p className="txt_content_icon_sec_4">تاريخ انعقاد الدورة</p>
                                    <p className="txt_content_icon_sec_4">من 22/04/1978</p>
                                    <p className="txt_content_icon_sec_4">إلى 01/06/1978</p>
                                </div>
                            </div>

                            <div className="card_sec_4">
                                <div className="icon_sec_4">
                                    <FaHardHat size={28} color="white" />
                                </div>
                                <div className="content_icon_sec_4">
                                    <p className="txt_content_icon_sec_4">دورة برامج الهندسة المدنية</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                SECTION 5 — WHY JOIN
            ══════════════════════════════════════ */}
            <section className="section_5">
                <div className="section-inner">
                    <h2 className="section-heading">
                        لماذا تشترك <span>بمعهد التدريب</span>
                    </h2>
                    <div className="heading-bar" />

                    <div className="cards_sec_5">

                        <div className="card_sec_5">
                            <div className="div_icon">
                                <FaCogs className="my-custom-class" />
                            </div>
                            <div className="div_title">
                                <h2>خدمات متميزة</h2>
                            </div>
                            <div className="div_dis">
                                <p className="div_dis_txt">
                                    نقدم مجموعة من الخدمات منها البرامج التدريبية ومدارس التعليم الفنى
                                    والتدريب للشركات والجهات الحكومية.
                                </p>
                            </div>
                        </div>

                        <div className="card_sec_5">
                            <div className="div_icon">
                                <FaUsers className="my-custom-class" />
                            </div>
                            <div className="div_title">
                                <h2>مجموعة متميزة من المدربين</h2>
                            </div>
                            <div className="div_dis">
                                <p className="div_dis_txt">
                                    نعتمد على الخبرات والكفاءات البشرية الفريدة التي تتسم بقدر عالٍ
                                    من المهارات والقدرات.
                                </p>
                            </div>
                        </div>

                        <div className="card_sec_5">
                            <div className="div_icon">
                                <FaGraduationCap className="my-custom-class" />
                            </div>
                            <div className="div_title">
                                <h2>شهادات معتمدة دوليًا</h2>
                            </div>
                            <div className="div_dis">
                                <p className="div_dis_txt">
                                    حاصلون على ISO 9001:2015 ومعتمدون من معهد إدارة المشاريع PMI
                                    مع تحديث سنوي مستمر.
                                </p>
                            </div>
                        </div>

                        <div className="card_sec_5">
                            <div className="div_icon">
                                <FaLaptop className="my-custom-class" />
                            </div>
                            <div className="div_title">
                                <h2>جودة الخدمات التدريبية</h2>
                            </div>
                            <div className="div_dis">
                                <p className="div_dis_txt">
                                    الجودة تعني التميز في تقديم الخدمات بفاعلية خالية من الأخطاء
                                    وترقى لمستوى توقعات ورغبات المستفيدين.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}

export default Overview;