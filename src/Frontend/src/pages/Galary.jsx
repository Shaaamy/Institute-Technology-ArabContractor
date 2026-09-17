import React, { useState, useEffect } from 'react';
import './galary.css';

const albums = [
    { id: 'album11', title: 'مركز جسر السويس', imageUrl: '/images/pic11a1.jpg', photosCount: 24, photoPrefix: 'pic11a', category: 'training' },
    { id: 'album12', title: 'مركز شبرا', imageUrl: '/images/pic12a1.jpg', photosCount: 11, photoPrefix: 'pic12a', category: 'training' },
    { id: 'albumZ', title: 'CEA المجموعة الرابعة', imageUrl: '/images/PicCEA1.jpg', photosCount: 11, photoPrefix: 'PicCEA', category: 'training' },
    { id: 'album15', title: 'معهد تدريب المهندسين العسكريين', imageUrl: '/images/Askry1.jpg', photosCount: 17, photoPrefix: 'Askry', category: 'training' },
    { id: 'album17', title: 'فرع الاسكندرية_17_3_2019_PMPبرنامج', imageUrl: '/images/pic17a1.jpg', photosCount: 14, photoPrefix: 'pic17a', category: 'training' },
    { id: 'album4', title: 'دورة اعداد السلامة_فرع شرق ووسط 24 - 3 - 2019', imageUrl: '/images/pic04a1.jpg', photosCount: 3, photoPrefix: 'pic04a', category: 'training' },
    { id: 'album2', title: 'التدريب فى المانيا', imageUrl: '/images/pic02a1.jpg', photosCount: 4, photoPrefix: 'pic02a', category: 'training' },
    { id: 'album6', title: 'زيارة المانيا مركز جسر السويس', imageUrl: '/images/pic06a1.jpg', photosCount: 23, photoPrefix: 'pic06a', category: 'training' },
    { id: 'album3', title: 'دورة زامبيا', imageUrl: '/images/pic03a1.jpg', photosCount: 3, photoPrefix: 'pic03a', category: 'training' },
    { id: 'album5', title: 'دورة طلبة كليات الهندسة جامعة جازان السعودية_اغسطس 2018', imageUrl: '/images/gazan0.jpg', photosCount: 17, photoPrefix: 'gazan', category: 'training' },
    { id: 'album13', title: 'طلبة السودان 2016', imageUrl: '/images/pic13a1.jpg', photosCount: 27, photoPrefix: 'pic13a', category: 'training' },
    { id: 'album7', title: 'زيارة طلاب التدريب الصيفى إلى العاصمة الإدارية الجديدة 2017-07-1', imageUrl: '/images/pic07a1.jpg', photosCount: 16, photoPrefix: 'pic07a', category: 'training' },
    { id: 'album8', title: 'زيارة طلاب التدريب الصيفى إلى محور روض الفرج 2017-07-20', imageUrl: '/images/pic08a1.jpg', photosCount: 4, photoPrefix: 'pic08a', category: 'training' },
    { id: 'album9', title: 'زيارة طلبة المدرسة الفنية مشروع ميناء شرق بورسعيد 2017-07', imageUrl: '/images/pic09a1.jpg', photosCount: 8, photoPrefix: 'pic09a', category: 'training' },
    { id: 'album14', title: 'ندوة عقود الفيديك - د شريف الهجان', imageUrl: '/images/pic14a1.jpg', photosCount: 5, photoPrefix: 'pic14a', category: 'activities' },
    { id: 'album16', title: 'السلامة فى اعمال الرفع والتصبين_مشروع معالجة مياه بحر البقر', imageUrl: '/images/pic16a1.jpg', photosCount: 6, photoPrefix: 'pic16a', category: 'activities' },
    { id: 'album1', title: 'بروتوكول تعاون مع جمعية المحاسبين المصريين', imageUrl: '/images/pic01a1.jpg', photosCount: 1, photoPrefix: 'pic01a', category: 'visits' },
    { id: 'album10', title: 'زيارة وفد دولة موريتانيا إلى مدرسة المقاولون العرب الثانوية النموذجية 2017-12-17', imageUrl: '/images/pic10a1.jpg', photosCount: 5, photoPrefix: 'pic10a', category: 'visits' },
];

