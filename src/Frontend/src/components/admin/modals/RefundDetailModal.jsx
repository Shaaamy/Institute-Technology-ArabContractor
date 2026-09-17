// modals/RefundDetailModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { REFUND_STATUS_META } from '../constants';

export function RefundDetailModal({ refund: r, usersData, coursesData, onClose, onAction }) {
    const u = usersData.find(u => u.id === r.userId) ?? { firstName: '—', lastName: '', email: '—' };
    const c = coursesData.find(c => c.id === r.courseId) ?? { title: '—' };
    const sm = REFUND_STATUS_META[r.status] || REFUND_STATUS_META.Pending;

    return (
        <div className="adm-modal-bg" onClick={onClose}>
            <div className="adm-modal rd" style={{ borderTopColor: sm.color }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                        <h3>💳 تفاصيل طلب الاسترداد</h3>
                        <div style={{ fontSize: '.62rem', color: '#6b7280', marginTop: 2 }}>{r.refNumber || r.id}</div>
                    </div>
                    <span className="rf-status" style={{ background: sm.bg, color: sm.color, borderColor: sm.border }}>{sm.icon} {sm.label}</span>
                </div>

                <div className="rf-detail">
                    <div><div className="rf-field-lbl">رقم الأوردر</div><div className="rf-field-val mono">{r.orderId || '—'}</div></div>
                    <div>
                        <div className="rf-field-lbl">المبلغ</div>
                        <div className="rf-field-val"><span className="rf-amount">{Number(r.amount || 0).toLocaleString()}</span> <span style={{ fontSize: '.6rem', color: '#6b7280' }}>{r.currency}</span></div>
                    </div>
                    <div><div className="rf-field-lbl">المستخدم</div><div className="rf-field-val">{`${u.firstName} ${u.lastName}`.trim() || '—'}</div></div>
                    <div><div className="rf-field-lbl">البريد الإلكتروني</div><div className="rf-field-val mono" style={{ fontSize: '.68rem' }}>{u.email || '—'}</div></div>
                    <div><div className="rf-field-lbl">الدورة</div><div className="rf-field-val">{c.title || '—'}</div></div>
                    <div><div className="rf-field-lbl">تاريخ الطلب</div><div className="rf-field-val mono">{r.requestedAt || '—'}</div></div>
                    <div className="rf-full"><div className="rf-field-lbl">سبب الاسترداد</div><div className="rf-field-val" style={{ fontWeight: 400 }}>{r.reason || '—'}</div></div>
                    {r.details && <div className="rf-full"><div className="rf-field-lbl">تفاصيل إضافية</div><div className="rf-field-val" style={{ fontWeight: 400, fontSize: '.72rem', lineHeight: 1.5 }}>{r.details}</div></div>}
                    <hr className="rf-divider" />
                    <div className="rf-bank-block">
                        <div className="rf-bank-title">🏦 بيانات البنك</div>
                        <div className="rf-bank-grid">
                            {[['اسم البنك', r.bankName || '—', false], ['صاحب الحساب', r.accountHolder || '—', false], ['رقم الحساب', r.accountNumber || '—', true], ['IBAN', r.iban || '—', true]].map(([lbl, val, mono]) => (
                                <div key={lbl}><div className="rf-field-lbl">{lbl}</div><div className={`rf-field-val${mono ? ' mono' : ''}`} style={{ fontSize: '.72rem' }}>{val}</div></div>
                            ))}
                        </div>
                    </div>
                </div>

                {(r.status === 'Pending' || r.status === 'Approved') && (
                    <div className="rf-action-area">
                        <div className="rf-action-row">
                            {r.status === 'Pending' && (
                                <>
                                    <button className="rf-action-btn approve" onClick={() => onAction(r, 'approve')}>✅ موافقة</button>
                                    <button className="rf-action-btn bank" onClick={() => onAction(r, 'send_to_bank')}>🏦 إرسال للبنك</button>
                                    <button className="rf-action-btn reject" onClick={() => onAction(r, 'reject')}>❌ رفض</button>
                                </>
                            )}
                            {r.status === 'Approved' && (
                                <button className="rf-action-btn bank" onClick={() => onAction(r, 'send_to_bank')}>🏦 إرسال للبنك</button>
                            )}
                        </div>
                    </div>
                )}

                <div className="adm-modal-actions">
                    <button className="adm-modal-cancel" onClick={onClose}>إغلاق</button>
                </div>
            </div>
        </div>
    );
} export default RefundDetailModal;
