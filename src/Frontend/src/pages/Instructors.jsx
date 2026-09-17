import React, { useState, useEffect } from 'react';

const Instructors = () => {
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'https://acwebsite-icmet-test.azurewebsites.net/api';

    // الـ pic من الـ API بييجي full URL زي:
    // "https://acwebappbackup.blob.core.windows.net/icemt/lecturers/lect01.jpg"
    // استخدمه مباشرة بدون أي prefix
    const getPhotoSrc = (pic) => {
        if (!pic) return null;
        return pic;
    };

    const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23dde3ea' width='100' height='100'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='44' fill='%23899aaa'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E";

    useEffect(() => {
        document.title = 'محاضرينا - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    useEffect(() => {
        const fetchLecturers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/Lecturer`);
                if (!response.ok) throw new Error('فشل في تحميل بيانات المحاضرين');
                const data = await response.json();
                // فلتر entries التجريبية اللي name فيها "string"
                const real = data.filter(l => l.name && l.name !== 'string');
                setLecturers(real);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLecturers();
    }, []);

    const handleLecturerClick = async (lecturerId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Lecturer/${lecturerId}`);
            if (!response.ok) throw new Error('فشل في تحميل تفاصيل المحاضر');
            const detailedData = await response.json();
            setSelectedLecturer(detailedData);
        } catch (err) {
            alert('حدث خطأ في تحميل تفاصيل المحاضر');
        }
    };

    const parseHTMLContent = (htmlString) => {
        if (!htmlString) return [];
        const div = document.createElement('div');
        div.innerHTML = htmlString;
        const sections = [];
        let current = { title: null, items: [] };

        const hasH5 = div.querySelector('h5') !== null;
        const hasP = div.querySelector('p') !== null;
        const hasLi = div.querySelector('li') !== null;

        if (hasH5 || hasP) {
            div.querySelectorAll('h5, p').forEach((node) => {
                const text = node.textContent.trim();
                if (!text) return;
                if (node.tagName === 'H5') {
                    if (current.title !== null || current.items.length > 0) sections.push(current);
                    current = { title: text, items: [] };
                } else {
                    current.items.push(text);
                }
            });
            if (current.title !== null || current.items.length > 0) sections.push(current);
            return sections;
        }

        if (hasLi) {
            const items = Array.from(div.querySelectorAll('li')).map(li => li.textContent.trim()).filter(Boolean);
            return [{ title: null, items }];
        }

        const divTags = div.querySelectorAll('div');
        if (divTags.length > 0) {
            const items = Array.from(divTags).map(d => d.textContent.trim()).filter(Boolean);
            return [{ title: null, items }];
        }

        const lines = htmlString.replace(/<[^>]+>/g, '\n').split('\n').map(l => l.trim()).filter(Boolean);
        return [{ title: null, items: lines }];
    };

    const renderParsedContent = (htmlString) => {
        const sections = parseHTMLContent(htmlString);
        if (!sections.length) return null;
        return sections.map((section, sIdx) => (
            <div key={sIdx} className={sIdx > 0 ? 'mt-5' : ''}>
                {section.title && (
                    <p className="mb-2 text-sm font-bold text-blue-700">{section.title}</p>
                )}
                <div className="space-y-2">
                    {section.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-start gap-2">
                            <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-orange-500"></span>
                            <p className="text-sm leading-relaxed text-gray-700">{item}</p>
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    const LecturerCard = ({ lecturer }) => {
        const src = getPhotoSrc(lecturer.pic);
        return (
            <div className="flex h-full flex-col rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-lg">
                <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="h-24 w-24 overflow-hidden rounded-lg shadow-md bg-gray-100">
                                <img
                                    src={src || FALLBACK}
                                    alt={lecturer.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                                />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="mb-2 text-lg font-bold text-orange-600">{lecturer.name}</h3>
                            <p className="mb-3 text-sm leading-relaxed text-gray-700">{lecturer.course}</p>
                            <div className="flex gap-2">
                                {lecturer.telephone && (
                                    <div className="rounded-md bg-orange-50 p-2" title={lecturer.telephone}>
                                        <svg className="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                                        </svg>
                                    </div>
                                )}
                                {lecturer.email && (
                                    <div className="rounded-md bg-gray-100 p-2" title={lecturer.email}>
                                        <svg className="h-4 w-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => handleLecturerClick(lecturer.id)}
                        className="w-full mt-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                        </svg>
                        السيرة الذاتية
                    </button>
                </div>
            </div>
        );
    };

    const CVDialog = ({ lecturer, onClose }) => {
        if (!lecturer) return null;
        const src = getPhotoSrc(lecturer.pic);
        return (
            <div
                className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50"
                onClick={onClose}
                style={{ paddingTop: '80px', paddingBottom: '80px' }}
            >
                <div
                    className="mx-4 my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative rounded-t-2xl bg-gradient-to-bl from-blue-700 to-blue-600 p-6 text-center">
                        <button
                            onClick={onClose}
                            className="absolute left-4 top-4 rounded-full p-2 text-white transition-colors hover:bg-white hover:bg-opacity-20"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-200">
                            <img
                                src={src || FALLBACK}
                                alt={lecturer.name}
                                className="h-full w-full object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
                            />
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-white">{lecturer.name}</h2>
                        <p className="text-white text-opacity-90">{lecturer.course}</p>
                    </div>

                    <div className="max-h-[calc(100vh-280px)] overflow-y-auto p-6">
                        {lecturer.mainEdu && (
                            <div className="mb-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-blue-700">المؤهل الرئيسي</h3>
                                </div>
                                <div className="rounded-lg border border-gray-300 bg-yellow-50 p-4">
                                    <p className="text-sm leading-relaxed text-gray-700">{lecturer.mainEdu}</p>
                                </div>
                            </div>
                        )}

                        {lecturer.edu && (
                            <>
                                <div className="mb-6">
                                    <div className="mb-3 flex items-center gap-2">
                                        <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                                        </svg>
                                        <h3 className="text-xl font-bold text-blue-700">التعليم والشهادات</h3>
                                    </div>
                                    <div className="rounded-lg border border-gray-300 bg-yellow-50 p-4">
                                        {renderParsedContent(lecturer.edu)}
                                    </div>
                                </div>
                                <hr className="my-6 border-gray-300" />
                            </>
                        )}

                        {lecturer.details && (
                            <>
                                <div className="mb-6">
                                    <div className="mb-3 flex items-center gap-2">
                                        <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                                        </svg>
                                        <h3 className="text-xl font-bold text-blue-700">الخبرات والتفاصيل</h3>
                                    </div>
                                    <div className="rounded-lg border border-gray-300 bg-yellow-50 p-4">
                                        {renderParsedContent(lecturer.details)}
                                    </div>
                                </div>
                                <hr className="my-6 border-gray-300" />
                            </>
                        )}

                        {(lecturer.telephone || lecturer.email) && (
                            <div className="mb-6">
                                <div className="mb-3 flex items-center gap-2">
                                    <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-blue-700">وسائل الإتصال</h3>
                                </div>
                                <div className="space-y-3 rounded-lg border border-gray-300 bg-yellow-50 p-4">
                                    {lecturer.telephone && (
                                        <div className="flex items-start gap-3">
                                            <svg className="h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                                            </svg>
                                            <p className="text-sm text-gray-700"><span className="font-bold">تليفون: </span>{lecturer.telephone}</p>
                                        </div>
                                    )}
                                    {lecturer.email && (
                                        <div className="flex items-start gap-3">
                                            <svg className="h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                            </svg>
                                            <p className="text-sm text-gray-700"><span className="font-bold">البريد الإلكتروني: </span>{lecturer.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={onClose}
                            className="w-full rounded-lg bg-orange-600 px-4 py-3 font-bold text-white transition-colors duration-200 hover:bg-orange-700"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
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
                    <span style={{ color: '#374151', marginRight: '8px' }}>محاضرينا</span>
                </div>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-bl from-blue-700 to-blue-600 px-5 py-10 text-center" style={{ marginTop: 40 }}>
                <svg className="mx-auto mb-4 h-16 w-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
                <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">لدينا مجموعة من أكفأ المحاضرين</h1>
                <p className="text-xl text-white text-opacity-90">قائمة المحاضرين</p>
            </div>

            {/* Description */}
            <div className="px-5 py-8">
                <div className="rounded-xl bg-white p-6 text-center shadow-md">
                    <p className="leading-relaxed text-gray-700">
                        إن معهد للتدريب يضم دائما أقوى المحاضرين للإنضمام للعمل معنا يدا واحدة لتحقيق هدفنا، وهو السعي لتطوير التدريب، والمساعدة في تأهيل المتدربين وفتح آفاقا جديدة لهم باستخدام احدث النظم التدريبية، وأفضل تقنيات التدريب ولأجل ذلك نحن نسعى لضم كل الكفاءات الراغبة في العمل معنا لتحقيق تلك الأهداف، وللإنضمام الى قائمة المحاضرين بالمعهد
                    </p>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-700"></div>
                        <p className="text-lg text-gray-700">جاري تحميل المحاضرين...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mx-auto max-w-2xl px-5 pb-12">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                        <p className="mb-2 font-bold text-red-700">حدث خطأ</p>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            )}

            {!loading && !error && (
                <div className="mx-auto max-w-7xl px-5 pb-12">
                    {lecturers.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-lg text-gray-600">لا يوجد محاضرين متاحين حالياً</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {lecturers.map((lecturer) => (
                                <LecturerCard key={lecturer.id} lecturer={lecturer} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedLecturer && (
                <CVDialog lecturer={selectedLecturer} onClose={() => setSelectedLecturer(null)} />
            )}
        </div>
    );
};

export default Instructors;