// modals/CertUploadModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useRef, useState } from 'react';

export function CertUploadModal({ modal, uploading, onClose, onFile }) {
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    return (
        <div className="adm-modal-bg" onClick={onClose}>
            <div className="adm-modal" onClick={e => e.stopPropagation()}>
                <h3>📜 رفع شهادة</h3>
                <p>{modal.userName} — {modal.courseTitle}</p>
                <div
                    className={`adm-drop${dragOver ? ' over' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => {
                        e.preventDefault(); setDragOver(false);
                        const f = e.dataTransfer.files[0];
                        if (f) onFile(modal.enrollmentId, modal.userId, modal.planworkId, f);
                    }}
                >
                    <div className="adm-drop-icon">📂</div>
                    <div className="adm-drop-txt">اسحب الملف هنا أو اضغط للاختيار</div>
                    <div className="adm-drop-sub">PDF, JPG, PNG — حجم أقصى 10 MB</div>
                    <input
                        ref={fileInputRef}
                        type="file" accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={e => {
                            const f = e.target.files[0];
                            if (f) onFile(modal.enrollmentId, modal.userId, modal.planworkId, f);
                            e.target.value = '';
                        }}
                    />
                </div>
                {uploading && (
                    <div style={{ textAlign: 'center', marginTop: 12, color: '#f57c00', fontSize: '.8rem', fontWeight: 700 }}>
                        ⏳ جاري الرفع على السيرفر...
                    </div>
                )}
                <div className="adm-modal-actions">
                    <button className="adm-modal-cancel" onClick={onClose}>إلغاء</button>
                </div>
            </div>
        </div>
    );
}
export default CertUploadModal;