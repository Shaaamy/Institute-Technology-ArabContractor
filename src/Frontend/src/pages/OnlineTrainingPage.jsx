import React, { useEffect, useState } from 'react';

const FaProjectDiagram = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 512 512" fill={color}><path d="M512 256c0 35.3-28.7 64-64 64s-64-28.7-64-64c0-23.7 12.9-44.4 32-55.4V224H272v176h48c0-35.3 28.7-64 64-64s64 28.7 64 64-28.7 64-64 64-64-28.7-64-64h-48v16c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32v-16H16c-8.8 0-16-7.2-16-16v-96c0-8.8 7.2-16 16-16h48v-16c0-17.7 14.3-32 32-32h32V144c-19.1-11-32-31.7-32-55.4C96 53 124.7 24.3 160 24.3s64 28.7 64 64c0 23.7-12.9 44.4-32 55.4v16h32c17.7 0 32 14.3 32 32v16h144v-23.4c-19.1-11-32-31.7-32-55.4C368 53 396.7 24.3 432 24.3s64 28.7 64 64c0 23.7-12.9 44.4-32 55.4V224c19.1 11 32 31.7 32 55.4zM192 88.3c0-17.7-14.3-32-32-32s-32 14.3-32 32 14.3 32 32 32 32-14.3 32-32zM432 88.3c0-17.7-14.3-32-32-32s-32 14.3-32 32 14.3 32 32 32 32-14.3 32-32zM432 320c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z" /></svg>;
const FaUserTie = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 448 512" fill={color}><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136 32-56h-96l32 56-32 136-47.8-191.4C56.9 304 0 362 0 432v16c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-16c0-70-56.9-128-128.2-143.4z" /></svg>;
const FaFileContract = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 384 512" fill={color}><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm64 236c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-64c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v8zm0-72v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm96-114.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" /></svg>;
const FaLightbulb = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 352 512" fill={color}><path d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z" /></svg>;
const FaShieldAlt = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 512 512" fill={color}><path d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3z" /></svg>;
const FaVideo = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 576 512" fill={color}><path d="M336.2 64H47.8C21.4 64 0 85.4 0 111.8v288.4C0 426.6 21.4 448 47.8 448h288.4c26.4 0 47.8-21.4 47.8-47.8V111.8c0-26.4-21.4-47.8-47.8-47.8zm189.4 37.7L416 177.3v157.4l109.6 75.5c21.2 14.6 50.4-.3 50.4-25.8V127.5c0-25.4-29.1-40.4-50.4-25.8z" /></svg>;
const FaComments = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 576 512" fill={color}><path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C82.7 416.9 165.1 448 256 448c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z" /></svg>;
const FaMapMarkerAlt = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 384 512" fill={color}><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" /></svg>;
const FaBook = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 448 512" fill={color}><path d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zm-104 96H96c-26.5 0-48-21.5-48-48s21.5-48 48-48h248v96z" /></svg>;
const FaHeadset = ({ size = 20, color = 'white' }) => <svg width={size} height={size} viewBox="0 0 512 512" fill={color}><path d="M192 208c0-17.7-14.3-32-32-32h-16C64.5 176 0 240.5 0 320v16c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-80c0-8.8 7.2-16 16-16h32c17.7 0 32-14.3 32-32v-32zm320 112v-16c0-79.5-64.5-144-144-144h-16c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h32c8.8 0 16 7.2 16 16v80c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32zM256 0C113.2 0 4.1 100.1 0 224h32c4-106 94.5-192 224-192s220 86 224 192h32C507.9 100.1 398.8 0 256 0z" /></svg>;
const FaCheckCircle = ({ size = 22, color = '#0865a8' }) => <svg width={size} height={size} viewBox="0 0 512 512" fill={color}><path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" /></svg>;