const photoCategories = [
    { key: 'all', label: 'الكل' },
    { key: 'activities', label: 'الأنشطة والفعاليات' },
    { key: 'training', label: 'الدورات التدريبية' },
    { key: 'library', label: 'مكتبة المعهد وسفارة المعرفة' },
    { key: 'labs', label: 'المعامل والقاعات' },
    { key: 'visits', label: 'زيارات وبروتوكولات التعاون' },
];

const videoCategories = [
    { key: 'all', label: 'الكل' },
    { key: 'aboutAC', label: 'عن المقاولون العرب' },
    { key: 'cea', label: 'آراء المهندسين — CEA' },
    { key: 'media', label: 'فيديوهات تعريفية وإعلامية' },
];

const videoSections = [
    {
        key: 'aboutAC',
        category: 'aboutAC',
        title: 'فيديوهات عن المقاولون العرب ودورها التعليمى فى هندسة التشييد والبناء',
        color: '#f57c00',
        videos: [
            { id: 'ZfDfud7dV50', title: 'فيديو 1' },
            { id: '5f4Pb_agNR8', title: 'فيديو 2' },
            { id: 'km_RuntColw', title: 'فيديو 3' },
        ],
    },
    {
        key: 'aboutAC_en',
        category: 'aboutAC',
        title: 'The Arab Contractors and Their Educational Role',
        color: '#D32F2F',
        videos: [
            { id: 'XL-8BmDEaKM', title: 'Video 1' },
            { id: 'DK91iVe4DuQ', title: 'Video 2' },
            { id: 'dR5LsCk4b2Y', title: 'Video 3' },
        ],
    },
    {
        key: 'aboutAC_fr',
        category: 'aboutAC',
        title: 'Les entrepreneurs arabes et leur rôle éducatif',
        color: '#0865a8',
        videos: [
            { id: '78_PrybZMtA', title: 'Vidéo 1' },
            { id: '7CXLX7iCWcs', title: 'Vidéo 2' },
            { id: 'Lb-f8lk_cCg', title: 'Vidéo 3' },
        ],
    },
    {
        key: 'cea_g1',
        category: 'cea',
        title: 'ICEMT_CEA_Group1',
        color: '#E65100',
        videos: [
            { id: 'qVacL0aaqHY', title: 'مهندس 1' },
            { id: 'MuQt0pQenhI', title: 'مهندس 2' },
            { id: 'wujlFjykJO0', title: 'مهندس 3' },
            { id: '4CA2Aj9xM0c', title: 'مهندس 4' },
            { id: 'v-BCi9TsaoM', title: 'مهندس 5' },
            { id: 'zYa5Ohpe2QE', title: 'مهندس 6' },
            { id: 'D2GsCDbjvdY', title: 'مهندس 7' },
        ],
    },
    {
        key: 'cea_g2',
        category: 'cea',
        title: 'ICEMT_CEA_Group2',
        color: '#E65100',
        videos: [
            { id: '1FxSAiZSx9c', title: 'مهندس 1' },
            { id: 'fLsCp8m5gDw', title: 'مهندس 2' },
            { id: '6R3PvQZml6k', title: 'مهندس 3' },
            { id: 'pKkDOwUpQlE', title: 'مهندس 4' },
            { id: 'xXBddNMMZ8E', title: 'مهندس 5' },
            { id: 'qzmapa6fOo4', title: 'مهندس 6' },
            { id: '0gN8RTYHafk', title: 'مهندس 7' },
        ],
    },
    {
        key: 'media_intro',
        category: 'media',
        title: 'فيديوهات تعريفية وإعلامية عن المعهد',
        color: '#1a6b3c',
        videos: [],
    },
];

