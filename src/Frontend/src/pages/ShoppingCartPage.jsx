import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from "react-router-dom";
import { useAuth } from '@clerk/clerk-react';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

const CartItemFull = ({ item, onRemove }) => {
    return (
        <div className="group relative mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg md:mb-6">
            <div className="flex flex-col md:flex-row">
                <div className="relative flex items-center justify-center bg-gradient-to-br from-[#0865a8] to-[#f57c00] md:w-64">
                    <div className="p-10 md:p-12">
                        <BookOpen className="h-20 w-20 text-white md:h-24 md:w-24" strokeWidth={1.5} />
                    </div>
                    {item.badge && (
                        <span className="absolute left-2 top-2 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm md:left-3 md:top-3 md:px-3 md:py-1.5">
                            {item.badge}
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col p-4 md:p-6">
                    <div className="mb-2 flex items-start justify-between gap-3 md:mb-3">
                        <h3 className="flex-1 text-base font-bold leading-tight text-black md:text-lg lg:text-xl">
                            {item.title}
                        </h3>
                    </div>

                    {/* ── UPDATED: Mode badge (online / onsite) ── */}
                    {item.isOnline !== undefined && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                            backgroundColor: item.isOnline ? '#ede9fe' : '#e0f2fe',
                            color: item.isOnline ? '#7c3aed' : '#0865a8',
                            marginBottom: '10px', alignSelf: 'flex-start',
                            fontFamily: '"Noto Kufi Arabic", serif',
                        }}>
                            {item.isOnline ? '🌐 أونلاين' : '🏢 حضوري'}
                        </span>
                    )}

                    {(item.instructor || item.place) && (
                        <p className="mb-2 text-sm text-black md:mb-3">
                            <span className="font-semibold text-[#0865a8]">
                                {item.instructor || item.place || 'غير محدد'}
                            </span>
                        </p>
                    )}

                    <div className="mb-3 flex flex-wrap gap-2 text-xs text-black md:mb-4 md:gap-4">
                        {item.hours && item.hours > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold text-black">{item.hours}</span> ساعة
                            </span>
                        )}
                        {item.lectures && item.lectures > 0 && (
                            <span className="flex items-center gap-1">
                                <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="font-semibold text-black">{item.lectures}</span> محاضرة
                            </span>
                        )}
                        {item.level && (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#0865a8] md:px-2.5 md:py-1">
                                {item.level}
                            </span>
                        )}
                    </div>

                    {(item.place || item.date) && (
                        <div className="mb-3 flex flex-wrap gap-2 text-xs text-black md:mb-4 md:gap-3">
                            {item.place && (
                                <span className="flex items-center gap-1">
                                    <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="line-clamp-1">{item.place}</span>
                                </span>
                            )}
                            {item.date && (
                                <span className="flex items-center gap-1">
                                    <svg className="h-4 w-4 text-[#0865a8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{item.date}</span>
                                </span>
                            )}
                        </div>
                    )}

                    <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 pt-3 md:flex-row md:items-end md:justify-between md:gap-4 md:pt-4">
                        <button
                            onClick={() => onRemove(item.planworkId || item.id)}
                            className="flex items-center gap-1.5 text-xs font-medium text-red-600 transition-colors hover:text-red-700 md:gap-2 md:text-sm"
                        >
                            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            حذف
                        </button>

                        <div className="text-left md:text-right">
                            <span className="text-xl font-bold text-[#f57c00] md:text-2xl">
                                {(item.currentPrice || 0).toFixed(2)} ج.م
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ShoppingCartPage() {
    const { getToken, isSignedIn } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'سلة التسوق - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            try {
                if (isSignedIn) {
                    const token = await getToken();
                    if (!token) throw new Error("No token");

                    // ── GET /api/Cart ──
                    const response = await fetch(`${API_BASE}/cart`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) throw new Error("API failed");

                    const data = await response.json();
                    const rawItems = data.items || [];

                    const transformedItems = rawItems.map(item => ({
                        id: item.planworkId,
                        planworkId: item.planworkId,
                        title: item.title || "دورة تدريبية",
                        place: item.place || "",
                        date: item.date || "",
                        currentPrice: item.price ?? 0,
                        originalPrice: item.cost ?? item.price ?? 0,
                        slug: item.slug || "",
                        quantity: 1,
                        // ── UPDATED: carry isOnline from API response ──
                        isOnline: item.isOnline ?? item.IsOnline ?? false,
                    }));

                    setItems(transformedItems);
                } else {
                    // Guest: read from localStorage (CourseDetails stores isOnline there too)
                    const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
                    setItems(localCart);
                }
            } catch (error) {
                console.error("Cart load error:", error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        loadCart();
        window.addEventListener("purchaseCompleted", loadCart);
        return () => window.removeEventListener("purchaseCompleted", loadCart);
    }, [isSignedIn, getToken]);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem("cartItems", JSON.stringify(items));
            window.dispatchEvent(new Event("cartUpdated"));
        }
    }, [items, loading]);

    const handleRemove = async (planworkId) => {
        try {
            if (isSignedIn) {
                const token = await getToken();
                if (token) {
                    // ── DELETE /api/Cart/remove/{planworkId} ──
                    await fetch(`${API_BASE}/cart/remove/${planworkId}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
            }
            setItems(prev => prev.filter(item => (item.planworkId || item.id) !== planworkId));
        } catch (error) {
            console.error("Remove error:", error);
        }
    };

    const totalPrice = items.reduce((sum, item) => sum + ((item.currentPrice || 0) * (item.quantity || 1)), 0);

    if (loading) {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`* { font-family: "Noto Kufi Arabic", serif !important; } @media (max-width: 640px) { .cart-main { padding-top: 100px !important; } } @media (min-width: 641px) and (max-width: 1024px) { .cart-main { padding-top: 120px !important; } } @media (min-width: 1025px) { .cart-main { padding-top: 130px !important; } }`}</style>
                <div className="fixed left-0 z-40 w-full border-b border-gray-300 bg-[#F5F7E1] px-5 py-2" style={{ top: 70 }}>
                    <div className="text-center">
                        <span className="text-sm">
                            <a href="/" className="ml-3 text-gray-700">الصفحة الرئيسية</a>
                            <span className="text-gray-500"> - </span>
                            <span className="mr-3 font-semibold text-gray-900">سلة التسوق</span>
                        </span>
                    </div>
                </div>
                <div className="cart-main min-h-screen bg-white pb-12" dir="rtl">
                    <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                            <div className="text-center text-2xl font-bold text-[#0865a8]">جاري تحميل السلة...</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`
                * { font-family: "Noto Kufi Arabic", serif !important; }
                @media (max-width: 640px) { .cart-main { padding-top: 100px !important; } }
                @media (min-width: 641px) and (max-width: 1024px) { .cart-main { padding-top: 120px !important; } }
                @media (min-width: 1025px) { .cart-main { padding-top: 130px !important; } }
            `}</style>

            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic  ", serif', fontSize: '1rem' }}>
                    <a
                        href="/"
                        style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}
                    >
                        الصفحة الرئيسية
                    </a>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151', marginRight: '8px' }}>سلة التسوق</span>
                </div>
            </div>

            <div className="cart-main min-h-screen bg-white pb-12" dir="rtl">
                <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="mb-6 md:mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-black md:text-4xl lg:text-5xl">سلة التسوق</h1>
                        <p className="text-base text-black opacity-70 md:text-lg">
                            {items.length === 0 ? 'السلة فارغة' :
                                items.length === 1 ? 'دورة واحدة في السلة' :
                                    items.length === 2 ? 'دورتان في السلة' :
                                        `${items.length} دورات في السلة`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                        <div className="lg:col-span-2">
                            {items.length === 0 ? (
                                <div className="rounded-2xl bg-white p-12 text-center shadow-lg ring-1 ring-gray-200 md:p-16">
                                    <ShoppingCart className="mx-auto mb-4 h-20 w-20 text-gray-300 md:h-24 md:w-24" />
                                    <h3 className="mb-2 text-xl font-bold text-black md:text-2xl">سلة التسوق فارغة</h3>
                                    <p className="mb-6 text-sm text-black opacity-60 md:text-base">لم تقم بإضافة أي دورات إلى السلة بعد</p>
                                    <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 md:px-8">
                                        تصفح الدورات
                                        <ArrowRight className="h-4 w-4 rotate-180 md:h-5 md:w-5" />
                                    </Link>
                                </div>
                            ) : (
                                items.map(item => (
                                    <CartItemFull
                                        key={item.planworkId || item.id}
                                        item={item}
                                        onRemove={handleRemove}
                                    />
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="lg:col-span-1">
                                <div className="sticky top-28 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-200 md:top-32 md:p-6">
                                    <h2 className="mb-4 text-lg font-bold text-black md:mb-6 md:text-xl">ملخص الطلب</h2>

                                    <div className="mb-4 border-b border-gray-200 pb-4 md:mb-6 md:pb-6">
                                        <div className="flex items-center justify-between text-sm text-black opacity-70 md:text-base">
                                            <span>عدد الدورات</span>
                                            <span className="font-semibold">{items.length}</span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="mb-1 text-xs text-black opacity-60 md:text-sm">الإجمالي:</p>
                                        <p className="text-3xl font-bold text-[#f57c00] md:text-4xl">
                                            {totalPrice.toFixed(2)} ج.م
                                        </p>
                                    </div>

                                    <Link to="/checkout" className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl md:py-4">
                                        المتابعة للدفع
                                        <ArrowRight className="h-4 w-4 rotate-180 md:h-5 md:w-5" />
                                    </Link>

                                    <p className="mb-4 text-center text-xs text-black opacity-60 md:mb-6">🔒 معاملة آمنة ومحمية</p>

                                    <div className="mt-4 flex items-center justify-center gap-3 text-xs text-black opacity-60 md:mt-6 md:gap-4">
                                        <div className="flex items-center gap-1">
                                            <svg className="h-3.5 w-3.5 text-green-600 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </svg>
                                            SSL آمن
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg className="h-3.5 w-3.5 text-blue-600 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                                            </svg>
                                            دفع آمن
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}