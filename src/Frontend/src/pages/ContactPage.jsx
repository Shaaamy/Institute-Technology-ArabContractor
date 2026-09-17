import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function ContactPage() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        document.title = isRTL
            ? 'اتصل بنا - المعهد التكنولوجي لهندسة التشييد والإدارة'
            : 'Contact Us - ICMT';
    }, [isRTL]);

    const cards = [
        {
            key: 'address',
            borderColor: 'border-blue-500',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            icon: <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />,
            content: <p className="leading-relaxed text-gray-600">{t('contact2.address')}</p>,
        },
        {
            key: 'phone',
            borderColor: 'border-green-500',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            icon: <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />,
            content: (
                <p className="text-gray-600">
                    <a href="tel:+20223892120" className="transition-colors hover:text-green-600">23892120 02 2+</a>
                </p>
            ),
        },
        {
            key: 'email',
            borderColor: 'border-purple-500',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            icon: <><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></>,
            content: (
                <p className="text-gray-600">
                    <a href="mailto:icemt@arabcont.com" className="break-all transition-colors hover:text-purple-600">icemt@arabcont.com</a>
                </p>
            ),
        },
        {
            key: 'fax',
            borderColor: 'border-orange-500',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
            icon: <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />,
            content: (
                <p className="text-gray-600">
                    <a href="tel:+20223892025" className="transition-colors hover:text-orange-600">23892025 02 2+</a>
                </p>
            ),
        },
    ];

    return (
        <div className="bg-white-50 min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Breadcrumb */}
            <div className="fixed left-0 z-50 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2" style={{ top: 70 }}>
                <div className="text-center">
                    <span className="text-base">
                        <Link to="/" className="ml-3 text-[#0865a8] font-bold hover:text-[#f57c00] transition-colors">
                            {t('nav.home')}
                        </Link>
                        <span className="text-gray-500 mx-1">-</span>
                        <span className="mr-3 text-gray-700">{t('contact2.title')}</span>
                    </span>
                </div>
            </div>

            <div className="pt-16">
                {/* Contact Cards */}
                <section className="from-blue-55 bg-gradient-to-b to-white py-12">
                    <div className="container mx-auto max-w-6xl px-4">
                        <h2 className="mb-12 text-center text-3xl font-bold text-gray-800">{t('contact2.sectionTitle')}</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {cards.map(({ key, borderColor, iconBg, iconColor, icon, content }) => (
                                <div key={key} className={`rounded-lg border-t-4 ${borderColor} bg-white p-6 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl`}>
                                    <div className="mb-4 flex justify-center">
                                        <div className={`flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}>
                                            <svg className={`h-8 w-8 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">{icon}</svg>
                                        </div>
                                    </div>
                                    <h4 className="mb-3 text-xl font-semibold text-gray-800">{t(`contact2.${key}`)}</h4>
                                    {content}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Map */}
                <section className="bg-white py-12">
                    <div className="container mx-auto max-w-6xl px-4">
                        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">{t('contact2.mapTitle')}</h2>
                        <div className="overflow-hidden rounded-lg shadow-xl">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1726.693694379521!2d31.307966656640538!3d30.054428425055146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583effe7c41675%3A0x4135ec1bd4322411!2z2KfZhNmF2YLYp9mI2YTZiNmGINin2YTYudix2KggLSDYp9mE2YXYudmH2K8g2KfZhNiq2YPZhdmI2YTZiNis2Yog2YTZh9mG2K_Ys9ipINin2YTYqti02YrZitivINmI2KfZhNll2K_Yp9ix2Kk!5e0!3m2!1sen!2seg!4v1598525338596!5m2!1sen!2seg"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title={t('contact2.mapTitle')}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}