// ─── Shared filter bar ────────────────────────────────────────────────────────
const CategoryBar = ({ categories, active, onChange }) => (
    <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        padding: '12px 16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
    }}>
        {categories.map(cat => (
            <button
                key={cat.key}
                onClick={() => onChange(cat.key)}
                style={{
                    padding: '7px 16px',
                    borderRadius: 20,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: active === cat.key ? 700 : 400,
                    background: active === cat.key
                        ? 'linear-gradient(to right, #2563eb, #60a5fa)'
                        : '#f3f4f6',
                    color: active === cat.key ? '#fff' : '#374151',
                    transition: 'all 0.2s',
                    boxShadow: active === cat.key ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                }}
            >
                {cat.label}
            </button>
        ))}
    </div>
);

// ─── Video components ─────────────────────────────────────────────────────────
const VideoCard = ({ videoId, title, color }) => {
    const [imageError, setImageError] = useState(false);
    return (
        <div
            onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
            className="training-video-card"
            style={{ borderColor: `${color}50` }}
        >
            <div className="training-video-thumbnail">
                {!imageError ? (
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt={title}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="training-video-error">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="#999">
                            <path d="M4 6h16v12H4z" />
                        </svg>
                    </div>
                )}
                <div className="training-video-overlay" />
                <div className="training-play-button">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
                {/* ── LTR title at bottom of video card ── */}
                <div className="training-video-title">
                    <span style={{ direction: 'ltr', textAlign: 'left' }}>{title}</span>
                </div>
            </div>
        </div>
    );
};

const VideoSection = ({ section }) => {
    if (!section.videos || section.videos.length === 0) {
        return (
            <div className="training-section">
                <div
                    className="training-section-header"
                    style={{ background: `linear-gradient(135deg, ${section.color} 0%, ${section.color}cc 100%)` }}
                >
                    {/* ── LTR section title ── */}
                    <h2 style={{ direction: 'ltr', textAlign: 'center' }}>{section.title}</h2>
                </div>
                <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: 15 }}>
                    لا توجد فيديوهات متاحة حالياً في هذا القسم
                </div>
            </div>
        );
    }
    return (
        <div className="training-section">
            <div
                className="training-section-header"
                style={{ background: `linear-gradient(135deg, ${section.color} 0%, ${section.color}cc 100%)` }}
            >
                {/* ── LTR section title ── */}
                <h2 style={{ direction: 'ltr', textAlign: 'center' }}>{section.title}</h2>
            </div>
            <div className="training-videos-grid">
                {section.videos.map((video, i) => (
                    <VideoCard key={i} videoId={video.id} title={video.title} color={section.color} />
                ))}
            </div>
        </div>
    );
};

const VideoGalleryPage = () => {
    const [activeVideoCategory, setActiveVideoCategory] = useState('all');

    const filtered = activeVideoCategory === 'all'
        ? videoSections
        : videoSections.filter(s => s.category === activeVideoCategory);

    const showCeaBanner =
        activeVideoCategory === 'all' || activeVideoCategory === 'cea';

    return (
        <div className="training-plan-container">
            <style>{`
                .training-plan-container { width: 100%; padding: 20px; }
                .training-section { background: white; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); overflow: hidden; }
                .training-section-header { padding: 20px; text-align: center; }
                .training-section-header h2 { color: white; font-size: 20px; font-weight: bold; margin: 0; }
                .training-cea-header { background: linear-gradient(135deg, #6A1B9A 0%, #9C27B0 100%); color: white; padding: 16px; margin-bottom: 24px; border-radius: 12px; text-align: center; }
                .training-cea-header h2 { font-size: 24px; font-weight: bold; margin: 0; }
                .training-videos-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; padding: 16px; }
                @media (min-width: 600px) { .training-videos-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1200px) { .training-videos-grid { grid-template-columns: repeat(3, 1fr); } }
                .training-video-card { border-radius: 12px; overflow: hidden; cursor: pointer; background-color: #f5f5f5; border: 2px solid; transition: transform 0.2s, box-shadow 0.2s; aspect-ratio: 16 / 10; }
                .training-video-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
                .training-video-thumbnail { position: relative; width: 100%; height: 100%; }
                .training-video-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
                .training-video-error { width: 100%; height: 100%; background-color: #ddd; display: flex; align-items: center; justify-content: center; }
                .training-video-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%); }
                .training-play-button { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(255,0,0,0.9); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: transform 0.2s; }
                .training-video-card:hover .training-play-button { transform: translate(-50%, -50%) scale(1.1); }
                .training-video-title { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px; text-align: left; }
                .training-video-title span { color: white; font-size: 14px; font-weight: bold; text-shadow: 0 0 4px rgba(0,0,0,0.8); direction: ltr; display: block; text-align: left; }
            `}</style>

            <CategoryBar
                categories={videoCategories}
                active={activeVideoCategory}
                onChange={setActiveVideoCategory}
            />

            <div style={{ height: 20 }} />

            {showCeaBanner && activeVideoCategory !== 'aboutAC' && activeVideoCategory !== 'media' && (
                <div className="training-cea-header">
                    <h2>رأي بعض المهندسين في البرنامج CEA</h2>
                </div>
            )}

            {filtered.map(section => (
                <VideoSection key={section.key} section={section} />
            ))}
        </div>
    );
};