const TeamsIcon = ({ size = 42 }) => (
    <svg width={size} height={size} viewBox="0 0 2228.833 2073.333" xmlns="http://www.w3.org/2000/svg">
        <path d="M1554.637,777.5h575.713c54.391,0,98.483,44.092,98.483,98.483v524.398c0,199.901-162.001,361.902-361.902,361.902h-1.78c-199.901,0.001-361.902-162-361.902-361.901V828.971C1504.249,800.544,1526.211,777.5,1554.637,777.5z" fill="#5059C9" />
        <circle cx="1943.75" cy="440.583" r="233.25" fill="#5059C9" />
        <circle cx="1218.083" cy="336.917" r="309.083" fill="#7B83EB" />
        <path d="M1667.323,777.5H717.01c-53.743,1.33-96.257,45.931-94.927,99.675v598.105c-7.825,322.069,247.353,590.279,569.422,598.104c322.069-7.825,577.247-276.035,569.422-598.104V877.174C1762.257,823.431,1720.906,777.5,1667.323,777.5z" fill="#7B83EB" />
        <linearGradient id="teams_grad" x1="198.099" y1="1683.0726" x2="942.2344" y2="394.2607" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5a62c3" /><stop offset="0.5" stopColor="#4d55bd" /><stop offset="1" stopColor="#3940ab" />
        </linearGradient>
        <path fill="url(#teams_grad)" d="M95.01,468.5h950.323c52.473,0,95.01,42.538,95.01,95.01v950.323c0,52.473-42.538,95.01-95.01,95.01H95.01C42.538,1608.843,0,1566.305,0,1513.833V563.51C0,511.038,42.538,468.5,95.01,468.5z" />
        <path d="M820.211,828.193H630.241v517.297H509.211V828.193H320.123V727.844H820.211V828.193z" fill="#ffffff" />
    </svg>
);

/* ── Banner Image component with error fallback ── */
function BannerImage({ src, alt, style = {} }) {
    const [err, setErr] = useState(false);
    if (err) return null;
    return (
        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(8,101,168,0.15)', marginBottom: 28, ...style }}>
            <img src={src} alt={alt} onError={() => setErr(true)}
                style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
    );
}

const css = `
.ot-page-root {
    min-height: 100vh; background: #fff; margin: 0; padding: 0;
    font-family: "Noto Kufi Arabic", serif;
}
.ot-hero {
    position: relative;
    padding: clamp(80px,10vw,120px) clamp(20px,5vw,80px) clamp(60px,8vw,100px);
    background: linear-gradient(135deg, #0a3d6b 0%, #0865a8 60%, #1a7abf 100%);
    color: #fff; overflow: hidden; margin-top: 36px; text-align: right;
}
.ot-hero::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
}
.ot-hero-accent-bar { position: absolute; top: 0; right: 0; width: 6px; height: 100%; background: #f57c00; }
.ot-hero-content { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }
.ot-hero-eyebrow { display: inline-block; font-size: clamp(12px,1.4vw,15px); font-weight: 700; color: #f9c56a; margin-bottom: 14px; padding: 4px 14px; border: 1px solid rgba(249,197,106,0.4); border-radius: 20px; }
.ot-hero-title { font-size: clamp(28px,5vw,52px); font-weight: 900; line-height: 1.25; margin: 0 0 20px; color: #fff; }
.ot-hero-title em { font-style: normal; color: #f9c56a; }
.ot-hero-body { font-size: clamp(14px,1.6vw,17px); line-height: 2; color: rgba(255,255,255,0.88); margin: 0; max-width: 680px; }
.ot-section-white { background: #fff; padding: clamp(40px,6vw,80px) 0; text-align: right; }
.ot-section-gray  { background: #f8fafc; padding: clamp(40px,6vw,80px) 0; text-align: right; }
.ot-section-inner { max-width: 1200px; margin: 0 auto; padding: 0 clamp(20px,4vw,60px); }
.ot-section-heading { font-size: clamp(20px,2.5vw,28px); font-weight: 900; color: #1e293b; margin: 0 0 10px; }
.ot-section-heading span { color: #0865a8; }
.ot-heading-bar { width: 60px; height: 4px; background: #f57c00; border-radius: 2px; margin: 0 0 36px auto; }
.ot-body-p { font-size: clamp(14px,1.4vw,16px); line-height: 2.1; color: #374151; margin: 0 0 16px; }
.ot-bullet-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.ot-bullet-list li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(14px,1.4vw,15px); line-height: 1.8; color: #374151; }
.ot-bullet-dot { flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; background: #f57c00; margin-top: 8px; }
.ot-why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; }
.ot-why-card { background: #fff; border-radius: 14px; padding: 22px 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s; text-align: right; }
.ot-why-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(8,101,168,0.12); }
.ot-why-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #0865a8, #1a7abf); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; margin-right: auto; margin-left: 0; }
.ot-why-label { font-size: 14px; font-weight: 900; color: #1e293b; margin: 0; line-height: 1.5; }
.ot-integrated-box { background: linear-gradient(135deg, #0a3d6b 0%, #0865a8 100%); border-radius: 20px; padding: clamp(28px,4vw,48px); color: #fff; }
.ot-integrated-title { font-size: clamp(18px,2vw,22px); font-weight: 900; color: #f9c56a; margin: 0 0 14px; }
.ot-integrated-p { font-size: clamp(14px,1.4vw,15px); line-height: 2; color: rgba(255,255,255,0.88); margin: 0 0 16px; }
.ot-integrated-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.ot-integrated-bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: clamp(13px,1.3vw,15px); line-height: 1.8; color: rgba(255,255,255,0.88); }
.ot-int-dot { flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; background: #f9c56a; margin-top: 8px; }
.ot-goals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
.ot-goal-card { background: #fff; border-radius: 14px; padding: 22px; border-right: 4px solid #0865a8; box-shadow: 0 4px 14px rgba(0,0,0,0.06); display: flex; align-items: flex-start; gap: 14px; }
.ot-goal-check { flex-shrink: 0; color: #0865a8; margin-top: 2px; }
.ot-goal-text { font-size: 15px; line-height: 1.8; color: #374151; margin: 0; }
.ot-platform-box { background: #fff; border-radius: 20px; padding: clamp(24px,3vw,40px); box-shadow: 0 8px 32px rgba(0,0,0,0.08); display: grid; grid-template-columns: auto 1fr; gap: 30px; align-items: start; }
@media (max-width: 600px) { .ot-platform-box { grid-template-columns: 1fr; } }
.ot-platform-logo { width: 90px; height: 90px; border-radius: 20px; background: linear-gradient(135deg, #0865a8, #1a7abf); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(8,101,168,0.3); flex-shrink: 0; }
.ot-platform-name { font-size: clamp(18px,2vw,22px); font-weight: 900; color: #0865a8; margin: 0 0 16px; }
.ot-platform-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.ot-platform-bullets li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #374151; line-height: 1.7; }
.ot-platform-bullets li::before { content: ''; flex-shrink: 0; width: 8px; height: 8px; border-radius: 50%; background: #f57c00; margin-top: 7px; }
.ot-infographic-wrapper { border-radius: 16px; overflow: hidden; box-shadow: 0 16px 48px rgba(0,0,0,0.14); }
.ot-infographic-wrapper img { width: 100%; height: auto; display: block; }
.ot-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.ot-feature-card { background: #fff; border-radius: 14px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.05); display: flex; align-items: flex-start; gap: 12px; text-align: right; transition: transform 0.2s; }
.ot-feature-card:hover { transform: translateY(-3px); }
.ot-feature-icon { flex-shrink: 0; width: 42px; height: 42px; border-radius: 10px; background: linear-gradient(135deg, #0865a8, #1a7abf); display: flex; align-items: center; justify-content: center; }
.ot-feature-label { font-size: 14px; font-weight: 900; color: #1e293b; line-height: 1.6; margin: 0; }
.ot-programs-list { display: flex; flex-direction: column; }
.ot-program-card { display: flex; gap: clamp(16px,2vw,24px); align-items: flex-start; padding: clamp(20px,2.5vw,28px) 0; border-bottom: 1px solid #e2e8f0; }
.ot-program-card:last-child { border-bottom: none; }
.ot-icon { flex-shrink: 0; width: clamp(48px,5vw,58px); height: clamp(48px,5vw,58px); border-radius: 50%; background: linear-gradient(135deg, #0865a8, #1a7abf); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(8,101,168,0.25); margin-top: 4px; }
.ot-program-content { flex: 1; }
.ot-program-title { font-size: clamp(15px,1.6vw,18px); font-weight: 900; margin: 0 0 10px; line-height: 1.5; }
.ot-program-title a { color: #0865a8; text-decoration: none; transition: color 0.2s; }
.ot-program-title a:hover { color: #f57c00; }
.ot-program-desc { font-size: clamp(13px,1.3vw,15px); line-height: 2; color: #374151; margin: 0; }
.ot-cta-banner { background: linear-gradient(135deg, #0a3d6b, #0865a8); border-radius: 16px; padding: 32px; text-align: center; margin-top: 40px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; }
.ot-cta-icon { color: #f9c56a; flex-shrink: 0; }
.ot-cta-text { font-size: clamp(14px,1.5vw,17px); font-weight: 700; color: #fff; margin: 0; }
`;

