// modals/RefundActionModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
const ACTION_META = {
    approve: { title: '✅ تأكيد الموافقة', color: '#16a34a', cls: 'approve', placeholder: 'ملاحظة للمستخدم (اختياري)...' },
    reject: { title: '❌ تأكيد الرفض', color: '#dc2626', cls: 'reject', placeholder: 'سبب الرفض (مطلوب)...' },
    send_to_bank: { title: '🏦 تأكيد الإرسال للبنك', color: '#0865a8', cls: 'bank', placeholder: 'مرجع التحويل البنكي (اختياري)...' },
};

export function RefundActionModal({ modal, note, saving, error, usersData, onNoteChange, onConfirm, onClose }) {
    const { refund: r, action } = modal;
    const am = ACTION_META[action];
    const u = usersData.find(u => u.id === r.userId) ?? { firstName: '—', lastName: '' };

    return (
        <div className="adm-modal-bg" onClick={() => !saving && onClose()}>
            <div className="adm-modal rd" style={{ maxWidth: 450, borderTopColor: am.color }} onClick={e => e.stopPropagation()}>
                <h3>{am.title}</h3>
                <p>
                    طلب <strong>{r.refNumber || r.id}</strong> — <strong>{`${u.firstName} ${u.lastName}`.trim() || '—'}</strong><br />
                    المبلغ:{' '}
                    <strong style={{ color: '#15803d', fontFamily: 'Courier New' }}>
                        {Number(r.amount || 0).toLocaleString()} {r.currency}
                    </strong>
                </p>
                {error && <div className="adm-err">⚠️ {error}</div>}
                <textarea
                    className="rf-textarea"
                    placeholder={am.placeholder}
                    value={note}
                    onChange={e => onNoteChange(e.target.value)}
                    disabled={saving}
                />
                <div className="adm-modal-actions">
                    <button className="adm-modal-cancel" onClick={onClose} disabled={saving}>إلغاء</button>
                    <button
                        className={`rf-action-confirm ${am.cls}`}
                        onClick={onConfirm}
                        disabled={saving || (action === 'reject' && !note.trim())}
                    >
                        {saving
                            ? <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'adm-spin .6s linear infinite', marginLeft: 6, verticalAlign: 'middle' }} />جاري...</>
                            : 'تأكيد'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
} export default RefundActionModal;