import React, { useEffect } from "react";
import './vision_goals.css';
import { FaHardHat, FaCalendarAlt, FaUsers, FaLaptop, FaGraduationCap, FaCogs } from 'react-icons/fa';
import img2 from '/images/vision.jfif';
import img1 from '../../assets/img1.jpg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Vision_goals() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        document.title = isRTL
            ? 'الرؤية والأهداف - المعهد التكنولوجي لهندسة التشييد والإدارة'
            : 'Vision & Goals - ICEMT';
    }, [isRTL]);

    return (
        <div className="page-root-vision" style={{ fontFamily: '"Noto Kufi Arabic", serif', direction: isRTL ? 'rtl' : 'ltr' }}>

            {/* Fixed breadcrumb bar */}
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                    <Link
                        to="/"
                        style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: isRTL ? '8px' : 0, marginRight: isRTL ? 0 : '8px' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}
                    >
                        {t('nav.home')}
                    </Link>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151', marginRight: isRTL ? '8px' : 0, marginLeft: isRTL ? 0 : '8px' }}>
                        {t('vision.pageTitle')}
                    </span>
                </div>
            </div>

            {/* Hero */}
            <section className="vision-hero">
                <div className="vision-hero-accent" />
                <div className="vision-hero-content">
                    <span className="vision-hero-eyebrow">{t('footer.instituteName')}</span>
                    <h1 className="vision-hero-title">
                        {t('vision.heroTitle')} <em>{t('vision.heroTitleAccent')}</em>
                    </h1>
                </div>
            </section>

            {/* Section 1 — Vision & Mission */}
            <section className="vision-mission-section">
                <div className="section-inner">
                    <div className="vision-mission-container">

                        <div className="image-container">
                            <img src={img1} alt={t('vision.visionMissionAlt')} className="main-image" />
                            <div className="image-overlay">
                                <h2 className="overlay-title">{t('vision.visionMissionOverlay')}</h2>
                            </div>
                        </div>

                        <div className="vision-mission-grid">
                            <div className="vision-section">
                                <h2 className="section-title" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('vision.visionTitle')}</h2>
                                <p className="text-content" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                    {t('vision.visionText')}
                                </p>
                            </div>
                            <div className="mission-section">
                                <h2 className="section-title" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('vision.missionTitle')}</h2>
                                <p className="text-content" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                    {t('vision.missionText')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2 — Strategy */}
            <section className="strategy-container">
                <div className="section-inner">
                    <div className="strategy-wrapper">

                        <div className="image-container">
                            <img src={img2} alt={t('vision.strategyAlt')} className="main-image" />
                            <div className="image-overlay">
                                <h2 className="overlay-title">{t('vision.strategyOverlay')}</h2>
                            </div>
                        </div>

                        <div className="strategy-section">
                            <span className="section-label">{t('vision.strategyLabel')}</span>
                            <h2 className="section-heading" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                                {t('vision.strategyHeading')} <span>{t('vision.strategyHeadingAccent')}</span>
                            </h2>
                            <div className="heading-bar" />

                            <div className="strategy-items">
                                {[
                                    { key: 'strategy1', icon: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z' },
                                    { key: 'strategy2', icon: 'M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z' },
                                    { key: 'strategy3', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' },
                                    { key: 'strategy4', icon: 'M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z' },
                                ].map(({ key, icon }) => (
                                    <div className="strategy-item" key={key}>
                                        <div className="icon-box">
                                            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path d={icon} />
                                            </svg>
                                        </div>
                                        <p className="strategy-text" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t(`vision.${key}`)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3 — Goals */}
            <section className="goals-container">
                <div className="goals-wrapper">
                    <div className="goals-title-section">
                        <h2 className="goals-title">
                            <em>{t('vision.goalsTitle')}</em>
                        </h2>
                        <p className="goals-subtitle">{t('vision.goalsSubtitle')}</p>
                    </div>

                    <div className="bottom-boxes">
                        {['goal1', 'goal2', 'goal3'].map((key, i) => (
                            <div className="goal-box" key={key}>
                                <div className="goal-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon-svg">
                                        {i === 0 && <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />}
                                        {i === 1 && <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />}
                                        {i === 2 && <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />}
                                    </svg>
                                </div>
                                <p className="goal-text" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t(`vision.${key}`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Vision_goals;