// ─── Album detail page ────────────────────────────────────────────────────────
const AlbumDetailPage = ({ album, onBack }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState({});
    const [imageError, setImageError] = useState({});

    const photos = Array.from(
        { length: album.photosCount },
        (_, i) => `/images/${album.photoPrefix}${i + 1}.jpg`
    );

    return (
        <div className="album-detail-page">
            <div className="album-detail-header">
                <div className="album-header-content">
                    <div className="album-title">{album.title}</div>
                    <div className="album-counter">
                        صورة {currentPhotoIndex + 1} من {photos.length}
                    </div>
                </div>
                <button onClick={onBack} className="back-button">
                    <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <div className="album-content">
                <div className="photo-viewer-container">
                    <div className="photo-card">
                        <div className="photo-wrapper">
                            {imageLoading[currentPhotoIndex] && (
                                <div className="photo-loading">
                                    <div className="spinner"></div>
                                    <div className="loading-text">جاري تحميل الصورة...</div>
                                </div>
                            )}
                            {imageError[currentPhotoIndex] ? (
                                <div className="photo-error">
                                    <svg className="error-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                    </svg>
                                    <div className="error-text">لا يمكن تحميل الصورة</div>
                                    <div className="error-url">{photos[currentPhotoIndex]}</div>
                                </div>
                            ) : (
                                <img
                                    src={photos[currentPhotoIndex]}
                                    alt={`Photo ${currentPhotoIndex + 1}`}
                                    className="main-photo"
                                    onLoad={() => setImageLoading(prev => ({ ...prev, [currentPhotoIndex]: false }))}
                                    onError={() => {
                                        setImageLoading(prev => ({ ...prev, [currentPhotoIndex]: false }));
                                        setImageError(prev => ({ ...prev, [currentPhotoIndex]: true }));
                                    }}
                                    onLoadStart={() => setImageLoading(prev => ({ ...prev, [currentPhotoIndex]: true }))}
                                />
                            )}
                            {/* ── photo badge REMOVED ── */}
                        </div>
                    </div>
                </div>

                <div className="navigation-buttons">
                    <button
                        onClick={() => currentPhotoIndex < photos.length - 1 && setCurrentPhotoIndex(i => i + 1)}
                        disabled={currentPhotoIndex >= photos.length - 1}
                        className="nav-button"
                    >
                        <span>التالي</span>
                    </button>

                    <div className="page-indicator">
                        {currentPhotoIndex + 1} / {photos.length}
                    </div>

                    <button
                        onClick={() => currentPhotoIndex > 0 && setCurrentPhotoIndex(i => i - 1)}
                        disabled={currentPhotoIndex <= 0}
                        className="nav-button"
                    >
                        <span>السابق</span>
                    </button>
                </div>

                <div className="thumbnail-strip">
                    <div className="thumbnail-container">
                        {photos.map((photo, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPhotoIndex(index)}
                                className={`thumbnail ${index === currentPhotoIndex ? 'thumbnail-selected' : ''}`}
                            >
                                <img
                                    src={photo}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="thumbnail-image"
                                    onError={e => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML =
                                            '<div class="thumbnail-error"><svg class="thumbnail-error-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main gallery ─────────────────────────────────────────────────────────────
const PhotoGallery = () => {
    const [showPhotos, setShowPhotos] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [activePhotoCategory, setActivePhotoCategory] = useState('all');
    const [imageLoading, setImageLoading] = useState({});
    const [imageError, setImageError] = useState({});

    const getGridColumns = (width) => {
        if (width > 1200) return 4;
        if (width > 800) return 3;
        if (width > 600) return 2;
        return 1;
    };
    const [columns, setColumns] = useState(4);

    useEffect(() => {
        const handleResize = () => setColumns(getGridColumns(window.innerWidth));
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.title = 'مكتبة الصور والفيديوهات - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    if (selectedAlbum) {
        return <AlbumDetailPage album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
    }

    const filteredAlbums = activePhotoCategory === 'all'
        ? albums
        : albums.filter(a => a.category === activePhotoCategory);

    return (
        <div dir="rtl" className="photo-gallery">
            {/* Breadcrumb */}
            <div style={{ position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%', borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px' }}>
                <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                    <a
                        href="/"
                        style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none', marginLeft: '8px' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}
                    >
                        الصفحة الرئيسية
                    </a>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151', marginRight: '8px' }}>مكتبة الصور والفيديوهات</span>
                </div>
            </div>

            <br /><br />

            {/* Tab switcher */}
            <div className="gallery-header">
                <div className="tab-buttons">
                    <button
                        onClick={() => setShowPhotos(true)}
                        className={`tab-button ${showPhotos ? 'tab-button-active' : ''}`}
                    >
                        مكتبة الصور
                    </button>
                    <button
                        onClick={() => setShowPhotos(false)}
                        className={`tab-button ${!showPhotos ? 'tab-button-active' : ''}`}
                    >
                        مكتبة الفيديوهات
                    </button>
                </div>
            </div>

            {/* Category filter bar */}
            {showPhotos && (
                <CategoryBar
                    categories={photoCategories}
                    active={activePhotoCategory}
                    onChange={setActivePhotoCategory}
                />
            )}

            <div className="gallery-content">
                {showPhotos ? (
                    <div className="albums-grid-wrapper">
                        {filteredAlbums.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af', fontSize: 16 }}>
                                لا توجد ألبومات في هذا القسم
                            </div>
                        ) : (
                            <div
                                className="albums-grid"
                                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                            >
                                {filteredAlbums.map(album => (
                                    <button
                                        key={album.id}
                                        onClick={() => setSelectedAlbum(album)}
                                        className="album-card"
                                    >
                                        <div className="album-image-container">
                                            {imageLoading[album.id] && (
                                                <div className="album-loading">
                                                    <div className="spinner"></div>
                                                </div>
                                            )}
                                            {imageError[album.id] ? (
                                                <div className="album-error">
                                                    <svg className="album-error-icon" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                    </svg>
                                                    <div className="album-error-text">ألبوم الصور</div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={album.imageUrl}
                                                    alt={album.title}
                                                    className="album-image"
                                                    onLoad={() => setImageLoading(prev => ({ ...prev, [album.id]: false }))}
                                                    onError={() => {
                                                        setImageLoading(prev => ({ ...prev, [album.id]: false }));
                                                        setImageError(prev => ({ ...prev, [album.id]: true }));
                                                    }}
                                                    onLoadStart={() => setImageLoading(prev => ({ ...prev, [album.id]: true }))}
                                                />
                                            )}
                                        </div>
                                        <div className="album-info">
                                            <div className="album-info-title">{album.title}</div>
                                            <div className="album-footer">
                                                <div className="album-action">
                                                    <svg className="album-action-icon" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                    </svg>
                                                    <span className="album-action-text">عرض الألبوم</span>
                                                </div>
                                                <div className="album-count">{album.photosCount} صورة</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <VideoGalleryPage />
                )}
            </div>
        </div>
    );
};

export default PhotoGallery;