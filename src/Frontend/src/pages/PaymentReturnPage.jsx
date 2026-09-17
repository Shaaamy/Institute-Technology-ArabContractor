/**
 * PaymentReturnPage.jsx
 *
 * The payment gateway redirects here after the user completes (or cancels) payment.
 * URL params received: ?orderId=X&resultIndicator=Y&sessionVersion=Z
 *
 * Flow:
 *  1. Read orderId + resultIndicator from URL
 *  2. Call backend GET /api/checkout/result?orderId=X&resultIndicator=Y to verify
 *  3a. SUCCESS → move pendingCartItems → purchasedCourses, clear cart, navigate to /my-courses
 *  3b. FAILURE → show error UI, keep cart intact
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net';

// ─── Persist purchased courses to localStorage ────────────────────────────────
const persistPurchasedCourses = (cartItems) => {
    try {
        const existing = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
        const existingIds = new Set(existing.map(c => String(c.id)));

        const newItems = cartItems
            .filter(item => !existingIds.has(String(item.id)))
            .map(item => ({
                id: item.id,
                slug: item.slug || '',
                title: item.title,
                place: item.place || item.instructor || '',
                instructor: item.instructor || item.place || 'غير محدد',
                date: item.date || '',
                image: item.image || 'book',
                currentPrice: item.currentPrice || 0,
                originalPrice: item.originalPrice || 0,
                isPurchased: true,
                progress: 0,
                purchasedAt: new Date().toISOString(),
            }));

        const merged = [...existing, ...newItems];
        localStorage.setItem('purchasedCourses', JSON.stringify(merged));

        // Remove these from enrolledCourses if they were free-enrolled before
        const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
        const purchasedIds = new Set(merged.map(c => String(c.id)));
        const filteredEnrolled = enrolled.filter(c => !purchasedIds.has(String(c.id)));
        localStorage.setItem('enrolledCourses', JSON.stringify(filteredEnrolled));

        return merged;
    } catch (e) {
        console.error('Error persisting purchased courses:', e);
        return [];
    }
};

// ─── Clear cart ───────────────────────────────────────────────────────────────
const clearCart = () => {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('pendingOrderId');
    localStorage.removeItem('pendingSuccessIndicator');
    localStorage.removeItem('pendingCartItems');
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('purchaseCompleted'));
    window.dispatchEvent(new Event('enrollUpdated'));
};

export default function PaymentReturnPage() {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [status, setStatus] = useState('verifying'); // verifying | success | failed
    const [purchasedItems, setPurchasedItems] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [countdown, setCountdown] = useState(5);
    const verifiedRef = useRef(false);

    useEffect(() => {
        if (verifiedRef.current) return;
        verifiedRef.current = true;

        const verify = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const orderId = params.get('orderId');
                const resultIndicator = params.get('resultIndicator') || params.get('transactionRef');

                if (!orderId || !resultIndicator) {
                    setErrorMsg('بيانات الدفع مفقودة في الرابط.');
                    setStatus('failed');
                    return;
                }

                // ── Try to get auth token (optional - backend allows anonymous) ──
                let token = null;
                try { token = await getToken(); } catch (_) { }

                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(
                    `${API_BASE}/api/checkout/result?orderId=${orderId}&resultIndicator=${encodeURIComponent(resultIndicator)}`,
                    { method: 'GET', headers }
                );

                const data = await res.json().catch(() => ({}));

                if (!res.ok || data.isSuccess === false || data.success === false) {
                    setErrorMsg(data.message || 'لم يتم تأكيد الدفع من البنك.');
                    setStatus('failed');
                    return;
                }

                // ── SUCCESS ───────────────────────────────────────────────────
                // Retrieve the cart items we saved just before showPaymentPage()
                let cartItems = [];
                try {
                    const pending = localStorage.getItem('pendingCartItems') || localStorage.getItem('cartItems');
                    if (pending) cartItems = JSON.parse(pending);
                } catch (_) { }

                persistPurchasedCourses(cartItems);
                clearCart();
                setPurchasedItems(cartItems);
                setStatus('success');

            } catch (err) {
                console.error('Payment verification error:', err);
                setErrorMsg('حدث خطأ أثناء التحقق من الدفع. تواصل مع الدعم إذا تم خصم المبلغ.');
                setStatus('failed');
            }
        };

        verify();
    }, []);

    // ── Auto-redirect after success ───────────────────────────────────────────
    useEffect(() => {
        if (status !== 'success') return;
        const timer = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearInterval(timer);
                    navigate('/my-courses');
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [status, navigate]);

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap"
                rel="stylesheet"
            />
            <style>{`
                * { font-family: "Noto Kufi Arabic", serif !important; box-sizing: border-box; }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(32px); }
                    to   { opacity: 1; transform: translateY(0);  }
                }
                @keyframes popIn {
                    0%   { transform: scale(0.4); opacity: 0; }
                    70%  { transform: scale(1.12); }
                    100% { transform: scale(1);   opacity: 1; }
                }
                @keyframes shimmer {
                    0%   { background-position: -400px 0; }
                    100% { background-position:  400px 0; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.5; }
                }
                @keyframes countdownShrink {
                    from { stroke-dashoffset: 0; }
                    to   { stroke-dashoffset: 113; }
                }

                .pr-page {
                    min-height: 100vh;
                    background: #f7f8fc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    direction: rtl;
                }

                /* ── VERIFYING ── */
                .pr-verifying {
                    text-align: center;
                    animation: fadeInUp 0.5s ease both;
                }
                .pr-verifying .spinner {
                    width: 72px; height: 72px;
                    border: 6px solid #e0e7f0;
                    border-top-color: #0865a8;
                    border-radius: 50%;
                    margin: 0 auto 28px;
                    animation: spin 0.9s linear infinite;
                }
                .pr-verifying h2 {
                    font-size: 26px; font-weight: bold; color: #0865a8; margin: 0 0 12px;
                }
                .pr-verifying p {
                    font-size: 16px; color: #666; margin: 0;
                }

                /* ── SHARED CARD ── */
                .pr-card {
                    background: #fff;
                    border-radius: 24px;
                    padding: 48px 40px;
                    max-width: 560px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.10);
                    animation: fadeInUp 0.5s ease both;
                    text-align: center;
                }

                /* ── SUCCESS ── */
                .pr-success-icon {
                    width: 96px; height: 96px;
                    background: linear-gradient(135deg, #1a7a3c, #27ae60);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 24px;
                    animation: popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
                    box-shadow: 0 8px 28px rgba(26,122,60,0.35);
                }
                .pr-success-icon svg { width: 48px; height: 48px; color: #fff; }

                .pr-success-title {
                    font-size: 30px; font-weight: bold; color: #1a7a3c; margin: 0 0 8px;
                }
                .pr-success-sub {
                    font-size: 16px; color: #555; margin: 0 0 28px; line-height: 1.6;
                }

                /* purchased items list */
                .pr-items {
                    background: #f0fdf4;
                    border: 1.5px solid #bbf7d0;
                    border-radius: 14px;
                    padding: 16px 20px;
                    margin-bottom: 28px;
                    text-align: right;
                }
                .pr-items-title {
                    font-size: 14px; font-weight: bold; color: #15803d;
                    margin: 0 0 12px;
                }
                .pr-item {
                    display: flex; align-items: center; gap: 12px;
                    padding: 8px 0;
                    border-bottom: 1px solid #dcfce7;
                }
                .pr-item:last-child { border-bottom: none; }
                .pr-item-icon {
                    width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
                    background: linear-gradient(135deg, #0865a8, #f57c00);
                    display: flex; align-items: center; justify-content: center;
                }
                .pr-item-icon svg { width: 18px; height: 18px; color: #fff; }
                .pr-item-title {
                    flex: 1; font-size: 14px; color: #111; font-weight: 500;
                    overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
                }
                .pr-item-price {
                    font-size: 13px; font-weight: bold; color: #f57c00; flex-shrink: 0;
                }

                /* countdown ring */
                .pr-countdown-wrap {
                    display: flex; flex-direction: column; align-items: center; gap: 12px;
                    margin-bottom: 24px;
                }
                .pr-countdown-ring { position: relative; width: 60px; height: 60px; }
                .pr-countdown-ring svg { transform: rotate(-90deg); }
                .pr-countdown-ring .track { fill: none; stroke: #e0e7f0; stroke-width: 5; }
                .pr-countdown-ring .fill  {
                    fill: none; stroke: #0865a8; stroke-width: 5;
                    stroke-dasharray: 113;
                    stroke-dashoffset: 0;
                    stroke-linecap: round;
                    animation: countdownShrink 5s linear forwards;
                }
                .pr-countdown-num {
                    position: absolute; inset: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 20px; font-weight: bold; color: #0865a8;
                }
                .pr-countdown-text {
                    font-size: 14px; color: #666;
                }

                .pr-btn-primary {
                    width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #0865a8 0%, #f57c00 100%);
                    color: #fff; border: none; border-radius: 12px;
                    font-size: 16px; font-weight: bold; cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(8,101,168,0.28);
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                }
                .pr-btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(8,101,168,0.35);
                }
                .pr-btn-secondary {
                    width: 100%; padding: 12px;
                    background: #fff; color: #555;
                    border: 1.5px solid #ddd; border-radius: 12px;
                    font-size: 15px; font-weight: 600; cursor: pointer;
                    transition: all 0.2s; margin-top: 10px;
                }
                .pr-btn-secondary:hover { border-color: #0865a8; color: #0865a8; }

                /* ── FAILED ── */
                .pr-fail-icon {
                    width: 96px; height: 96px;
                    background: linear-gradient(135deg, #dc2626, #ef4444);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 24px;
                    animation: popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
                    box-shadow: 0 8px 28px rgba(220,38,38,0.35);
                }
                .pr-fail-icon svg { width: 48px; height: 48px; color: #fff; }

                .pr-fail-title {
                    font-size: 28px; font-weight: bold; color: #dc2626; margin: 0 0 8px;
                }
                .pr-fail-sub {
                    font-size: 15px; color: #666; margin: 0 0 12px; line-height: 1.6;
                }
                .pr-fail-detail {
                    background: #fef2f2; border: 1px solid #fecaca;
                    border-radius: 10px; padding: 12px 16px;
                    font-size: 14px; color: #b91c1c; margin-bottom: 28px;
                    text-align: right;
                }

                @media (max-width: 540px) {
                    .pr-card { padding: 32px 20px; border-radius: 16px; }
                    .pr-success-title, .pr-fail-title { font-size: 24px; }
                }
            `}</style>

            <div className="pr-page">

                {/* ── VERIFYING ─────────────────────────────────────────────── */}
                {status === 'verifying' && (
                    <div className="pr-verifying">
                        <div className="spinner" />
                        <h2>جاري التحقق من الدفع...</h2>
                        <p>يرجى الانتظار، نتحقق من عملية الدفع مع البنك</p>
                    </div>
                )}

                {/* ── SUCCESS ───────────────────────────────────────────────── */}
                {status === 'success' && (
                    <div className="pr-card">
                        <div className="pr-success-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h2 className="pr-success-title">تم الدفع بنجاح! 🎉</h2>
                        <p className="pr-success-sub">
                            تمت عملية الدفع بنجاح وتمت إضافة الدورات إلى حسابك
                        </p>

                        {purchasedItems.length > 0 && (
                            <div className="pr-items">
                                <p className="pr-items-title">✅ الدورات المشتراة</p>
                                {purchasedItems.map(item => (
                                    <div key={item.id} className="pr-item">
                                        <div className="pr-item-icon">
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <span className="pr-item-title">{item.title}</span>
                                        <span className="pr-item-price">{(item.currentPrice || 0).toFixed(2)} ج.م</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pr-countdown-wrap">
                            <div className="pr-countdown-ring">
                                <svg viewBox="0 0 40 40" width="60" height="60">
                                    <circle className="track" cx="20" cy="20" r="18" />
                                    <circle className="fill" cx="20" cy="20" r="18" />
                                </svg>
                                <div className="pr-countdown-num">{countdown}</div>
                            </div>
                            <span className="pr-countdown-text">سيتم تحويلك إلى دوراتك تلقائياً</span>
                        </div>

                        <button className="pr-btn-primary" onClick={() => navigate('/my-courses')}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            الانتقال إلى دوراتي الآن
                        </button>

                        <button className="pr-btn-secondary" onClick={() => navigate('/')}>
                            العودة إلى الصفحة الرئيسية
                        </button>
                    </div>
                )}

                {/* ── FAILED ────────────────────────────────────────────────── */}
                {status === 'failed' && (
                    <div className="pr-card">
                        <div className="pr-fail-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        <h2 className="pr-fail-title">لم تتم عملية الدفع</h2>
                        <p className="pr-fail-sub">
                            لم يتم تأكيد الدفع. لم يتم خصم أي مبلغ من حسابك.
                        </p>

                        {errorMsg && (
                            <div className="pr-fail-detail">
                                ⚠️ {errorMsg}
                            </div>
                        )}

                        <button className="pr-btn-primary" onClick={() => navigate('/cart')}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            العودة إلى السلة والمحاولة مجدداً
                        </button>

                        <button className="pr-btn-secondary" onClick={() => navigate('/')}>
                            العودة إلى الصفحة الرئيسية
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}