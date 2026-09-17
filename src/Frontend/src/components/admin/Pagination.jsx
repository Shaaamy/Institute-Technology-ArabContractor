// Pagination.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { T, ITEMS_PER_PAGE } from './constants';

export function Pagination({ currentPage, totalItems, itemsPerPage = ITEMS_PER_PAGE, onPageChange, accentColor = T.blue }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    const buildPages = () => {
        const pages = []; const delta = 2;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) pages.push(i);
        }
        const result = []; let prev = null;
        for (const p of pages) { if (prev !== null && p - prev > 1) result.push('...'); result.push(p); prev = p; }
        return result;
    };

    const pgBtn = (label, onClick, isActive, isDisabled) => (
        <button
            key={label + Math.random()}
            onClick={onClick}
            disabled={isDisabled}
            style={{
                minWidth: 34, height: 34, padding: '0 8px', borderRadius: 2,
                border: isActive ? `2px solid ${accentColor}` : `1.5px solid ${T.gray300}`,
                background: isActive ? accentColor : isDisabled ? T.gray100 : T.white,
                color: isActive ? T.white : isDisabled ? T.gray300 : T.gray700,
                fontFamily: T.font, fontSize: '.78rem', fontWeight: 700,
                cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1,
                transition: 'all .14s', lineHeight: 1,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
        >{label}</button>
    );

    return (
        <div className="adm-pg">
            <span className="adm-pg-info">
                عرض <strong>{start}</strong> – <strong>{end}</strong> من إجمالي{' '}
                <strong style={{ color: accentColor }}>{totalItems}</strong> سجل
            </span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                {pgBtn('«', () => onPageChange(1), false, currentPage === 1)}
                {pgBtn('‹', () => onPageChange(currentPage - 1), false, currentPage === 1)}
                {buildPages().map((p, i) =>
                    p === '...'
                        ? <span key={`el-${i}`} style={{ padding: '0 4px', color: T.gray300, fontSize: '.78rem' }}>…</span>
                        : pgBtn(p, () => onPageChange(p), p === currentPage, false)
                )}
                {pgBtn('›', () => onPageChange(currentPage + 1), false, currentPage === totalPages)}
                {pgBtn('»', () => onPageChange(totalPages), false, currentPage === totalPages)}
            </div>
        </div>
    );
}
