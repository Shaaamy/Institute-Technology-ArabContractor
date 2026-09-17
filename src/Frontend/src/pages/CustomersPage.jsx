import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const customers = [{ id: 1, name: 'جامعة حلوان', image: 'customer01.jpg' }, { id: 2, name: 'جامعة القاهرة', image: 'customer02.jpg' }, { id: 3, name: 'نقابه المهندسين المصرية العامة', image: 'customer03.jpg' }, { id: 4, name: 'المعهد العالى للتكنولوجيا السادس من اكتوبر', image: 'customer04.jpg' }, { id: 5, name: 'مصر الجديدة للإسكان والتعمير', image: 'customer05.jpg' }, { id: 6, name: 'المعهد العالى للتكنولوجيا العاشر من رمضان', image: 'customer06.jpg' }, { id: 7, name: 'جامعة المنوفية', image: 'customer07.jpg' }, { id: 8, name: 'جامعة عين شمس', image: 'customer08.jpg' }, { id: 9, name: 'جامعة 6 اكتوبر', image: 'customer09.jpg' }, { id: 10, name: '(مختار ابراهيم سابقا)المقاولات المصرية', image: 'customer10.jpg' }, { id: 11, name: 'جامعة قناة السويس', image: 'customer11.jpg' }, { id: 12, name: 'الجامعة الامريكية', image: 'customer12.jpg' }, { id: 13, name: 'العربية العامة للمقاولات', image: 'customer13.jpg' }, { id: 14, name: 'شركة بتروجيت', image: 'customer14.jpg' }, { id: 15, name: 'مجموعة شركات طلعت مصطفى', image: 'customer15.jpg' }, { id: 16, name: 'جامعة جازان (المملكة العربية السعودية)', image: 'customer16.jpg' }, { id: 17, name: 'مودرن اكاديمي', image: 'customer17.jpg' }, { id: 18, name: 'جامعة الاهرام الكندية', image: 'customer18.jpg' }, { id: 19, name: 'هيئة المحطات النووية لتوليد الكهرباء', image: 'customer19.jpg' }, { id: 20, name: 'الجامعة الروسية', image: 'customer20.jpg' }, { id: 21, name: 'شركة فنسي الفرنسية', image: 'customer21.jpg' }, { id: 22, name: 'مؤسسة الثقافة العمالية', image: 'customer22.jpg' }, { id: 23, name: 'جامعة دمشق', image: 'customer23.jpg' }, { id: 24, name: 'مجلس التدريب الصناعى', image: 'customer24.jpg' }, { id: 25, name: 'جامعة السودان', image: 'customer25.jpg' }, { id: 26, name: 'جمعية المحاسبين والمراجعين المصرية', image: 'customer26.jpg' }, { id: 27, name: 'جامعة اليمن', image: 'customer27.jpg' }, { id: 28, name: 'نقابه المهندسين المصرية الفرعية بالقاهرة', image: 'customer28.jpg' }, { id: 29, name: 'وزارة الاسكان والمرافق والمجتمعات العمرانية', image: 'customer29.jpg' }, { id: 30, name: 'جمعية الهندسة الادارية', image: 'customer30.jpg' }, { id: 31, name: 'نقابه المهندسين المصرية الفرعية بدمياط', image: 'customer31.jpg' }, { id: 32, name: 'شركة خليج السويس ( جابكو )', image: 'customer32.jpg' }, { id: 33, name: 'شركة بترول بلاعيم', image: 'customer33.jpg' }, { id: 34, name: 'شركة غاز مصر', image: 'customer34.jpg' }, { id: 35, name: 'القابضة للتشييد والتعمير', image: 'customer35.jpg' }, { id: 36, name: 'طابا للمقاولات', image: 'customer36.jpg' }, { id: 37, name: 'الاتحاد المصرى لمقاولى التشييد و البناء', image: 'customer37.jpg' }, { id: 38, name: 'الصعيد العامة للمقاولات', image: 'customer38.jpg' }, { id: 39, name: 'النصر للمرافق والتركيبات', image: 'customer39.jpg' }, { id: 40, name: 'العامة للإنشاءات (رولان)', image: 'customer40.jpg' }, { id: 41, name: 'هيئة قناة السويس', image: 'customer41.jpg' }, { id: 42, name: 'الهيئة العامة للابنية التعليمية', image: 'customer42.jpg' }, { id: 43, name: 'دول الكومنولث', image: 'customer43.jpg' }, { id: 44, name: 'وزارة الاسكان اليمنية', image: 'customer44.jpg' }, { id: 45, name: 'وزارة الدفاع المصرية', image: 'customer45.jpg' }, { id: 46, name: 'البحر الاحمر العامة للمقاولات', image: 'customer46.jpg' }, { id: 47, name: 'رئاسة جمهورية مصر العربية', image: 'customer47.jpg' }, { id: 48, name: 'الجيزة العامة للمقاولات', image: 'customer48.jpg' }, { id: 49, name: 'النيل للخرسانة الجاهزة', image: 'customer49.jpg' }, { id: 50, name: 'النصر العامة للمقاولات (حسن علام)', image: 'customer50.jpg' }, { id: 51, name: 'مدينة نصر للإسكان والتعمير', image: 'customer51.jpg' }, { id: 52, name: 'العامة للمقاولات والاعمال الصحية والتكميلية', image: 'customer52.jpg' }, { id: 53, name: 'دريم لاند (احمد بهجت)', image: 'customer53.jpg' }, { id: 54, name: 'الهيئة العامة للطرق و الكبارى و النقل البرى', image: 'customer54.jpg' }, { id: 55, name: 'اطلس العامة للمقاولات', image: 'customer55.jpg' }, { id: 56, name: 'اتحاد عمال البناء', image: 'customer56.jpg' }, { id: 57, name: 'الهيئة القومية للانفاق', image: 'customer57.jpg' }, { id: 58, name: 'القاهرة العامة للمقاولات', image: 'customer58.jpg' }, { id: 59, name: 'النصر العامة للأعمال المدنية', image: 'customer59.jpg' }, { id: 60, name: 'الدلتا العامة للمقاولات المصرية للإنشاءات', image: 'customer60.jpg' }, { id: 61, name: 'وزارة الاسكان البحرانية', image: 'customer61.jpg' }, { id: 62, name: 'هندسة المنشآت العسكرية الكويتية', image: 'customer62.jpg' }, { id: 63, name: 'وزارة الاسكان السودانية', image: 'customer63.jpg' }, { id: 64, name: 'وزارة البترول الليبية', image: 'customer64.jpg' }, { id: 65, name: 'الشمس للإسكان والتعمير', image: 'customer65.jpg' }, { id: 66, name: 'مصر لأعمال الاسمنت المسلح', image: 'customer66.jpg' }, { id: 67, name: 'المكتب العربي للتصميمات', image: 'customer67.jpg' }, { id: 68, name: 'المحمودية العامة للمقاولات', image: 'customer68.jpg' }, { id: 69, name: 'النصر للمباني والانشاءات', image: 'customer69.jpg' }, { id: 70, name: 'شركة مصر الدولية للمقاولات', image: 'customer70.jpg' }, { id: 71, name: 'شركة AHD', image: 'customer71.jpg' }, { id: 72, name: 'شركة ايفل', image: 'customer72.jpg' }, { id: 73, name: 'شركة ريدكون للتعمير', image: 'customer73.jpg' }, { id: 74, name: 'شركة الحازق', image: 'customer74.jpg' },];