export default function OnlineTrainingPage() {
    const whyItems = [
        { icon: <FaVideo size={20} color="white" />, label: 'تقديم التدريب بشكل مباشر (Live) عبر Microsoft Teams' },
        { icon: <FaComments size={20} color="white" />, label: 'بيئة تعليمية تفاعلية' },
        { icon: <FaMapMarkerAlt size={20} color="white" />, label: 'إمكانية الحضور من أي مكان داخل أو خارج مصر' },
        { icon: <FaBook size={20} color="white" />, label: 'محتوى تدريبي محدث وفق احتياجات سوق العمل' },
        { icon: <FaHeadset size={20} color="white" />, label: 'دعم فني وتواصل مستمر مع المتدربين' },
    ];
    const integratedBullets = [
        'إرسال روابط الحضور والتعليمات بشكل واضح ومنظم',
        'متابعة مستمرة لضمان الالتزام والاستفادة',
        'توفير تسجيلات أو مواد مساعدة (عند الحاجة)',
        'تقييم الأداء لضمان تحقيق أهداف التدريب',
    ];
    const goals = [
        'تأهيل كوادر قادرة على مواكبة التطور التكنولوجي',
        'دعم الطلاب والخريجين بمهارات عملية حقيقية',
        'ربط التدريب بمتطلبات سوق العمل محليًا ودوليًا',
    ];
    const mechanismBullets = [
        'عقد اجتماعات مباشرة بالصوت والصورة',
        'مشاركة المحتوى والعروض التقديمية',
        'التفاعل من خلال الدردشة والأسئلة المباشرة',
        'تسجيل المحاضرات للرجوع إليها لاحقًا',
    ];
    const platformFeatures = [
        'الفصول الافتراضية المباشرة',
        'مشاركة الملفات والمواد التدريبية',
        'تنظيم الجداول التدريبية وإرسال الدعوات',
        'إدارة التفاعل بين المدرب والمتدربين بكفاءة',
    ];
    const features = [
        { icon: <FaVideo size={18} color="white" />, label: 'تدريب مباشر (Live) وليس مسجل' },
        { icon: <FaComments size={18} color="white" />, label: 'تفاعل فوري مع المدربين' },
        { icon: <FaMapMarkerAlt size={18} color="white" />, label: 'مرونة في الحضور من أي مكان' },
        { icon: <FaBook size={18} color="white" />, label: 'محتوى تدريبي محدث وفق متطلبات سوق العمل' },
        { icon: <FaHeadset size={18} color="white" />, label: 'دعم فني مستمر طوال فترة التدريب' },
    ];
    const programs = [
        { icon: <FaProjectDiagram size={28} color="white" />, title: 'برنامج Project Management Professional (PMP)', description: 'وهو برنامج إدارة المشاريع الإحترافية (PMP) الذي اصبح الآن متوفر أون لاين تحت اشراف طقم ادارى متخصص (تدريب عن بعد) مما يتيح تنفيذ العملية اون لاين، بحيث تتمكن من الإستفسار عن أي نقطة أو تساؤل أثناء مشاهدة المادة وحضور البرنامج وايضا الاستفادة بالحصول على مقاطع فيديو متعددة تشرح مادة إدارة المشاريع الإحترافية (PMP) مبنيةً على آخر إصدار من كتاب و منهجية إدارة المشاريع الإحترافية PMBOK وايضا امثلة من الاختبارات للمساعدة في تأكيد المعلومات الواردة في كل وحدة وفور اكتمال حضور المتدرب ثلاثة اسابيع بواقع 45 ساعة تدريبية واجتيازه تقييم كل اسبوع من الاسابيع الثلاثة بنجاح يحصل على شهادة من المعهد كجهة معتمدة من معهد ادارة المشروعات الامريكى PMI.' },
        { icon: <FaUserTie size={28} color="white" />, title: 'القيادة التنفيذية', description: 'وهى ندوة اليوم الواحد حيث تم تنظيمها باستخدام تكنولوجيا الاتصالات عن بعد حيث يتم حضور المتدربين الندوة عن بعد والاستفادة من المادة العلمية التى يلقيها المحاضر وتشمل (الانماط المختلفة للقيادة - اساليب القيادة الفعالة)' },
        { icon: <FaFileContract size={28} color="white" />, title: 'عقود الفيديك', description: 'وهى ندوة تعقد لمدة يومين للمهتمين بتفاصيل العقود الخاصة بالمشروعات أو مدير مشروع أو مسئول التعاقدات حيث تحتوى الندوة على فكرة عامة عن عقود الفيديك وشروطه والبنود المتعلقة بالوقت به والبنود المتعلقة بالتغيرات والمطالبات والبنود المتعلقة بدفع المستحقات وايضا تسوية النزاعات فى عقود الفيديك ويتم تنفيذها ايضا عن بعد' },
        { icon: <FaLightbulb size={28} color="white" />, title: 'اساليب تحليل المشكلات واتخاذ القرارات', description: 'وهى ندوة لمدة يومين تتيح للمتدرب حل المشكلات واتخاذ القرارات والتى تنظم طريقة تفكير المتدرب عند مواجهة المشكلات فى جميع نواحي الحياة العملية ومن خلالها يستطيع المتدرب التعرف على الطرق العلمية المنظمة لحل المشكلات واتخاذ القرارات بداية من الاسلوب الادارى فى تحليل وحل المشكلات ثم معرفة انماط المديرين فى حل المشكلات الى ان يتم الإتفاق على افضل القرارات لتطبيقها ووضع ورقة عمل لتنفيذها ومتابعتها وتقييم فاعليته ويتم تنفيذها ايضا عن بعد' },
        { icon: <FaShieldAlt size={28} color="white" />, title: 'برنامجى السلامة والجودة للمهندسين المرشحين للترقى', description: 'وفى اطار حرص الشركة لتزويد العاملين بها بالمعرفة الكاملة بأسس السلامة والصحة المهنية ومتطلبات الجودة بالشركة فقد حرصت على ضرورة حضور المهندسين المرشحين للترقى لبرنامجى السلامة والجودة مما يتيح للمهندسين الحاضرين لتلك البرامج التعامل مع متطلبات السلامة من حيث (مهمات الحماية الشخصية – دليل و خطة السلامة والصحة المهنية للمشروعات - خطة الاستجابة للطوارئ والحريق - تصاريح الاعمال الخطرة - تحليل مؤشرات الحوادث والاصابات والامراض المهنية - تقييم المخاطر - ترتيب ونظافة مواقع العمل) وايضا لتحقيق اعلى جودة من حيث (التعريفات الهامة والتطور التاريخى للجودة - المواصفات الدولية الأيزو) ويتم تنفيذها ايضا عن بعد' },
    ];

    useEffect(() => {
        document.title = 'التدريب عن بعد ( اونلاين ) - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <>
            <style>{css}</style>
            <div className="ot-page-root" dir="rtl">

                {/* ── BREADCRUMB ── */}
                <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                    <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                        <a href="/" style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}>الصفحة الرئيسية</a>
                        <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                        <span style={{ color: '#374151' }}>تدريب عن بعد ( اونلاين )</span>
                    </div>
                </div>

                {/* ── HERO ── */}
                <section className="ot-hero">
                    <div className="ot-hero-accent-bar" />
                    <div className="ot-hero-content">
                        <span className="ot-hero-eyebrow">تعلم بلا حدود جغرافية</span>
                        <h1 className="ot-hero-title">التدريب عن بعد<br /><em>( أونلاين )</em></h1>
                        <p className="ot-hero-body">في إطار توجه المعهد التكنولوجي لهندسة التشييد والإدارة نحو التحول الرقمي وتطوير منظومة التدريب، يقدم المعهد برامج تدريبية متكاملة بنظام التدريب عن بعد المباشر (Live Training)، والتي تتيح للمتدربين الحصول على تجربة تعليمية تفاعلية عالية الجودة دون التقيد بالموقع الجغرافي.</p>
                        <p className="ot-hero-body" style={{ marginTop: 14 }}>يعتمد هذا النظام على تقديم محتوى تدريبي احترافي يتم تنفيذه بواسطة نخبة من المدربين المتخصصين، من خلال جلسات مباشرة تُمكّن المتدربين من التفاعل الفوري، طرح الأسئلة، والمشاركة في المناقشات والتطبيقات العملية، بما يضمن تحقيق أقصى استفادة ممكنة.</p>
                    </div>
                </section>

                {/* ── 💡 لماذا التدريب الأونلاين ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">💡 لماذا <span>التدريب الأونلاين بالمعهد؟</span></h2>
                        <div className="ot-heading-bar" />

                        {/* Image 5: تعلم من أي مكان */}
                        <BannerImage
                            src="/images/online/2.jpeg"
                            alt="تعلم من أي مكان" />

                        <p className="ot-body-p">يتميز التدريب الأونلاين لدينا بعدة عناصر تجعله أكثر مرونة وفعالية:</p>
                        <div className="ot-why-grid">
                            {whyItems.map((item, i) => (
                                <div className="ot-why-card" key={i}>
                                    <div className="ot-why-icon">{item.icon}</div>
                                    <p className="ot-why-label">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 🚀 تجربة تدريب متكاملة ── */}
                <section className="ot-section-gray">
                    <div className="ot-section-inner">
                        <div className="ot-integrated-box">
                            <p className="ot-integrated-title">🚀 تجربة تدريب متكاملة</p>
                            <p className="ot-integrated-p">لا يقتصر التدريب الأونلاين على مجرد حضور محاضرات، بل هو منظومة تدريبية متكاملة تبدأ من لحظة التسجيل، مرورًا بالتواصل المستمر عبر البريد الإلكتروني وواتساب، وحتى انتهاء البرنامج والحصول على شهادة معتمدة.</p>
                            <p className="ot-integrated-p">ويحرص المعهد على توفير تجربة سلسة للمتدرب من خلال:</p>
                            <ul className="ot-integrated-bullets">
                                {integratedBullets.map((b, i) => <li key={i}><span className="ot-int-dot" />{b}</li>)}
                            </ul>
                        </div>

                        {/* Image 3: تواصل ودعم مستمر — shown right after the integrated box */}
                        <div style={{ marginTop: 28 }}>
                            <BannerImage
                                src="/images/online/4.jpeg"
                                alt="تواصل ودعم مستمر" />
                        </div>
                    </div>
                </section>

                {/* ── 🎯 هدفنا ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">🎯 <span>هدفنا</span></h2>
                        <div className="ot-heading-bar" />
                        <p className="ot-body-p">نهدف من خلال منظومة التدريب عن بعد إلى:</p>
                        <div className="ot-goals-grid">
                            {goals.map((g, i) => (
                                <div className="ot-goal-card" key={i}>
                                    <FaCheckCircle size={22} color="#0865a8" />
                                    <p className="ot-goal-text">{g}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 💻 آلية تنفيذ التدريب ── */}
                <section className="ot-section-gray">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">💻 <span>آلية تنفيذ التدريب</span></h2>
                        <div className="ot-heading-bar" />

                        {/* Image 6: تدريب مباشر وتفاعلي */}
                        <BannerImage
                            src="/images/online/1.jpeg"
                            alt="تدريب مباشر وتفاعلي" />

                        <p className="ot-body-p">يتم تنفيذ البرامج التدريبية الأونلاين من خلال جلسات مباشرة (Live Sessions) يقودها مدربون متخصصون، حيث يتم التفاعل مع المتدربين بشكل فوري من خلال الشرح، المناقشات، وورش العمل التطبيقية.</p>
                        <p className="ot-body-p">ويعتمد التدريب على منصة Microsoft Teams، والتي تُعد من أبرز منصات التواصل والتعلم الرقمي، حيث تتيح:</p>
                        <ul className="ot-bullet-list" style={{ marginBottom: 16 }}>
                            {mechanismBullets.map((b, i) => <li key={i}><span className="ot-bullet-dot" />{b}</li>)}
                        </ul>
                        <p className="ot-body-p">وتُستخدم هذه المنصة على نطاق واسع لدعم التدريب والتعاون عن بُعد في بيئات العمل الحديثة.</p>
                    </div>
                </section>

                {/* ── ⚙️ البرنامج المستخدم ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">⚙️ البرنامج المستخدم <span>في التدريب</span></h2>
                        <div className="ot-heading-bar" />
                        <p className="ot-body-p">يعتمد المعهد على برنامج Microsoft Teams وذلك لما يوفره من بيئة تعليمية متكاملة تشمل:</p>
                        <div className="ot-platform-box">
                            <div className="ot-platform-logo"><TeamsIcon size={54} /></div>
                            <div>
                                <p className="ot-platform-name">Microsoft Teams</p>
                                <ul className="ot-platform-bullets">
                                    {platformFeatures.map((f, i) => <li key={i}>{f}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 🪜 خطوات الالتحاق (Infographic) ── */}
                <section className="ot-section-gray">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">🪜 خطوات <span>الالتحاق والتدريب</span></h2>
                        <div className="ot-heading-bar" />
                        <p className="ot-body-p">تمر عملية التدريب الأونلاين بعدة مراحل منظمة لضمان تجربة تعليمية سلسة:</p>
                        <div className="ot-infographic-wrapper">
                            <img src="/images/Teams.png" alt="خطوات الالتحاق والتدريب عبر Microsoft Teams" />
                        </div>
                    </div>
                </section>

                {/* ── 📌 مميزات التدريب الأونلاين ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">📌 مميزات <span>التدريب الأونلاين بالمعهد</span></h2>
                        <div className="ot-heading-bar" />

                        {/* Image 6 already used above — here we use 1 (محتوى تدريبي محدث) */}
                        <BannerImage
                            src="/images/online/6.jpeg"
                            alt="محتوى تدريبي محدث" />

                        {/* Image 4: تطبيق عملي ومشاريع تفاعلية */}
                        <BannerImage
                            src="/images/online/3.jpeg"
                            alt="تطبيق عملي ومشاريع تفاعلية" />

                        <div className="ot-features-grid">
                            {features.map((f, i) => (
                                <div className="ot-feature-card" key={i}>
                                    <div className="ot-feature-icon">{f.icon}</div>
                                    <p className="ot-feature-label">{f.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── PROGRAMS ── */}
                <section className="ot-section-gray" id="programs">
                    <div className="ot-section-inner">
                        <h2 className="ot-section-heading">أمثلة فعلية على <span>البرامج التدريبية عن بعد</span></h2>
                        <div className="ot-heading-bar" />
                        <div className="ot-programs-list">
                            {programs.map((program, i) => (
                                <div className="ot-program-card" key={i}>
                                    <div className="ot-icon">{program.icon}</div>
                                    <div className="ot-program-content">
                                        <h3 className="ot-program-title"><a href="#">{program.title}</a></h3>
                                        <p className="ot-program-desc">{program.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="ot-section-white">
                    <div className="ot-section-inner">
                        {/* Image 2: شهادات معتمدة — placed above CTA */}
                        <BannerImage
                            src="/images/online/5.jpeg"
                            alt="شهادات معتمدة" />

                        <div className="ot-cta-banner">
                            <FaShieldAlt size={28} color="#f9c56a" />
                            <p className="ot-cta-text">نلتزم بتقديم تجربة تدريبية احترافية تفاعلية تدعم تطوير مهاراتك وتحقيق أهدافك المهنية</p>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}