import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useEffect } from 'react';

export default function TechnicalSchoolPage() {
    const [openAccordion, setOpenAccordion] = useState(null);
    const [openAccordion2, setOpenAccordion2] = useState(null);
    const [openAccordion3, setOpenAccordion3] = useState(null);

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const toggleAccordion2 = (id) => {
        setOpenAccordion2(openAccordion2 === id ? null : id);
    };

    const toggleAccordion3 = (id) => {
        setOpenAccordion3(openAccordion3 === id ? null : id);
    };

    const images = [
        { src: '/images/sch01.jpg', caption: 'اختبار الطلبة' },
        { src: '/images/sch02.jpg', caption: 'اختبار الطلبة' },
        { src: '/images/sch03.jpg', caption: 'فصول المدرسة' },
        { src: '/images/sch04.jpg', caption: 'فصول المدرسة' },
        { src: '/images/sch05.jpg', caption: 'قاعة الرسم' },
        { src: '/images/sch06.jpg', caption: 'قاعة الكمبيوتر' },
        { src: '/images/sch07.jpg', caption: 'ورشة الميكانيكا' },
        { src: '/images/sch08.jpg', caption: 'ورشة الميكانيكا' },
        { src: '/images/sch09.jpg', caption: 'معمل PLC' },
        { src: '/images/sch10.jpg', caption: 'دورات المياه' },
        { src: '/images/sch11.jpg', caption: 'الأوفيس والبوفيه' },
        { src: '/images/sch12.jpg', caption: 'فِناء المدرسة' }
    ];

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        document.title = '         تطوير التعليم الفني - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (

        <div style={{ fontFamily: '"Noto Kufi Arabic", serif', direction: 'rtl' }}>
            {/* ======== ADDED PART (NO CHANGE) ======== */}
           
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic",, serif', fontSize: '1rem' }}>
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
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #070707 0%, #0865a8 100%)',
                color: 'white',
                padding: '80px 20px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
                        مدرسة المقاولون العرب الثانوية الفنية 
                    </h1>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
                        للتعليم والتدريب المزدوج
                    </h2>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
                <div style={{ marginBottom: '40px', lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
                    <p style={{ marginBottom: '20px' }}>
                        يعاني السوق المصري من نقص شديد في العمالة المدربة في مجال معدات التشييد. ويزيد علي ذلك أن المعدات الجديدة أصبحت تتطلب مهارات لا يستطيع نظام التعليم الفني أو التدريب الحالي تحقيقه. وهذا حدا بالعديد من الشركات إلي البدء في استيراد هذه العمالة المدربة من خارج مصر.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                        وحيث إن النقص واضح في المهن المتعلقة بالمعدات الثقيلة وخاصة ما يتعلق بالتشغيل والصيانة و الإصلاح الميكانيكي والكهربي والتحكم وذلك في حفر الأنفاق ومعدات تحريك التربة ومعدات حفر الأساسات. حيث تطلب هذه المعدات كفاءة كبيره لتشغيلها نظرا لارتفاع تكلفتها الاستثمارية وكذا احتياجها لمعلومات متعددة في مجال الكهرباء والميكانيكا والتحكم.
                    </p>
                    <p>
                        والشركة كجزء من السوق المحلي والعالمي تحتاج إلي هذه المهن كما أن الشركة رائده في مجال تطوير التعليم الفني والمهني منذ أعوام كبيرة والتوسع في هذه النوعية من المهن يوفر احتياجاتها في مشروعاتها كما يوفر احتياجات الشركات الأخرى في مصر والعالم مما يسهم في تقليل نسبة البطالة و كذا زيادة عائدات الدخل القومي وتحسين صورة التعليم الفني عن طريق إيجاد فرص عمل لائقة وذات عائد مجزي للشباب.
                    </p>
                </div>

                {/* Image Gallery */}
                <div style={{ marginBottom: '60px', backgroundColor: '#f5f5f5', padding: '30px', borderRadius: '15px' }}>
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <img
                            src={images[currentImage].src}
                            alt={images[currentImage].caption}
                            style={{ width: '100%', height: 'auto', borderRadius: '10px', maxHeight: '500px', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '10px 30px',
                            borderRadius: '25px',
                            fontSize: '1.1rem'
                        }}>
                            {images[currentImage].caption}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img.src}
                                alt={img.caption}
                                onClick={() => setCurrentImage(index)}
                                style={{
                                    width: '120px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: currentImage === index ? '3px solid #f57c00' : '3px solid transparent',
                                    transition: '0.3s'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Accordion Section 1: Vision, Mission, Goals */}
                <div style={{ marginBottom: '60px' }}>
                    {[
                        {
                            id: 1,
                            title: 'الرؤية',
                            content: 'قيام الشركة ببناء قدراتها على كافة المستويات وخاصة الفنية والحرفية لسد العجز في بعض التخصصات التي تتطلب مهارات تقنية عالية وأن تساهم الشركة في حل مشكلة البطالة بالدولة'
                        },
                        {
                            id: 2,
                            title: 'الرسالة',
                            content: 'قيام الشركة ببناء قدراتها على كافة المستويات وخاصة الفنية والحرفية لسد العجز في بعض التخصصات التي تتطلب مهارات تقنية عالية و أن تساهم الشركة في حل مشكلة البطالة بالدولةتوفير برامج التعليم الفني والتدريب المهني المبتكر المتصلة بإحتياجات سوق العمل المحلى والدولي ووفقًا للمعايير الدولية، مع التركيز على المهارات والكفاءات والجدارات وبناء الشخصية'
                        },
                        {
                            id: 3,
                            title: 'الأهداف',
                            content: null,
                            list: [
                                'توفير إحتياجات الشركة المستقبلية من الفنيين المهرة في مجال المعدات الثقيلة وذلك لمهنة صيانة وإصلاح المعدات الثقيلة.',
                                'التركيز على إكساب الخريجين المهارات الحياتية وخاصة تلك المتعلقة بثقافة العمل واللغة الإنجليزية وذلك بدءا من سن صغير نسبيا.',
                                'استقبال الطلاب الحاصلين على الشهادة الإعدادية بالمدرسة بالتنسيق مع وزارة التربية والتعليم لإعدادهم وتأهيلهم بعناية وفقا لمتطلبات العمل بمشاريع الشركة للحصول على مؤهل دبلوم فني بنظام الثلاث سنوات للعمل بالمشاريع القومية المختلفة بالدولة.',
                                'إنشاء نظام مستدام لتوفير الفنيين المتخصصين في مجال المعدات الثقيلة بالشركة',
                                'المساهمة في توفير العمالة المدربة للدولة وتقليل البطالة من خلال هذا النموذج المستدام يمكن التوسع في تطبيقه في الشركات ومنظومات العمل الأخرى.'
                            ]
                        },
                        {
                            id: 4,
                            title: 'وصف للدراسة والتدريب',
                            content: null,
                            list: [
                                'المؤهل دبلوم المدارس الثانوية الفنيه نظام الثلاث سنوات.',
                                'مدة الدراسة والتدريب ثلاث سنوات دراسية .',
                                'العام الدراسي 11 شهر ويمنح المتدرب أجازة سنوية شهر عن كل سنة بطلب توافق الشركة عليه.',
                                'يتلقى الطالب الدراسة النظرية في المدرسة يومان أسبوعياً.',
                                'يتلقى الطالب التدريبات المهنية 4 أيام أسبوعياً في المكان التدريبي .',
                                'الأجازة الصيفية ونصف العام للمدارس يتواجد الطالب بالشركة 6 أيام أسبوعياً .',
                                'يحصل الطالب على 21 يوم أجازة خلال الصيف بطلب يوافق المكان التدريبي علية. .',
                                'يحصل الطالب على دورات عملية داخل معامل وورش الشركه وخارجها .',
                                'في نهاية المرحلة تقوم الشركة بإبرام عقد توظيف للطلاب المتميزين براتب مناسب في حالة وجود أماكن خالية .',
                                'يقوم المعهد بترشيح الخريج إلى وظيفة بأحد الشركات في حالة عدم تعيينه بالشركه .'
                            ]
                        },
                        {
                            id: 5,
                            title: 'إنشاء المدرسة',
                            content: null,
                            list: [
                                'تم إبرام اتفاقية تعاون مع وزاره التربية و التعليم و التعليم الفني لإنشاء مدرسة ثانوية فنية صناعية للتعليم والتدريب المزدوج للمعدات الثقيلة داخل شركة المقاولون العرب بمقر مركز تدريب شبرا التابع لإدارة المعهد التكنولوجي لهندسة التشييد والإدارة.',
                                'تم إصدار قرار وزاري رقم (358) بإنشاء مدرسة المقاولون العرب الثانوية الفنية للتعليم و التدريب المزدوج التابعة لإدارة شرق شبرا الخيمة التعليمية بمحافظه القليوبية',
                                'تم إصدار قرار وزاري رقم (392) بمهنه صيانة وإصلاح المعدات الثقيلة بنظام التعليم المزدوج بمدرسة المقاولون العرب الثانوية الفنية للتعليم و التدريب المزدوج .'
                            ]
                        }
                    ].map((item) => (
                        <div key={item.id} style={{
                            marginBottom: '15px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '10px',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => toggleAccordion(item.id)}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    backgroundColor: openAccordion === item.id ? '#f57c00' : 'white',
                                    color: openAccordion === item.id ? 'white' : '#333',
                                    border: 'none',
                                    textAlign: 'right',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: '0.3s'
                                }}
                            >
                                {item.title}
                                <ChevronDown style={{
                                    transform: openAccordion === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: '0.3s'
                                }} />
                            </button>
                            {openAccordion === item.id && (
                                <div style={{ padding: '25px', backgroundColor: '#f9f9f9', lineHeight: '1.8' }}>
                                    {item.content && <p>{item.content}</p>}
                                    {item.list && (
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {item.list.map((listItem, index) => (
                                                <li key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                                                    <Check style={{ color: '#f57c00', marginLeft: '10px', marginTop: '5px', flexShrink: 0 }} size={20} />
                                                    <span>{listItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Section 2: Profession Details */}
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#f57c00',
                    textAlign: 'center'
                }}>
                    صيانة وإصلاح المعدات الثقيلة
                </h2>

                <div style={{ marginBottom: '60px' }}>
                    {[
                        {
                            id: 1,
                            title: 'تعريف بالمهنة',
                            content: 'العمل في مهنة صيانة وإصلاح المعدات ثقيلة بمجال التشييد و البناء يتطلب الإلمام بجانب من المعارف الأساسية وإتقان عدد من المهارات الأدائية مع بعض المعارف الخاصة بالأجزاء الميكانيكية و الكهربية للمعدة التي تمكن العامل من صيانة وإصلاح المعدات الثقيلة تحت إشراف , مع مراعاة تعليمات السلامة والصحة المهنية و الحفاظ على بيئة العمل.'
                        },
                        {
                            id: 2,
                            title: 'المهارات المعرفية',
                            content: 'يجب الإلمام بالمعارف و المعلومات الفنيه التى تساعده على انجاز العمل المكلف بأدائه على الوجه الأكمل وفقا للأصول الفنية المتعارف عليها . و على هذا يجب أن يكون ملماً بالمعارف و المعلومات الفنية الاتيه :-',
                            list: [
                                'جميع أنواع أجهزة القياس المختلفة وكيفية استخدامها وصيانتها والمحافظة عليها',
                                'معرفة محركات الديزل والبنزين ودورة الوقود و التزييت و التبريد ودوائر الكهرباء للمعدة و أجهزة نقل الحركة و دوائر الهيدروليك و الفرامل في المعدات.',
                                'معرفة مكونات الدوائر الهيدروليكية وطريقة عملها وتشخيص أعطالها.',
                                'معرفة المصطلحات التخصصية المرتبطة بالمفاهيم الميكانيكية في مجال المعدات الثقيلة.',
                                'معرفة إستراتيجية لتشخيص الأعطال الميكانيكية في منظومات ومكونات المعدة.',
                                'استخدام كتالوجات الخدمة والصيانة للأنواع المختلفة من المعدات والتعامل مع قطع غيار المعدات.',
                                'استخدام الأجهزة المختلفة في مجال المعدات لإجراء الاختبارات اللازمة على منظومات ومكونات المعدات.'
                            ]
                        },
                        {
                            id: 3,
                            title: 'المهارات الادائية',
                            content: 'يجب ان يكون قادرا على اداء العمل المكلف بأدائه وفقا للأصول الفنية المتعارف عليها و على هذا يجب ان يكون متقنا للمهارات الادائية الفنية الاتية :-',
                            list: [
                                'استخدام أجهزة القياس والعدد المختلفة لإجراء الصيانة والإصلاحات اللازمة على منظومات ومكونات المعدة.',
                                'تنفيذ الصيانة والإصلاحات البسيطة لكل من محركات الديزل والبنزين ومجموعة الفرامل الهواء والزيت ومجموعة نقل الحركة (التورك كونفرتر والترانسميشن والكرونه) والمنظومات الهيدروليكية والدوائر الكهربائية بالمعدة.',
                                'فك وتركيب الأجزاء الآتية للمعدة الهيكل السفلي للمعدات ذات الكاتينة و الطلمبات والبلوف والمواتير والبساتم الهيدروليكية',
                                'تجهيز الأجزاء والخامات لإجراء العمليات الصناعية من لحام وشنكرة والترميز والتذنيب ونشر للصاج والمواسير.',
                                'تنفيذ إجراءات وتعليمات الأمن والسلامة داخل ورش المعدات قبل الشروع في أداء أي عمل يوكل إليه.'
                            ]
                        }
                    ].map((item) => (
                        <div key={item.id} style={{
                            marginBottom: '15px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '10px',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => toggleAccordion2(item.id)}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    backgroundColor: openAccordion2 === item.id ? '#0865a8' : 'white',
                                    color: openAccordion2 === item.id ? 'white' : '#333',
                                    border: 'none',
                                    textAlign: 'right',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: '0.3s'
                                }}
                            >
                                {item.title}
                                <ChevronDown style={{
                                    transform: openAccordion2 === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: '0.3s'
                                }} />
                            </button>
                            {openAccordion2 === item.id && (
                                <div style={{ padding: '25px', backgroundColor: '#f9f9f9', lineHeight: '1.8' }}>
                                    {item.content && <p style={{ marginBottom: '15px' }}>{item.content}</p>}
                                    {item.list && (
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {item.list.map((listItem, index) => (
                                                <li key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                                                    <Check style={{ color: '#0865a8', marginLeft: '10px', marginTop: '5px', flexShrink: 0 }} size={20} />
                                                    <span>{listItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Section 3: Application Details */}
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#f57c00',
                    textAlign: 'center'
                }}>
                    التقديم بمدرسة المقاولون العرب الثانوية الفنية للتعليم والتدريب المزدوج لحاملي الإعدادية للعام 2020/2021
                </h2>

                <div style={{ marginBottom: '60px' }}>
                    {[
                        {
                            id: 1,
                            title: 'عنوان مدرسة المقاولون العرب الثانوية الفنية للتعليم والتدريب المزدوج',
                            list: [
                                '10 شارع 6 أكتوبر - ترعة الإسماعيلية بجوار إدارة المصانع الورش المركزية للمقاولون العرب .',
                                'تم تجهيز المدرسة بأحدث الوسائل التعليمية، والتي تشمل ورش عمل ، ومعمل PLC، فضلا عن معامل الكمبيوتر و قاعات للرسم .'
                            ]
                        },
                        {
                            id: 2,
                            title: 'تنسيق مدرسة المقاولون العرب الثانوية الفنية للتعليم والتدريب المزدوج',
                            content: 'أعلنت مدرسة المقاولون العرب للتعليم والتدريب المزدوج عن بدء قبول عدد (15) طالب للعام 2020/2021 م من الطلبة الحاصلين على الشهادة الإعدادية عام 2020م بحــد أدنى 255 درجة'
                        },
                        {
                            id: 3,
                            title: 'شروط التقدم للمدرسة',
                            list: [
                                'أن يكون الطالب حاصل على شهادة الإعدادية عام ٢٠٢٠ م من مدارس محافظة القليوبية.',
                                'ألا يقل مجموع الطالب المتقدم عن ٢٥٥ درجــة.',
                                'ألا يزيد سن الطالب في 1/١٠/2020 م عن (١٨) ثمانية عشر عاما والأفضلية للأصغر سناً.',
                                'أن يكون مصري الجنسية.',
                                'اجتياز الطالب للاختبارات والكشف الطبي والمقابلة الشخصية التي ستجرى بمقر الشركة.',
                                'في حالة اجتياز الطالب للاختبارات والكشف الطبي والمقابلة الشخصية لا يعد قبوله بالمدرسة نهائيا إلا بعد تقديم أصل المستندات المطلوبة مع كتابة إقرار من ولى الأمر بأنه غير مقيد بمدرسة أخرى.',
                                'سوف يتم تحديد مواعيد الاختبارات والمقابلة الشخصية تباعاً.'
                            ]
                        },
                        {
                            id: 4,
                            title: 'المستندات المطلوبة',
                            list: [
                                'ملف التقديم من وزاره التربيه و التعليم و التعليم الفنى .',
                                'صورة استمارة النجاح بالشهادة لإعدادية للعام 2019/2020 م.',
                                'صورة شهادة الميلاد.',
                                'صورة بطاقة الرقم القومي لولى الأمر.',
                                'عدد (4) صور شخصية للطالب.',
                                'استيفاء نموذج طلب التقديم المعد لذلك بمقر المدرسة بشركة المقاولون العرب.'
                            ]
                        },
                        {
                            id: 5,
                            title: 'مميزات المدرسة',
                            list: [
                                'التعليم و التدريب العملى 80 % بالمصنع و20 % بالمدرسة.',
                                'شهادة خبره معتمده من شركه المقاولون العرب',
                                'الزي المدرسي .',
                                'تأمين طبي.',
                                'وجبات غذائية.',
                                'مصروف جيب (بواقع 20جنيه الصف الأول/يوميا، بواقع 25 جنيها الصف الثاني/يوميا، بواقع 30 جنيها الصف الثالث/يوميا)',
                                'ممارسه النشاط الرياضي بنادى المقاولون العرب الرياضي'
                            ]
                        }
                    ].map((item) => (
                        <div key={item.id} style={{
                            marginBottom: '15px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '10px',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => toggleAccordion3(item.id)}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    backgroundColor: openAccordion3 === item.id ? '#f57c00' : 'white',
                                    color: openAccordion3 === item.id ? 'white' : '#333',
                                    border: 'none',
                                    textAlign: 'right',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: '0.3s'
                                }}
                            >
                                {item.title}
                                <ChevronDown
                                    style={{
                                        transform:
                                            openAccordion3 === item.id
                                                ? 'rotate(180deg)'
                                                : 'rotate(0deg)',
                                        transition: '0.3s'
                                    }}
                                />
                            </button>

                            {openAccordion3 === item.id && (
                                <div
                                    style={{
                                        padding: '25px',
                                        backgroundColor: '#f9f9f9',
                                        lineHeight: '1.8'
                                    }}
                                >
                                    {item.content && (
                                        <p style={{ marginBottom: '15px' }}>{item.content}</p>
                                    )}

                                    {item.list && (
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {item.list.map((listItem, index) => (
                                                <li
                                                    key={index}
                                                    style={{
                                                        marginBottom: '15px',
                                                        display: 'flex',
                                                        alignItems: 'flex-start'
                                                    }}
                                                >
                                                    <Check
                                                        size={20}
                                                        style={{
                                                            color: '#f57c00',
                                                            marginLeft: '10px',
                                                            marginTop: '5px',
                                                            flexShrink: 0
                                                        }}
                                                    />
                                                    <span>{listItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