const CustomersPage = () => {
    useEffect(() => {
        document.title = '       عملاؤنا - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);
    return (
        <div
            dir="rtl"
            className="min-h-screen bg-white font-['Droid_Arabic_Kufi']"
        >
            {/* Fixed Overview Bar — SAME STYLE & COLORS */}
            
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
                    <span style={{ color: '#374151', marginRight: '8px' }}>عملاؤنا</span>
                </div>
            </div>

            {/* PAGE CONTENT */}
            <div className="container mx-auto px-9 pt-[110px] pb-24 sm:px-9 lg:px-16">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h3 className="mb-2 text-3xl font-bold text-[#0865a8] md:text-4xl">
                        عملاؤنا
                    </h3>
                    <div className="mx-auto mb-3 h-1 w-20 rounded-full bg-[#f57c00]" />
                    <p className="text-gray-600">
                        نسعى دائمًا لإرضاء العميل بتقديم أفضل الخدمات
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {customers.map((item) => (
                        <div
                            key={item.id}
                            className="group flex flex-col items-center"
                        >
                            <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
                                <img
                                    src={`/images/${item.image}`}
                                    alt={item.name}
                                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            <h6 className="mt-4 line-clamp-2 px-2 text-center text-xs font-semibold text-gray-500 group-hover:text-[#0865a8] md:text-sm">
                                {item.name}
                            </h6>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomersPage;