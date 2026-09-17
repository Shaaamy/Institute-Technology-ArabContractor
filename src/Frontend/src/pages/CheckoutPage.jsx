/**
 * CheckoutPage.jsx — UPDATED TERMS & REFUND POLICY
 *
 * الشروط والأحكام وسياسة الاسترجاع محدّثة من الوثيقة الرسمية للمعهد.
 */

import { useState, useEffect, useRef } from "react";
import {
    ArrowRight, ShieldCheck, Lock, Tag,
    BookOpen, AlertCircle, X, FileText, RotateCcw
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = "https://acwebsite-icmet-test.azurewebsites.net";

// ── Helper: normalize item من الـ API response ──────────────────────────────
function normalizeCartItem(item) {
    return {
        id: item.planworkId,
        planworkId: item.planworkId,
        title: item.title || item.courseName || "دورة تدريبية",
        currentPrice: item.price ?? 0,
        originalPrice: item.cost ?? item.price ?? 0,
        place: item.place,
        date: item.date,
        days: item.days,
        slug: item.slug,
        courseImage: item.courseImage,
        quantity: 1,
    };
}

// ── Terms & Conditions Modal ─────────────────────────────────────────────────
function TermsModal({ onClose, onAccept }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.55)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
            <div style={{
                background: '#fff', borderRadius: 18, width: '100%', maxWidth: 640,
                maxHeight: '88vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
                fontFamily: '"Noto Kufi Arabic", serif'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(90deg,#0865a8,#f57c00)',
                    padding: '18px 24px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText style={{ width: 22, height: 22, color: '#fff' }} />
                        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
                            الشروط والأحكام وسياسة الاسترجاع
                        </h2>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.2)', border: 'none',
                        borderRadius: '50%', width: 32, height: 32,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#fff'
                    }}>
                        <X style={{ width: 18, height: 18 }} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div style={{
                    overflowY: 'auto', padding: '24px',
                    direction: 'rtl', lineHeight: 2,
                    color: '#374151', fontSize: '0.875rem'
                }}>

                    {/* Legal Notice */}
                    <div style={{
                        background: '#f0f9ff', border: '1px solid #bae6fd',
                        borderRadius: 12, padding: '14px 18px', marginBottom: 24
                    }}>
                        <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.85rem', lineHeight: 1.9 }}>
                            <strong>تنويه قانوني: </strong>
                            باستخدامكم لموقع المعهد التكنولوجي لهندسة التشييد والإدارة أو تسجيلكم في أي من الدورات التدريبية أو برامج التدريب الصيفي، فإنكم تقرّون وتوافقون على الالتزام التام بالشروط والأحكام الآتية، والتي تمثل اتفاقًا قانونيًا ملزمًا بين المتقدم والمعهد.
                        </p>
                    </div>

                    {/* ══ TERMS & CONDITIONS ══ */}
                    <h3 style={{
                        fontWeight: 700, color: '#0865a8', fontSize: '1rem',
                        borderRight: '4px solid #0865a8', paddingRight: 12, marginBottom: 16
                    }}>
                        الشروط والأحكام للدورات التدريبية وبرامج التدريب الصيفي
                    </h3>

                    {/* 1. التسجيل */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: 10 }}>١. التسجيل</h4>
                        <ul style={{ paddingRight: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <li>يتعين على المتدرب تقديم بيانات صحيحة وكاملة عند التسجيل.</li>
                            <li>يعتبر التسجيل أوليًا ولا يُعد مؤكدًا إلا بعد سداد الرسوم كاملة من خلال بوابة الدفع المعتمدة.</li>
                            <li>يحتفظ المعهد بالحق في قبول أو رفض أي طلب تسجيل دون إبداء أسباب ودون أي مسؤولية قانونية.</li>
                        </ul>
                    </div>

                    {/* 2. الدفع الإلكتروني */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: 10 }}>٢. الدفع الإلكتروني</h4>
                        <ul style={{ paddingRight: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <li>تتم عمليات الدفع من خلال بوابة الدفع الخاصة ببنك مصر وفقًا للمعايير الأمنية المعتمدة.</li>
                            <li>يعتبر إتمام عملية الدفع قبولًا نهائيًا لهذه الشروط والأحكام وسياسة الاسترجاع.</li>
                        </ul>
                    </div>

                    {/* 3. تعديل أو إلغاء الدورات */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: 10 }}>٣. تعديل أو إلغاء الدورات</h4>
                        <ul style={{ paddingRight: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <li>يحتفظ المعهد بالحق في تعديل مواعيد الدورات أو مكونات برامج التدريب الصيفي أو محاضريها أو محاورها التدريبية وفقًا للظروف التنظيمية دون تحمل أي مسؤولية قانونية.</li>
                            <li>في حال إلغاء أي دورة تدريبية أو برنامج تدريب صيفي قبل بدايته من جانب المعهد، يتم رد كامل الرسوم للمتقدم.</li>
                        </ul>
                    </div>

                    {/* 4. استخدام المواد التعليمية */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: 10 }}>٤. استخدام المواد التعليمية</h4>
                        <p style={{ margin: 0, paddingRight: 4, lineHeight: 1.9 }}>
                            جميع المواد التدريبية ووسائل الشرح والمحتوى العلمي المتاح ضمن الدورات التدريبية أو التدريب الصيفي ملك للمعهد، ولا يجوز إعادة استخدامها، أو نشرها، أو تصويرها، أو تداولها بأي وسيلة دون إذن كتابي مسبق.
                        </p>
                    </div>

                    {/* 5. حماية البيانات */}
                    <div style={{ marginBottom: 28 }}>
                        <h4 style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem', marginBottom: 10 }}>٥. حماية البيانات</h4>
                        <p style={{ margin: 0, paddingRight: 4, lineHeight: 1.9 }}>
                            يلتزم المعهد بالحفاظ على سرية بيانات المتدربين وعدم مشاركتها مع أي طرف خارجي إلا بالقدر الضروري لإتمام عمليات الدفع أو تنفيذ المتطلبات القانونية.
                        </p>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '2px dashed #e5e7eb', marginBottom: 24 }} />

                    {/* ══ REFUND POLICY ══ */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
                        border: '2px solid #f57c00', borderRadius: 14,
                        padding: '18px 20px', marginBottom: 20
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <RotateCcw style={{ width: 22, height: 22, color: '#f57c00', flexShrink: 0 }} />
                            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#92400e', margin: 0 }}>
                                سياسة الاسترجاع — Refund Policy
                            </h3>
                        </div>
                        <p style={{ margin: '0 0 12px', color: '#78350f', fontSize: '0.85rem', lineHeight: 1.8 }}>
                            تنطبق السياسة التالية على: <strong>الدورات التدريبية</strong> وكذلك <strong>برامج التدريب الصيفي لطلبة الجامعات</strong>.
                        </p>

                        {/* Case 1 */}
                        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 10, borderRight: '4px solid #16a34a' }}>
                            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#14532d', fontSize: '0.88rem' }}>
                                ١. الاسترجاع قبل بدء البرنامج بـ 7 أيام عمل أو أكثر
                            </p>
                            <ul style={{ margin: 0, paddingRight: 20, color: '#166534', fontSize: '0.82rem', lineHeight: 1.8 }}>
                                <li>يحق للمتقدم استرداد <strong>كامل الرسوم المدفوعة</strong>.</li>
                                <li>قد يتم خصم رسوم إدارية أو مصاريف تحويل بنكي (إن وجدت).</li>
                            </ul>
                        </div>

                        {/* Case 2 */}
                        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 10, borderRight: '4px solid #f59e0b' }}>
                            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#78350f', fontSize: '0.88rem' }}>
                                ٢. الاسترجاع قبل بدء البرنامج بيومي عمل
                            </p>
                            <ul style={{ margin: 0, paddingRight: 20, color: '#92400e', fontSize: '0.82rem', lineHeight: 1.8 }}>
                                <li>يحق للمتقدم طلب استرجاع المبلغ، لكن يتم <strong>خصم نسبة 25% من إجمالي قيمة الرسوم</strong>.</li>
                                <li>نظرًا لحجز مكان واستهلاك موارد تنظيمية وإدارية.</li>
                            </ul>
                        </div>

                        {/* Case 3 */}
                        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 10, borderRight: '4px solid #dc2626' }}>
                            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#7f1d1d', fontSize: '0.88rem' }}>
                                ٣. الاسترجاع بعد بدء البرنامج
                            </p>
                            <ul style={{ margin: 0, paddingRight: 20, color: '#991b1b', fontSize: '0.82rem', lineHeight: 1.8 }}>
                                <li><strong>لا يحق للمتقدم استرجاع أي مبالغ</strong> بعد بدء الدورة تحت أي ظرف.</li>
                            </ul>
                        </div>

                        {/* Case 4 */}
                        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 10, borderRight: '4px solid #0865a8' }}>
                            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#1e3a5f', fontSize: '0.88rem' }}>
                                ٤. إلغاء الدورة من قبل المعهد
                            </p>
                            <ul style={{ margin: 0, paddingRight: 20, color: '#1e40af', fontSize: '0.82rem', lineHeight: 1.8 }}>
                                <li>في حال قيام المعهد بإلغاء البرنامج قبل بدايته، يتم رد <strong>كامل قيمة الرسوم دون أي خصومات</strong>.</li>
                            </ul>
                        </div>

                        {/* Case 5 — Process */}
                        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', borderRight: '4px solid #7c3aed' }}>
                            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#4c1d95', fontSize: '0.88rem' }}>
                                ٥. آلية استرجاع المبالغ
                            </p>
                            <ul style={{ margin: 0, paddingRight: 20, color: '#5b21b6', fontSize: '0.82rem', lineHeight: 1.8 }}>
                                <li>تتم عملية الاسترجاع باستخدام <strong>نفس وسيلة الدفع</strong> التي استخدمها المتدرب عند التسجيل.</li>
                                <li>تستغرق عملية رد المبلغ مدة تتراوح بين <strong>7 إلى 14 يوم عمل</strong> وفقًا للإجراءات البنكية.</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ background: '#f0f9ff', borderRadius: 10, padding: '12px 16px', borderRight: '4px solid #0865a8' }}>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#1e40af', fontWeight: 600 }}>
                            آخر تحديث: يناير 2025 — المعهد التكنولوجي لهندسة التشييد والإدارة (ICMET)
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                    <button onClick={() => { onAccept(); onClose(); }} style={{
                        background: 'linear-gradient(90deg,#0865a8,#f57c00)',
                        color: '#fff', border: 'none', borderRadius: 10,
                        padding: '10px 28px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                        fontFamily: '"Noto Kufi Arabic", serif'
                    }}>
                        فهمت وأوافق
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);
    const [cartError, setCartError] = useState("");

    const [loading, setLoading] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [error, setError] = useState("");

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsError, setTermsError] = useState(false);

    const getTokenRef = useRef(getToken);
    const cartItemsRef = useRef(cartItems);
    const successIndicatorRef = useRef(null);
    const orderIdRef = useRef(null);
    const subtotalRef = useRef(0);

    useEffect(() => { getTokenRef.current = getToken; }, [getToken]);
    useEffect(() => { cartItemsRef.current = cartItems; }, [cartItems]);

    // Fetch cart from API
    useEffect(() => {
        if (isSignedIn === false) {
            alert("يجب تسجيل الدخول أولاً");
            navigate("/sign-in");
            return;
        }
        if (!isSignedIn) return;

        const fetchCart = async () => {
            setCartLoading(true);
            setCartError("");
            try {
                const token = await getToken();
                const res = await fetch(`${API_BASE}/api/cart`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(`فشل تحميل السلة (${res.status})`);
                const data = await res.json();
                const normalized = (data.items || []).map(normalizeCartItem);
                setCartItems(normalized);
                localStorage.setItem("cartItems", JSON.stringify(normalized));
            } catch (err) {
                setCartError(err.message || "حدث خطأ أثناء تحميل السلة");
            } finally {
                setCartLoading(false);
            }
        };

        fetchCart();
    }, [isSignedIn, getToken]);

    // Mastercard global callbacks
    useEffect(() => {
        // ✅ لو المستخدم رجع بالـ Back من صفحة الدفع، وقف الـ loading فوراً
        const handlePageShow = (event) => {
            if (event.persisted) {
                setLoading(false);
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                setLoading(false);
            }
        };

        window.addEventListener('pageshow', handlePageShow);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        window.completeCallbackReact = async (resultIndicator) => {
            if (resultIndicator === successIndicatorRef.current) {
                try {
                    const token = await getTokenRef.current();
                    await fetch(
                        `${API_BASE}/api/checkout/result?orderId=${orderIdRef.current}&transactionRef=${resultIndicator}`,
                        {
                            method: "GET",
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                } catch (_) { }

                localStorage.removeItem("cartItems");
                window.dispatchEvent(new Event("cartUpdated"));

                navigate(`/payment-return?orderId=${orderIdRef.current}&resultIndicator=${resultIndicator}`);
            } else {
                setLoading(false);
                setError("فشل التحقق من الدفع. يرجى التواصل مع الدعم الفني.");
            }
        };

        window.errorCallbackReact = (err) => {
            setLoading(false);
            setError(
                "حدث خطأ أثناء الدفع: " +
                (err?.error?.explanation || "يرجى المحاولة مرة أخرى.")
            );
        };

        window.cancelCallbackReact = () => {
            setLoading(false);
            setError("تم إلغاء عملية الدفع.");
        };

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            delete window.completeCallbackReact;
            delete window.errorCallbackReact;
            delete window.cancelCallbackReact;
        };
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.currentPrice ?? 0) * (item.quantity || 1), 0);
    const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.originalPrice ?? item.currentPrice ?? 0) * (item.quantity || 1), 0);
    const totalDiscount = totalOriginalPrice - subtotal;

    useEffect(() => { subtotalRef.current = subtotal; }, [subtotal]);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setError("");

        if (!termsAccepted) {
            setTermsError(true);
            setTimeout(() => setTermsError(false), 600);
            setError("يجب الموافقة على الشروط والأحكام وسياسة الاسترجاع أولاً.");
            return;
        }
        if (cartItems.length === 0) {
            setError("السلة فارغة. يرجى إضافة دورات أولاً.");
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("فشل في الحصول على رمز المصادقة");

            const response = await fetch(`${API_BASE}/api/checkout/checkout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `خطأ في الخادم: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success || !result.data?.sessionId) {
                throw new Error(result.message || "لم يتم استلام بيانات الجلسة من الخادم");
            }

            const { sessionId, successIndicator, orderId } = result.data;
            successIndicatorRef.current = successIndicator;
            orderIdRef.current = orderId;

            localStorage.setItem('pendingOrderId', String(orderId));
            localStorage.setItem('pendingSuccessIndicator', String(successIndicator));
            localStorage.setItem('pendingCartItems', JSON.stringify(cartItems));

            if (!window.Checkout) {
                throw new Error("بوابة الدفع لم تُحمَّل بعد. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
            }

            window.Checkout.configure({ session: { id: sessionId } });
            window.Checkout.showPaymentPage();

        } catch (err) {
            let msg = "حدث خطأ أثناء معالجة الطلب";
            if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
                msg = "فشل الاتصال بالخادم. تحقق من اتصال الإنترنت.";
            } else if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
                msg = "انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.";
                setTimeout(() => navigate("/sign-in"), 2000);
            } else if (err.message) {
                msg = err.message;
            }
            setError(msg);
            setLoading(false);
        }
    };

    const Spinner = () => (
        <svg style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );

    const VisaLogo = () => (
        <svg style={{ height: 22, width: 'auto' }} viewBox="0 0 152 47">
            <path fill="#1A1F71" d="M62.4 45.6H50.5L57.8 1.4h11.9zM42.7 1.4L31.4 31.7l-1.3-6.6L26.2 5.2S25.7 1.4 21 1.4H2.1L2 2.1s5.7 1.2 12.4 5.2l10.3 38.3h12.4L55 1.4H42.7zm80.1 0h-11c-4 0-5 3.1-5 3.1L91.2 45.6h12.3l2.4-6.7h15l1.4 6.7h10.9L122.8 1.4zm-14.4 28.4l6.2-17.1 3.5 17.1h-9.7zm-27.1-18s-5.5-2.8-11.3-2.8c-6.2 0-21 2.7-21 16.2 0 12.6 17.6 12.8 17.6 19.4 0 .8-.7 6.6-11.5 6.6-10.8 0-15.8-5.7-15.8-5.7l-2.8 9.8s6.2 4 16.7 4c10.6 0 22.7-6.1 22.7-18.4 0-12.6-17.7-13.7-17.7-19.5 0-1.5 1.4-5.7 9.8-5.7 7.9 0 12.7 3.7 12.7 3.7l2.6-7.6z" />
        </svg>
    );

    const MastercardLogo = () => (
        <svg style={{ height: 30, width: 'auto' }} viewBox="0 0 131.39 86.9">
            <rect fill="#FF5F00" x="48.37" width="34.65" height="86.9" />
            <path fill="#EB001B" d="M51.94 43.45a55.2 55.2 0 0 1 14.12-37.42A48.19 48.19 0 0 0 0 43.45a48.19 48.19 0 0 0 66.06 43.42A55.2 55.2 0 0 1 51.94 43.45z" />
            <path fill="#F79E1B" d="M131.39 43.45A48.19 48.19 0 0 0 65.33 0a55.23 55.23 0 0 1 0 86.87 48.19 48.19 0 0 0 66.06-43.42z" />
        </svg>
    );

    if (cartLoading) {
        return (
            <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <Spinner />
                <p style={{ color: '#6b7280', fontFamily: '"Noto Kufi Arabic", serif' }}>جاري تحميل سلة التسوق...</p>
            </div>
        );
    }

    return (
        <>
            {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} onAccept={() => setTermsAccepted(true)} />}

            <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`
                * { font-family: "Noto Kufi Arabic", serif !important; }
                .co-wrap { padding-top: 108px; }
                @media (min-width: 768px)  { .co-wrap { padding-top: 128px; } }
                @media (min-width: 1024px) { .co-wrap { padding-top: 138px; } }
                @keyframes spin { to { transform: rotate(360deg) } }
                @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
                .terms-shake { animation: shake 0.5s ease-in-out; }
            `}</style>

            {/* ── Breadcrumb ── */}
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
                    <Link
                        to="/cart"
                        style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}
                    >
                        سلة التسوق
                    </Link>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151', fontWeight: 700, marginRight: '8px' }}>إتمام الدفع</span>
                </div>
            </div>

            <div dir="rtl" className="co-wrap" style={{ minHeight: '100vh', background: '#fff', paddingBottom: '4rem' }}>
                <div style={{ textAlign: 'center', padding: 'clamp(1rem,4vw,2rem) 1rem clamp(0.75rem,3vw,1.5rem)' }}>
                    <h1 style={{ fontSize: 'clamp(1.4rem,5vw,3rem)', fontWeight: 700 }}>اشترك في دوراتنا</h1>
                </div>

                {/* Error banner */}
                {(error || cartError) && (
                    <div style={{ maxWidth: 900, margin: '0 auto 1.5rem', padding: '0 12px' }}>
                        <div style={{ background: '#fef2f2', borderRadius: 10, padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <AlertCircle style={{ width: 20, height: 20, color: '#dc2626', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <p style={{ fontWeight: 700, color: '#991b1b' }}>خطأ</p>
                                    <p style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: 4 }}>{error || cartError}</p>
                                    <button onClick={() => { setError(""); setCartError(""); }}
                                        style={{ marginTop: 8, fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(8px, 3vw, 24px)' }}>
                    <style>{`
                        @media (min-width: 1024px) {
                            .co-grid { flex-direction: row !important; align-items: flex-start !important; }
                            .co-left { flex: 1 1 0%; }
                            .co-right { width: 340px; flex-shrink: 0; position: sticky; top: 144px; }
                            .co-mobile-btn { display: none !important; }
                        }
                        @media (min-width: 1280px) { .co-right { width: 380px; } }
                    `}</style>

                    <div className="co-grid" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* ── LEFT: Payment method + Terms ── */}
                        <div className="co-left">
                            <div style={{ borderRadius: 16, background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', padding: 'clamp(14px,3vw,24px)' }}>
                                <h2 style={{ fontSize: 'clamp(0.95rem,2.5vw,1.1rem)', fontWeight: 700, marginBottom: 'clamp(12px,3vw,20px)' }}>تفاصيل الدفع</h2>

                                <div style={{ borderRadius: 12, border: '2px solid #0865a8', background: 'rgba(8,101,168,0.04)', padding: 'clamp(10px,2.5vw,18px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #0865a8', background: '#0865a8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 700, fontSize: 'clamp(0.8rem,2vw,0.95rem)' }}>بطاقة ائتمان/خصم مباشر</p>
                                            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Visa, Mastercard</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <VisaLogo /><MastercardLogo />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 12, borderRadius: 12, background: '#f0fdf4', padding: 'clamp(10px,2.5vw,16px)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <ShieldCheck style={{ width: 18, height: 18, color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: 'clamp(0.78rem,2vw,0.9rem)' }}>معاملة آمنة ومشفرة بالكامل</p>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 2 }}>معلوماتك محمية بأعلى معايير الأمان العالمية</p>
                                    </div>
                                </div>

                                {/* ── Updated Refund Policy Summary ── */}
                                <div style={{ marginTop: 14, borderRadius: 12, background: 'linear-gradient(135deg, #fff7ed, #fef3c7)', border: '1px solid #fed7aa', padding: 'clamp(10px,2.5vw,16px)' }}>
                                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                                        <RotateCcw style={{ width: 18, height: 18, color: '#f57c00', flexShrink: 0, marginTop: 2 }} />
                                        <p style={{ fontWeight: 700, fontSize: 'clamp(0.78rem,2vw,0.9rem)', color: '#92400e', margin: 0 }}>ملخص سياسة الاسترجاع</p>
                                    </div>
                                    <ul style={{ margin: 0, paddingRight: 20, color: '#78350f', fontSize: '0.78rem', lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <li>
                                            <strong>قبل 7 أيام عمل أو أكثر من بدء البرنامج:</strong> استرداد كامل الرسوم.
                                        </li>
                                        <li>
                                            <strong>قبل يومي عمل من بدء البرنامج:</strong> خصم 25% من إجمالي الرسوم.
                                        </li>
                                        <li>
                                            <strong>بعد بدء البرنامج:</strong> لا يحق استرجاع أي مبالغ.
                                        </li>
                                        <li>
                                            <strong>مدة رد المبلغ:</strong> من 7 إلى 14 يوم عمل عبر نفس وسيلة الدفع.
                                        </li>
                                    </ul>
                                </div>

                                {/* Terms & Conditions Checkbox */}
                                <div
                                    className={termsError ? 'terms-shake' : ''}
                                    style={{
                                        marginTop: 16, borderRadius: 12,
                                        border: `2px solid ${termsError ? '#dc2626' : termsAccepted ? '#16a34a' : '#e5e7eb'}`,
                                        background: termsError ? '#fef2f2' : termsAccepted ? 'rgba(22,163,74,0.04)' : '#f9fafb',
                                        padding: 'clamp(10px,2.5vw,16px)',
                                        transition: 'border-color 0.25s, background 0.25s', cursor: 'pointer'
                                    }}
                                    onClick={() => { setTermsAccepted(prev => !prev); if (termsError) setTermsError(false); setError(""); }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                                            border: `2px solid ${termsAccepted ? '#16a34a' : '#d1d5db'}`,
                                            background: termsAccepted ? '#16a34a' : '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s', marginTop: 1
                                        }}>
                                            {termsAccepted && (
                                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                    <path d="M2 6.5L5.5 10L11 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <p style={{ fontSize: 'clamp(0.78rem,2vw,0.875rem)', lineHeight: 1.7, margin: 0, color: '#374151', userSelect: 'none' }}>
                                            لقد قرأت وأوافق على{' '}
                                            <span onClick={(e) => { e.stopPropagation(); setShowTermsModal(true); }}
                                                style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
                                                الشروط والأحكام وسياسة الاسترجاع
                                            </span>
                                            {' '}الخاصة بالمعهد التكنولوجي لهندسة التشييد والإدارة (ICMET).
                                        </p>
                                    </div>
                                    {termsError && (
                                        <p style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: 8, marginRight: 34 }}>
                                            ⚠️ يجب الموافقة على الشروط والأحكام قبل المتابعة
                                        </p>
                                    )}
                                </div>

                                {/* Mobile-only pay button */}
                                <button onClick={handleSubmit}
                                    disabled={loading || cartItems.length === 0}
                                    className="co-mobile-btn"
                                    style={{ marginTop: 16, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, background: termsAccepted ? 'linear-gradient(90deg,#0865a8,#f57c00)' : '#d1d5db', padding: '0.85rem', fontWeight: 700, color: '#fff', border: 'none', cursor: loading || cartItems.length === 0 || !termsAccepted ? 'not-allowed' : 'pointer', opacity: loading || cartItems.length === 0 ? 0.7 : 1, transition: 'background 0.3s' }}>
                                    {loading ? <><Spinner />جاري المعالجة...</> : <>المتابعة إلى الدفع <ArrowRight style={{ width: 18, height: 18, transform: 'rotate(180deg)' }} /></>}
                                </button>
                            </div>
                        </div>

                        {/* ── RIGHT: Order summary ── */}
                        <div className="co-right">
                            <div style={{ borderRadius: 16, background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', padding: 'clamp(14px,3vw,24px)' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 12, marginBottom: 16 }}>
                                    <span style={{ fontWeight: 700, fontSize: 'clamp(0.85rem,2.5vw,1rem)' }}>
                                        {cartItems.length === 0 ? "السلة فارغة" : cartItems.length === 1 ? "دورة واحدة" : `${cartItems.length} دورات`}
                                    </span>
                                    <Link to="/cart" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0865a8', textDecoration: 'none' }}>تغيير</Link>
                                </div>

                                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 12 }}>ملخص الطلب</p>
                                <div style={{ maxHeight: 210, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                                    {cartItems.length === 0 ? (
                                        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>لا توجد دورات في السلة</p>
                                    ) : cartItems.map((item) => (
                                        <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg,#0865a8,#f57c00)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {item.courseImage
                                                    ? <img src={item.courseImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    : <BookOpen style={{ width: 22, height: 22, color: '#fff' }} />
                                                }
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 'clamp(0.75rem,2vw,0.875rem)', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {item.title}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f57c00' }}>
                                                        {((item.currentPrice || 0) * (item.quantity || 1)).toFixed(2)} جنيه
                                                    </p>
                                                    {item.originalPrice > item.currentPrice && (
                                                        <p style={{ fontSize: '0.72rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                                                            {((item.originalPrice || 0) * (item.quantity || 1)).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'clamp(0.78rem,2vw,0.875rem)', marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
                                        <span>المجموع الفرعي</span>
                                        <span>{totalOriginalPrice.toFixed(2)} جنيه</span>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                                            <span>خصم الدورات</span>
                                            <span>-{totalDiscount.toFixed(2)} جنيه</span>
                                        </div>
                                    )}
                                </div>

                                {/* Coupon */}
                                <div style={{ marginBottom: 16 }}>
                                    {!showCoupon ? (
                                        <button onClick={() => setShowCoupon(true)}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, border: '1px solid #d1d5db', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 600, background: '#fff', cursor: 'pointer' }}>
                                            <Tag style={{ width: 15, height: 15 }} />استخدم كود الخصم
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="أدخل كود الخصم"
                                                style={{ flex: 1, borderRadius: 10, border: '1px solid #d1d5db', padding: '0.5rem 0.75rem', fontSize: '0.85rem', outline: 'none' }} />
                                            <button onClick={() => couponCode.trim() && alert("سيتم تطبيق الكود عند إتمام الدفع")}
                                                style={{ borderRadius: 10, background: '#0865a8', color: '#fff', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}>
                                                تطبيق
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: 16 }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <span style={{ fontWeight: 700, fontSize: 'clamp(0.9rem,2.5vw,1rem)' }}>إجمالي المستحق</span>
                                    <span style={{ fontWeight: 700, fontSize: 'clamp(1.2rem,3vw,1.5rem)', color: '#f57c00' }}>
                                        {subtotal.toFixed(2)} جنيه
                                    </span>
                                </div>

                                {/* Pay button */}
                                <button onClick={handleSubmit}
                                    disabled={loading || cartItems.length === 0}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: 8, borderRadius: 12,
                                        background: termsAccepted ? 'linear-gradient(90deg,#0865a8,#f57c00)' : '#d1d5db',
                                        padding: '0.9rem', fontWeight: 700, color: '#fff', border: 'none',
                                        cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer',
                                        opacity: loading || cartItems.length === 0 ? 0.7 : 1,
                                        marginBottom: 12, transition: 'background 0.3s'
                                    }}>
                                    {loading
                                        ? <><Spinner />جاري المعالجة...</>
                                        : !termsAccepted
                                            ? <>يجب الموافقة على الشروط أولاً</>
                                            : <>المتابعة إلى الدفع <ArrowRight style={{ width: 20, height: 20, transform: 'rotate(180deg)' }} /></>
                                    }
                                </button>

                                {!termsAccepted && (
                                    <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af', marginBottom: 12 }}>
                                        يرجى الموافقة على الشروط والأحكام في القسم الأيسر أولاً
                                    </p>
                                )}

                                <div style={{ borderRadius: 10, background: '#f9fafb', padding: '0.75rem', textAlign: 'center' }}>
                                    <Lock style={{ width: 20, height: 20, opacity: 0.5, margin: '0 auto 6px' }} />
                                    <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>الدفع عبر بوابة بنك مصر الآمنة</p>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: 2 }}>معاملة مشفرة بتقنية SSL</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}