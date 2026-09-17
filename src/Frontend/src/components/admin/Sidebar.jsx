// Sidebar.jsx
// ─────────────────────────────────────────────────────────────────────────────
import logoSrc from '../../assets/white.webp';

export function Sidebar({ user, activeTab, tabs, totalCerts, pendingRefunds, onTabChange }) {
    return (
        <aside className="adm-sidebar">
            <div className="adm-sidebar-brand">
                <img src={logoSrc} alt="ICEMT" className="adm-sb-logo" />
                <div className="adm-sb-title">
                    <div className="adm-sb-name">ICEMT</div>
                    <div className="adm-sb-sub">لوحة التحكم الإدارية</div>
                </div>
            </div>
            <div className="adm-sidebar-user">
                <div className="adm-su-av">{user?.firstName?.[0] || 'م'}{user?.lastName?.[0] || ''}</div>
                <div className="adm-su-info">
                    <div className="adm-su-name">{user?.firstName} {user?.lastName}</div>
                    <div className="adm-su-role">🔐 مدير النظام</div>
                </div>
            </div>
            <nav className="adm-sidebar-nav">
                <div className="adm-nav-label">القائمة الرئيسية</div>
                {tabs.map(t => (
                    <button
                        key={t.id}
                        title={t.label}
                        className={`adm-nav-btn${activeTab === t.id ? ' active' : ''}`}
                        onClick={() => onTabChange(t.id)}
                    >
                        <span className="adm-nav-icon">{t.icon}</span>
                        <span className="adm-nav-txt">{t.label}</span>
                        {t.id === 'certificates' && totalCerts > 0 && <span className="adm-nav-badge">{totalCerts}</span>}
                        {t.id === 'refunds' && pendingRefunds > 0 && <span className="adm-nav-badge pulse">{pendingRefunds}</span>}
                    </button>
                ))}
            </nav>
            <div className="adm-sidebar-footer">
                المعهد التكنولوجي لهندسة التشييد والإدارة © {new Date().getFullYear()}
            </div>
        </aside>
    );
}
export default Sidebar;