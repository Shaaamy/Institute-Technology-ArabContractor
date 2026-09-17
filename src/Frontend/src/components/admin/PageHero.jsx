// PageHero.jsx
// ─────────────────────────────────────────────────────────────────────────────
import { TAB_TITLES } from './constants';

export function PageHero({ activeTab }) {
    const meta = TAB_TITLES[activeTab] ?? { tag: 'لوحة الإدارة', title: ['', ''] };
    const [plain, accent, trail] = meta.title;

    return (
        <div className="adm-page-hero">
            <div className="adm-hero-accent" />
            <div className="adm-hero-content">
                <div className="adm-hero-tag">{meta.tag}</div>
                <h1 className="adm-hero-title">
                    {plain} <span>{accent}</span>{trail}
                </h1>
                <div className="adm-hero-date">
                    {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
        </div>
    );
} export default PageHero;