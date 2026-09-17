// CourseDetails.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

const font = '"Noto Kufi Arabic",serif';

function resolveCertUrl(url) {
    if (!url) return null;
    if (url === 'uploaded') return null;
    // Only return absolute blob URLs directly — relative paths need token-fetch
    if (url.startsWith('https://') || url.startsWith('http://')) return url;
    // Relative path: store as-is with leading slash, caller must token-fetch it
    if (url.startsWith('/')) return url;
    return null;
}

// Normalise a raw cert object from the API
function normaliseCert(raw) {
    if (!raw) return null;
    const rawUrl = raw.fileUrl ?? raw.url ?? raw.filePath ?? raw.path ?? null;
    const url = resolveCertUrl(rawUrl);
    if (!url) return null;
    return {
        ...raw,
        url,   // may be absolute blob URL OR relative /api/... path
        rawUrl,
        name: raw.fileName ?? raw.filename ?? raw.name ?? null,
        // Flag whether this needs an authenticated fetch to get the real content
        needsAuth: !!(url && !url.startsWith('http')),
    };
}

// ── Fetch an auth-gated URL and return a blob object URL ────────────────────
// Used when fileUrl is a relative /api/... path that requires Authorization header.
async function fetchBlobUrl(relativeOrAbsoluteUrl, token) {
    const fullUrl = relativeOrAbsoluteUrl.startsWith('http')
        ? relativeOrAbsoluteUrl
        : `${API_BASE.replace('/api', '')}${relativeOrAbsoluteUrl}`;
    const res = await fetch(fullUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

// ── Resolve a plan-file URL from the AdminPlanFiles API ─────────────────────
function resolvePlanFileUrl(raw) {
    if (!raw) return null;
    if (raw.startsWith('https://') || raw.startsWith('http://')) return raw;
    if (raw.startsWith('/')) return `${API_BASE.replace('/api', '')}${raw}`;
    return null;
}

const mediaQueryStyles = `
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes modalSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes certModalSlideUp { from { transform: translateY(40px) scale(0.97); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
  @keyframes certShine {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @media (max-width: 768px) {
    .overview-bar { padding: 10px 16px !important; }
    .breadcrumb-text { font-size: 12px !important; }
    .main-container { padding: 20px 16px !important; }
    .content-wrapper { grid-template-columns: 1fr !important; gap: 24px !important; }
    .right-sidebar { position: static !important; order: -1; }
    .refund-modal-actions { flex-direction: column !important; }
    .cert-modal-card { max-width: 98vw !important; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .content-wrapper { grid-template-columns: 1fr 320px !important; gap: 24px !important; }
  }
  @media (hover: hover) {
    .btnAddCart:hover { background-color: #0865a8 !important; color: #ffffff !important; }
    .btnBuyNow:hover { transform: translateY(-2px); }
    .btnEnroll:hover { transform: translateY(-2px); }
    .btnViewMyCourses:hover { transform: translateY(-2px); }
    .btnRefund:hover { background-color: #e53935 !important; color: #ffffff !important; }
    .fileItemLink:hover { background-color: #eaf3ff !important; border-color: #0865a8 !important; }
    .otherCourseCard:hover { background-color: #ffffff !important; border-color: #0865a8 !important; transform: translateY(-2px); }
    .topicCard:hover { background-color: #ffffff !important; border-color: #0865a8 !important; }
    .btnCertPreview:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.45) !important; }
    .btnCertDownloadModal:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.35) !important; }
  }
`;

const S = {
    overviewBar: { position: 'fixed', left: 0, top: '64px', zIndex: 40, width: '100%', backgroundColor: '#f5f5f5', padding: '12px 24px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #e0e0e0' },
    overviewBarText: { textAlign: 'center', fontSize: '14px', fontFamily: '"Noto Kufi Arabic",serif', color: '#000' },
    breadcrumbLink: { marginLeft: '12px', color: '#0865a8', textDecoration: 'none', cursor: 'pointer', fontWeight: '500' },
    breadcrumbSep: { color: '#000', margin: '0 8px', opacity: 0.4 },
    breadcrumbCur: { marginRight: '12px', color: '#000', fontWeight: '600' },
    pageWrapper: { minHeight: '100vh', backgroundColor: '#fff', fontFamily: '"Noto Kufi Arabic",serif', direction: 'rtl' },
    heroSection: { color: '#fff', padding: '100px 24px 48px', marginTop: '52px' },
    heroContainer: { maxWidth: '1200px', margin: '0 auto' },
    heroContent: { maxWidth: '900px' },
    ownedBadge: { display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.9)', color: '#4a4a8a', fontWeight: 800, fontSize: '1rem', padding: '4px 16px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
    freeBadge: { display: 'inline-block', backgroundColor: '#fff', color: '#1a7a3c', fontWeight: 800, fontSize: '1rem', padding: '4px 16px', borderRadius: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
    heroTitle: { fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', lineHeight: '1.4', color: '#fff' },
    heroDesc: { fontSize: '18px', marginBottom: '24px', lineHeight: '1.6', color: '#fff', opacity: 0.95 },
    heroInfo: { display: 'flex', gap: '24px', flexWrap: 'wrap' },
    infoItem: { display: 'flex', alignItems: 'center', fontSize: '15px', color: '#fff' },
    loadingWrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', fontSize: '20px', color: '#0865a8', marginTop: '100px' },
    mainContainer: { maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' },
    contentWrapper: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' },
    leftContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
    section: { backgroundColor: '#fff', padding: '28px', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    sectionHeading: { fontSize: '22px', fontWeight: 'bold', marginBottom: '20px', color: '#000', borderRight: '4px solid #0865a8', paddingRight: '16px' },
    topicsGrid: { display: 'grid', gap: '14px' },
    topicCard: { display: 'flex', gap: '14px', padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderRight: '3px solid #f57c00', transition: 'all 0.2s' },
    topicIcon: { color: '#0865a8', flexShrink: 0, marginTop: '2px' },
    topicText: { fontSize: '15px', color: '#000', lineHeight: '1.6', margin: 0 },
    objGrid: { display: 'grid', gap: '14px' },
    objItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '15px', color: '#000', lineHeight: '1.6' },
    checkIcon: { color: '#f57c00', marginTop: '4px', flexShrink: 0 },
    prereqList: { listStyle: 'disc', paddingRight: '24px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#000', fontSize: '15px', lineHeight: '1.6' },
    methodsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px' },
    methodItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#000', fontSize: '15px' },
    dateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '14px' },
    dateItem: { padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '3px solid #0865a8' },
    dateLabel: { fontSize: '14px', color: '#000', fontWeight: 'bold', opacity: 0.7 },
    dateValue: { fontSize: '15px', color: '#000' },
    filesList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    fileLink: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f0f7ff', borderRadius: '8px', border: '2px solid #cce0ff', color: '#0865a8', fontSize: '15px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' },
    fileLocked: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '2px solid #e0e0e0', color: '#aaa', fontSize: '15px' },
    lockedBanner: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', backgroundColor: '#fff8e1', border: '2px solid #ffe082', borderRadius: '10px', marginBottom: '14px' },
    lockedBannerText: { fontSize: '14px', color: '#795548', lineHeight: '1.6' },
    filesLoadingWrap: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', color: '#0865a8', fontSize: '14px' },
    rightSidebar: { display: 'flex', flexDirection: 'column', gap: '24px', alignSelf: 'flex-start', position: 'sticky', top: '100px' },
    priceCard: { backgroundColor: '#fff', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
    pricePreview: { width: '100%', height: '200px', overflow: 'hidden', position: 'relative' },
    previewImg: { width: '100%', height: '100%', objectFit: 'cover' },
    certPreviewRibbon: {
        position: 'absolute', bottom: '12px', left: '12px',
        backgroundColor: 'rgba(124,58,237,0.92)',  // fallback
        backgroundImage: 'linear-gradient(100deg, rgba(124,58,237,0.95) 0%, rgba(159,103,245,0.95) 50%, rgba(124,58,237,0.95) 100%)',
        backgroundSize: '200% auto',               // no longer conflicts
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(6px)',
        borderRadius: '8px', padding: '6px 14px',
        fontSize: '13px', fontWeight: 'bold', color: '#fff',
        boxShadow: '0 2px 10px rgba(124,58,237,0.5)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        fontFamily: '"Noto Kufi Arabic",serif',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.2s',
        animation: 'certShine 3s linear infinite',
    },
    priceContent: { padding: '24px' },
    priceSec: { marginBottom: '20px' },
    ownedLabel: { fontSize: '32px', fontWeight: 'bold', color: '#4a4a8a', display: 'block', lineHeight: 1.2 },
    freeLabel: { fontSize: '32px', fontWeight: 'bold', color: '#1a7a3c', display: 'block', lineHeight: 1.2 },
    priceSub: { fontSize: '13px', color: '#666', marginTop: '4px', display: 'block' },
    paidPrice: { fontSize: '32px', fontWeight: 'bold', color: '#f57c00', display: 'block', marginBottom: '4px' },
    strikePrice: { fontSize: '16px', color: '#000', textDecoration: 'line-through', opacity: 0.5, display: 'block', marginBottom: '4px' },
    discountBadge: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, backgroundColor: '#fce7f3', color: '#be185d', marginBottom: '6px' },
    modeBadgeOnline: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, backgroundColor: '#ede9fe', color: '#7c3aed', marginTop: '4px' },
    modeBadgeOnsite: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, backgroundColor: '#e0f2fe', color: '#0865a8', marginTop: '4px' },
    actionBtns: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
    btnViewMyCourses: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg,#4a4a8a 0%,#7b5ea7 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(74,74,138,0.3)' },
    btnCertPreview: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        width: '100%', padding: '13px 24px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
        fontFamily: '"Noto Kufi Arabic",serif',
        boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
        transition: 'all 0.25s ease',
    },
    btnRefund: { width: '100%', padding: '12px 24px', backgroundColor: '#fff', color: '#e53935', border: '2px solid #e53935', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s' },
    btnEnroll: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg,#1a7a3c 0%,#27ae60 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(26,122,60,0.3)' },
    btnAddCart: { width: '100%', padding: '14px 24px', backgroundColor: '#fff', color: '#0865a8', border: '2px solid #0865a8', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif', transition: 'all 0.3s' },
    btnBuyNow: { width: '100%', padding: '14px 24px', background: 'linear-gradient(135deg,#0865a8 0%,#f57c00 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(8,101,168,0.3)' },
    includesItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#000' },
    otherCard: { backgroundColor: '#fff', borderRadius: '12px', border: '2px solid #f0f0f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '24px' },
    otherTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#000' },
    otherList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    otherCourseCard: { display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', backgroundColor: '#f9f9f9', border: '2px solid transparent' },
    otherCourseImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
    otherCourseName: { fontSize: '14px', fontWeight: 'bold', color: '#000', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 },
    otherCoursePrice: { fontSize: '16px', fontWeight: 'bold' },
    notFoundWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px' },
    notFoundCard: { backgroundColor: '#fff', padding: '48px', borderRadius: '12px', border: '2px solid #f0f0f0', textAlign: 'center', maxWidth: '500px' },
    btnPrimary: { display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg,#0865a8 0%,#f57c00 100%)', color: '#fff', textDecoration: 'none', borderRadius: '10px', marginTop: '24px', fontWeight: 'bold' },
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' },
    modalCard: { backgroundColor: '#fff', borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.22)', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', animation: 'modalSlideUp 0.3s ease-out' },
    modalHeader: { background: 'linear-gradient(135deg,#c62828 0%,#e53935 100%)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', position: 'sticky', top: 0, zIndex: 1 },
    modalHeaderIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' },
    modalTitle: { fontSize: '17px', fontWeight: 'bold', color: '#fff', margin: 0 },
    modalSubtitle: { fontSize: '12px', color: 'rgba(255,255,255,0.85)', margin: '3px 0 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    modalClose: { marginRight: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', flexShrink: 0 },
    modalBody: { padding: '20px' },
    infoBox: { display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' },
    infoBoxText: { fontSize: '13px', color: '#1565c0', lineHeight: '1.5', margin: 0 },
    warningBox: { display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#795548', fontFamily: '"Noto Kufi Arabic",serif' },
    formLabel: { display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000', marginBottom: '8px' },
    formInput: { width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: '"Noto Kufi Arabic",serif', color: '#000', outline: 'none', boxSizing: 'border-box', direction: 'rtl', transition: 'border-color 0.2s', marginBottom: '12px' },
    textarea: { width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: '"Noto Kufi Arabic",serif', color: '#000', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: '1.5', direction: 'rtl' },
    charCount: { textAlign: 'left', fontSize: '11px', color: '#999', marginTop: '4px', marginBottom: '12px' },
    errorBox: { display: 'flex', gap: '8px', alignItems: 'flex-start', backgroundColor: '#ffebee', border: '1px solid #ef9a9a', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '13px', color: '#c62828' },
    modalActions: { display: 'flex', gap: '10px', marginTop: '6px' },
    btnCancel: { flex: 1, padding: '11px 16px', backgroundColor: '#f5f5f5', color: '#555', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif' },
    btnSubmit: { flex: 2, padding: '11px 16px', background: 'linear-gradient(135deg,#c62828 0%,#e53935 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif', boxShadow: '0 3px 10px rgba(229,57,53,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    successState: { textAlign: 'center', padding: '16px 0' },
    successIcon: { fontSize: '48px', marginBottom: '12px' },
    successTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1a7a3c', marginBottom: '10px' },
    successText: { fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '20px' },
    btnDone: { padding: '11px 36px', background: 'linear-gradient(135deg,#1a7a3c 0%,#27ae60 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic",serif' },
    policyBox: { display: 'flex', gap: '10px', alignItems: 'flex-start', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', lineHeight: '1.6', fontFamily: '"Noto Kufi Arabic",serif' },
    enrollMsgBox: { padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontFamily: '"Noto Kufi Arabic",serif', lineHeight: '1.6', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' },
    certOverlay: {
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(10,5,30,0.75)',
        zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(8px)',
    },
    certModalCard: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 24px 64px rgba(124,58,237,0.3), 0 8px 24px rgba(0,0,0,0.2)',
        width: '100%', maxWidth: '760px', maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        animation: 'certModalSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        border: '1.5px solid rgba(124,58,237,0.2)',
    },
    certModalHeader: {
        background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 50%, #9f67f5 100%)',
        padding: '18px 22px',
        display: 'flex', alignItems: 'center', gap: '14px',
        position: 'relative', flexShrink: 0,
    },
    certModalHeaderIconWrap: {
        width: '44px', height: '44px', borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.18)',
        border: '1.5px solid rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', flexShrink: 0,
    },
    certModalTitleWrap: { flex: 1 },
    certModalTitle: { fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0, fontFamily: '"Noto Kufi Arabic",serif' },
    certModalSubtitle: {
        fontSize: '12px', color: 'rgba(255,255,255,0.78)', margin: '4px 0 0',
        display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        fontFamily: '"Noto Kufi Arabic",serif',
    },
    certModalCloseBtn: {
        background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '50%', width: '34px', height: '34px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#fff', flexShrink: 0, transition: 'background 0.2s',
    },
    certModalBody: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    certPreviewArea: {
        flex: 1, background: '#1a1a2e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '420px', position: 'relative', overflow: 'hidden',
    },
    certIframe: { width: '100%', height: '100%', minHeight: '420px', border: 'none', display: 'block' },
    certFallback: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '16px', padding: '40px 24px', textAlign: 'center',
    },
    certFallbackIcon: { fontSize: '64px', lineHeight: 1 },
    certFallbackText: { fontSize: '15px', color: 'rgba(255,255,255,0.7)', fontFamily: '"Noto Kufi Arabic",serif', lineHeight: '1.6' },
    certModalFooter: {
        padding: '16px 22px',
        borderTop: '1px solid #f0e8ff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        backgroundColor: '#faf7ff', flexShrink: 0, flexWrap: 'wrap',
    },
    certModalInfo: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#7c3aed', fontFamily: '"Noto Kufi Arabic",serif' },
    certModalActions: { display: 'flex', gap: '10px', alignItems: 'center' },
    btnOpenNewTab: {
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '9px 18px',
        backgroundColor: '#fff', color: '#7c3aed',
        border: '2px solid #7c3aed', borderRadius: '8px',
        fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
        fontFamily: '"Noto Kufi Arabic",serif', transition: 'all 0.2s',
        textDecoration: 'none',
    },
    btnCertDownloadModal: {
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '9px 22px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #9f67f5 100%)',
        color: '#fff', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
        fontFamily: '"Noto Kufi Arabic",serif',
        boxShadow: '0 3px 12px rgba(124,58,237,0.35)',
        transition: 'all 0.25s ease', textDecoration: 'none',
    },
};

const REFUND_STATUS_MAP = {
    Pending: { label: 'قيد المراجعة', bg: '#fff8e1', color: '#f59e0b', icon: '⏳' },
    Approved: { label: 'تمت الموافقة', bg: '#e3f2fd', color: '#0865a8', icon: '✅' },
    Rejected: { label: 'مرفوض', bg: '#ffebee', color: '#e53935', icon: '❌' },
    Sent: { label: 'تم التحويل', bg: '#f0fff4', color: '#1a7a3c', icon: '💸' },
};

function getRefundPolicy(courseDateStr, coursePrice) {
    if (!courseDateStr) return { type: 'unknown' };
    const raw = courseDateStr.split(' - ')[0].trim();
    let startDate = null;
    const parts = raw.split(/[\/\-]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) startDate = new Date(+parts[0], +parts[1] - 1, +parts[2]);
        else startDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
    }
    if (!startDate || isNaN(startDate.getTime())) return { type: 'unknown' };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((startDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return { type: 'blocked', reason: 'started' };
    if (daysLeft < 2) return { type: 'blocked', reason: 'tooClose', daysLeft };
    if (daysLeft <= 6) return { type: 'partial', daysLeft, refundAmount: (coursePrice * 0.75).toLocaleString('ar-EG') };
    return { type: 'full', daysLeft };
}

function renderPolicyBox(policy) {
    if (policy.type === 'blocked') {
        const msg = policy.reason === 'started'
            ? 'عذراً، لا يمكن طلب الاسترداد بعد بدء الكورس.'
            : 'عذراً، لا يمكن طلب الاسترداد. تبقى أقل من يومي عمل على بدء الكورس.';
        return (
            <div style={{ ...S.policyBox, backgroundColor: '#ffebee', border: '1px solid #ef9a9a', color: '#c62828' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>🚫</span>
                <span>{msg}</span>
            </div>
        );
    }
    if (policy.type === 'partial') {
        return (
            <div style={{ ...S.policyBox, backgroundColor: '#fff8e1', border: '1px solid #ffe082', color: '#795548' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
                <span>تبقى <strong>{policy.daysLeft} أيام</strong> على بدء الكورس — سيُخصم 25% وستسترد <strong>{policy.refundAmount} جنيه</strong> فقط.</span>
            </div>
        );
    }
    if (policy.type === 'full') {
        return (
            <div style={{ ...S.policyBox, backgroundColor: '#f0fff4', border: '1px solid #a7f3d0', color: '#1a7a3c' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>✅</span>
                <span>مؤهل لاسترداد كامل — تبقى <strong>{policy.daysLeft} أيام</strong> على بدء الكورس.</span>
            </div>
        );
    }
    return null;
}

async function parseServerError(res) {
    const status = res.status;
    let body = '';
    try { body = await res.text(); } catch (_) { }
    try {
        const j = JSON.parse(body);
        const msg = j.message || j.Message || j.error || j.Error || j.title || j.Title;
        if (msg) return `${msg} (${status})`;
    } catch (_) { }
    if (body && body.length < 300 && !body.trim().startsWith('<')) return `${body.trim()} (${status})`;
    const defaults = {
        400: 'بيانات الطلب غير صحيحة (400)',
        401: 'غير مصرح — يرجى تسجيل الدخول مجدداً (401)',
        403: 'ليس لديك صلاحية تنفيذ هذا الإجراء (403)',
        404: 'الطلب غير موجود أو الخدمة غير متاحة (404)',
        409: 'لديك طلب استرداد قيد المراجعة بالفعل',
        422: 'البيانات المدخلة غير مقبولة (422)',
        500: 'خطأ في الخادم، يرجى المحاولة لاحقاً (500)',
    };
    return defaults[status] || `حدث خطأ غير متوقع (${status})`;
}

// ─────────────────────────────────────────────────────────────────────────────
const CertificateModal = ({ cert, courseTitle, onClose, getToken }) => {
    const [blobUrl, setBlobUrl] = useState(null);     // resolved object URL for preview & download
    const [loadingBlob, setLoadingBlob] = useState(false);
    const [loadError, setLoadError] = useState(false);

    const rawUrl = cert?.url ?? null;
    const certName = cert?.name || `شهادة_${courseTitle || 'الدورة'}.jpg`;
    // Determine if it's a direct URL (blob storage) or needs auth fetch
    const isDirectUrl = rawUrl && rawUrl.startsWith('http');
    const displayUrl = isDirectUrl ? rawUrl : blobUrl;
    const isImage = displayUrl && /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(displayUrl);
    const isPdf = displayUrl && /\.pdf($|\?)/i.test(displayUrl);

    // Fetch auth-gated content as blob URL
    useEffect(() => {
        if (!rawUrl || isDirectUrl) return;
        let objectUrl = null;
        setLoadingBlob(true);
        setLoadError(false);
        (async () => {
            try {
                const token = await getToken();
                objectUrl = await fetchBlobUrl(rawUrl, token);
                setBlobUrl(objectUrl);
            } catch {
                setLoadError(true);
            } finally {
                setLoadingBlob(false);
            }
        })();
        return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
    }, [rawUrl, isDirectUrl, getToken]);

    // Download handler — works for both direct URLs and blob object URLs
    const handleDownload = () => {
        const url = displayUrl;
        if (!url) return;
        const a = document.createElement('a');
        a.href = url;
        a.download = certName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Open in new tab — for direct URLs only (blob object URLs can't be opened in new tab reliably)
    const handleOpenNewTab = () => {
        if (!displayUrl) return;
        window.open(displayUrl, '_blank', 'noopener,noreferrer');
    };

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!rawUrl) return null;

    const showLoading = !isDirectUrl && loadingBlob;
    const showError = !isDirectUrl && loadError;
    const readyToShow = isDirectUrl ? !!displayUrl : !!blobUrl;

    return (
        <div style={S.certOverlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={S.certModalCard} className="cert-modal-card" dir="rtl">
                <div style={S.certModalHeader}>
                    <div style={S.certModalHeaderIconWrap}>📜</div>
                    <div style={S.certModalTitleWrap}>
                        <h2 style={S.certModalTitle}>شهادة الإتمام</h2>
                        <p style={S.certModalSubtitle}>{courseTitle}</p>
                    </div>
                    <button style={S.certModalCloseBtn} onClick={onClose} title="إغلاق">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div style={S.certModalBody}>
                    <div style={S.certPreviewArea}>
                        {showLoading ? (
                            <div style={S.certFallback}>
                                <svg style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite', color: '#9f67f5' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <p style={S.certFallbackText}>جاري تحميل الشهادة...</p>
                            </div>
                        ) : showError ? (
                            <div style={S.certFallback}>
                                <div style={S.certFallbackIcon}>⚠️</div>
                                <p style={S.certFallbackText}>
                                    تعذّر تحميل الشهادة للمعاينة.<br />
                                    يمكنك تحميلها مباشرةً بالضغط على زر التحميل.
                                </p>
                            </div>
                        ) : readyToShow && isImage ? (
                            <img
                                src={displayUrl}
                                alt="شهادة الإتمام"
                                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '4px', display: 'block' }}
                            />
                        ) : readyToShow && isPdf ? (
                            <iframe
                                src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                style={S.certIframe}
                                title="معاينة الشهادة"
                            />
                        ) : readyToShow ? (
                            // Unknown type — show as image first, fallback handled by onError
                            <img
                                src={displayUrl}
                                alt="شهادة الإتمام"
                                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '4px', display: 'block' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div style={S.certFallback}>
                                <div style={S.certFallbackIcon}>📄</div>
                                <p style={S.certFallbackText}>جاري تجهيز الشهادة...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={S.certModalFooter}>
                    <div style={S.certModalInfo}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span>شهادتك معتمدة ✓</span>
                    </div>
                    <div style={S.certModalActions}>
                        {/* Open in new tab — only meaningful for direct URLs */}
                        {isDirectUrl && displayUrl && (
                            <button onClick={handleOpenNewTab} style={S.btnOpenNewTab} className="btnOpenNewTab">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                </svg>
                                فتح في تبويب جديد
                            </button>
                        )}
                        {/* Download — works for both direct and blob object URLs */}
                        <button
                            onClick={handleDownload}
                            disabled={!displayUrl}
                            style={{
                                ...S.btnCertDownloadModal,
                                ...(!displayUrl ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                            }}
                            className="btnCertDownloadModal"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            تحميل الشهادة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const CourseDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherCourses, setOtherCourses] = useState([]);
    const [ownedCourseIds, setOwnedCourseIds] = useState(new Set());

    // ── Plan files state ─────────────────────────────────────────────────────
    const [planFiles, setPlanFiles] = useState([]);
    const [planFilesLoading, setPlanFilesLoading] = useState(false);

    // cert: normalised cert object { url, rawUrl, name, ... } or null
    const [cert, setCert] = useState(null);
    const [certLoading, setCertLoading] = useState(false);
    const [showCertModal, setShowCertModal] = useState(false);

    const [enrolling, setEnrolling] = useState(false);
    const [enrollMsg, setEnrollMsg] = useState(null);

    const [showRefund, setShowRefund] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [bankName, setBankName] = useState('');
    const [iban, setIban] = useState('');
    const [refundSending, setRefundSending] = useState(false);
    const [refundSuccess, setRefundSuccess] = useState(false);
    const [refundError, setRefundError] = useState(null);
    const [existingRefund, setExistingRefund] = useState(null);
    const [loadingRefundCheck, setLoadingRefundCheck] = useState(false);

    const [mode, setMode] = useState('onsite');
    const [onlineSetting, setOnlineSetting] = useState(null);
    const [onlineLoading, setOnlineLoading] = useState(false);

    const safeGetToken = useCallback(async () => {
        try { return await getToken(); } catch (_) { return null; }
    }, [getToken]);

    const fetchOwnedCourses = useCallback(async () => {
        if (!isSignedIn) { setOwnedCourseIds(new Set()); return; }
        try {
            const token = await safeGetToken();
            if (!token) return;
            const res = await fetch(`${API_BASE}/course/my-courses`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const data = await res.json();
            setOwnedCourseIds(new Set(data.map(e => e.childId)));
        } catch { setOwnedCourseIds(new Set()); }
    }, [isSignedIn, safeGetToken]);

    // ── Fetch plan files ─────────────────────────────────────────────────────
    const fetchPlanFiles = useCallback(async (courseId) => {
        if (!courseId) return;
        setPlanFiles([]);
        setPlanFilesLoading(true);
        try {
            const token = await safeGetToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch(`${API_BASE}/admin/AdminPlanFiles/${courseId}`, { headers });
            if (!res.ok) { setPlanFiles([]); return; }
            const data = await res.json();
            const list = Array.isArray(data) ? data : [];
            const sorted = [...list].sort((a, b) =>
                (a.filePeriority ?? a.FilePeriority ?? 999) - (b.filePeriority ?? b.FilePeriority ?? 999)
            );
            const mapped = sorted.map(f => {
                const rawUrl = f.fileName ?? f.FileName ?? f.fileUrl ?? f.FileUrl ?? null;
                const url = resolvePlanFileUrl(rawUrl);
                return {
                    id: f.fileId ?? f.FileId ?? null,
                    title: f.fileTitle ?? f.FileTitle ?? f.planworkName ?? f.PlanworkName ?? 'ملف',
                    url,
                    priority: f.filePeriority ?? f.FilePeriority ?? 0,
                };
            });
            setPlanFiles(mapped);
        } catch {
            setPlanFiles([]);
        } finally {
            setPlanFilesLoading(false);
        }
    }, [safeGetToken]);

    // ── FIXED: Fetch certificate — mirrors MyCourses.jsx exactly ────────────
    // Strategy:
    //   1. Call my-courses to get userId for this course
    //   2. Primary:  GET /Admin/certificates/{userId}/{planworkId}  → single object with full blob URL
    //   3. Fallback: GET /Admin/certificates (all certs list)       → filter by planworkId
    //                (these return relative /api/... paths which resolveCertUrl handles)
    const fetchCertForCourse = useCallback(async (courseId) => {
        if (!isSignedIn || !courseId) return;
        setCert(null);
        setCertLoading(true);
        try {
            const token = await safeGetToken();
            if (!token) return;

            // Step 1: get userId from my-courses
            let userId = null;
            try {
                const mcRes = await fetch(`${API_BASE}/course/my-courses`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (mcRes.ok) {
                    const list = await mcRes.json();
                    const match = list.find(e => String(e.childId) === String(courseId));
                    if (match) userId = match.userId ?? match.UserId ?? null;
                }
            } catch { /* continue without userId */ }

            let raw = null;

            // Step 2 – Primary: /certificates/{userId}/{planworkId}
            // This endpoint returns a SINGLE object with a full blob URL in fileUrl (Image 1)
            if (userId) {
                try {
                    const res = await fetch(
                        `${API_BASE}/Admin/certificates/${userId}/${courseId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (res.ok) {
                        const data = await res.json();
                        raw = Array.isArray(data) ? data[0] : data;
                    }
                } catch { /* fall through */ }
            }

            // Step 3 – Fallback: GET /Admin/certificates (full list, Image 2)
            // Returns relative paths → resolveCertUrl converts them to absolute
            if (!raw) {
                try {
                    const res = await fetch(
                        `${API_BASE}/Admin/certificates`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (res.ok) {
                        const data = await res.json();
                        const list = Array.isArray(data) ? data : [data];
                        // Match by planworkId first, then userId+planworkId
                        raw = list.find(c =>
                            String(c.planworkId ?? c.PlanworkId ?? '') === String(courseId) &&
                            (!userId || String(c.userId ?? c.UserId ?? '') === String(userId))
                        ) ?? list.find(c =>
                            String(c.planworkId ?? c.PlanworkId ?? '') === String(courseId)
                        ) ?? null;
                    }
                } catch { /* give up */ }
            }

            setCert(normaliseCert(raw));
        } catch {
            setCert(null);
        } finally {
            setCertLoading(false);
        }
    }, [isSignedIn, safeGetToken]);

    useEffect(() => { fetchOwnedCourses(); }, [fetchOwnedCourses]);

    useEffect(() => {
        window.addEventListener('cartUpdated', fetchOwnedCourses);
        window.addEventListener('enrollUpdated', fetchOwnedCourses);
        return () => {
            window.removeEventListener('cartUpdated', fetchOwnedCourses);
            window.removeEventListener('enrollUpdated', fetchOwnedCourses);
        };
    }, [fetchOwnedCourses]);

    const checkExistingRefund = useCallback(async (courseId) => {
        if (!isSignedIn) return;
        setLoadingRefundCheck(true);
        try {
            const token = await safeGetToken();
            if (!token) return;
            const res = await fetch(`${API_BASE}/refund/my`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 404 || res.status === 204) { setExistingRefund(null); return; }
            if (!res.ok) { setExistingRefund(null); return; }
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data?.data ?? data?.items ?? data?.result ?? []);
            const cid = String(courseId);
            const match = list.find(r =>
                (String(r.planworkId ?? r.planWorkId ?? r.PlanworkId ?? '') === cid) &&
                (r.status === 'Pending' || r.status === 'Approved')
            );
            setExistingRefund(match || null);
        } catch {
            setExistingRefund(null);
        } finally {
            setLoadingRefundCheck(false);
        }
    }, [isSignedIn, safeGetToken]);

    const extractList = (html, heading) => {
        if (!html) return [];
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const items = [];
        const h = Array.from(doc.querySelectorAll('h6')).find(n => n.textContent.includes(heading));
        if (h) {
            let el = h.nextElementSibling;
            while (el && el.tagName !== 'H6') {
                if (el.tagName === 'UL') el.querySelectorAll('li').forEach(li => { const t = li.textContent.trim(); if (t) items.push(t); });
                el = el.nextElementSibling;
            }
        }
        return items;
    };

    const extractDates = (s) => {
        if (!s) return { startDate: '', endDate: '' };
        const p = s.split(' - ');
        return { startDate: p[0]?.trim() || '', endDate: p[1]?.trim() || p[0]?.trim() || '' };
    };

    const transform = (a) => {
        const { startDate, endDate } = extractDates(a.date);
        const isFree = !a.cost || a.cost === 0;
        const onsitePrice = a.cost || 0;
        const onsiteOriginalPrice = a.originalPrice ?? a.onSale ?? (a.cost ? Math.round(a.cost / (1 - (a.discountPercent || 0) / 100)) : 0);
        const onsiteDiscountPercent = a.discountPercent ?? a.DiscountPercent ?? 0;
        const onsiteDiscountAmount = a.discountAmount ?? a.DiscountAmount ?? 0;
        const onlineCostRaw = a.onlineCost ?? a.online_cost ?? a.OnlineCost ?? null;
        const onlineOriginalPrice = a.onlineOriginalPrice ?? null;
        const onlineDiscountPercent = a.onlineDiscountPercent ?? a.OnlineDiscountPercent ?? 0;
        const onlineDiscountAmount = a.onlineDiscountAmount ?? a.OnlineDiscountAmount ?? 0;
        return {
            id: a.id, slug: a.slug, title: a.title, description: a.description, place: a.place,
            price: onsitePrice, originalPrice: onsiteOriginalPrice,
            discountPercent: onsiteDiscountPercent, discountAmount: onsiteDiscountAmount,
            onlineCost: onlineCostRaw, onlineOriginalPrice,
            onlineDiscountPercent, onlineDiscountAmount,
            currency: 'جنيه', isFree,
            duration: 26, videoDuration: 26,
            articlesCount: a.files?.length || 0,
            hasCertificate: true, language: 'العربية', level: 'مبتدئ',
            topics: extractList(a.content, 'محتويات البرنامج'),
            objectives: extractList(a.content, 'فائدة حضور البرنامج'),
            prerequisites: extractList(a.content, 'لمن يعقد البرنامج'),
            implementationMethods: extractList(a.content, 'طريقة تنفيذ البرنامج'),
            programDates: extractList(a.content, 'تاريخ انعقاد البرنامج'),
            startDate, endDate, date: a.date,
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
        };
    };

    // ── Load course data ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!slug) return;
        (async () => {
            try {
                setLoading(true); setError(null);
                const res = await fetch(`${API_BASE}/Course/${slug}`);
                if (!res.ok) throw new Error('not found');
                const c = transform(await res.json());
                setCourse(c);
                const rel = ['solid-liquid-waste-management', 'construction-project-management', 'architectural-engineering']
                    .filter(s => s !== slug).slice(0, 3);
                const others = await Promise.all(rel.map(s =>
                    fetch(`${API_BASE}/Course/${s}`).then(r => r.ok ? r.json() : null).catch(() => null)
                ));
                setOtherCourses(others.filter(Boolean).map(transform));
            } catch (e) { setError(e.message); }
            finally { setLoading(false); }
        })();
    }, [slug]);

    const isOwned = course ? ownedCourseIds.has(course.id) : false;

    // ── Fetch plan files (always, for all users) ─────────────────────────────
    useEffect(() => {
        if (course?.id) {
            fetchPlanFiles(course.id);
        } else {
            setPlanFiles([]);
        }
    }, [course?.id, fetchPlanFiles]);

    // ── Fetch cert only when owned ───────────────────────────────────────────
    useEffect(() => {
        if (course?.id && isOwned) {
            fetchCertForCourse(course.id);
        } else {
            setCert(null);
        }
    }, [course?.id, isOwned, fetchCertForCourse]);

    useEffect(() => {
        if (!course?.id) { setOnlineSetting(null); return; }
        setOnlineLoading(true);
        (async () => {
            try {
                const token = await safeGetToken();
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await fetch(`${API_BASE}/Admin/online-settings/${course.id}`, { headers });
                if (res.ok) {
                    const data = await res.json();
                    const item = Array.isArray(data) ? data[0] : data;
                    if (item) {
                        setOnlineSetting({
                            link: item.meetingLink ?? item.MeetingLink ?? '',
                            visible: !!(item.isVisible ?? item.IsVisible ?? false),
                        });
                    } else { setOnlineSetting(null); }
                } else { setOnlineSetting(null); }
            } catch { setOnlineSetting(null); }
            finally { setOnlineLoading(false); }
        })();
    }, [course?.id, safeGetToken]);

    useEffect(() => {
        document.title = course?.title ? `${course.title} - المعهد التكنولوجي` : 'المعهد التكنولوجي';
    }, [course]);

    const addToCart = async (buyNow = false, courseMode = 'onsite') => {
        if (!course) return;
        const isOnline = courseMode === 'online';
        const priceToUse = isOnline ? (course.onlineCost != null ? course.onlineCost : 0) : course.price;
        try {
            const token = await safeGetToken();
            if (token) {
                await fetch(`${API_BASE}/cart/add/${course.id}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isOnline }),
                });
            }
        } catch { }
        const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (!cart.some(i => i.id === course.id)) {
            cart.push({
                id: course.id, slug: course.slug, title: course.title,
                instructor: course.place || 'غير محدد', image: course.image,
                currentPrice: priceToUse,
                originalPrice: isOnline ? (course.onlineOriginalPrice || 0) : (course.originalPrice || 0),
                quantity: 1, isOnline, modeLabel: isOnline ? 'أونلاين' : 'حضوري',
            });
            localStorage.setItem('cartItems', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
        }
        navigate(buyNow ? '/checkout' : '/cart');
    };

    const handleEnroll = async () => {
        if (!course) return;
        if (!isSignedIn) { navigate('/sign-in'); return; }
        setEnrolling(true); setEnrollMsg(null);
        try {
            const token = await safeGetToken();
            if (!token) { setEnrollMsg({ type: 'error', text: 'يجب تسجيل الدخول أولاً.' }); return; }
            const res = await fetch(`${API_BASE}/course/enroll-free/${course.id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) { setEnrollMsg({ type: 'error', text: data?.message || 'حدث خطأ، حاول مرة أخرى.' }); return; }
            if (data.alreadyEnrolled) {
                setEnrollMsg({ type: 'info', text: '✅ أنت مسجل في هذا الكورس بالفعل.' });
            } else {
                setEnrollMsg({ type: 'success', text: '🎉 تم تسجيلك بنجاح! يمكنك الآن متابعة الكورس من دوراتك.' });
            }
            await fetchOwnedCourses();
            window.dispatchEvent(new Event('enrollUpdated'));
        } catch (err) {
            setEnrollMsg({ type: 'error', text: err.message || 'حدث خطأ، حاول مرة أخرى.' });
        } finally { setEnrolling(false); }
    };

    const openRefund = () => {
        setShowRefund(true); setRefundError(null);
        setRefundSuccess(false); setExistingRefund(null);
        if (course) checkExistingRefund(course.id);
    };

    const submitRefund = async () => {
        if (!refundReason.trim()) { setRefundError('الرجاء كتابة سبب طلب الاسترداد'); return; }
        setRefundSending(true); setRefundError(null);
        try {
            const token = await safeGetToken();
            if (!token) { setRefundError('يجب تسجيل الدخول أولاً'); setRefundSending(false); return; }
            let planworkId = course.id; let orderId = null;
            try {
                const myCoursesRes = await fetch(`${API_BASE}/course/my-courses`, { headers: { Authorization: `Bearer ${token}` } });
                if (myCoursesRes.ok) {
                    const myList = await myCoursesRes.json();
                    const enrollment = myList.find(e => String(e.childId) === String(course.id));
                    if (enrollment) { planworkId = enrollment.childId ?? course.id; orderId = enrollment.orderId ?? null; }
                }
            } catch { }
            if (!orderId) { setRefundError('لم يتم العثور على بيانات الطلب الأصلي. يرجى التواصل مع الدعم.'); setRefundSending(false); return; }
            const payload = { orderId, planworkId, reason: refundReason.trim(), details: null, bankName: bankName.trim() || null, accountNumber: null, accountHolder: null, iban: iban.trim() || null };
            const res = await fetch(`${API_BASE}/refund`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.status === 409) { setRefundError('لديك طلب استرداد قيد المراجعة بالفعل لهذه الدورة'); return; }
            if (!res.ok) { setRefundError(await parseServerError(res)); return; }
            setRefundSuccess(true);
            setRefundReason(''); setBankName(''); setIban('');
        } catch (err) {
            setRefundError(err.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
        } finally { setRefundSending(false); }
    };

    const closeRefund = () => {
        setShowRefund(false); setRefundReason(''); setBankName(''); setIban('');
        setRefundError(null); setRefundSuccess(false); setExistingRefund(null);
    };

    const heroBg = isOwned
        ? 'linear-gradient(135deg,#4a4a8a 0%,#7b5ea7 100%)'
        : course?.isFree
            ? 'linear-gradient(135deg,#1a7a3c 0%,#27ae60 100%)'
            : 'linear-gradient(135deg,#0865a8 0%,#f57c00 100%)';

    const font = '"Noto Kufi Arabic",serif';
    const statusInfo = existingRefund ? REFUND_STATUS_MAP[existingRefund.status] : null;

    const refundPolicy = course ? getRefundPolicy(course.date, course.price) : { type: 'unknown' };
    const isRefundBlocked = refundPolicy.type === 'blocked';

    const onlineCost = course?.onlineCost ?? null;
    const onlinePriceFree = onlineCost === null || onlineCost === 0;
    const activePrice = mode === 'online' ? (onlineCost != null ? onlineCost : 0) : (course?.price ?? 0);

    const modeTabBase = { flex: 1, padding: '9px 10px', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Noto Kufi Arabic",serif', transition: 'all .2s' };
    const modeTabActive = { ...modeTabBase, background: 'linear-gradient(135deg,#0865a8,#1a84d4)', color: '#fff', boxShadow: '0 3px 10px rgba(8,101,168,0.3)' };
    const modeTabInactive = { ...modeTabBase, background: '#f0f1f2', color: '#6b7280' };

    const hasCert = !!(cert?.url);

    const showFilesSection = planFilesLoading || planFiles.length > 0;

    if (loading) return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`*{font-family:${font}!important}${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                <div style={S.overviewBar} className="overview-bar">
                    <div style={S.overviewBarText} className="breadcrumb-text">
                        <a href="/" style={S.breadcrumbLink}>الصفحة الرئيسية</a>
                        <span style={S.breadcrumbSep}>•</span>
                        <span style={S.breadcrumbCur}>جاري التحميل...</span>
                    </div>
                </div>
                <div style={S.loadingWrap}>جاري تحميل الدورة...</div>
            </div>
        </>
    );

    if (error || !course) return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`*{font-family:${font}!important}${mediaQueryStyles}`}</style>
            <div dir="rtl" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
                <div style={S.overviewBar} className="overview-bar">
                    <div style={S.overviewBarText} className="breadcrumb-text">
                        <a href="/" style={S.breadcrumbLink}>الصفحة الرئيسية</a>
                        <span style={S.breadcrumbSep}>•</span>
                        <span style={S.breadcrumbCur}>خطأ</span>
                    </div>
                </div>
                <div style={S.notFoundWrap}>
                    <div style={S.notFoundCard}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
                        <h2>الدورة غير موجودة!</h2>
                        <p style={{ marginTop: '8px', color: '#666' }}>عذراً، الدورة التي تبحث عنها غير متوفرة</p>
                        <Link to="/" style={S.btnPrimary}>العودة للصفحة الرئيسية</Link>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />
            <style>{`*{font-family:${font}!important}${mediaQueryStyles}`}</style>

            <div dir="rtl" style={S.pageWrapper}>
                <div style={{ ...S.overviewBar, top: 70 }} className="overview-bar">
                    <div style={S.overviewBarText} className="breadcrumb-text">
                        <a href="/" style={S.breadcrumbLink}
                            onMouseEnter={e => e.target.style.color = '#f57c00'}
                            onMouseLeave={e => e.target.style.color = '#0865a8'}>الصفحة الرئيسية</a>
                        <span style={S.breadcrumbSep}>•</span>
                        <span style={S.breadcrumbCur}>{course.title}</span>
                    </div>
                </div>

                <div style={S.heroSection} className="hero-section">
                    <div style={S.heroContainer}>
                        <div style={S.heroContent}>
                            {isOwned && <div style={S.ownedBadge}>✅ مسجل في هذه الدورة</div>}
                            {!isOwned && course.isFree && <div style={S.freeBadge}>مجاناً</div>}
                            <h1 style={S.heroTitle}>{course.title}</h1>
                            <p style={S.heroDesc}>{course.description}</p>
                            <div style={S.heroInfo}>
                                <span style={S.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" /><path d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H5.5a.5.5 0 010-1H7.5V4a.5.5 0 01.5-.5z" /></svg>
                                    تاريخ البدء: {course.startDate}
                                </span>
                                <span style={S.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z" /></svg>
                                    {course.place}
                                </span>
                                <span style={S.infoItem}>
                                    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ marginLeft: '8px' }}><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 018 1z" /></svg>
                                    {course.language}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={S.mainContainer} className="main-container">
                    <div style={S.contentWrapper} className="content-wrapper">
                        <div style={S.leftContent}>
                            {course.topics.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>محتويات البرنامج</h2>
                                    <div style={S.topicsGrid}>
                                        {course.topics.map((t, i) => (
                                            <div key={i} style={S.topicCard} className="topicCard">
                                                <div style={S.topicIcon}><svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M9.293 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4.707A1 1 0 0013.707 4L10 .293A1 1 0 009.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 01-1-1zM4.5 9a.5.5 0 010-1h7a.5.5 0 010 1h-7zM4 10.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 010-1h4a.5.5 0 010 1h-4z" /></svg></div>
                                                <p style={S.topicText}>{t}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {course.objectives.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>فائدة حضور البرنامج</h2>
                                    <div style={S.objGrid}>
                                        {course.objectives.map((o, i) => (
                                            <div key={i} style={S.objItem}>
                                                <svg style={S.checkIcon} width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" /></svg>
                                                <span>{o}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {course.prerequisites.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>لمن يعقد البرنامج</h2>
                                    <ul style={S.prereqList}>{course.prerequisites.map((p, i) => <li key={i}>{p}</li>)}</ul>
                                </div>
                            )}
                            {course.implementationMethods.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>طريقة تنفيذ البرنامج</h2>
                                    <div style={S.methodsGrid}>
                                        {course.implementationMethods.map((m, i) => (
                                            <div key={i} style={S.methodItem}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                <span>{m}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {course.programDates.length > 0 && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>تاريخ انعقاد البرنامج</h2>
                                    <div style={S.dateGrid}>
                                        {course.programDates.map((d, i) => (
                                            <div key={i} style={S.dateItem}>
                                                <span style={S.dateLabel}>الدورة {i + 1}:</span>
                                                <span style={S.dateValue}>{d}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── PLAN FILES SECTION ────────────────────────────────────── */}
                            {showFilesSection && (
                                <div style={S.section}>
                                    <h2 style={S.sectionHeading}>الملفات المرفقة</h2>

                                    {!isOwned && (
                                        <div style={S.lockedBanner}>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                            <span style={S.lockedBannerText}>هذه الملفات متاحة فقط بعد شراء الدورة.</span>
                                        </div>
                                    )}

                                    {planFilesLoading ? (
                                        <div style={S.filesLoadingWrap}>
                                            <svg style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span>جاري تحميل الملفات...</span>
                                        </div>
                                    ) : (
                                        <div style={S.filesList}>
                                            {planFiles.map((file, i) => isOwned ? (
                                                file.url ? (
                                                    <a
                                                        key={file.id ?? i}
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={S.fileLink}
                                                        className="fileItemLink"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 16 16" fill="#0865a8">
                                                            <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5zm-3 0A1.5 1.5 0 009.5 3V1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4.5h-2z" />
                                                        </svg>
                                                        <span style={{ flex: 1 }}>{file.title}</span>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0865a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                                        </svg>
                                                    </a>
                                                ) : (
                                                    <div key={file.id ?? i} style={{ ...S.fileLink, opacity: 0.6, cursor: 'default' }}>
                                                        <svg width="20" height="20" viewBox="0 0 16 16" fill="#0865a8">
                                                            <path d="M14 4.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V2a2 2 0 012-2h5.5L14 4.5zm-3 0A1.5 1.5 0 009.5 3V1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V4.5h-2z" />
                                                        </svg>
                                                        <span style={{ flex: 1 }}>{file.title}</span>
                                                    </div>
                                                )
                                            ) : (
                                                <div key={file.id ?? i} style={S.fileLocked}>
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                                    </svg>
                                                    <span style={{ flex: 1 }}>{file.title}</span>
                                                    <span>🔒</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
                        <div style={S.rightSidebar} className="right-sidebar">
                            <div style={S.priceCard}>
                                <div style={S.pricePreview}>
                                    <img src={course.image} alt={course.title} style={S.previewImg} />

                                    {isOwned && (
                                        certLoading ? (
                                            <div style={{ ...S.certPreviewRibbon, background: 'rgba(100,100,120,0.85)', animation: 'none', cursor: 'default' }}>
                                                <svg style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                <span>جاري التحقق من الشهادة...</span>
                                            </div>
                                        ) : hasCert ? (
                                            <div style={S.certPreviewRibbon} onClick={() => setShowCertModal(true)} title="اضغط لمعاينة شهادتك">
                                                <span>📜</span>
                                                <span>شهادتك جاهزة — اضغط للمعاينة</span>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div style={{ ...S.certPreviewRibbon, background: 'linear-gradient(135deg,#9e9e9e 0%,#bdbdbd 100%)', cursor: 'not-allowed', boxShadow: 'none', opacity: 0.75, justifyContent: 'center' }}>
                                                <span>🕐</span>
                                                <span>الشهادة لم تُضف بعد</span>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div style={S.priceContent}>
                                    {!isOwned && !course.isFree && (
                                        <div style={{ display: 'flex', gap: 6, padding: '6px', background: '#f0f1f2', borderRadius: '10px', marginBottom: '16px' }}>
                                            <button style={mode === 'onsite' ? modeTabActive : modeTabInactive} onClick={() => setMode('onsite')}>🏢 حضوري</button>
                                            <button style={mode === 'online' ? modeTabActive : modeTabInactive} onClick={() => setMode('online')}>🌐 أونلاين</button>
                                        </div>
                                    )}

                                    <div style={S.priceSec}>
                                        {isOwned ? (
                                            <><span style={S.ownedLabel}>✅ مسجل</span><span style={S.priceSub}>لديك هذه الدورة بالفعل</span></>
                                        ) : course.isFree ? (
                                            <><span style={S.freeLabel}>مجاناً</span><span style={S.priceSub}>دورة مجانية بالكامل</span></>
                                        ) : mode === 'online' ? (
                                            <>
                                                {onlinePriceFree ? <span style={S.freeLabel}>مجاناً</span> : (
                                                    <>
                                                        <span style={S.paidPrice}>{Number(activePrice).toLocaleString('ar-EG')} {course.currency}</span>
                                                        {course.onlineOriginalPrice > activePrice && <span style={S.strikePrice}>{Number(course.onlineOriginalPrice).toLocaleString('ar-EG')} {course.currency}</span>}
                                                        {!course.onlineOriginalPrice && course.originalPrice > activePrice && <span style={S.strikePrice}>{Number(course.originalPrice).toLocaleString('ar-EG')} {course.currency}</span>}
                                                        {course.onlineDiscountPercent > 0 && <span style={S.discountBadge}>🏷️ خصم {course.onlineDiscountPercent}%</span>}
                                                    </>
                                                )}
                                                <span style={S.modeBadgeOnline}>🌐 سعر التدريب الإلكتروني</span>
                                            </>
                                        ) : (
                                            <>
                                                <span style={S.paidPrice}>{Number(course.price ?? 0).toLocaleString('ar-EG')} {course.currency}</span>
                                                {course.originalPrice > course.price && <span style={S.strikePrice}>{Number(course.originalPrice).toLocaleString('ar-EG')} {course.currency}</span>}
                                                {course.discountPercent > 0 && <span style={S.discountBadge}>🏷️ خصم {course.discountPercent}%</span>}
                                                <span style={S.modeBadgeOnsite}>🏢 سعر التدريب الحضوري</span>
                                            </>
                                        )}
                                    </div>

                                    <div style={S.actionBtns}>
                                        {isOwned ? (
                                            <>
                                                {certLoading ? (
                                                    <div style={{ ...S.btnCertPreview, opacity: 0.6, cursor: 'default', justifyContent: 'center' }}>
                                                        <svg style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        <span>جاري التحقق من الشهادة...</span>
                                                    </div>
                                                ) : hasCert ? (
                                                    <button className="btnCertPreview" style={S.btnCertPreview} onClick={() => setShowCertModal(true)}>
                                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                        </svg>
                                                        <span>📜 معاينة الشهادة وتحميلها</span>
                                                    </button>
                                                ) : (
                                                    <div style={{ ...S.btnCertPreview, background: 'linear-gradient(135deg,#9e9e9e 0%,#bdbdbd 100%)', cursor: 'not-allowed', boxShadow: 'none', opacity: 0.75, justifyContent: 'center' }}>
                                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                        <span>الشهادة لم تُضف بعد</span>
                                                    </div>
                                                )}

                                                <button className="btnViewMyCourses" style={S.btnViewMyCourses} onClick={() => navigate('/my-courses')}>عرض في دوراتي</button>

                                                {onlineLoading ? (
                                                    <div style={{ padding: '12px 0', textAlign: 'center', fontSize: '13px', color: '#7c3aed', fontFamily }}>
                                                        <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite', verticalAlign: 'middle', marginLeft: 6 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                        جاري تحميل رابط الاجتماع...
                                                    </div>
                                                ) : onlineSetting?.visible && onlineSetting?.link ? (
                                                    <a href={onlineSetting.link} target="_blank" rel="noopener noreferrer"
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '13px 20px', boxSizing: 'border-box', background: 'linear-gradient(135deg,#5b21b6,#7c3aed)', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', fontFamily, boxShadow: '0 4px 14px rgba(124,58,237,0.35)', transition: 'all .25s ease' }}
                                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.5)'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.35)'; }}>
                                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                                            <path d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6v6l-4-4" />
                                                    </svg>
                                                    🌐 انضم إلى الاجتماع الإلكتروني
                                                </a>
                                            ) : onlineSetting && !onlineSetting.visible ? (
                                                <div style={{ padding: '12px 14px', borderRadius: '10px', background: '#f8f9fa', border: '1.5px solid #e2e8f0', fontSize: '13px', color: '#6b7280', fontFamily, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                                    🕐 رابط الاجتماع سيُتاح قريبًا
                                                </div>
                                            ) : null}

                                            {!course.isFree && (
                                                <button className="btnRefund" style={S.btnRefund} onClick={openRefund}>💸 طلب استرداد المبلغ</button>
                                            )}
                                        </>
                                        ) : course.isFree ? (
                                            <>
                                                {enrollMsg && (
                                                    <div style={{ ...S.enrollMsgBox, backgroundColor: enrollMsg.type === 'success' ? '#e8f5e9' : enrollMsg.type === 'info' ? '#e3f2fd' : '#ffebee', border: `1px solid ${enrollMsg.type === 'success' ? '#4caf50' : enrollMsg.type === 'info' ? '#2196f3' : '#f44336'}`, color: enrollMsg.type === 'success' ? '#2e7d32' : enrollMsg.type === 'info' ? '#1565c0' : '#c62828' }}>
                                                        {enrollMsg.text}
                                                    </div>
                                                )}
                                                <button className="btnEnroll" style={{ ...S.btnEnroll, opacity: enrolling ? 0.7 : 1, cursor: enrolling ? 'not-allowed' : 'pointer' }} onClick={handleEnroll} disabled={enrolling}>
                                                    {enrolling ? '⏳ جاري التسجيل...' : '🎁 اشترك الآن — مجاناً'}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btnAddCart" style={S.btnAddCart} onClick={() => addToCart(false, mode)}>إضافة إلى السلة</button>
                                                <button className="btnBuyNow" style={S.btnBuyNow} onClick={() => addToCart(true, mode)}>اشترِ الآن</button>
                                            </>
                                        )}
                                    </div>

                                    <div style={S.includesSec}>
                                        <h3 style={S.includesTitle}>هذه الدورة تتضمن:</h3>
                                        <ul style={S.includesList}>
                                            <li style={S.includesItem}><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H2z" /></svg> {course.videoDuration} ساعة محتوى تدريبي</li>
                                            <li style={S.includesItem}><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12z" /></svg> {planFiles.length || course.articlesCount} ملف تدريبي</li>
                                            <li style={S.includesItem}><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 1a7 7 0 110 14A7 7 0 008 1z" /></svg> وصول كامل للمحتوى</li>
                                            {course.hasCertificate && <li style={S.includesItem}><svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor"><path d="M14 1a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1h12z" /></svg> شهادة إتمام</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {otherCourses.length > 0 && (
                                <div style={S.otherCard}>
                                    <h3 style={S.otherTitle}>دورات أخرى قد تهمك</h3>
                                    <div style={S.otherList}>
                                        {otherCourses.map(o => (
                                            <Link key={o.id} to={`/course/${o.slug}`} style={S.otherCourseCard} className="otherCourseCard">
                                                <img src={o.image} alt={o.title} style={S.otherCourseImg} />
                                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <h4 style={S.otherCourseName}>{o.title}</h4>
                                                    <span style={{ ...S.otherCoursePrice, color: o.isFree ? '#1a7a3c' : '#f57c00' }}>
                                                        {o.isFree ? 'مجاناً' : `${o.price.toLocaleString('ar-EG')} ${o.currency}`}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CERTIFICATE PREVIEW MODAL ──────────────────────────────────── */}
            {showCertModal && hasCert && (
                <CertificateModal cert={cert} courseTitle={course.title} onClose={() => setShowCertModal(false)} />
            )}

            {/* ── REFUND MODAL ───────────────────────────────────────────────── */}
            {showRefund && (
                <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) closeRefund(); }}>
                    <div style={S.modalCard} dir="rtl">
                        <div style={S.modalHeader}>
                            <div style={S.modalHeaderIcon}>💸</div>
                            <div style={{ flex: 1 }}>
                                <h2 style={S.modalTitle}>طلب استرداد المبلغ</h2>
                                <p style={S.modalSubtitle}>{course.title}</p>
                            </div>
                            <button style={S.modalClose} onClick={closeRefund}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div style={S.modalBody}>
                            {loadingRefundCheck ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '160px' }}>
                                    <svg style={{ width: '40px', height: '40px', color: '#0865a8', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                            ) : existingRefund && !refundSuccess ? (
                                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                    <div style={{ fontSize: '52px', marginBottom: '16px' }}>{statusInfo?.icon}</div>
                                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', marginBottom: '12px', fontFamily }}>لديك طلب استرداد مسبق</h3>
                                    <div style={{ ...S.statusBadge, backgroundColor: statusInfo?.bg, color: statusInfo?.color, margin: '0 auto 16px', display: 'inline-flex' }}>{statusInfo?.label}</div>
                                    {existingRefund.status === 'Rejected' && existingRefund.rejectionReason && (
                                        <div style={{ ...S.warningBox, textAlign: 'right', marginTop: '12px' }}>
                                            <div><strong style={{ display: 'block', marginBottom: '4px' }}>سبب الرفض:</strong>{existingRefund.rejectionReason}</div>
                                        </div>
                                    )}
                                    {existingRefund.status === 'Pending' && <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', fontFamily, marginBottom: '20px' }}>طلبك قيد المراجعة. سنتواصل معك خلال 3-5 أيام عمل.</p>}
                                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '8px', textAlign: 'right' }}>
                                        <div style={{ fontSize: '13px', color: '#888', fontFamily }}>رقم الطلب: <strong style={{ color: '#0865a8' }}>{existingRefund.refNumber || `#${existingRefund.id}`}</strong></div>
                                        {existingRefund.requestedAt && <div style={{ fontSize: '13px', color: '#888', fontFamily, marginTop: '4px' }}>تاريخ الطلب: {new Date(existingRefund.requestedAt).toLocaleDateString('ar-EG')}</div>}
                                    </div>
                                    <button style={{ ...S.btnCancel, width: '100%', marginTop: '20px' }} onClick={closeRefund}>إغلاق</button>
                                </div>
                            ) : refundSuccess ? (
                                <div style={S.successState}>
                                    <div style={S.successIcon}>✅</div>
                                    <h3 style={S.successTitle}>تم إرسال طلبك بنجاح!</h3>
                                    <p style={S.successText}>سيقوم فريق الدعم بمراجعة طلبك والرد عليك خلال 3-5 أيام عمل.</p>
                                    <button style={S.btnDone} onClick={closeRefund}>حسناً، شكراً</button>
                                </div>
                            ) : (
                                <>
                                    {renderPolicyBox(refundPolicy)}
                                    <div style={S.infoBox}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0865a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p style={S.infoBoxText}>سيتم مراجعة طلبك من قِبل الإدارة خلال 3-5 أيام عمل.</p>
                                    </div>
                                    <label style={S.formLabel}>سبب طلب الاسترداد <span style={{ color: '#e53935' }}>*</span></label>
                                    <textarea style={S.textarea} rows={4} maxLength={500} placeholder="يرجى توضيح سبب رغبتك في استرداد المبلغ..." value={refundReason} onChange={e => { setRefundReason(e.target.value); setRefundError(null); }} />
                                    <div style={S.charCount}>{refundReason.length} / 500</div>
                                    <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '16px', marginBottom: '4px' }}>
                                        <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px', fontFamily }}>بيانات بنكية (اختياري)</p>
                                        <label style={S.formLabel}>اسم البنك</label>
                                        <input style={S.formInput} type="text" placeholder="مثال: بنك مصر" value={bankName} onChange={e => setBankName(e.target.value)} maxLength={100} />
                                        <label style={S.formLabel}>رقم الـ IBAN أو الحساب</label>
                                        <input style={S.formInput} type="text" placeholder="EG00 0000 0000 0000 0000 0000 0000" value={iban} onChange={e => setIban(e.target.value)} maxLength={34} dir="ltr" />
                                    </div>
                                    {refundError && (
                                        <div style={S.errorBox}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span>{refundError}</span>
                                        </div>
                                    )}
                                    <div style={S.modalActions}>
                                        <button style={S.btnCancel} onClick={closeRefund}>إلغاء</button>
                                        <button style={{ ...S.btnSubmit, ...((refundSending || isRefundBlocked) ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }} onClick={submitRefund} disabled={refundSending || isRefundBlocked}>
                                            {refundSending
                                                ? <><svg style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>جاري الإرسال...</>
                                                : 'إرسال الطلب'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseDetails;