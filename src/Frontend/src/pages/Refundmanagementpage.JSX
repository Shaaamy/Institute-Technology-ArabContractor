import { useState, useEffect } from "react";
import { Search, RefreshCw, CheckCircle, XCircle, AlertTriangle, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = "https://localhost:7177";

const statusColors = {
    Paid:      { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  label: "مدفوع"    },
    Refunded:  { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", label: "مسترد"    },
    Cancelled: { bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    label: "ملغي"     },
    Pending:   { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", label: "معلق"     },
};

export default function RefundManagementPage() {
    const { getToken } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [adminNote, setAdminNote] = useState("");
    const [refundLoading, setRefundLoading] = useState(false);
    const [toast, setToast] = useState(null); // { type: "success"|"error", msg }
    const [confirmOpen, setConfirmOpen] = useState(false);

    // ─── Load paid orders ──────────────────────────────────────
    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/api/checkout/orders?status=Paid`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data.data || []);
            }
        } catch {
            showToast("error", "فشل تحميل الطلبات");
        } finally {
            setLoading(false);
        }
    };

    const handleRefund = async () => {
        if (!selectedOrder) return;
        setRefundLoading(true);
        setConfirmOpen(false);
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/api/checkout/refund`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderId: selectedOrder.orderId,
                    adminNote: adminNote || "استرداد من لوحة الإدارة"
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast("success", `✅ تم استرداد ${data.data?.refundAmount?.toFixed(2)} جنيه بنجاح`);
                setOrders(prev => prev.map(o =>
                    o.orderId === selectedOrder.orderId ? { ...o, status: "Refunded" } : o
                ));
                setSelectedOrder(null);
                setAdminNote("");
            } else {
                showToast("error", data.message || "فشل الاسترداد");
            }
        } catch {
            showToast("error", "حدث خطأ أثناء الاسترداد");
        } finally {
            setRefundLoading(false);
        }
    };

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const filtered = orders.filter(o =>
        searchId === "" || String(o.orderId).includes(searchId)
    );

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`* { font-family: "Noto Kufi Arabic", serif !important; }`}</style>

            {/* Toast */}
            {toast && (
                <div className={`fixed left-4 top-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl transition-all
                    ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                    {toast.type === "success"
                        ? <CheckCircle className="h-5 w-5" />
                        : <XCircle className="h-5 w-5" />}
                    <span className="text-sm font-semibold">{toast.msg}</span>
                </div>
            )}

            {/* Confirm Modal */}
            {confirmOpen && selectedOrder && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
                    <div dir="rtl" className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="h-1.5 bg-gradient-to-r from-orange-400 to-red-500" />
                        <div className="p-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                                <AlertTriangle className="h-8 w-8 text-orange-500" />
                            </div>
                            <h2 className="mb-2 text-xl font-bold text-gray-900">تأكيد الاسترداد</h2>
                            <p className="mb-1 text-sm text-gray-500">
                                سيتم استرداد مبلغ
                                <span className="mx-1 font-bold text-[#f57c00]">
                                    {selectedOrder.totalAmount?.toFixed(2)} جنيه
                                </span>
                                للطلب رقم <span className="font-bold text-[#0865a8]">#{selectedOrder.orderId}</span>
                            </p>
                            <p className="mb-6 text-xs text-red-500">⚠️ سيتم إلغاء تسجيل المستخدم من جميع الدورات</p>
                            <div className="flex gap-3">
                                <button onClick={handleRefund}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 py-3 font-bold text-white shadow-md hover:opacity-90">
                                    <RefreshCw className="h-4 w-4" />
                                    تأكيد الاسترداد
                                </button>
                                <button onClick={() => setConfirmOpen(false)}
                                    className="flex-1 rounded-2xl border-2 border-gray-100 py-3 font-semibold text-gray-600 hover:bg-gray-50">
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-10">
                <div className="mx-auto max-w-5xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">إدارة الاستردادات</h1>
                        <p className="mt-1 text-sm text-gray-400">استرداد المدفوعات وإلغاء التسجيلات</p>
                    </div>

                    {/* Search + Refresh */}
                    <div className="mb-6 flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchId}
                                onChange={e => setSearchId(e.target.value)}
                                placeholder="ابحث برقم الطلب..."
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-10 pl-4 text-sm shadow-sm focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20"
                            />
                        </div>
                        <button onClick={fetchOrders}
                            className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50">
                            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            تحديث
                        </button>
                    </div>

                    {/* Orders Table */}
                    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-[#0865a8]" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="py-20 text-center text-gray-400">لا توجد طلبات</div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50 text-right text-xs font-bold text-gray-500">
                                        <th className="px-6 py-4">رقم الطلب</th>
                                        <th className="px-6 py-4">المبلغ</th>
                                        <th className="px-6 py-4">التاريخ</th>
                                        <th className="px-6 py-4">الحالة</th>
                                        <th className="px-6 py-4">إجراء</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map(order => {
                                        const st = statusColors[order.status] || statusColors.Pending;
                                        const isPaid = order.status === "Paid";
                                        return (
                                            <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-[#0865a8]">#{order.orderId}</td>
                                                <td className="px-6 py-4 font-bold text-[#f57c00]">
                                                    {order.totalAmount?.toFixed(2)} جنيه
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {order.createdAt
                                                        ? new Date(order.createdAt).toLocaleDateString("ar-EG")
                                                        : "—"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold
                                                        ${st.bg} ${st.text} ${st.border}`}>
                                                        {st.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isPaid ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setConfirmOpen(true);
                                                            }}
                                                            disabled={refundLoading}
                                                            className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 ring-1 ring-red-200 transition-all hover:bg-red-100 disabled:opacity-50">
                                                            <RefreshCw className="h-3.5 w-3.5" />
                                                            استرداد
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-300">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Admin Note input — shows when order selected */}
                    {selectedOrder && !confirmOpen && (
                        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <p className="mb-3 text-sm font-bold text-gray-700">
                                سبب الاسترداد للطلب #{selectedOrder.orderId}
                            </p>
                            <textarea
                                value={adminNote}
                                onChange={e => setAdminNote(e.target.value)}
                                placeholder="اكتب سبب الاسترداد (اختياري)..."
                                rows={3}
                                className="w-full rounded-2xl border border-gray-200 p-4 text-sm focus:border-[#0865a8] focus:outline-none focus:ring-2 focus:ring-[#0865a8]/20"
                            />
                            <div className="mt-3 flex gap-3">
                                <button
                                    onClick={() => setConfirmOpen(true)}
                                    disabled={refundLoading}
                                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 font-bold text-white shadow-md hover:opacity-90 disabled:opacity-50">
                                    {refundLoading
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <RefreshCw className="h-4 w-4" />}
                                    تنفيذ الاسترداد
                                </button>
                                <button
                                    onClick={() => { setSelectedOrder(null); setAdminNote(""); }}
                                    className="rounded-2xl border-2 border-gray-100 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50">
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}