import { T, NAVBAR_H, OVERVIEW_H } from './constants';

export const ADMIN_STYLES = `

    .adm-root {
    direction: rtl;
    font-family: ${T.font};
    background: ${T.white};
    overflow-x: hidden;
    margin-top: 20px;
    display: flex;
    align-items: stretch;
    /* make root itself at least full viewport */
    min-height: calc(100vh - 20px);
}

    /* ── Keyframes ── */
    @keyframes adm-spin    { to { transform: rotate(360deg) } }
    @keyframes adm-fadeUp  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
    @keyframes adm-slideIn { from { opacity:0; transform:translateX(8px)  } to { opacity:1; transform:translateX(0) } }
    @keyframes adm-pulse   { 0%,100%{ opacity:1 } 50%{ opacity:.45 } }
    @keyframes adm-slideDown { from { opacity:0; transform:translateY(-14px) } to { opacity:1; transform:translateY(0) } }
    @keyframes adm-barGrow { from { transform:scaleY(0) } to { transform:scaleY(1) } }

    /* ── Sidebar ── */
    .adm-sidebar {
    width: 220px; flex-shrink: 0;
    background: ${T.blueDark};
    display: flex; flex-direction: column;
    position: sticky; top: 0;
    /* CHANGE height to min-height */
    min-height: 100vh;
    height: auto;
    overflow: hidden; z-index: 200;
    box-shadow: -4px 0 24px rgba(4,68,120,0.35);
    border-left: 3px solid ${T.orange};
    align-self: stretch;
}
    .adm-sidebar::before {
        content: ''; position: absolute; inset: 0;
        background-image:
            linear-gradient(rgba(245,124,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,124,0,0.05) 1px, transparent 1px);
        background-size: 40px 40px; pointer-events: none; z-index: 0;
    }
    .adm-sidebar-brand {
        position: relative; z-index: 1;
        padding: 18px 16px 14px; border-bottom: 3px solid ${T.orange};
        display: flex; align-items: center; gap: 10px;
        background: rgba(0,0,0,0.25); flex-shrink: 0;
    }
    .adm-sb-logo  { width: 36px; height: 36px; object-fit: contain; flex-shrink:0; }
    .adm-sb-name  { font-size: .86rem; font-weight: 900; color: ${T.white}; white-space:nowrap; }
    .adm-sb-sub   { font-size: .6rem; color: rgba(255,255,255,.45); margin-top:2px; }
    .adm-sidebar-user {
        position: relative; z-index: 1;
        padding: 12px 16px; border-bottom: 1.5px solid rgba(245,124,0,0.2);
        display: flex; align-items: center; gap: 10px;
        background: rgba(0,0,0,0.15); flex-shrink: 0;
    }
    .adm-su-av   { width: 36px; height: 36px; border-radius: 4px; background: ${T.orange}; display: flex; align-items: center; justify-content: center; font-size: .7rem; font-weight: 900; color: ${T.white}; flex-shrink:0; }
    .adm-su-name { font-size: .75rem; font-weight: 700; color: ${T.white}; }
    .adm-su-role { display: inline-flex; align-items: center; gap: 3px; margin-top: 2px; padding: 1px 7px; background: rgba(245,124,0,0.2); border: 1px solid rgba(245,124,0,0.4); border-radius: 2px; font-size: .58rem; color: ${T.orangeLight}; font-weight: 700; }
    .adm-sidebar-nav { flex:1; padding: 12px 8px; overflow-y:auto; overflow-x:hidden; position:relative; z-index:1; }
    .adm-sidebar-nav::-webkit-scrollbar { width:3px; }
    .adm-sidebar-nav::-webkit-scrollbar-thumb { background: rgba(245,124,0,0.4); border-radius:2px; }
    .adm-nav-label { font-size:.56rem; font-weight:700; color:rgba(255,255,255,0.3); letter-spacing:1.5px; text-transform:uppercase; padding: 0 8px; margin-bottom:6px; margin-top:4px; }
    .adm-nav-btn {
        width: 100%; display:flex; align-items:center; gap:9px;
        padding: 10px 12px; border-radius:3px;
        border: 1.5px solid transparent; background: transparent;
        color: rgba(255,255,255,0.6); font-family: ${T.font};
        font-size:.8rem; font-weight:700; cursor:pointer;
        transition: all .22s cubic-bezier(.4,0,.2,1);
        text-align:right; margin-bottom:3px; white-space:nowrap;
        overflow:hidden; position:relative;
    }
    .adm-nav-btn::before { content:''; position:absolute; right:0; top:0; bottom:0; width:3px; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform .3s cubic-bezier(.4,0,.2,1); }
    .adm-nav-btn:hover  { background: rgba(245,124,0,0.1); color:${T.white}; border-color:rgba(245,124,0,0.2); }
    .adm-nav-btn.active { background: rgba(245,124,0,0.15); color:${T.white}; border-color:rgba(245,124,0,0.35); }
    .adm-nav-btn.active::before { transform:scaleY(1); }
    .adm-nav-icon  { font-size:.95rem; flex-shrink:0; }
    .adm-nav-txt   { flex:1; text-align:right; overflow:hidden; text-overflow:ellipsis; }
    .adm-nav-badge { padding:1px 7px; border-radius:2px; font-size:.58rem; font-weight:900; background:${T.orange}; color:${T.white}; flex-shrink:0; }
    .adm-nav-badge.pulse { animation: adm-pulse 2s ease infinite; }
    .adm-sidebar-footer { position:relative; z-index:1; padding: 10px 14px; border-top: 1.5px solid rgba(245,124,0,0.2); font-size:.6rem; color:rgba(255,255,255,0.25); text-align:center; background:rgba(0,0,0,0.2); flex-shrink:0; }

    /* ── Main ── */
    .adm-main { flex:1; min-width:0; overflow-y:auto; background: ${T.gray100}; animation: adm-fadeUp .28s ease; }
    .adm-main::-webkit-scrollbar { width:5px; }
    .adm-main::-webkit-scrollbar-thumb { background:${T.gray300}; border-radius:3px; }

    /* ── Page hero ── */
    .adm-page-hero { position:relative; background: ${T.blueDark}; padding: 32px clamp(20px,4vw,48px) 56px; overflow:hidden; }
    .adm-page-hero::before { content:''; position:absolute; inset:0; background-image: linear-gradient(rgba(245,124,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(245,124,0,0.07) 1px, transparent 1px); background-size:40px 40px; pointer-events:none; }
    .adm-page-hero::after  { content:''; position:absolute; bottom:-2px; left:0; right:0; height: clamp(28px,5vw,56px); background:${T.gray100}; clip-path: polygon(0 100%, 100% 0, 100% 100%); }
    .adm-hero-accent   { position:absolute; top:0; right:0; width:6px; height:100%; background:linear-gradient(to bottom,${T.orange},${T.orangeLight}); }
    .adm-hero-content  { position:relative; z-index:2; }
    .adm-hero-tag      { display:inline-block; background:${T.orange}; color:${T.white}; font-family:${T.font}; font-size:clamp(9px,1.1vw,12px); font-weight:700; padding: 4px 16px; border-radius:2px; margin-bottom:10px; letter-spacing:.05em; }
    .adm-hero-title    { font-size:clamp(18px,3vw,32px); font-weight:900; color:${T.white}; font-family:${T.font}; line-height:1.3; }
    .adm-hero-title span { color:${T.orangeLight}; }
    .adm-hero-date     { font-size:clamp(10px,1.2vw,13px); color:rgba(255,255,255,0.5); margin-top:6px; }

    /* ── Content area ── */
    .adm-content { padding: clamp(16px,2.5vw,32px) clamp(16px,3vw,40px) clamp(40px,5vw,64px); }

    /* ── Stat cards ── */
    .adm-stats { display:grid; grid-template-columns: repeat(6,1fr); gap: clamp(10px,1.5vw,18px); margin-bottom: clamp(20px,2.5vw,32px); }
    @media(max-width:1100px){ .adm-stats{ grid-template-columns:repeat(3,1fr); } }
    @media(max-width:640px) { .adm-stats{ grid-template-columns:repeat(2,1fr); } }
    .adm-sc { background: ${T.white}; border-radius:3px; border: 1.5px solid ${T.gray300}; border-top: 4px solid ${T.orange}; padding: clamp(14px,2vw,20px) clamp(12px,1.8vw,16px); display:flex; flex-direction:column; gap:6px; position:relative; overflow:hidden; transition: transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s cubic-bezier(.4,0,.2,1); box-shadow: 0 2px 10px rgba(0,0,0,0.06); min-width:0; }
    .adm-sc:hover   { transform:translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
    .adm-sc.blue    { border-top-color:${T.blue}; }
    .adm-sc::before { content:''; position:absolute; top:0; right:0; width:3px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform .3s cubic-bezier(.4,0,.2,1); z-index:2; }
    .adm-sc.blue::before  { background:${T.blue}; }
    .adm-sc:hover::before { transform:scaleY(1); }
    .adm-sc-icon { font-size:1.4rem; margin-bottom:2px; }
    .adm-sc-val  { font-size:clamp(1.6rem,3vw,2rem); font-weight:900; color:${T.orange}; line-height:1; font-family:'Courier New',monospace; }
    .adm-sc.blue .adm-sc-val { color:${T.blue}; }
    .adm-sc-lbl  { font-size:clamp(.62rem,1.1vw,.72rem); color:${T.gray500}; font-weight:700; }
    .adm-sc-bar  { height:3px; border-radius:2px; background:linear-gradient(to left,${T.orange},${T.orangeLight}); margin-top:4px; width:50%; opacity:.6; }
    .adm-sc.blue .adm-sc-bar { background:linear-gradient(to left,${T.blue},${T.blueLight}); }

    /* ── Section headers ── */
    .adm-section-hdr { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom: clamp(14px,2vw,22px); padding-bottom: clamp(10px,1.5vw,16px); border-bottom: 3px solid ${T.orange}; position:relative; }
    .adm-section-tag   { display:inline-block; background:${T.blue}; color:${T.white}; font-family:${T.font}; font-size:clamp(9px,1.1vw,12px); font-weight:700; padding:4px 14px; border-radius:2px; margin-bottom:4px; letter-spacing:.04em; }
    .adm-section-title { font-size:clamp(14px,2vw,20px); font-weight:900; color:${T.black}; font-family:${T.font}; }
    .adm-section-title span { color:${T.orange}; }

    /* ── Toolbar ── */
    .adm-toolbar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom: clamp(12px,2vw,18px); background:${T.white}; border:1.5px solid ${T.gray300}; border-radius:3px; padding: clamp(10px,1.5vw,14px) clamp(12px,2vw,18px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .adm-search input { width:100%; padding: clamp(8px,1.2vw,11px) 34px clamp(8px,1.2vw,11px) clamp(10px,1.5vw,14px); border-radius:3px; border:1.5px solid ${T.gray300}; background:${T.gray100}; color:${T.black}; font-family:${T.font}; font-size:clamp(.72rem,1.3vw,.8rem); outline:none; direction:rtl; transition: border .18s, box-shadow .18s; }
    .adm-search input::placeholder { color:${T.gray500}; }
    .adm-search input:focus { border-color:${T.orange}; background:${T.white}; box-shadow:0 0 0 3px rgba(245,124,0,0.1); }
    .adm-search::after { content:''; position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:.68rem; pointer-events:none; opacity:.5; }
    .adm-fdate { padding: clamp(7px,1.1vw,10px) clamp(8px,1.2vw,12px); border-radius:3px; border:1.5px solid ${T.gray300}; background:${T.gray100}; color:${T.black}; font-family:${T.font}; font-size:clamp(.7rem,1.2vw,.78rem); outline:none; direction:ltr; transition: border .18s; }
    .adm-fdate:focus { border-color:${T.orange}; background:${T.white}; }
    .adm-fsel { padding: clamp(7px,1.1vw,10px) clamp(8px,1.2vw,12px); border-radius:3px; border:1.5px solid ${T.gray300}; background:${T.gray100}; color:${T.black}; font-family:${T.font}; font-size:clamp(.7rem,1.2vw,.78rem); outline:none; cursor:pointer; }
    .adm-filter-active { display:inline-flex; align-items:center; gap:5px; padding:3px 12px; border-radius:2px; background:rgba(245,124,0,0.08); border:1.5px solid rgba(245,124,0,0.3); color:${T.orange}; font-size:.68rem; font-weight:700; }
    .adm-fclear { padding: clamp(6px,1vw,9px) clamp(10px,1.5vw,14px); border-radius:3px; background:${T.gray100}; border:1.5px solid ${T.gray300}; font-family:${T.font}; font-size:clamp(.64rem,1.1vw,.72rem); font-weight:700; cursor:pointer; color:${T.gray500}; transition:all .16s; }
    .adm-fclear:hover { border-color:${T.orange}; color:${T.orange}; background:rgba(245,124,0,0.06); }

    /* ── Export button ── */
    .adm-expw { position:relative; }
    .adm-expbtn { display:flex; align-items:center; gap:6px; padding: clamp(8px,1.2vw,11px) clamp(14px,2vw,20px); background:${T.orange}; color:${T.white}; border:none; border-radius:3px; font-family:${T.font}; font-size:clamp(.72rem,1.3vw,.8rem); font-weight:700; cursor:pointer; white-space:nowrap; transition:all .22s cubic-bezier(.4,0,.2,1); box-shadow:0 4px 14px rgba(245,124,0,0.3); }
    .adm-expbtn:hover    { background:${T.orangeDark}; transform:translateY(-2px); box-shadow:0 6px 20px rgba(245,124,0,0.38); }
    .adm-expbtn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    .adm-expmenu { position:absolute; top:calc(100% + 6px); left:0; background:${T.white}; border:1.5px solid ${T.gray300}; border-radius:3px; box-shadow:0 10px 32px rgba(0,0,0,0.12); overflow:hidden; z-index:400; min-width:190px; animation: adm-slideIn .15s ease; border-top:3px solid ${T.orange}; }
    .adm-expitem { display:flex; align-items:center; gap:9px; width:100%; padding: clamp(10px,1.8vw,13px) clamp(14px,2vw,18px); background:none; border:none; border-bottom:1px solid ${T.gray100}; font-family:${T.font}; font-size:clamp(.72rem,1.3vw,.8rem); font-weight:700; color:${T.gray700}; direction:rtl; cursor:pointer; transition:background .12s,color .12s; }
    .adm-expitem:last-child { border-bottom:none; }
    .adm-expitem:hover { background:rgba(245,124,0,0.06); color:${T.orange}; }

    /* ── Table card ── */
    .adm-card { background:${T.white}; border-radius:3px; border:1.5px solid ${T.gray300}; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.06); position:relative; }
    .adm-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to left,${T.orange},${T.blue}); z-index:2; }
    .adm-tscr { overflow-x:auto; -webkit-overflow-scrolling:touch; }
    .adm-tbl  { width:100%; border-collapse:collapse; min-width:480px; }
    .adm-tbl thead th { background:${T.blue}; color:${T.white}; padding: clamp(12px,1.8vw,16px) clamp(10px,2vw,18px); font-family:${T.font}; font-size:clamp(.7rem,1.2vw,.78rem); font-weight:700; text-align:right; white-space:nowrap; border-bottom:3px solid ${T.orange}; letter-spacing:.3px; }
    .adm-tbl thead th.or { background:${T.orange}; border-bottom-color:rgba(255,255,255,0.3); }
    .adm-tbl thead th.gr { background:#16a34a; border-bottom-color:#86efac; }
    .adm-tbl thead th.pu { background:#7c3aed; border-bottom-color:#c4b5fd; }
    .adm-tbl thead th.rd { background:#dc2626; border-bottom-color:#fca5a5; }
    .adm-tbl thead th.c  { text-align:center; }
    .adm-tbl tbody tr { border-bottom:1px solid ${T.gray100}; transition:background .12s; }
    .adm-tbl tbody tr:last-child { border-bottom:none; }
    .adm-tbl tbody tr:hover { background:rgba(8,101,168,0.04); }
    .adm-tbl tbody tr.xopen { background:rgba(8,101,168,0.05); }
    .adm-tbl tbody tr:nth-child(even) { background:#fafbfc; }
    .adm-tbl tbody tr:nth-child(even):hover { background:rgba(8,101,168,0.04); }
    .adm-tbl td { padding: clamp(11px,1.6vw,14px) clamp(10px,2vw,18px); font-family:${T.font}; font-size:clamp(.69rem,1.25vw,.78rem); color:${T.gray700}; vertical-align:middle; }

    /* ── Table helpers ── */
    .adm-av { width:clamp(30px,3.5vw,36px); height:clamp(30px,3.5vw,36px); border-radius:3px; background:${T.blue}; color:${T.white}; display:inline-flex; align-items:center; justify-content:center; font-weight:900; font-size:clamp(.6rem,1vw,.68rem); flex-shrink:0; }
    .adm-av.or { background:${T.orange}; }
    .adm-av.rd { background:#dc2626; }
    .adm-av.sm { width:24px; height:24px; font-size:.58rem; }
    .adm-uc    { display:flex; align-items:center; gap:9px; }
    .adm-uname { font-weight:700; color:${T.black}; }
    .adm-cb    { display:inline-flex; align-items:center; justify-content:center; min-width:26px; height:26px; border-radius:2px; background:rgba(8,101,168,0.08); border:1.5px solid rgba(8,101,168,0.25); color:${T.blue}; font-size:clamp(.64rem,1.1vw,.72rem); font-weight:900; padding:0 6px; font-family:'Courier New',monospace; }
    .adm-cb.or { background:rgba(245,124,0,0.08); border-color:rgba(245,124,0,0.3); color:${T.orange}; }
    .adm-pill  { display:inline-block; padding:4px 12px; border-radius:2px; font-size:clamp(.62rem,1.1vw,.7rem); font-weight:700; cursor:pointer; border:1.5px solid rgba(8,101,168,0.3); color:${T.blue}; background:rgba(8,101,168,0.07); user-select:none; transition:all .14s; font-family:${T.font}; }
    .adm-pill:hover,.adm-pill.op { background:rgba(8,101,168,0.14); border-color:rgba(8,101,168,0.55); }
    .adm-pill.or { border-color:rgba(245,124,0,0.3); color:${T.orange}; background:rgba(245,124,0,0.07); }
    .adm-pill.or:hover,.adm-pill.or.op { background:rgba(245,124,0,0.14); border-color:rgba(245,124,0,0.55); }

    /* ── Expanded rows ── */
    .adm-xrow td { padding:0!important; border:none; }
    .adm-xin  { padding: clamp(12px,2vw,16px) clamp(14px,2.5vw,22px); display:flex; flex-wrap:wrap; gap:clamp(7px,1.3vw,11px); background:rgba(8,101,168,0.04); border-top:2px solid rgba(8,101,168,0.1); }
    .adm-mc   { background:${T.white}; border-radius:3px; padding:clamp(9px,1.8vw,13px) clamp(10px,2vw,14px); border:1.5px solid ${T.gray300}; min-width:clamp(150px,20vw,200px); flex:1 1 150px; max-width:260px; transition:border-color .14s; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
    .adm-mc:hover { border-color:rgba(245,124,0,0.4); }
    .adm-mt { font-size:clamp(.7rem,1.25vw,.78rem); font-weight:700; color:${T.blue}; margin-bottom:2px; }
    .adm-mt.or { color:${T.orange}; }
    .adm-ms { font-size:clamp(.63rem,1.1vw,.7rem); color:${T.gray500}; }
    .adm-md { font-size:clamp(.6rem,1vw,.66rem); color:${T.gray300}; margin-top:4px; }

    /* ── Empty / loading ── */
    .adm-empty { text-align:center; padding:clamp(40px,8vw,70px) 20px; }
    .adm-emi   { font-size:clamp(1.8rem,4vw,2.5rem); margin-bottom:12px; opacity:.35; }
    .adm-empty p { color:${T.gray300}; font-size:clamp(.74rem,1.4vw,.82rem); }
    .adm-ld    { text-align:center; padding:clamp(50px,10vw,80px) 20px; }
    .adm-sp    { width:clamp(32px,4.5vw,42px); height:clamp(32px,4.5vw,42px); border:3px solid ${T.gray300}; border-top-color:${T.blue}; border-radius:50%; animation:adm-spin .7s linear infinite; margin:0 auto clamp(12px,2vw,18px); }
    .adm-ld p  { color:${T.gray300}; font-size:clamp(.72rem,1.3vw,.8rem); }

    /* ── Overlay ── */
    .adm-ovl  { position:fixed; inset:0; background:rgba(245,247,250,.88); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); }
    .adm-ovlb { background:${T.white}; border-radius:3px; padding:clamp(28px,5vw,44px) clamp(44px,7vw,64px); text-align:center; box-shadow:0 20px 56px rgba(8,101,168,0.18); border:2px solid rgba(8,101,168,0.15); border-top:4px solid ${T.orange}; }
    .adm-ovlb p { font-size:clamp(.78rem,1.5vw,.86rem); margin-top:14px; color:${T.gray500}; font-family:${T.font}; }

    /* ── Error ── */
    .adm-err { background:#fef2f2; border:1.5px solid rgba(220,38,38,.3); color:#dc2626; border-radius:3px; padding:clamp(8px,1.5vw,11px) clamp(10px,2vw,14px); margin-bottom:14px; font-size:clamp(.7rem,1.3vw,.78rem); display:flex; align-items:center; gap:9px; border-right:4px solid #dc2626; }

    /* ── Attendance ── */
    .adm-chk { width:22px; height:22px; border-radius:3px; border:2px solid ${T.gray300}; background:${T.gray100}; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all .16s; flex-shrink:0; font-size:.75rem; color:transparent; }
    .adm-chk:hover { border-color:#16a34a; background:#f0fdf4; }
    .adm-chk.on    { background:#f0fdf4; border-color:#16a34a; color:#16a34a; }
    .adm-chk.spin  { border-color:#16a34a; border-top-color:transparent; border-radius:50%; animation:adm-spin .6s linear infinite; }
    .adm-att-badge { display:inline-flex; align-items:center; gap:3px; padding:3px 9px; border-radius:2px; font-size:clamp(.62rem,1.1vw,.7rem); font-weight:700; }
    .adm-att-badge.on  { background:#f0fdf4; color:#16a34a; border:1px solid #86efac; }
    .adm-att-badge.off { background:${T.gray100}; color:${T.gray300}; border:1px solid ${T.gray300}; }
    .adm-att-sum { display:flex; align-items:center; gap:clamp(10px,2vw,20px); flex-wrap:wrap; background:${T.blue}; border-radius:3px; padding:clamp(10px,1.8vw,14px) clamp(14px,2.5vw,20px); margin-bottom:clamp(12px,2vw,18px); box-shadow:0 4px 16px rgba(8,101,168,0.25); position:relative; overflow:hidden; }
    .adm-att-sum::before { content:''; position:absolute; inset:0; background-image: linear-gradient(rgba(245,124,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,0.06) 1px,transparent 1px); background-size:28px 28px; pointer-events:none; }
    .adm-att-sum span { font-size:clamp(.7rem,1.3vw,.78rem); font-weight:700; color:rgba(255,255,255,0.85); position:relative; z-index:1; }
    .adm-prog-wrap { flex:1; min-width:100px; height:5px; background:rgba(255,255,255,0.2); border-radius:3px; overflow:hidden; position:relative; z-index:1; }
    .adm-prog-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,${T.orange},${T.orangeLight}); transition:width .5s ease; }

    /* ── Certificate cards ── */
    .adm-cert-grid { display:grid; gap:clamp(10px,1.8vw,16px); padding:clamp(12px,2vw,20px); grid-template-columns:repeat(auto-fill,minmax(clamp(240px,28vw,300px),1fr)); }
    .adm-cert-card { background:${T.white}; border-radius:3px; padding:clamp(12px,2vw,16px); border:1.5px solid ${T.gray300}; display:flex; flex-direction:column; gap:10px; transition:transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s, border-color .3s; box-shadow:0 2px 8px rgba(0,0,0,0.05); position:relative; }
    .adm-cert-card::before { content:''; position:absolute; top:0; right:0; width:3px; height:100%; background:${T.orange}; transform:scaleY(0); transform-origin:bottom; transition:transform .3s cubic-bezier(.4,0,.2,1); }
    .adm-cert-card:hover { border-color:${T.orange}; box-shadow:0 8px 28px rgba(245,124,0,0.14); transform:translateY(-4px); }
    .adm-cert-card:hover::before { transform:scaleY(1); }
    .adm-cert-card.has-cert::before { background:#16a34a; }
    .adm-cert-card.has-cert:hover  { border-color:#86efac; box-shadow:0 8px 28px rgba(22,163,74,0.12); }
    .adm-cert-card-top   { display:flex; align-items:flex-start; gap:10px; }
    .adm-cert-icon { width:40px; height:40px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; background:rgba(8,101,168,0.08); border:1.5px solid rgba(8,101,168,0.2); }
    .adm-cert-icon.has  { background:#f0fdf4; border-color:#86efac; }
    .adm-cert-icon.grey { background:rgba(156,163,175,.06); border-color:rgba(156,163,175,.15); }
    .adm-cert-info   { flex:1; min-width:0; }
    .adm-cert-name   { font-weight:700; font-size:.8rem; color:${T.black}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .adm-cert-course { font-size:.7rem; color:${T.blue}; margin-top:3px; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .adm-cert-badges  { display:flex; gap:5px; flex-wrap:wrap; margin-top:5px; }
    .adm-cert-actions { display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end; border-top:1px solid ${T.gray100}; padding-top:9px; }
    .adm-cert-btn { padding:clamp(5px,1vw,7px) clamp(10px,1.5vw,14px); border-radius:2px; font-family:${T.font}; font-size:clamp(.64rem,1.1vw,.72rem); font-weight:700; cursor:pointer; border:none; transition:all .16s; white-space:nowrap; }
    .adm-cert-btn.up   { background:rgba(8,101,168,0.08); color:${T.blue}; border:1.5px solid rgba(8,101,168,0.25); }
    .adm-cert-btn.up:hover { background:rgba(8,101,168,0.16); }
    .adm-cert-btn.dl   { background:rgba(245,124,0,0.08); color:${T.orange}; border:1.5px solid rgba(245,124,0,0.25); }
    .adm-cert-btn.dl:hover { background:rgba(245,124,0,0.16); }
    .adm-cert-btn.rm   { background:#fef2f2; color:#dc2626; border:1.5px solid rgba(220,38,38,.2); }
    .adm-cert-btn.rm:hover { background:#fee2e2; }
    .adm-cert-btn.full { width:100%; text-align:center; justify-content:center; background:${T.blue}; color:${T.white}; border:none; }
    .adm-cert-btn.full:hover { background:${T.blueDark}; }
    .adm-cert-btn:disabled { opacity:.45; cursor:not-allowed; }
    .adm-cert-sum { display:flex; align-items:center; gap:14px; flex-wrap:wrap; background:${T.white}; border:1.5px solid ${T.gray300}; border-radius:3px; padding:12px 20px; margin-bottom:16px; box-shadow:0 2px 8px rgba(0,0,0,0.05); border-top:4px solid ${T.blue}; }

    /* ── Modals ── */
    .adm-modal-bg { position:fixed; inset:0; background:rgba(4,68,120,0.45); z-index:10000; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(6px); animation:adm-fadeUp .16s ease; }
    .adm-modal { background:${T.white}; border-radius:3px; padding:clamp(16px,2.5vw,24px); max-width:clamp(290px,88vw,520px); width:100%; box-shadow:0 20px 56px rgba(4,68,120,0.22); direction:rtl; border:1.5px solid ${T.gray300}; border-top:4px solid ${T.orange}; }
    .adm-modal.rd { border-top-color:#dc2626; max-width:clamp(290px,92vw,540px); max-height:90vh; overflow-y:auto; }
    .adm-modal h3 { font-size:clamp(.82rem,1.5vw,.94rem); font-weight:900; color:${T.black}; margin-bottom:4px; }
    .adm-modal p  { font-size:clamp(.66rem,1.1vw,.74rem); color:${T.gray500}; margin-bottom:12px; font-family:${T.font}; }
    .adm-drop { border:2px dashed rgba(8,101,168,0.35); border-radius:3px; padding:clamp(24px,5vw,36px) 16px; text-align:center; cursor:pointer; transition:all .16s; background:rgba(8,101,168,0.03); }
    .adm-drop.over  { border-color:${T.orange}; background:rgba(245,124,0,0.05); }
    .adm-drop:hover { border-color:rgba(8,101,168,0.6); }
    .adm-drop-icon  { font-size:clamp(1.7rem,3.5vw,2.3rem); margin-bottom:8px; }
    .adm-drop-txt   { font-size:clamp(.72rem,1.4vw,.8rem); color:${T.gray700}; margin-bottom:4px; font-family:${T.font}; }
    .adm-drop-sub   { font-size:clamp(.62rem,1.1vw,.7rem); color:${T.gray500}; }
    .adm-modal-actions { display:flex; gap:7px; margin-top:18px; justify-content:flex-end; }
    .adm-modal-cancel { padding:clamp(7px,1.3vw,10px) clamp(12px,2vw,18px); border-radius:3px; background:${T.gray100}; border:1.5px solid ${T.gray300}; font-family:${T.font}; font-size:clamp(.7rem,1.3vw,.78rem); font-weight:700; cursor:pointer; color:${T.gray500}; transition:all .14s; }
    .adm-modal-cancel:hover { border-color:${T.black}; color:${T.black}; background:${T.white}; }
    .adm-email { direction:ltr; text-align:right; color:${T.gray500}; font-size:clamp(.65rem,1.15vw,.73rem); }

    /* ── Refund ── */
    .rf-stat-bar { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:10px; margin-bottom:20px; }
    .rf-sc { background:${T.white}; border-radius:3px; padding:14px 16px; border:1.5px solid ${T.gray300}; box-shadow:0 2px 8px rgba(0,0,0,0.05); display:flex; align-items:center; gap:11px; transition:transform .2s; border-right:4px solid ${T.orange}; }
    .rf-sc:hover { transform:translateY(-2px); }
    .rf-sc-icon { width:36px; height:36px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:1rem; flex-shrink:0; }
    .rf-sc-val  { font-size:1.3rem; font-weight:900; line-height:1; font-family:'Courier New',monospace; }
    .rf-sc-lbl  { font-size:.62rem; color:${T.gray500}; font-weight:700; margin-top:3px; }
    .rf-status  { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:2px; font-size:.7rem; font-weight:700; white-space:nowrap; border:1.5px solid transparent; }
    .rf-amount  { font-family:'Courier New',monospace; font-weight:900; font-size:.88rem; color:#15803d; direction:ltr; display:inline-block; }
    .rf-filter-btns { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
    .rf-fbtn { padding:5px 13px; border-radius:2px; border:1.5px solid ${T.gray300}; background:${T.gray100}; font-family:${T.font}; font-size:.7rem; font-weight:700; cursor:pointer; color:${T.gray500}; transition:all .14s; }
    .rf-fbtn:hover { border-color:${T.blue}; color:${T.blue}; background:rgba(8,101,168,0.06); }
    .rf-fbtn.active      { background:rgba(8,101,168,0.1); border-color:rgba(8,101,168,0.4); color:${T.blue}; }
    .rf-fbtn.active.pend { background:rgba(245,124,0,0.08); border-color:rgba(245,124,0,0.4); color:${T.orange}; }
    .rf-fbtn.active.appr { background:#f0fdf4; border-color:#86efac; color:#16a34a; }
    .rf-fbtn.active.bank { background:rgba(8,101,168,0.08); border-color:rgba(8,101,168,0.35); color:${T.blue}; }
    .rf-fbtn.active.rjct { background:#fef2f2; border-color:rgba(220,38,38,.35); color:#dc2626; }
    .rf-action-btn { padding:5px 12px; border-radius:2px; font-family:${T.font}; font-size:.68rem; font-weight:700; cursor:pointer; border:1.5px solid; transition:all .14s; white-space:nowrap; }
    .rf-action-btn:disabled { opacity:.4; cursor:not-allowed; }
    .rf-action-btn.view    { background:rgba(8,101,168,0.07); color:${T.blue}; border-color:rgba(8,101,168,0.3); }
    .rf-action-btn.view:hover    { background:rgba(8,101,168,0.14); }
    .rf-action-btn.approve { background:#f0fdf4; color:#16a34a; border-color:#86efac; }
    .rf-action-btn.approve:hover { background:#dcfce7; }
    .rf-action-btn.bank    { background:rgba(8,101,168,0.07); color:${T.blue}; border-color:rgba(8,101,168,0.35); }
    .rf-action-btn.bank:hover    { background:rgba(8,101,168,0.14); }
    .rf-action-btn.reject  { background:#fef2f2; color:#dc2626; border-color:rgba(220,38,38,.3); }
    .rf-action-btn.reject:hover  { background:#fee2e2; }
    .rf-detail    { display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; }
    .rf-field-lbl { font-size:.58rem; color:${T.gray500}; font-weight:700; margin-bottom:2px; }
    .rf-field-val { font-size:.74rem; color:${T.black}; font-weight:700; word-break:break-all; }
    .rf-field-val.mono { font-family:'Courier New',monospace; direction:ltr; display:inline-block; }
    .rf-full      { grid-column:1/-1; }
    .rf-divider   { grid-column:1/-1; border:none; border-top:1.5px dashed ${T.gray300}; margin:4px 0; }
    .rf-bank-block  { grid-column:1/-1; background:${T.gray100}; border:1.5px solid rgba(8,101,168,0.15); border-radius:3px; padding:10px 14px; border-right:4px solid ${T.blue}; }
    .rf-bank-title  { font-size:.68rem; font-weight:900; color:${T.blue}; margin-bottom:7px; display:flex; align-items:center; gap:5px; }
    .rf-bank-grid   { display:grid; grid-template-columns:1fr 1fr; gap:5px 14px; }
    .rf-action-area { margin-top:12px; border-top:1.5px solid ${T.gray300}; padding-top:10px; }
    .rf-action-row  { display:flex; gap:7px; flex-wrap:wrap; }
    .rf-textarea { width:100%; padding:8px 10px; border-radius:3px; border:1.5px solid ${T.gray300}; background:${T.gray100}; font-family:${T.font}; font-size:.74rem; color:${T.black}; resize:vertical; min-height:60px; outline:none; direction:rtl; margin-top:8px; transition:border .18s; }
    .rf-textarea:focus { border-color:${T.orange}; background:${T.white}; }
    .rf-action-confirm { padding:8px 18px; border-radius:2px; font-family:${T.font}; font-size:.76rem; font-weight:700; cursor:pointer; border:none; transition:all .16s; }
    .rf-action-confirm.approve       { background:#16a34a; color:${T.white}; }
    .rf-action-confirm.approve:hover { background:#15803d; }
    .rf-action-confirm.bank          { background:${T.blue}; color:${T.white}; }
    .rf-action-confirm.bank:hover    { background:${T.blueDark}; }
    .rf-action-confirm.reject        { background:#dc2626; color:${T.white}; }
    .rf-action-confirm.reject:hover  { background:#b91c1c; }
    .rf-action-confirm:disabled      { opacity:.5; cursor:not-allowed; }
    .rf-bank-banner { padding:12px 16px; border-radius:3px; font-family:${T.font}; font-size:.78rem; font-weight:700; display:flex; align-items:center; gap:10px; margin-bottom:16px; animation:adm-slideDown .3s ease; position:relative; border-right:4px solid; }
    .rf-bank-banner.success { background:#f0fdf4; border-color:#86efac; color:#15803d; }
    .rf-bank-banner.failed  { background:rgba(245,124,0,0.06); border-color:${T.orange}; color:${T.orangeDark}; }
    .rf-bank-banner-close { position:absolute; left:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:1rem; color:inherit; opacity:.6; }
    .rf-bank-banner-close:hover { opacity:1; }

    /* ── Pagination ── */
    .adm-pg { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:14px 18px; border-top:1.5px solid ${T.gray300}; background:${T.gray100}; font-family:${T.font}; direction:rtl; }
    .adm-pg-info { font-size:.72rem; color:${T.gray500}; font-weight:700; }
    .adm-pg-info strong { color:${T.black}; }

    /* ── Breadcrumb ── */
    .adm-bc { position:fixed; top:${NAVBAR_H}px; left:0; z-index:1050; width:100%; height:${OVERVIEW_H}px; background:#f5f5f5; border-bottom:1px solid ${T.gray300}; display:flex; align-items:center; justify-content:center; font-family:${T.font}; font-size:clamp(.72rem,1.3vw,.82rem); }
    .adm-bc a     { margin-left:6px; color:${T.blue}; text-decoration:none; font-weight:700; transition:color .15s; }
    .adm-bc a:hover { color:${T.orange}; }
    .adm-bc .sep  { color:${T.gray500}; margin:0 6px; }
    .adm-bc .cur  { color:${T.gray700}; margin-right:8px; }

    /* ── Footer ── */
    .adm-footer { background:${T.black}; padding:clamp(24px,4vw,40px) clamp(16px,3vw,32px); text-align:center; margin-top: clamp(32px,5vw,60px); }
    .adm-footer p { color:rgba(255,255,255,0.25); font-family:${T.font}; font-size:clamp(.62rem,1.1vw,.7rem); }

    /* ── Responsive ── */
    @media(max-width:1100px){
        .adm-sidebar { 
        width: 54px;
        min-height: 100vh; /* add this */
    }
        .adm-sb-title,.adm-su-info,.adm-nav-label,.adm-nav-badge,.adm-sidebar-footer,.adm-nav-txt { display:none; }
        .adm-sidebar-brand { padding:12px; justify-content:center; }
        .adm-sidebar-user  { padding:10px; justify-content:center; }
        .adm-sidebar-nav   { padding:8px 5px; }
        .adm-nav-btn { justify-content:center; padding:10px 6px; }
        .adm-sb-logo,.adm-su-av { width:28px; height:28px; }
    }
    @media(max-width:768px){
        .rf-detail,.rf-bank-grid { grid-template-columns:1fr; }
        .adm-cert-grid { grid-template-columns:1fr!important; }
        .adm-mc { max-width:100%; }
        .adm-toolbar { flex-direction:column; align-items:stretch; }
        .adm-expw { align-self:flex-start; }
    }
    @media(max-width:480px){ .adm-content { padding:12px 10px 32px; } }
    @media print {
        .adm-sidebar,.adm-toolbar,.adm-bc { display:none!important; }
        .adm-root { margin-top:0!important; }
    }
    // src/components/admin/styles.js
// ─────────────────────────────────────────────────────────────────────────────
// PASTE everything between the === markers into your ADMIN_STYLES template
// literal, just before the closing backtick.
// ─────────────────────────────────────────────────────────────────────────────
// ==================  PASTE START  ==================

    /* ══ FINANCIAL TAB ══ */
    .fin-income-hero {
        display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
        background: linear-gradient(135deg, #073f6e 0%, #044478 60%, #0b4a1c 100%);
        border-radius:3px; padding:clamp(20px,3vw,32px) clamp(20px,3.5vw,40px);
        margin-bottom:clamp(18px,2.5vw,28px); position:relative; overflow:hidden;
        box-shadow: 0 8px 32px rgba(4,68,120,0.3); border:1.5px solid rgba(22,163,74,0.3);
    }
    .fin-income-hero::before {
        content:''; position:absolute; inset:0;
        background-image: linear-gradient(rgba(22,163,74,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(22,163,74,0.07) 1px,transparent 1px);
        background-size:36px 36px; pointer-events:none;
    }
    .fin-income-hero::after {
        content:''; position:absolute; top:0; right:0;
        width:5px; height:100%; background:linear-gradient(to bottom,#16a34a,#22c55e);
    }
    .fin-total-label { font-size:clamp(.72rem,1.3vw,.82rem); color:rgba(255,255,255,.55); font-weight:700; margin-bottom:6px; }
    .fin-total-amount { font-size:clamp(2rem,4.5vw,3.2rem); font-weight:900; color:#ffffff; font-family:'Courier New',monospace; line-height:1; letter-spacing:-1px; text-shadow:0 2px 12px rgba(22,163,74,0.4); }
    .fin-total-amount .fin-currency { font-size:clamp(.9rem,1.8vw,1.3rem); color:#4ade80; margin-right:6px; font-weight:700; }
    .fin-total-sub { font-size:clamp(.65rem,1.15vw,.74rem); color:rgba(255,255,255,.4); margin-top:4px; }
    .fin-income-pills { display:flex; gap:10px; flex-wrap:wrap; position:relative; z-index:1; }
    .fin-ip { display:flex; flex-direction:column; align-items:center; padding:12px 18px; border-radius:3px; min-width:110px; background:rgba(255,255,255,0.07); border:1.5px solid rgba(255,255,255,0.12); backdrop-filter:blur(4px); transition:all .2s; }
    .fin-ip:hover { background:rgba(255,255,255,0.12); border-color:rgba(22,163,74,0.4); }
    .fin-ip-val { font-size:clamp(1.1rem,2.2vw,1.5rem); font-weight:900; font-family:'Courier New',monospace; color:#ffffff; }
    .fin-ip-lbl { font-size:clamp(.58rem,1vw,.65rem); color:rgba(255,255,255,.5); margin-top:3px; font-weight:700; }

    .fin-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:clamp(10px,1.5vw,16px); margin-bottom:clamp(16px,2.5vw,26px); }
    @media(max-width:900px){ .fin-stats-row{ grid-template-columns:repeat(2,1fr); } }
    @media(max-width:480px){ .fin-stats-row{ grid-template-columns:1fr 1fr; } }
    .fin-sc { background:#ffffff; border-radius:3px; border:1.5px solid #d0d3d8; padding:clamp(14px,2vw,20px) clamp(12px,1.8vw,16px); display:flex; align-items:center; gap:12px; box-shadow:0 2px 10px rgba(0,0,0,0.06); position:relative; overflow:hidden; transition:transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s; }
    .fin-sc::before { content:''; position:absolute; top:0; right:0; width:4px; height:100%; background:#16a34a; transform:scaleY(0); transform-origin:bottom; transition:transform .3s cubic-bezier(.4,0,.2,1); }
    .fin-sc:hover { transform:translateY(-4px); box-shadow:0 10px 28px rgba(0,0,0,0.1); }
    .fin-sc:hover::before { transform:scaleY(1); }
    .fin-sc-icon { width:44px; height:44px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
    .fin-sc-body { flex:1; min-width:0; }
    .fin-sc-val { font-size:clamp(1.15rem,2.5vw,1.5rem); font-weight:900; font-family:'Courier New',monospace; line-height:1; }
    .fin-sc-lbl { font-size:clamp(.62rem,1.1vw,.7rem); color:#6b7280; font-weight:700; margin-top:3px; }
    .fin-sc-bar { height:3px; border-radius:2px; margin-top:6px; width:60%; opacity:.55; }

    .fin-cb-row { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
    .fin-cb-name { font-size:.76rem; font-weight:700; color:#0a0a0a; min-width:clamp(120px,25vw,200px); max-width:clamp(120px,25vw,200px); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:right; }
    .fin-cb-track { flex:1; height:8px; background:#f0f1f2; border-radius:4px; overflow:hidden; }
    .fin-cb-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,#16a34a,#22c55e); transition:width .6s cubic-bezier(.4,0,.2,1); }
    .fin-cb-fill.alt { background:linear-gradient(90deg,#0865a8,#1a84d4); }
    .fin-cb-amt { font-size:.74rem; font-weight:900; font-family:'Courier New',monospace; color:#16a34a; min-width:90px; text-align:left; }
    .fin-cb-count { font-size:.64rem; color:#6b7280; min-width:50px; text-align:left; }

    .fin-user-total { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:2px; background:#f0fdf4; border:1.5px solid #86efac; font-family:'Courier New',monospace; font-size:.78rem; font-weight:900; color:#16a34a; }
    .fin-course-chip { display:inline-flex; align-items:center; gap:7px; background:#ffffff; border:1.5px solid #d0d3d8; border-radius:3px; padding:7px 12px; margin:4px; font-size:.72rem; transition:border-color .15s; }
    .fin-course-chip:hover { border-color:#16a34a; }
    .fin-course-chip-name { font-weight:700; color:#0a0a0a; }
    .fin-course-chip-price { font-family:'Courier New',monospace; font-weight:900; color:#16a34a; font-size:.78rem; }
    .fin-xin { padding:14px 20px; background:rgba(22,163,74,0.03); border-top:2px solid rgba(22,163,74,0.1); }

    /* financial hero / accent overrides */
    .adm-page-hero.fin-hero { background:linear-gradient(135deg,#073f6e 0%,#044478 60%,#0a4a1a 100%); }
    .adm-hero-accent.green   { background:linear-gradient(to bottom,#16a34a,#22c55e); }
    .adm-hero-tag.green      { background:#16a34a; }
    .adm-hero-title span.green { color:#4ade80; }
    .adm-section-hdr.green   { border-bottom-color:#16a34a; }
    .adm-section-tag.green   { background:#16a34a; }
    .adm-section-title span.green { color:#16a34a; }
    .adm-card.green::before  { background:linear-gradient(to left,#16a34a,#0865a8); }

    /* sidebar financial nav item */
    .adm-nav-divider   { height:1px; background:rgba(245,124,0,0.15); margin:8px 8px; }
    .adm-nav-btn.fin-nav::before { background:#16a34a; }
    .adm-nav-btn.fin-nav.active  { background:rgba(22,163,74,0.15); border-color:rgba(22,163,74,0.35); }
    .adm-nav-badge.green { background:#16a34a; }

    /* export button green variant */
    .adm-expbtn.green { background:#16a34a; box-shadow:0 4px 14px rgba(22,163,74,0.3); }
    .adm-expbtn.green:hover { background:#15803d; box-shadow:0 6px 20px rgba(22,163,74,0.38); }
    .adm-expmenu.green { border-top-color:#16a34a; }

    /* table cell variants used in FinancialTab */
    .adm-av.gr   { background:#16a34a; }
    .adm-cb.gr   { background:rgba(22,163,74,0.08); border-color:rgba(22,163,74,0.3); color:#16a34a; }
    .adm-pill.gr { border-color:rgba(22,163,74,0.3); color:#16a34a; background:rgba(22,163,74,0.07); }
    .adm-pill.gr:hover,.adm-pill.gr.op { background:rgba(22,163,74,0.14); border-color:rgba(22,163,74,0.55); }

// ==================  PASTE END  ==================
// ──────────────────────────────────────────────────────────────────────────────
// PASTE everything between ═══ START ═══ and ═══ END ═══
// into ADMIN_STYLES in src/components/admin/styles.js
// (right before the closing backtick of the template literal)
// ──────────────────────────────────────────────────────────────────────────────

/* ═══ START ═══ */

    @keyframes lec-notif-in { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

    /* ── Lecturers layout ── */
    .lec-layout {
    display: flex;
    gap: clamp(10px, 1.5vw, 18px);
    align-items: stretch;
}

    /* ── Left panel (list) ── */
    .lec-panel {
    width: clamp(230px,26vw,290px);
    flex-shrink: 0;
    background: #ffffff;
    border-radius: 3px;
    border: 1.5px solid #d0d3d8;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    height: 100vh and max-height: 100vh */
    //position: sticky;
    top: 16px;
    /* ADD these: */
    height: fit-content;
    max-height: calc(100vh - 32px);
    overflow: hidden;
}
    .lec-panel-hdr {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 14px 10px; border-bottom: 1.5px solid #f0f1f2;
        flex-shrink: 0; gap: 8px;
    }
    .lec-count-badge {
        background: rgba(8,101,168,0.1); color: #0865a8;
        border: 1.5px solid rgba(8,101,168,0.25); border-radius: 2px;
        padding: 1px 9px; font-size: .68rem; font-weight: 900; font-family: 'Courier New',monospace;
    }
    .lec-new-btn {
        background: rgba(245,124,0,0.1); color: #f57c00;
        border: 1.5px solid rgba(245,124,0,0.35); border-radius: 2px;
        padding: 4px 12px; font-size: .72rem; font-weight: 800;
        cursor: pointer; font-family: inherit; transition: all .16s;
    }
    .lec-new-btn:hover { background: rgba(245,124,0,0.18); }
    .lec-search-wrap { flex-shrink:0; padding:10px 10px 6px; min-width:unset!important; }
    .lec-search-wrap input { font-size:.76rem!important; }
    .lec-search-clear { position:absolute; left:8px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#6b7280; font-size:1rem; line-height:1; padding:2px; }
    .lec-list { 
        flex: 1; 
        overflow-y: auto; 
        padding: 6px 8px 10px;
        /* ADD: */
        min-height: 0;  /* critical for flex children to scroll */
    }    
    .lec-list::-webkit-scrollbar { width:4px; }
    .lec-list::-webkit-scrollbar-thumb { background:#d0d3d8; border-radius:2px; }

    /* ── List row ── */
    .lec-row {
        display:flex; align-items:center; gap:9px;
        padding:9px 10px; border-radius:3px; margin-bottom:3px;
        cursor:pointer; border:1.5px solid transparent;
        transition:background .13s, border-color .13s;
    }
    .lec-row:hover  { background:rgba(8,101,168,0.05); border-color:rgba(8,101,168,0.12); }
    .lec-row.active { background:rgba(245,124,0,0.09); border-color:rgba(245,124,0,0.35); border-right:3px solid #f57c00; }
    .lec-avatar {
        width:36px; height:36px; border-radius:3px; flex-shrink:0;
        overflow:hidden; background:linear-gradient(135deg,#0865a8,#1a84d4);
        display:flex; align-items:center; justify-content:center;
        border:1.5px solid rgba(8,101,168,0.25);
    }
    .lec-avatar img  { width:100%; height:100%; object-fit:cover; }
    .lec-avatar span { color:#bfdbfe; font-weight:900; font-size:.65rem; }
    .lec-row-info  { overflow:hidden; flex:1; }
    .lec-row-name  { color:#0a0a0a; font-size:.76rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .lec-row-spec  { color:#6b7280; font-size:.64rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:1px; }
    .lec-row-id    { background:#f0f1f2; color:#6b7280; font-size:.6rem; padding:2px 7px; border-radius:2px; flex-shrink:0; font-weight:700; font-family:'Courier New',monospace; }

    /* ── Form area ── */
    .lec-form-wrap { flex:1; min-width:0; display:flex; flex-direction:column; gap:12px; }

    .lec-notif {
        display:flex; align-items:center; gap:10px;
        padding:11px 16px; border-radius:3px;
        font-size:.8rem; font-weight:700;
        animation:lec-notif-in .3s cubic-bezier(.34,1.56,.64,1);
        border-right:4px solid;
    }
    .lec-notif-success { background:#f0fdf4; border-color:#16a34a; color:#15803d; }
    .lec-notif-error   { background:#fef2f2; border-color:#dc2626; color:#dc2626; }
    .lec-notif-info    { background:rgba(8,101,168,0.06); border-color:#0865a8; color:#0865a8; }

    .lec-form-card { overflow:visible!important; }

    .lec-form-hdr {
        background:#044478;
        padding:clamp(16px,2.5vw,22px) clamp(18px,3vw,28px);
        display:flex; align-items:flex-start;
        justify-content:space-between; gap:12px; flex-wrap:wrap;
        position:relative; overflow:hidden; border-radius:3px 3px 0 0;
    }
    .lec-form-hdr::before {
        content:''; position:absolute; inset:0;
        background-image: linear-gradient(rgba(245,124,0,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,0.07) 1px,transparent 1px);
        background-size:36px 36px; pointer-events:none;
    }
    .lec-form-title { font-size:clamp(15px,2vw,19px); font-weight:900; color:#ffffff; margin:0; position:relative; z-index:1; }
    .lec-form-sub   { font-size:.74rem; color:rgba(255,255,255,.45); margin:4px 0 0; position:relative; z-index:1; }
    .lec-stat-pill  { display:inline-flex; align-items:center; padding:5px 14px; border-radius:2px; background:rgba(255,255,255,0.08); border:1.5px solid rgba(255,255,255,0.15); color:rgba(255,255,255,.75); font-size:.72rem; font-weight:700; position:relative; z-index:1; }

    .lec-form-body { padding:clamp(16px,2.5vw,26px); }
    .lec-top-row   { display:flex; gap:clamp(14px,2.5vw,24px); margin-bottom:22px; align-items:flex-start; flex-wrap:wrap; }
    .lec-photo-col { flex-shrink:0; display:flex; flex-direction:column; gap:8px; }

    /* ── Photo zone ── */
    .lec-photo-zone {
        width:140px; height:160px; border-radius:3px;
        border:2px dashed #d0d3d8; background:#f8f9fa;
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        cursor:pointer; overflow:hidden; position:relative;
        transition:border-color .18s, background .18s;
    }
    .lec-photo-zone:hover { border-color:#f57c00; background:rgba(245,124,0,0.04); }
    .lec-photo-zone.over  { border-color:#f57c00; background:rgba(245,124,0,0.07); }
    .lec-photo-img { width:100%; height:100%; object-fit:cover; position:absolute; inset:0; }
    .lec-photo-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.52); display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
    .lec-photo-zone:hover .lec-photo-overlay { opacity:1; }
    .lec-photo-overlay-txt { color:#fff; font-size:.72rem; font-weight:700; margin-top:5px; }
    .lec-photo-placeholder { display:flex; flex-direction:column; align-items:center; gap:6px; padding:10px; }
    .lec-photo-icon  { width:48px; height:48px; border-radius:3px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; font-size:1.4rem; }
    .lec-photo-hint  { color:#6b7280; font-size:.68rem; font-weight:600; text-align:center; line-height:1.6; }
    .lec-photo-types { color:#d0d3d8; font-size:.62rem; background:#e2e8f0; padding:2px 10px; border-radius:2px; }
    .lec-remove-photo { background:#fef2f2; color:#dc2626; border:1.5px solid rgba(220,38,38,.3); border-radius:2px; padding:6px 0; font-size:.72rem; font-weight:700; cursor:pointer; width:100%; font-family:inherit; transition:background .14s; }
    .lec-remove-photo:hover { background:#fee2e2; }

    /* ── Fields ── */
    .lec-fields-grid { flex:1; display:grid; grid-template-columns:1fr 1fr; gap:12px 18px; min-width:0; }
    .lec-field { display:flex; flex-direction:column; gap:5px; }
    .lec-label { font-size:.72rem; font-weight:700; color:#374151; }
    .lec-inp {
        border:1.5px solid #d0d3d8; border-radius:3px; padding:9px 12px;
        font-size:.8rem; color:#0a0a0a; width:100%; background:#fff;
        direction:rtl; font-family:inherit;
        transition:border-color .18s, box-shadow .18s; outline:none;
    }
    .lec-inp:focus { border-color:#f57c00; box-shadow:0 0 0 3px rgba(245,124,0,0.1); }
    .lec-inp::placeholder { color:#6b7280; }

    .lec-divider { height:1px; background:#f0f1f2; margin:4px 0 20px; }

    /* ══ RICH TEXT EDITOR ══ */

    .lec-rte-block {
        margin-bottom: 16px;
        border-radius: 3px;
        border: 1.5px solid #d0d3d8;
        overflow: hidden;
        box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        transition: border-color .18s;
    }
    .lec-rte-block:focus-within {
        border-color: #f57c00;
        box-shadow: 0 0 0 3px rgba(245,124,0,0.08);
    }

    .lec-rte-hdr {
        background: #f8f9fa;
        padding: 10px 16px;
        border-bottom: 1.5px solid #e2e8f0;
        display: flex;
        align-items: center;
        gap: 9px;
        flex-wrap: wrap;
    }
    .lec-rte-icon  { font-size: 1.1rem; flex-shrink: 0; }
    .lec-rte-label { font-weight: 800; font-size: .8rem; color: #0a0a0a; }
    .lec-rte-sub   { font-size: .66rem; color: #6b7280; margin-top: 1px; }

    /* ── Toolbar ── */
    .lec-rte-toolbar {
        background: #ffffff;
        border-bottom: 1.5px solid #e2e8f0;
        padding: 6px 10px;
        display: flex;
        align-items: center;
        gap: 3px;
        flex-wrap: wrap;
    }

    .lec-rte-sep {
        width: 1px;
        height: 20px;
        background: #e2e8f0;
        margin: 0 3px;
        flex-shrink: 0;
    }

    /* Toolbar buttons */
    .lec-tb-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 28px;
        border: 1.5px solid transparent;
        border-radius: 3px;
        background: none;
        cursor: pointer;
        font-size: .82rem;
        font-family: inherit;
        color: #374151;
        font-weight: 700;
        transition: all .13s;
        flex-shrink: 0;
        padding: 0;
    }
    .lec-tb-btn:hover  { background: rgba(8,101,168,0.07); border-color: rgba(8,101,168,0.2); color: #0865a8; }
    .lec-tb-btn.active { background: rgba(245,124,0,0.1); border-color: rgba(245,124,0,0.4); color: #f57c00; }
    .lec-tb-btn.bold   { font-weight: 900; font-size: .9rem; }
    .lec-tb-btn.italic { font-style: italic; font-size: .9rem; }
    .lec-tb-btn.under  { text-decoration: underline; }

    /* ── Font family select ── */
    .lec-tb-font-select {
        height: 28px;
        border: 1.5px solid #d0d3d8;
        border-radius: 3px;
        background: #fff;
        font-size: .74rem;
        font-weight: 600;
        color: #0a0a0a;
        padding: 0 4px;
        cursor: pointer;
        outline: none;
        transition: border-color .13s;
        max-width: 120px;
    }
    .lec-tb-font-select:hover { border-color: #0865a8; }
    .lec-tb-font-select:focus { border-color: #f57c00; box-shadow: 0 0 0 2px rgba(245,124,0,0.1); }

    /* ── Font size wrapper ── */
    .lec-tb-size-wrap {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        flex-shrink: 0;
    }
    .lec-tb-size-unit {
        font-size: .62rem;
        color: #6b7280;
        font-weight: 600;
        line-height: 1;
        user-select: none;
    }

    /* Font size select */
    .lec-tb-select {
        height: 28px;
        border: 1.5px solid #d0d3d8;
        border-radius: 3px;
        background: #fff;
        font-size: .78rem;
        font-family: 'Courier New', monospace;
        font-weight: 700;
        color: #0a0a0a;
        padding: 0 4px 0 2px;
        cursor: pointer;
        outline: none;
        transition: border-color .13s;
        text-align: center;
    }
    .lec-tb-size-select {
        width: 58px;
        text-align: center;
        -webkit-appearance: auto;
        appearance: auto;
    }
    .lec-tb-select:hover  { border-color: #0865a8; }
    .lec-tb-select:focus  { border-color: #f57c00; box-shadow: 0 0 0 2px rgba(245,124,0,0.1); }

    /* Color picker wrapper */
    .lec-tb-color-wrap {
        position: relative;
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
    }
    .lec-tb-color-btn {
        width: 34px;
        height: 28px;
        border: 1.5px solid #d0d3d8;
        border-radius: 3px;
        background: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 3px 5px;
        gap: 1px;
        transition: border-color .13s;
        position: relative;
        overflow: hidden;
    }
    .lec-tb-color-btn:hover { border-color: #f57c00; }
    .lec-tb-color-btn .color-letter {
        font-size: .85rem;
        font-weight: 900;
        line-height: 1;
    }
    .lec-tb-color-btn .color-bar {
        height: 3px;
        width: 18px;
        border-radius: 1px;
    }
    .lec-tb-color-input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
        border: none;
        padding: 0;
    }

    /* URL button & popover */
    .lec-tb-url-wrap {
        position: relative;
        flex-shrink: 0;
    }
    .lec-url-popover {
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        background: #fff;
        border: 1.5px solid #d0d3d8;
        border-radius: 3px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        padding: 10px 12px;
        display: flex;
        gap: 6px;
        align-items: center;
        z-index: 100;
        min-width: 280px;
        animation: lec-notif-in .2s ease;
    }
    .lec-url-popover input {
        flex: 1;
        border: 1.5px solid #d0d3d8;
        border-radius: 3px;
        padding: 6px 10px;
        font-size: .76rem;
        font-family: inherit;
        outline: none;
        direction: ltr;
        transition: border-color .15s;
    }
    .lec-url-popover input:focus { border-color: #f57c00; }
    .lec-url-popover-ok {
        background: #0865a8; color: #fff;
        border: none; border-radius: 3px;
        padding: 6px 12px; font-size: .72rem;
        font-weight: 800; cursor: pointer;
        font-family: inherit; transition: background .13s;
        white-space: nowrap;
    }
    .lec-url-popover-ok:hover { background: #044478; }
    .lec-url-popover-cancel {
        background: #f0f1f2; color: #374151;
        border: none; border-radius: 3px;
        padding: 6px 10px; font-size: .72rem;
        font-weight: 700; cursor: pointer;
        font-family: inherit; transition: background .13s;
    }
    .lec-url-popover-cancel:hover { background: #e2e8f0; }

    /* ── Editable area ── */
    .lec-rte-editor {
        min-height: 120px;
        padding: 13px 16px;
        font-size: .8rem;
        color: #0a0a0a;
        font-family: inherit;
        line-height: 1.9;
        direction: rtl;
        background: #fff;
        outline: none;
        transition: background .14s;
        word-break: break-word;
    }
    .lec-rte-editor:focus { background: #fffdf9; }
    .lec-rte-editor:empty:before {
        content: attr(data-placeholder);
        color: #6b7280;
        pointer-events: none;
        white-space: pre-line;
    }
    .lec-rte-editor a { color: #0865a8; text-decoration: underline; }

    /* ── Action buttons ── */
    .lec-actions { display:flex; gap:9px; margin-top:24px; padding-top:18px; border-top:2px solid #f0f1f2; flex-wrap:wrap; align-items:center; }
    .lec-act-btn {
        display:inline-flex; align-items:center; gap:6px;
        padding:9px 20px; border-radius:3px;
        font-family:inherit; font-size:.8rem; font-weight:800;
        cursor:pointer; border:none; transition:all .2s cubic-bezier(.4,0,.2,1); white-space:nowrap;
    }
    .lec-act-btn:hover  { transform:translateY(-2px); }
    .lec-act-btn:active { transform:translateY(0); }
    .lec-act-btn.save   { background:#16a34a; color:#fff; box-shadow:0 3px 12px rgba(22,163,74,0.3); }
    .lec-act-btn.save:hover   { background:#15803d; box-shadow:0 5px 16px rgba(22,163,74,0.4); }
    .lec-act-btn.new    { background:#0865a8; color:#fff; box-shadow:0 3px 12px rgba(8,101,168,0.3); }
    .lec-act-btn.new:hover    { background:#044478; box-shadow:0 5px 16px rgba(8,101,168,0.4); }
    .lec-act-btn.reset  { background:#f57c00; color:#fff; box-shadow:0 3px 12px rgba(245,124,0,0.3); }
    .lec-act-btn.reset:hover  { background:#bf5200; box-shadow:0 5px 16px rgba(245,124,0,0.4); }
    .lec-act-btn.delete { background:#dc2626; color:#fff; box-shadow:0 3px 12px rgba(220,38,38,0.3); }
    .lec-act-btn.delete:hover { background:#b91c1c; box-shadow:0 5px 16px rgba(220,38,38,0.4); }
    .lec-delete-confirm { display:flex; align-items:center; gap:10px; flex-wrap:wrap; background:#fef2f2; border:1.5px solid rgba(220,38,38,.3); border-radius:3px; padding:9px 14px; border-right:4px solid #dc2626; }
    .lec-delete-warn    { font-size:.78rem; color:#dc2626; font-weight:700; }

    /* ══ RESPONSIVE ══ */

    @media(min-width:2000px){
        .lec-panel        { width: 360px; }
        .lec-form-body    { padding: 36px; }
        .lec-inp, .lec-rte-editor { font-size: .9rem; }
        .lec-form-title   { font-size: 1.3rem; }
        .lec-fields-grid  { grid-template-columns: 1fr 1fr 1fr; }
    }

    @media(min-width:1600px) and (max-width:1999px){
        .lec-panel        { width: 320px; }
        .lec-fields-grid  { grid-template-columns: 1fr 1fr 1fr; }
    }

    @media(max-width:1100px){
        .lec-panel { width: clamp(190px, 26vw, 250px); }
    }

    @media(max-width:900px){
        .lec-layout       { flex-direction: column; }
        .lec-panel        { width: 100% !important; height: auto !important; max-height: none !important; position: static !important; }
        .lec-list         { display: flex; flex-direction: row; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; max-height: 80px; gap: 6px; padding: 6px 8px 10px; }
        .lec-list::-webkit-scrollbar         { height: 4px; width: unset; }
        .lec-list::-webkit-scrollbar-thumb   { background: rgba(245,124,0,0.35); border-radius: 2px; }
        .lec-row          { flex: 0 0 auto; width: clamp(160px, 44vw, 220px); margin-bottom: 0; }
        .lec-row-spec     { display: none; }
        .lec-form-wrap    { width: 100%; }
        .lec-top-row      { flex-direction: column; }
        .lec-photo-col    { width: 100%; }
        .lec-photo-zone   { width: 100%; height: 120px; }
        .lec-fields-grid  { grid-template-columns: 1fr 1fr; }
    }

    @media(max-width:640px){
        .lec-panel-hdr    { flex-wrap: wrap; gap: 6px; }
        .lec-search-wrap  { padding: 8px 10px 4px; }
        .lec-list         { max-height: 74px; }
        .lec-row          { width: clamp(150px, 55vw, 200px); }
        .lec-fields-grid  { grid-template-columns: 1fr; }
        .lec-form-hdr     { flex-direction: column; gap: 8px; }
        .lec-stat-pill    { align-self: flex-start; }
        .lec-form-body    { padding: clamp(12px, 3vw, 18px); }
        .lec-actions      { flex-direction: column; align-items: stretch; }
        .lec-act-btn      { width: 100%; justify-content: center; }
        .lec-delete-confirm { flex-direction: column; align-items: stretch; }
        .lec-delete-confirm .lec-act-btn,
        .lec-delete-confirm .adm-fclear { width: 100%; justify-content: center; text-align: center; }
        .lec-rte-toolbar  { gap: 2px; padding: 5px 8px; }
        .lec-tb-btn       { width: 26px; height: 26px; }
        .lec-tb-size-select { width: 46px; }
        .lec-url-popover  { min-width: 220px; right: auto; left: 0; }
        .lec-tb-font-select { max-width: 90px; font-size: .68rem; }
    }

    @media(max-width:400px){
        .lec-panel-hdr    { padding: 10px; }
        .lec-new-btn      { padding: 4px 10px; font-size: .68rem; }
        .lec-count-badge  { font-size: .6rem; }
        .lec-row          { width: clamp(140px, 60vw, 180px); }
        .lec-form-body    { padding: 10px; }
        .lec-inp          { padding: 8px 10px; font-size: .76rem; }
        .lec-rte-editor   { padding: 10px 12px; font-size: .76rem; }
        .lec-photo-zone   { height: 100px; }
        .lec-act-btn      { padding: 8px 14px; font-size: .76rem; }
        .lec-tb-size-select { width: 40px; font-size: .7rem; }
        .lec-tb-font-select { max-width: 80px; }
    }

/* ═══ END ═══ */

// ──────────────────────────────────────────────────────────────────────────────
// PASTE everything between ═══ START ═══ and ═══ END ═══
// into ADMIN_STYLES in src/components/admin/styles.js
// (right before the closing backtick of the template literal)
// ──────────────────────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────────────────
// PASTE everything between ═══ START ═══ and ═══ END ═══
// into ADMIN_STYLES in src/components/admin/styles.js
// (right before the closing backtick of the template literal)
// ──────────────────────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────────────────────
// PASTE everything between ═══ START ═══ and ═══ END ═══
// into ADMIN_STYLES in src/components/admin/styles.js
// (right before the closing backtick of the template literal)
// ──────────────────────────────────────────────────────────────────────────────

// ═══ START ═══

    @keyframes bk-notif-in { from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);} }

    /* ══ BOOKS TAB ══ */

    /* ── Layout ── */
    .bk-layout {
        display: flex;
        gap: clamp(10px,1.5vw,20px);
        align-items: flex-start;
    }

    /* ── Left panel ── */
    .bk-panel {
        width: clamp(200px,24vw,270px);
        flex-shrink: 0;
        background: #ffffff;
        border-radius: 3px;
        border: 1.5px solid #d0d3d8;
        box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        display: flex;
        flex-direction: column;
        height: 100vh;
        max-height: 100vh;
        position: sticky;
        top: 0;
        overflow: hidden;
    }

    /* ── Sub-page tabs (books / types) ── */
    .bk-subtabs {
        display: flex;
        gap: 5px;
        padding: 10px 10px 4px;
        flex-shrink: 0;
        border-bottom: 1.5px solid #f0f1f2;
    }
    .bk-subtab {
        flex: 1;
        padding: 7px 6px;
        border-radius: 3px;
        font-size: clamp(.64rem,1.1vw,.72rem);
        font-weight: 800;
        cursor: pointer;
        border: 1.5px solid rgba(245,124,0,0.2);
        color: #6b7280;
        background: transparent;
        text-align: center;
        font-family: inherit;
        transition: all .15s;
    }
    .bk-subtab:hover:not(.active) { background: rgba(8,101,168,0.05); color: #374151; border-color: rgba(8,101,168,0.2); }
    .bk-subtab.active { background: rgba(245,124,0,0.12); color: #f57c00; border-color: rgba(245,124,0,0.45); }

    /* ── Panel header ── */
    .bk-panel-hdr {
        display: flex; align-items: center; justify-content: space-between;
        padding: 10px 12px 8px; border-bottom: 1.5px solid #f0f1f2;
        flex-shrink: 0; gap: 7px;
    }
    .bk-count-badge {
        background: rgba(8,101,168,0.1); color: #0865a8;
        border: 1.5px solid rgba(8,101,168,0.25); border-radius: 2px;
        padding: 1px 9px; font-size: .66rem; font-weight: 900;
        font-family: 'Courier New', monospace;
    }
    .bk-new-btn {
        background: rgba(245,124,0,0.1); color: #f57c00;
        border: 1.5px solid rgba(245,124,0,0.35); border-radius: 2px;
        padding: 4px 12px; font-size: .7rem; font-weight: 800;
        cursor: pointer; font-family: inherit; transition: all .16s;
    }
    .bk-new-btn:hover { background: rgba(245,124,0,0.18); }

    /* ── Search wrap ── */
    .bk-search-wrap { flex-shrink: 0; padding: 8px 10px 5px; min-width: unset !important; }
    .bk-search-wrap input { font-size: .74rem !important; }
    .bk-search-clear { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #6b7280; font-size: 1rem; line-height: 1; padding: 2px; }

    /* ── List ── */
    .bk-list {
    flex: 0 1 auto;        /* instead of flex: 1 */
    overflow-y: auto;
    padding: 5px 7px 10px;
    max-height: 100%;      /* prevents overflow */
}    .bk-list::-webkit-scrollbar { width: 4px; }
    .bk-list::-webkit-scrollbar-thumb { background: #d0d3d8; border-radius: 2px; }

    /* ── List row ── */
    .bk-row {
        display: flex; align-items: center; gap: 9px;
        padding: 9px 10px; border-radius: 3px; margin-bottom: 2px;
        cursor: pointer; border: 1.5px solid transparent;
        transition: background .13s, border-color .13s;
    }
    .bk-row:hover  { background: rgba(8,101,168,0.05); border-color: rgba(8,101,168,0.12); }
    .bk-row.active { background: rgba(245,124,0,0.09); border-color: rgba(245,124,0,0.35); border-right: 3px solid #f57c00; }
    .bk-row-avatar {
        width: 36px; height: 36px; border-radius: 3px; flex-shrink: 0;
        overflow: hidden; background: linear-gradient(135deg,#0865a8,#1a84d4);
        display: flex; align-items: center; justify-content: center;
        border: 1.5px solid rgba(8,101,168,0.25); font-size: 1.1rem;
    }
    .bk-row-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .bk-row-info { overflow: hidden; flex: 1; }
    .bk-row-name { color: #0a0a0a; font-size: .74rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .bk-row-sub  { color: #6b7280; font-size: .62rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
    .bk-row-id   { background: #f0f1f2; color: #6b7280; font-size: .58rem; padding: 2px 6px; border-radius: 2px; flex-shrink: 0; font-weight: 700; font-family: 'Courier New', monospace; }

    /* ── Form wrap ── */
    .bk-form-wrap { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }

    /* ── Notification ── */
    .bk-notif {
        display: flex; align-items: center; gap: 10px;
        padding: 11px 16px; border-radius: 3px;
        font-size: .8rem; font-weight: 700;
        animation: bk-notif-in .3s cubic-bezier(.34,1.56,.64,1);
        border-right: 4px solid;
    }
    .bk-notif-success { background: #f0fdf4; border-color: #16a34a; color: #15803d; }
    .bk-notif-error   { background: #fef2f2; border-color: #dc2626; color: #dc2626; }
    .bk-notif-info    { background: rgba(8,101,168,0.06); border-color: #0865a8; color: #0865a8; }

    /* ── Form card ── */
    .bk-form-card { overflow: visible !important; }

    .bk-form-hdr {
        background: #044478;
        padding: clamp(14px,2.5vw,22px) clamp(16px,3vw,28px);
        display: flex; align-items: flex-start;
        justify-content: space-between; gap: 12px; flex-wrap: wrap;
        position: relative; overflow: hidden; border-radius: 3px 3px 0 0;
    }
    .bk-form-hdr::before {
        content: ''; position: absolute; inset: 0;
        background-image: linear-gradient(rgba(245,124,0,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,0.07) 1px,transparent 1px);
        background-size: 36px 36px; pointer-events: none;
    }
    .bk-form-title { font-size: clamp(14px,2vw,19px); font-weight: 900; color: #ffffff; margin: 0; position: relative; z-index: 1; }
    .bk-form-sub   { font-size: clamp(.64rem,1.1vw,.74rem); color: rgba(255,255,255,.4); margin: 4px 0 0; position: relative; z-index: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
    .bk-stat-pill  { display: inline-flex; align-items: center; padding: 5px 14px; border-radius: 2px; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); color: rgba(255,255,255,.75); font-size: .72rem; font-weight: 700; position: relative; z-index: 1; flex-shrink: 0; }

    .bk-form-body { padding: clamp(14px,2.5vw,24px); }

    /* ── Top row (cover + fields) ── */
    .bk-top-row   { display: flex; gap: clamp(12px,2.5vw,22px); margin-bottom: 20px; align-items: flex-start; flex-wrap: wrap; }
    .bk-cover-col { flex-shrink: 0; display: flex; flex-direction: column; gap: 7px; }

    /* ── Cover zone ── */
    .bk-cover-zone {
        width: clamp(110px,14vw,150px);
        height: clamp(130px,17vw,195px);
        border-radius: 3px; border: 2px dashed #d0d3d8; background: #f8f9fa;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        cursor: pointer; overflow: hidden; position: relative;
        transition: border-color .18s, background .18s;
    }
    .bk-cover-zone:hover, .bk-cover-zone.over { border-color: #f57c00; background: rgba(245,124,0,0.04); }
    .bk-cover-img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
    .bk-cover-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.52); display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity .2s; }
    .bk-cover-zone:hover .bk-cover-overlay { opacity: 1; }
    .bk-cover-overlay-txt { color: #fff; font-size: .7rem; font-weight: 700; margin-top: 5px; }
    .bk-cover-placeholder { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px; }
    .bk-cover-icon  { width: 44px; height: 52px; border-radius: 3px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; }
    .bk-cover-hint  { color: #6b7280; font-size: clamp(.6rem,1vw,.68rem); font-weight: 600; text-align: center; line-height: 1.6; }
    .bk-cover-types { color: #d0d3d8; font-size: .6rem; background: #e2e8f0; padding: 2px 10px; border-radius: 2px; }
    .bk-remove-cover { background: #fef2f2; color: #dc2626; border: 1.5px solid rgba(220,38,38,.3); border-radius: 2px; padding: 6px 0; font-size: .7rem; font-weight: 700; cursor: pointer; width: 100%; font-family: inherit; transition: background .14s; }
    .bk-remove-cover:hover { background: #fee2e2; }

    /* ── Fields grid ── */
    .bk-fields-grid { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 11px 16px; min-width: 0; }
    .bk-field { display: flex; flex-direction: column; gap: 5px; }
    .bk-label { font-size: .72rem; font-weight: 700; color: #374151; }
    .bk-inp {
        border: 1.5px solid #d0d3d8; border-radius: 3px;
        padding: clamp(7px,1.1vw,10px) 12px;
        font-size: clamp(.74rem,1.3vw,.8rem); color: #0a0a0a;
        width: 100%; background: #fff; direction: rtl;
        font-family: inherit; transition: border .18s, box-shadow .18s; outline: none;
    }
    .bk-inp:focus { border-color: #f57c00; box-shadow: 0 0 0 3px rgba(245,124,0,0.1); }
    .bk-inp::placeholder { color: #6b7280; }
    .bk-select { cursor: pointer; }

    /* ── Divider ── */
    .bk-divider { height: 1px; background: #f0f1f2; margin: 4px 0 18px; }

    /* ── Textarea block ── */
    .bk-ta-block { margin-bottom: 14px; border-radius: 3px; border: 1.5px solid #d0d3d8; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
    .bk-ta-hdr   { background: #f8f9fa; padding: 9px 15px; border-bottom: 1.5px solid #e2e8f0; display: flex; align-items: center; gap: 8px; }
    .bk-ta-icon  { font-size: 1rem; flex-shrink: 0; }
    .bk-ta-label { font-weight: 800; font-size: clamp(.74rem,1.3vw,.8rem); color: #0a0a0a; }
    .bk-ta-sub   { font-size: .64rem; color: #6b7280; margin-top: 1px; }
    .bk-ta-count { background: #e2e8f0; border-radius: 2px; padding: 2px 10px; font-size: .64rem; color: #374151; font-weight: 700; flex-shrink: 0; }
    .bk-ta {
        width: 100%; border: none; outline: none; resize: vertical;
        padding: 12px 15px; font-size: clamp(.74rem,1.3vw,.8rem);
        color: #0a0a0a; font-family: inherit; line-height: 1.9;
        direction: rtl; background: #fff; display: block; transition: background .14s;
    }
    .bk-ta:focus { background: #fffdf9; }
    .bk-ta::placeholder { color: #6b7280; }

    /* ── Actions ── */
    .bk-actions { display: flex; gap: 8px; margin-top: 22px; padding-top: 16px; border-top: 2px solid #f0f1f2; flex-wrap: wrap; align-items: center; }
    .bk-act-btn {
        display: inline-flex; align-items: center; gap: 6px;
        padding: clamp(7px,1.2vw,9px) clamp(14px,2vw,20px);
        border-radius: 3px; font-family: inherit;
        font-size: clamp(.74rem,1.3vw,.8rem); font-weight: 800;
        cursor: pointer; border: none;
        transition: all .2s cubic-bezier(.4,0,.2,1); white-space: nowrap;
    }
    .bk-act-btn:hover  { transform: translateY(-2px); }
    .bk-act-btn:active { transform: translateY(0); }
    .bk-act-btn.save   { background: #16a34a; color: #fff; box-shadow: 0 3px 12px rgba(22,163,74,0.3); }
    .bk-act-btn.save:hover   { background: #15803d; box-shadow: 0 5px 16px rgba(22,163,74,0.4); }
    .bk-act-btn.new    { background: #0865a8; color: #fff; box-shadow: 0 3px 12px rgba(8,101,168,0.3); }
    .bk-act-btn.new:hover    { background: #044478; box-shadow: 0 5px 16px rgba(8,101,168,0.4); }
    .bk-act-btn.reset  { background: #f57c00; color: #fff; box-shadow: 0 3px 12px rgba(245,124,0,0.3); }
    .bk-act-btn.reset:hover  { background: #bf5200; box-shadow: 0 5px 16px rgba(245,124,0,0.4); }
    .bk-act-btn.delete { background: #dc2626; color: #fff; box-shadow: 0 3px 12px rgba(220,38,38,0.3); }
    .bk-act-btn.delete:hover { background: #b91c1c; box-shadow: 0 5px 16px rgba(220,38,38,0.4); }
    .bk-delete-confirm { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; background: #fef2f2; border: 1.5px solid rgba(220,38,38,.3); border-radius: 3px; padding: 8px 13px; border-right: 4px solid #dc2626; }
    .bk-delete-warn { font-size: .76rem; color: #dc2626; font-weight: 700; }

    /* ══ RESPONSIVE — 300px → 2000px+ ══ */

    /* ≥2000px */
    @media(min-width:2000px){
        .bk-panel         { width: 340px; }
        .bk-fields-grid   { grid-template-columns: 1fr 1fr 1fr; }
        .bk-form-body     { padding: 34px; }
        .bk-inp, .bk-ta   { font-size: .88rem; }
        .bk-form-title    { font-size: 1.25rem; }
        .bk-cover-zone    { width: 170px; height: 220px; }
    }

    /* 1600px – 1999px */
    @media(min-width:1600px) and (max-width:1999px){
        .bk-panel         { width: 300px; }
        .bk-fields-grid   { grid-template-columns: 1fr 1fr 1fr; }
        .bk-cover-zone    { width: 155px; height: 205px; }
    }

    /* 1200px – 1599px — default desktop, nothing extra */

    /* ≤1100px */
    @media(max-width:1100px){
        .bk-panel { width: clamp(180px,24vw,240px); }
    }

    /* ≤900px — panel becomes horizontal strip */
    @media(max-width:900px){
        .bk-layout         { flex-direction: column; }
        .bk-panel          { width: 100% !important; height: auto !important; max-height: none !important; position: static !important; }
        .bk-list           { display: flex; flex-direction: row; flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; max-height: 80px; gap: 6px; padding: 6px 8px 10px; }
        .bk-list::-webkit-scrollbar        { height: 4px; width: unset; }
        .bk-list::-webkit-scrollbar-thumb  { background: rgba(245,124,0,0.35); border-radius: 2px; }
        .bk-row            { flex: 0 0 auto; width: clamp(150px,44vw,210px); margin-bottom: 0; }
        .bk-row-sub        { display: none; }
        .bk-top-row        { flex-direction: column; }
        .bk-cover-col      { width: 100%; }
        .bk-cover-zone     { width: 100%; height: 120px; flex-direction: row; gap: 16px; padding: 12px; }
        .bk-cover-placeholder { flex-direction: row; gap: 12px; }
        .bk-fields-grid    { grid-template-columns: 1fr 1fr; }
    }

    /* ≤640px */
    @media(max-width:640px){
        .bk-subtabs        { padding: 8px 8px 4px; gap: 4px; }
        .bk-panel-hdr      { padding: 8px 10px 6px; flex-wrap: wrap; gap: 5px; }
        .bk-search-wrap    { padding: 7px 8px 4px; }
        .bk-list           { max-height: 74px; }
        .bk-row            { width: clamp(140px,54vw,200px); }
        .bk-fields-grid    { grid-template-columns: 1fr; }
        .bk-form-hdr       { flex-direction: column; gap: 8px; padding: 14px 16px; }
        .bk-stat-pill      { align-self: flex-start; }
        .bk-form-body      { padding: clamp(12px,3vw,18px); }
        .bk-actions        { flex-direction: column; align-items: stretch; }
        .bk-act-btn        { width: 100%; justify-content: center; }
        .bk-delete-confirm { flex-direction: column; align-items: stretch; }
        .bk-delete-confirm .bk-act-btn,
        .bk-delete-confirm .adm-fclear { width: 100%; justify-content: center; text-align: center; }
        .bk-ta-hdr         { flex-wrap: wrap; }
        .bk-ta-count       { margin-right: auto; }
    }

    /* ≤480px */
    @media(max-width:480px){
        .bk-layout         { gap: 8px; }
        .bk-row            { width: clamp(130px,60vw,185px); }
        .bk-list           { max-height: 70px; }
        .bk-cover-zone     { height: 100px; }
        .bk-form-body      { padding: 10px 11px; }
        .bk-inp            { padding: 8px 10px; font-size: .76rem; }
        .bk-ta             { padding: 10px 12px; font-size: .76rem; }
        .bk-act-btn        { padding: 8px 14px; font-size: .76rem; }
        .bk-subtab         { font-size: .62rem; padding: 6px 4px; }
    }

    /* ≤380px (very small phones) */
    @media(max-width:380px){
        .bk-panel-hdr      { padding: 6px 8px; }
        .bk-new-btn        { padding: 3px 8px; font-size: .64rem; }
        .bk-count-badge    { font-size: .58rem; }
        .bk-row            { width: clamp(120px,65vw,170px); }
        .bk-list           { max-height: 66px; }
        .bk-form-hdr       { padding: 11px 13px; }
        .bk-form-title     { font-size: .9rem; }
        .bk-form-body      { padding: 9px; }
        .bk-fields-grid    { gap: 8px 10px; }
        .bk-inp            { padding: 7px 9px; font-size: .74rem; }
        .bk-ta             { padding: 9px 10px; font-size: .74rem; }
        .bk-act-btn        { padding: 7px 12px; font-size: .74rem; }
    }

// ═══ END ═══


// ─────────────────────────────────────────────────────────────────────────────
// PASTE this entire block into ADMIN_STYLES in src/components/admin/styles.js
// just before the closing backtick of the template literal.
// ─────────────────────────────────────────────────────────────────────────────

// ═══ PLANWORK TAB ═══

    /* sidebar nav accent */
    .adm-nav-btn.pw-nav::before   { background: #7c3aed; }
    .adm-nav-btn.pw-nav.active    { background: rgba(124,58,237,0.15); border-color: rgba(124,58,237,0.35); }
    .adm-nav-badge.pw             { background: #7c3aed; }

    /* page-hero variant */
    .adm-page-hero.pw-hero        { background: linear-gradient(135deg,#1e1b4b 0%,#312e81 55%,#3730a3 100%); }
    .adm-hero-accent.pw           { background: linear-gradient(to bottom,#7c3aed,#a78bfa); }
    .adm-hero-tag.pw              { background: #7c3aed; }
    .adm-hero-title span.pw       { color: #c4b5fd; }
    .adm-section-hdr.pw           { border-bottom-color: #7c3aed; }
    .adm-section-tag.pw           { background: #7c3aed; }
    .adm-section-title span.pw    { color: #7c3aed; }
    .adm-card.pw::before          { background: linear-gradient(to left,#7c3aed,#0865a8); }

    /* ── Left panel override ── */
    .pw-left-panel { width: clamp(230px,27vw,310px); }
    .pw-records-list { max-height: 32vh; overflow-y: auto; }

    /* ── Parent selector ── */
    .pw-parent-field { grid-column: 1 / -1; }

    .pw-parent-wrap {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        flex-wrap: nowrap;
    }
    .pw-parent-id-sel {
        width: 80px !important;
        flex: 0 0 80px;
        font-family: 'Courier New', monospace;
        font-weight: 700;
        font-size: .76rem !important;
        text-align: center;
        padding: 9px 6px !important;
    }
    .pw-parent-clear {
        flex-shrink: 0;
        align-self: flex-end;
        padding: 8px 10px;
        border-radius: 3px;
        border: 1.5px solid rgba(220,38,38,.3);
        background: #fef2f2;
        color: #dc2626;
        font-size: .76rem;
        font-weight: 700;
        cursor: pointer;
        transition: background .14s;
        white-space: nowrap;
        height: 38px;
        display: flex;
        align-items: center;
    }
    .pw-parent-clear:hover { background: #fee2e2; }

    /* ── Tree viewer ── */
    .pw-tree-panel {
        flex-shrink: 0;
        border-top: 2px solid #f0f1f2;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-height: 0;
    }
    .pw-tree-header {
        padding: 8px 12px;
        font-size: .78rem;
        font-weight: 900;
        color: #0a0a0a;
        background: #f8f9fa;
        border-bottom: 1.5px solid #e2e8f0;
        flex-shrink: 0;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        flex-wrap: wrap;
    }
    .pw-tree-selected-badge {
        font-size: .62rem;
        font-weight: 700;
        color: #7c3aed;
        background: rgba(124,58,237,0.08);
        border: 1px solid rgba(124,58,237,0.25);
        border-radius: 2px;
        padding: 2px 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 140px;
    }
    .pw-tree-scroll {
        overflow-y: auto;
        flex: 1;
        padding: 4px 2px 6px;
        min-height: 120px;
        max-height: 38vh;
        background: #fff;
    }
    .pw-tree-scroll::-webkit-scrollbar { width: 5px; }
    .pw-tree-scroll::-webkit-scrollbar-thumb { background: #c8cdd4; border-radius: 2px; }

    /* tree footer (shows selected parent + clear) */
    .pw-tree-footer {
        flex-shrink: 0;
        padding: 8px 12px;
        background: rgba(124,58,237,0.06);
        border-top: 1.5px solid rgba(124,58,237,0.2);
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        direction: rtl;
    }
    .pw-tree-footer-name {
        flex: 1;
        font-size: .72rem;
        font-weight: 700;
        color: #7c3aed;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .pw-tree-footer-clear {
        padding: 3px 10px;
        border-radius: 2px;
        border: 1.5px solid rgba(124,58,237,0.3);
        background: rgba(124,58,237,0.08);
        color: #7c3aed;
        font-size: .68rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        transition: background .13s;
        white-space: nowrap;
    }
    .pw-tree-footer-clear:hover { background: rgba(124,58,237,0.16); }

    /* base row */
    .pw-tree-row {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        padding: 4px 10px 4px 4px;
        cursor: pointer;
        direction: rtl;
        transition: background .11s;
        border-right: 3px solid transparent;
        text-align: right;
        line-height: 1.55;
        user-select: none;
    }
    .pw-tree-row:hover { background: rgba(8,101,168,0.05); }
    .pw-tree-row.active { background: rgba(124,58,237,0.09); border-right-color: #7c3aed; }

    /* depth 0 — root */
    .pw-tree-d0 { font-size: .78rem; font-weight: 900; color: #0a0a0a; background: #f0f4f8; border-bottom: 1px solid #d0d3d8; }
    .pw-tree-d0:hover { background: #e4eaf2; }
    .pw-tree-d0.active { background: #dce8f4; border-right-color: #0865a8; }
    /* depth 1 — parent */
    .pw-tree-d1 { font-size: .75rem; font-weight: 800; color: #1a3a5c; background: #f7f9fc; border-bottom: 1px solid #eaecef; }
    .pw-tree-d1:hover { background: #edf2f9; }
    .pw-tree-d1.active { background: #dce8f4; border-right-color: #0865a8; }
    /* depth 2 — sub */
    .pw-tree-d2 { font-size: .73rem; font-weight: 700; color: #374151; }
    .pw-tree-d2:hover { background: rgba(8,101,168,0.05); }
    .pw-tree-d2.active { background: rgba(124,58,237,0.09); border-right-color: #7c3aed; }
    /* depth 3 — leaf */
    .pw-tree-d3 { font-size: .7rem; font-weight: 400; color: #555f6e; }
    .pw-tree-d3:hover { background: rgba(245,124,0,0.04); }
    .pw-tree-d3.active { background: rgba(245,124,0,0.09); border-right-color: #f57c00; color: #bf5200; font-weight: 600; }

    .pw-tree-children { border-right: 1.5px solid #e2e8f0; margin-right: 18px; }
    .pw-tree-children.pw-children-d0 { border-right-color: #c8d8ea; }
    .pw-tree-children.pw-children-d1 { border-right-color: #dde6ef; }
    .pw-tree-children.pw-children-d2 { border-right-color: #eaeef2; }
    .pw-tree-toggle { flex-shrink:0; width:16px; font-size:.72rem; color:#6b7280; text-align:center; margin-top:1px; }
    .pw-tree-label  { flex: 1; }

    /* ── Files section ── */
    .pw-files-section { background:#f8f9fa; border:1.5px solid #d0d3d8; border-radius:3px; overflow:hidden; margin-top:4px; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
    .pw-files-hdr { display:flex; align-items:center; gap:10px; padding:12px 16px; background:#044478; border-bottom:1.5px solid rgba(245,124,0,0.3); position:relative; overflow:hidden; }
    .pw-files-hdr::before { content:''; position:absolute; inset:0; background-image:linear-gradient(rgba(245,124,0,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(245,124,0,0.06) 1px,transparent 1px); background-size:28px 28px; pointer-events:none; }
    .pw-files-icon  { font-size:1.2rem; position:relative; z-index:1; }
    .pw-files-title { font-size:.84rem; font-weight:900; color:#fff; position:relative; z-index:1; }
    .pw-files-sub   { font-size:.68rem; color:rgba(255,255,255,.45); margin-top:2px; position:relative; z-index:1; }
    .pw-files-body  { display:flex; gap:18px; padding:16px; flex-wrap:wrap; }
    .pw-files-form  { display:flex; flex-direction:column; gap:11px; flex:1; min-width:220px; }
    .pw-files-actions { display:flex; gap:7px; flex-wrap:wrap; align-items:center; padding-top:6px; }
    .pw-select-file-btn { padding:7px 12px; border-radius:3px; border:1.5px solid #d0d3d8; background:#f0f1f2; font-family:inherit; font-size:.74rem; font-weight:700; cursor:pointer; color:#374151; white-space:nowrap; transition:all .14s; flex-shrink:0; }
    .pw-select-file-btn:hover { border-color:#f57c00; color:#f57c00; background:rgba(245,124,0,0.06); }
    .pw-files-table-wrap { flex:1; min-width:200px; border:1.5px solid #d0d3d8; border-radius:3px; overflow:hidden; background:#fff; align-self:flex-start; }
    .pw-files-tbl { width:100%; border-collapse:collapse; direction:rtl; font-family:inherit; }
    .pw-files-tbl thead th { background:#374151; color:#fff; padding:8px 14px; font-size:.74rem; font-weight:700; text-align:right; border-bottom:2px solid #f57c00; white-space:nowrap; }
    .pw-files-tbl tbody tr { border-bottom:1px solid #f0f1f2; cursor:pointer; transition:background .12s; }
    .pw-files-tbl tbody tr:last-child { border-bottom:none; }
    .pw-files-tbl tbody tr:hover  { background:rgba(8,101,168,0.05); }
    .pw-files-tbl tbody tr.active { background:rgba(124,58,237,0.08); border-right:3px solid #7c3aed; }
    .pw-files-tbl tbody tr:nth-child(even) { background:#fafbfc; }
    .pw-files-tbl tbody tr:nth-child(even):hover  { background:rgba(8,101,168,0.05); }
    .pw-files-tbl tbody tr.active:nth-child(even) { background:rgba(124,58,237,0.08); }
    .pw-files-tbl td { padding:8px 14px; font-size:.74rem; color:#374151; text-align:right; }

    /* ══ RESPONSIVE 300px → 2000px ══ */

    /* ≥ 2000px */
    @media(min-width:2000px){
        .pw-left-panel        { width: 380px; }
        .pw-records-list      { max-height: 28vh; }
        .pw-tree-scroll       { max-height: 44vh; }
        .pw-parent-id-sel     { width: 100px !important; flex-basis: 100px; }
        .pw-files-body        { gap: 28px; padding: 24px; }
    }

    /* 1600px – 1999px */
    @media(min-width:1600px) and (max-width:1999px){
        .pw-left-panel        { width: 340px; }
        .pw-tree-scroll       { max-height: 42vh; }
    }

    /* 1200px – 1599px  — default desktop, nothing extra */

    /* ≤ 1100px */
    @media(max-width:1100px){
        .pw-left-panel        { width: clamp(210px,26vw,270px); }
        .pw-tree-scroll       { max-height: 34vh; }
    }

    /* ≤ 900px — stack vertically */
    @media(max-width:900px){
        .pw-left-panel        { width: 100% !important; height: auto !important; max-height: none !important; position: static !important; }
        .pw-records-list      { display:flex; flex-direction:row; flex-wrap:nowrap; overflow-x:auto; overflow-y:hidden; max-height:82px; gap:6px; padding:6px 8px 10px; }
        .pw-records-list::-webkit-scrollbar { height:4px; width:unset; }
        .pw-records-list::-webkit-scrollbar-thumb { background:rgba(245,124,0,0.35); border-radius:2px; }
        .lec-row              { flex:0 0 auto; width:clamp(160px,44vw,220px); margin-bottom:0; }
        .pw-tree-scroll       { max-height: 220px; }
        .pw-files-body        { flex-direction: column; }
        .pw-parent-wrap       { flex-wrap: wrap; }
        .pw-parent-id-sel     { width: 70px !important; flex-basis: 70px; }
    }

    /* ≤ 640px */
    @media(max-width:640px){
        .pw-records-list      { max-height: 74px; }
        .lec-row              { width: clamp(150px,54vw,200px); }
        .pw-tree-scroll       { max-height: 180px; }
        .pw-tree-header       { font-size: .72rem; padding: 7px 10px; }
        .pw-tree-selected-badge { max-width: 100px; }
        .pw-files-form        { min-width: unset; }
        .pw-files-actions     { flex-direction: column; align-items: stretch; }
        .pw-files-actions .lec-act-btn { width: 100%; justify-content: center; }
        .pw-parent-wrap       { flex-direction: column; gap: 6px; }
        .pw-parent-id-sel     { width: 100% !important; flex-basis: auto; }
        .pw-parent-clear      { width: 100%; justify-content: center; height: auto; }
    }

    /* ≤ 480px */
    @media(max-width:480px){
        .pw-records-list      { max-height: 68px; }
        .lec-row              { width: clamp(140px,60vw,185px); }
        .pw-tree-scroll       { max-height: 150px; }
        .pw-files-body        { padding: 10px; gap: 10px; }
        .pw-tree-footer       { padding: 6px 10px; }
        .pw-tree-footer-name  { font-size: .66rem; }
        .pw-files-title       { font-size: .76rem; }
        .pw-files-sub         { font-size: .62rem; }
        .pw-select-file-btn   { font-size: .68rem; padding: 6px 9px; }
    }

    /* ≤ 380px — very small */
    @media(max-width:380px){
        .pw-records-list      { max-height: 62px; }
        .lec-row              { width: clamp(130px,65vw,175px); }
        .pw-tree-scroll       { max-height: 120px; }
        .pw-tree-header       { font-size: .68rem; }
        .pw-files-hdr         { padding: 9px 11px; }
        .pw-files-body        { padding: 8px; gap: 8px; }
        .pw-parent-id-sel     { font-size: .7rem !important; }
    }

    /* ≤ 320px */
    @media(max-width:320px){
        .pw-records-list      { max-height: 56px; }
        .pw-tree-scroll       { max-height: 100px; }
        .pw-files-body        { padding: 6px; }
    }

// ═══ END PLANWORK STYLES ═══

`;

export function injectAdminStyles() {
    if (document.getElementById('adm-styles')) return;
    const el = document.createElement('style');
    el.id = 'adm-styles';
    el.textContent = ADMIN_STYLES;
    document.head.appendChild(el);
}