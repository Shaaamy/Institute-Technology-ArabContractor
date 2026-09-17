import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Home, BookOpen, Sparkles, RefreshCw } from "lucide-react";

const API_BASE = "https://acwebsite-icmet-test.azurewebsites.net";

export default function PaymentResultPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");
    const [orderData, setOrderData] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const orderId = searchParams.get("orderId");
        const resultIndicator = searchParams.get("resultIndicator");

        if (!orderId || !resultIndicator) {
            setStatus("failed");
            setErrorMsg("بيانات الطلب غير مكتملة.");
            return;
        }

        verifyPayment(orderId, resultIndicator);
    }, []);

    const verifyPayment = async (orderId, resultIndicator) => {
        try {
            const res = await fetch(
                `${API_BASE}/api/checkout/result?orderId=${orderId}&resultIndicator=${resultIndicator}`,
                { method: "GET" }
            );
            const data = await res.json();

            if (!data.isSuccess) {
                setStatus("failed");
                setErrorMsg(data.message || "فشلت عملية الدفع.");
                return;
            }

            const orderRes = await fetch(`${API_BASE}/api/checkout/order/${orderId}`);
            const orderJson = await orderRes.json();
            if (orderJson.success) setOrderData(orderJson.data);

            movePurchasedToEnrolled();
            setStatus("success");
        } catch {
            setStatus("failed");
            setErrorMsg("حدث خطأ أثناء التحقق من الدفع. يرجى التواصل مع الدعم.");
        }
    };

    const movePurchasedToEnrolled = () => {
        try {
            const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
            const existingEnrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
            const existingPurchased = JSON.parse(localStorage.getItem("purchasedCourses") || "[]");
            cartItems.forEach((item) => {
                const courseObj = {
                    id: item.id, slug: item.slug || "", title: item.title,
                    place: item.place || item.instructor || "",
                    instructor: item.instructor || item.place || "غير محدد",
                    date: item.date || "", image: item.image || "book",
                    currentPrice: item.currentPrice || 0, progress: 0,
                };
                if (!existingEnrolled.find((e) => e.id === item.id)) existingEnrolled.push(courseObj);
                if (!existingPurchased.find((e) => e.id === item.id)) existingPurchased.push(courseObj);
            });
            localStorage.setItem("enrolledCourses", JSON.stringify(existingEnrolled));
            localStorage.setItem("purchasedCourses", JSON.stringify(existingPurchased));
            localStorage.removeItem("cartItems");
            window.dispatchEvent(new Event("enrollUpdated"));
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (err) {
            console.error("Error moving courses:", err);
        }
    };

    // ══════════════════════════════════
    // LOADING
    // ══════════════════════════════════
    if (status === "loading") {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`
                    * { font-family: "Noto Kufi Arabic", serif !important; }
                    @keyframes pulse-ring {
                        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(8,101,168,0.4); }
                        70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(8,101,168,0); }
                        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(8,101,168,0); }
                    }
                    .pulse-ring { animation: pulse-ring 2s infinite; }
                `}</style>
                <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
                    <div className="text-center">
                        <div className="pulse-ring mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                            <Loader2 className="h-10 w-10 animate-spin text-[#0865a8]" />
                        </div>
                        <p className="text-xl font-bold text-[#0865a8]">جاري التحقق من الدفع</p>
                        <p className="mt-2 text-sm text-gray-400">يرجى الانتظار، لا تغلق الصفحة</p>
                    </div>
                </div>
            </>
        );
    }

    // ══════════════════════════════════
    // FAILED
    // ══════════════════════════════════
    if (status === "failed") {
        return (
            <>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet" />
                <style>{`* { font-family: "Noto Kufi Arabic", serif !important; }`}</style>
                <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-slate-50 px-4 py-16">
                    <div className="mx-auto w-full max-w-md">
                        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
                            <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-600" />
                            <div className="p-8 text-center md:p-10">
                                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                                    <XCircle className="h-11 w-11 text-red-500" />
                                </div>
                                <h1 className="mb-2 text-2xl font-bold text-gray-900">فشلت عملية الدفع</h1>
                                <p className="mb-8 text-sm leading-relaxed text-gray-500">
                                    {errorMsg || "لم يتم تأكيد الدفع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني."}
                                </p>
                                <div className="space-y-3">
                                    <Link to="/checkout"
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-3.5 font-bold text-white shadow-md transition-all hover:shadow-lg hover:opacity-90">
                                        <RefreshCw className="h-4 w-4" />
                                        المحاولة مرة أخرى
                                    </Link>
                                    <Link to="/"
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 py-3.5 font-semibold text-gray-600 transition-colors hover:bg-gray-50">
                                        <Home className="h-4 w-4" />
                                        الصفحة الرئيسية
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ══════════════════════════════════
    // SUCCESS
    // ══════════════════════════════════
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`
                * { font-family: "Noto Kufi Arabic", serif !important; }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 1; transform: scale(1); }
                }
                .float { animation: float 3s ease-in-out infinite; }
                .fade-up-1 { animation: fadeInUp 0.6s 0.1s ease both; }
                .fade-up-2 { animation: fadeInUp 0.6s 0.2s ease both; }
                .fade-up-3 { animation: fadeInUp 0.6s 0.3s ease both; }
                .fade-up-4 { animation: fadeInUp 0.6s 0.4s ease both; }
                .fade-up-5 { animation: fadeInUp 0.6s 0.5s ease both; }
                .scale-in { animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
            `}</style>

            <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 px-4 py-16">

                {/* Decorative blobs */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#0865a8] opacity-5 blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#f57c00] opacity-5 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-lg">

                    {/* Main card */}
                    <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">

                        {/* Gradient top bar */}
                        <div className="h-1.5 bg-gradient-to-r from-[#0865a8] via-blue-400 to-[#f57c00]" />

                        <div className="p-8 md:p-10">

                            {/* Success Icon */}
                            <div className="scale-in mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-200">
                                <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
                            </div>

                            {/* Title */}
                            <div className="fade-up-1 mb-6 text-center">
                                <div className="mb-2 flex items-center justify-center gap-2">
                                    <Sparkles className="h-4 w-4 text-[#f57c00]" />
                                    <span className="text-sm font-semibold text-[#f57c00]">عملية ناجحة</span>
                                    <Sparkles className="h-4 w-4 text-[#f57c00]" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">تم الدفع بنجاح!</h1>
                                <p className="mt-2 text-sm text-gray-400">تم تأكيد طلبك وإضافة الدورات إلى حسابك</p>
                            </div>

                            {/* Amount */}
                            {orderData?.totalAmount && (
                                <div className="fade-up-2 mb-6 rounded-2xl bg-gradient-to-br from-[#0865a8]/5 to-[#f57c00]/5 p-5 text-center ring-1 ring-gray-100">
                                    <p className="mb-1 text-xs text-gray-400">المبلغ المدفوع</p>
                                    <p className="text-4xl font-bold text-[#f57c00]">
                                        {orderData.totalAmount.toFixed(2)}
                                        <span className="mr-2 text-lg font-semibold text-gray-400">جنيه</span>
                                    </p>
                                </div>
                            )}

                            {/* Courses list */}
                            {orderData?.items?.length > 0 && (
                                <div className="fade-up-3 mb-6">
                                    <p className="mb-3 text-sm font-bold text-gray-700">الدورات المشتراة</p>
                                    <div className="space-y-2">
                                        {orderData.items.map((item, idx) => (
                                            <div key={idx}
                                                className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0865a8] to-[#f57c00] shadow-sm">
                                                        <BookOpen className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {item.title || `دورة ${idx + 1}`}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-bold text-[#0865a8]">
                                                    {item.price?.toFixed(2)} جنيه
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="fade-up-4 mb-6 border-t border-dashed border-gray-100" />

                            {/* Actions */}
                            <div className="fade-up-5 space-y-3">
                                <Link to="/my-courses"
                                    className="float flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0865a8] to-[#f57c00] py-4 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:shadow-xl hover:opacity-90">
                                    <BookOpen className="h-5 w-5" />
                                    ابدأ التعلم الآن
                                </Link>
                                <Link to="/"
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-100 py-3.5 font-semibold text-gray-500 transition-colors hover:bg-gray-50">
                                    <Home className="h-4 w-4" />
                                    الصفحة الرئيسية
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Security badge */}
                    <div className="fade-up-5 mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        معاملة آمنة ومشفرة — بنك مصر
                    </div>

                </div>
            </div>
        </>
    );
}