import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, MapPin, Search, X, TrendingUp, Clock } from 'lucide-react';

const API_BASE = 'https://acwebsite-icmet-test.azurewebsites.net/api';

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('q') || '';

    // Results passed from Navbar via router state
    const stateResults = location.state?.results || null;
    const stateQuery = location.state?.query || '';

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [recentSearches, setRecentSearches] = useState([]);

    const popularSearches = [
        'دورات الهندسة المدنية',
        'برامج التدريب الحرفي',
        'دورات إدارة المشاريع',
        'التعليم الفني',
        'شهادات معتمدة',
    ];

    // Page title
    useEffect(() => {
        document.title = queryParam
            ? `نتائج البحث: "${queryParam}" - المعهد التكنولوجي لهندسة التشييد والإدارة`
            : 'البحث - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, [queryParam]);

    // Load recent searches from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('recentSearches');
            if (saved) setRecentSearches(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);

    // Generate slug helper
    const generateSlug = (title = '') =>
        title.trim().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF\u0660-\u0669-]/g, '').toLowerCase();

    // Save recent search
    const saveRecentSearch = (term) => {
        if (!term.trim()) return;
        setRecentSearches(prev => {
            const updated = [term, ...prev.filter(s => s !== term)].slice(0, 5);
            try { localStorage.setItem('recentSearches', JSON.stringify(updated)); } catch { /* ignore */ }
            return updated;
        });
    };

    // Clear recent searches
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    // Highlight matched text
    const highlightMatch = (text, q) => {
        if (!q || !text) return text;
        const idx = text.toLowerCase().indexOf(q.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <span style={{ fontWeight: 'bold', color: '#0865a8', borderBottom: '1.5px solid rgba(8,101,168,0.35)' }}>
                    {text.slice(idx, idx + q.length)}
                </span>
                {text.slice(idx + q.length)}
            </>
        );
    };

    // Main search effect
    useEffect(() => {
        if (!queryParam) { 
            setHasSearched(false); 
            setSearchResults([]); 
            return; 
        }

        setSearchQuery(queryParam);
        setHasSearched(true);
        saveRecentSearch(queryParam);

        // FAST PATH: Use results from Navbar if available
        if (stateResults && stateQuery.toLowerCase() === queryParam.toLowerCase()) {
            console.log('✅ Using results from Navbar:', stateResults.length);
            setSearchResults(stateResults);
            setLoading(false);
            return;
        }

        // FALLBACK: Fetch all courses and filter
        console.log('🔄 Fetching all courses for search...');
        fetchAndFilter(queryParam);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParam]);

    // Fallback: Fetch all courses and filter
    const fetchAndFilter = async (query) => {
        setLoading(true);
        try {
            // Get category tree
            const treeRes = await fetch(`${API_BASE}/Categories/tree`);
            if (!treeRes.ok) throw new Error('Failed to load categories');
            const treeData = await treeRes.json();

            // Collect all category slugs
            const allSlugs = new Set();
            const collectSlugs = (categories) => {
                categories.forEach(cat => {
                    if (cat.slug) allSlugs.add(cat.slug);
                    if (cat.children) collectSlugs(cat.children);
                });
            };
            
            if (treeData[0]?.children) {
                collectSlugs(treeData[0].children);
            }

            console.log('📦 Fetching from slugs:', Array.from(allSlugs));

            // Fetch courses from each program
            const coursePromises = Array.from(allSlugs).map(async (slug) => {
                try {
                    const res = await fetch(`${API_BASE}/course/programs/${slug}/courses`);
                    if (!res.ok) return [];
                    const data = await res.json();
                    
                    const coursesList = Array.isArray(data) ? data : (data.courses || data.data || []);
                    
                    return coursesList.map(c => ({
                        id: c.id || c.courseId,
                        title: c.title || c.name || c.courseName || '',
                        slug: c.slug || generateSlug(c.title || c.name || String(c.id)),
                        description: c.description || '',
                        category: c.categoryName || c.category || '',
                        place: c.place || '',
                        date: c.date || '',
                        cost: c.cost,
                        image: c.imageUrl || c.image || c.thumbnail || null
                    }));
                } catch (err) {
                    console.warn(`Failed to load courses from ${slug}:`, err);
                    return [];
                }
            });

            const results = await Promise.all(coursePromises);
            const allCourses = results.flat();

            // Remove duplicates
            const uniqueCourses = Array.from(
                new Map(allCourses.map(c => [c.id, c])).values()
            );

            console.log('✅ Loaded courses:', uniqueCourses.length);

            // Filter by search query
            const q = query.toLowerCase();
            const matched = uniqueCourses.filter(c =>
                c.title.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q) ||
                c.place.toLowerCase().includes(q)
            );

            console.log('🔍 Matched courses:', matched.length);
            setSearchResults(matched);
        } catch (err) {
            console.error('❌ Search error:', err);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setSearchParams({ q: searchQuery });
    };

    const handleQuickSearch = (term) => {
        setSearchQuery(term);
        setSearchParams({ q: term });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
        setSearchParams({});
    };

    const filteredResults = activeFilter === 'all'
        ? searchResults
        : searchResults.filter(r => r.type === activeFilter);

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Droid+Arabic+Kufi:wght@400;700&display=swap" rel="stylesheet" />

            <style>{`
                * { font-family: "Noto Kufi Arabic", serif !important; }

                @media (max-width: 640px) {
                    .search-main-container { margin-top: 100px !important; }
                    .fixed-overview        { top: 56px !important; }
                }
                @media (min-width: 641px) and (max-width: 768px) {
                    .search-main-container { margin-top: 110px !important; }
                    .fixed-overview        { top: 64px !important; }
                }
                @media (min-width: 769px) and (max-width: 1024px) {
                    .search-main-container { margin-top: 120px !important; }
                    .fixed-overview        { top: 70px !important; }
                }
                @media (min-width: 1025px) {
                    .search-main-container { margin-top: 130px !important; }
                    .fixed-overview        { top: 70px !important; }
                }
                @media (max-width: 300px)  { .search-container { padding: 12px !important; } }
                @media (min-width: 1920px) { .search-container { max-width: 1600px !important; } }

                ::-webkit-scrollbar       { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: #f1f1f1; }
                ::-webkit-scrollbar-thumb { background: #0865a8; border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #f57c00; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .fade-in    { animation: fadeIn 0.3s ease-out; }
                .search-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(8,101,168,0.1); }
                .result-card { transition: all 0.3s ease; }
                .result-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                    border-color: #0865a8 !important;
                }
            `}</style>

            <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>

                {/* Fixed Overview Bar */}
                <div className="fixed-overview" style={{
                    position: 'fixed', left: 0, zIndex: 40, width: '100%',
                    borderBottom: '1px solid #d1d5db', backgroundColor: '#F5F7E1',
                    padding: '8px 20px',
                }}>
                    <div style={{ textAlign: 'center', fontSize: '14px' }}>
                        <a href="/"
                            style={{ marginLeft: '12px', color: '#374151', textDecoration: 'none' }}
                            onMouseEnter={e => e.target.style.color = '#f57c00'}
                            onMouseLeave={e => e.target.style.color = '#374151'}>
                            الصفحة الرئيسية
                        </a>
                        <span style={{ color: '#9ca3af', margin: '0 8px' }}>-</span>
                        <span style={{ marginRight: '12px', fontWeight: '600', color: '#111' }}>بحث</span>
                    </div>
                </div>

                {/* Main Container */}
                <div className="search-main-container search-container"
                    style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px 60px' }}>

                    {/* Page heading */}
                    <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 'bold',
                            color: '#000', marginBottom: '8px',
                        }}>
                            اكتشف الدورات والبرامج التدريبية المناسبة لك
                        </h1>
                    </div>

                    {/* Search bar */}
                    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto 32px' }}>
                        <form onSubmit={handleSearchSubmit}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="ابحث عن دورات، برامج، أو موضوعات..."
                                        className="search-input"
                                        style={{
                                            width: '100%', borderRadius: '12px',
                                            border: '2px solid #d1d5db', backgroundColor: '#fff',
                                            padding: '12px 48px 12px 48px',
                                            fontSize: '16px', color: '#000',
                                            boxSizing: 'border-box', transition: 'border-color 0.2s',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#0865a8'}
                                        onBlur={e => e.target.style.borderColor = '#d1d5db'}
                                    />
                                    <Search style={{
                                        position: 'absolute', right: '14px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '20px', height: '20px',
                                        color: '#0865a8', pointerEvents: 'none',
                                    }} />
                                    {searchQuery && (
                                        <button type="button" onClick={handleClearSearch} style={{
                                            position: 'absolute', left: '14px', top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none', border: 'none',
                                            cursor: 'pointer', padding: 0, color: '#9ca3af',
                                        }}>
                                            <X style={{ width: '18px', height: '18px' }} />
                                        </button>
                                    )}
                                </div>
                                <button type="submit" disabled={loading} style={{
                                    borderRadius: '12px', padding: '12px 28px',
                                    background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
                                    color: '#fff', fontWeight: 'bold', border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '15px', opacity: loading ? 0.6 : 1,
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 3px 10px rgba(8,101,168,0.25)',
                                }}>
                                    {loading ? 'جاري البحث...' : 'بحث'}
                                </button>
                            </div>
                        </form>

                        {/* Filter buttons */}
                        {hasSearched && searchResults.length > 0 && (
                            <div style={{
                                marginTop: '16px', display: 'flex',
                                flexWrap: 'wrap', justifyContent: 'center', gap: '8px',
                            }}>
                                <button onClick={() => setActiveFilter('all')} style={{
                                    borderRadius: '8px', padding: '8px 18px',
                                    fontSize: '13px', fontWeight: 'bold', border: 'none',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    backgroundColor: activeFilter === 'all' ? '#0865a8' : '#f3f4f6',
                                    color: activeFilter === 'all' ? '#fff' : '#374151',
                                }}>
                                    الكل ({searchResults.length})
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pre-search: recent + popular */}
                    {!hasSearched && (
                        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>

                            {recentSearches.length > 0 && (
                                <div style={{
                                    borderRadius: '16px', border: '2px solid #e5e7eb',
                                    backgroundColor: '#fff', padding: '24px', marginBottom: '24px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock style={{ width: '20px', height: '20px', color: '#0865a8' }} />
                                            <h3 style={{ fontWeight: 'bold', fontSize: '17px', color: '#000', margin: 0 }}>
                                                عمليات البحث الأخيرة
                                            </h3>
                                        </div>
                                        <button onClick={clearRecentSearches} style={{
                                            fontSize: '13px', color: '#6b7280',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                        }}
                                            onMouseEnter={e => e.target.style.color = '#f57c00'}
                                            onMouseLeave={e => e.target.style.color = '#6b7280'}>
                                            مسح الكل
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {recentSearches.map((s, i) => (
                                            <button key={i} onClick={() => handleQuickSearch(s)} style={{
                                                borderRadius: '8px', border: '2px solid #e5e7eb',
                                                backgroundColor: '#f9fafb', padding: '8px 16px',
                                                fontSize: '13px', fontWeight: '500', color: '#000',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0865a8'; e.currentTarget.style.backgroundColor = '#0865a8'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = '#000'; }}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{
                                borderRadius: '16px', border: '2px solid #e5e7eb',
                                backgroundColor: '#fff', padding: '24px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <TrendingUp style={{ width: '20px', height: '20px', color: '#f57c00' }} />
                                    <h3 style={{ fontWeight: 'bold', fontSize: '17px', color: '#000', margin: 0 }}>
                                        عمليات البحث الشائعة
                                    </h3>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {popularSearches.map((s, i) => (
                                        <button key={i} onClick={() => handleQuickSearch(s)} style={{
                                            borderRadius: '8px', border: '2px solid #e5e7eb',
                                            backgroundColor: '#f9fafb', padding: '8px 16px',
                                            fontSize: '13px', fontWeight: '500', color: '#000',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f57c00'; e.currentTarget.style.backgroundColor = '#f57c00'; e.currentTarget.style.color = '#fff'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = '#000'; }}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {hasSearched && (
                        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>

                            {/* Loading spinner */}
                            {loading && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px' }}>
                                    <div style={{
                                        width: '64px', height: '64px', borderRadius: '50%',
                                        border: '4px solid #e5e7eb', borderTopColor: '#0865a8',
                                        animation: 'spin 0.9s linear infinite', marginBottom: '16px',
                                    }} />
                                    <p style={{ fontSize: '17px', fontWeight: '600', color: '#4b5563' }}>
                                        جاري البحث...
                                    </p>
                                </div>
                            )}

                            {/* No results */}
                            {!loading && filteredResults.length === 0 && (
                                <div style={{
                                    borderRadius: '16px', border: '2px solid #e5e7eb',
                                    backgroundColor: '#fff', padding: '60px 20px', textAlign: 'center',
                                }}>
                                    <Search style={{ margin: '0 auto 16px', width: '64px', height: '64px', color: '#d1d5db' }} />
                                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', marginBottom: '8px' }}>
                                        لم يتم العثور على نتائج
                                    </h3>
                                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                                        حاول استخدام كلمات مفتاحية مختلفة أو أكثر عمومية
                                    </p>
                                    <button onClick={handleClearSearch} style={{
                                        borderRadius: '12px', padding: '12px 28px',
                                        background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
                                        color: '#fff', fontWeight: 'bold', border: 'none',
                                        cursor: 'pointer', fontSize: '15px',
                                    }}>
                                        مسح البحث
                                    </button>
                                </div>
                            )}

                            {/* Result cards */}
                            {!loading && filteredResults.length > 0 && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                        <h2 style={{ fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 'bold', color: '#000' }}>
                                            النتائج ({filteredResults.length})
                                        </h2>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {filteredResults.map((result, index) => (
                                            <div
                                                key={`${result.id}-${index}`}
                                                className="result-card fade-in"
                                                onClick={() => navigate(`/course/${result.slug}`)}
                                                style={{
                                                    cursor: 'pointer', borderRadius: '16px',
                                                    border: '2px solid #e5e7eb', backgroundColor: '#fff',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                                    overflow: 'hidden',
                                                    animationDelay: `${index * 0.04}s`,
                                                }}
                                            >
                                                <div style={{
                                                    display: 'flex', alignItems: 'flex-start',
                                                    gap: '16px', padding: '20px 24px',
                                                }}>
                                                    {/* Gradient icon */}
                                                    <div style={{
                                                        width: '64px', height: '64px', flexShrink: 0,
                                                        borderRadius: '12px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        background: 'linear-gradient(135deg, #0865a8 0%, #f57c00 100%)',
                                                    }}>
                                                        <BookOpen style={{ width: '30px', height: '30px', color: '#fff' }} />
                                                    </div>

                                                    {/* Text content */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        {/* Type badge */}
                                                        <div style={{ marginBottom: '8px' }}>
                                                            <span style={{
                                                                display: 'inline-block', borderRadius: '20px',
                                                                padding: '3px 12px', fontSize: '12px', fontWeight: 'bold',
                                                                backgroundColor: '#0865a8',
                                                                color: '#fff',
                                                            }}>
                                                                دورة تدريبية
                                                            </span>
                                                        </div>

                                                        {/* Title with highlighted text */}
                                                        <h3 style={{
                                                            fontSize: 'clamp(15px, 2vw, 19px)', fontWeight: 'bold',
                                                            color: '#000', marginBottom: '8px', lineHeight: '1.5',
                                                        }}>
                                                            {highlightMatch(result.title, queryParam)}
                                                        </h3>

                                                        {/* Description */}
                                                        {result.description && (
                                                            <p style={{
                                                                fontSize: '14px', color: '#6b7280',
                                                                marginBottom: '12px', lineHeight: '1.6',
                                                                overflow: 'hidden', display: '-webkit-box',
                                                                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                            }}>
                                                                {result.description}
                                                            </p>
                                                        )}

                                                        {/* Course meta */}
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
                                                            {result.place && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                    <MapPin style={{ width: '14px', height: '14px', color: '#0865a8', flexShrink: 0 }} />
                                                                    <span>{result.place}</span>
                                                                </div>
                                                            )}
                                                            {result.date && (
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                    <Calendar style={{ width: '14px', height: '14px', color: '#0865a8', flexShrink: 0 }} />
                                                                    <span>{result.date}</span>
                                                                </div>
                                                            )}
                                                            {result.cost != null && result.cost > 0 && (
                                                                <span style={{ fontWeight: 'bold', color: '#f57c00' }}>
                                                                    {Number(result.cost).toLocaleString('ar-EG')} ج.م
                                                                </span>
                                                            )}
                                                            {(result.cost === 0 || result.cost === null) && (
                                                                <span style={{ fontWeight: 'bold', color: '#16a34a' }}>مجاناً</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Arrow */}
                                                    <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center', flexShrink: 0 }}>
                                                        <svg width="22" height="22" fill="none" stroke="#0865a8" viewBox="0 0 24 24"
                                                            style={{ transform: 'rotate(180deg)' }}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchPage;