// StatCards.jsx
// ─────────────────────────────────────────────────────────────────────────────
const STAT_DEFS = [
    { key: 'users', label: 'المستخدمون', icon: '👤', blue: false },
    { key: 'courses', label: 'الدورات', icon: '📚', blue: true },
    { key: 'enrollments', label: 'التسجيلات', icon: '🔗', blue: false },
    { key: 'attended', label: 'حضروا', icon: '🎓', blue: true },
    { key: 'certificates', label: 'الشهادات', icon: '📜', blue: false },
    { key: 'refundsPending', label: 'المستردات', icon: '💳', blue: true },
];

export function StatCards({ stats }) {
    return (
        <div className="adm-stats">
            {STAT_DEFS.map(s => (
                <div key={s.key} className={`adm-sc${s.blue ? ' blue' : ''}`}>
                    <div className="adm-sc-icon">{s.icon}</div>
                    <div className="adm-sc-val">{stats[s.key]}</div>
                    <div className="adm-sc-lbl">{s.label}</div>
                    <div className="adm-sc-bar" />
                </div>
            ))}
        </div>
    );
} export default StatCards;