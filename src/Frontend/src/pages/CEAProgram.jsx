import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Card, CardMedia, IconButton, Dialog, DialogContent } from '@mui/material';
import { ExpandMore, CheckCircle, PlayArrow, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NAV_HEIGHT = 70;

const CEAProgram = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const [openVideo, setOpenVideo] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [currentGallerySlide, setCurrentGallerySlide] = useState(0);

    const galleryImages = [
        { src: '/images/Cea1.jpg' }, { src: '/images/Cea2.jpg' },
        { src: '/images/Cea3.jpg' }, { src: '/images/Cea4.jpg' },
        { src: '/images/Cea5.jpg' }, { src: '/images/Cea6.jpg' },
        { src: '/images/Cea7.jpg' }, { src: '/images/Cea8.jpg' },
    ];

    const videos = [
        { id: 1, thumbnail: '/images/CEA-Video-bg1.jpg', title: 'Bibliotheca Alexandria: foundation and structural design, Egypt.', videoUrl: 'https://www.youtube.com/embed/rJmJhoV7vYE' },
        { id: 2, thumbnail: '/images/CEA-Video-bg2.jpg', title: "Delivering the Emirates airline, Britain's First Urban Cable Car, London.", videoUrl: 'https://www.youtube.com/embed/5Aq8dhNO2DE' },
    ];

    useEffect(() => { document.title = 'ICEMT Webinar - CEA Program'; }, []);

    // Force document dir to match language — this overrides any global RTL setting
    useEffect(() => {
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        return () => {
            // Restore on unmount if needed
        };
    }, [isRTL]);

    useEffect(() => {
        const maxSlide = Math.ceil(galleryImages.length / 4) - 1;
        const timer = setInterval(() => {
            setCurrentGallerySlide(prev => (prev >= maxSlide ? 0 : prev + 1));
        }, 4000);
        return () => clearInterval(timer);
    }, [galleryImages.length]);

    const handleImageClick = (index) => { setSelectedImageIndex(index); setOpenImageModal(true); };
    const handleCloseImageModal = () => setOpenImageModal(false);
    const handlePrevImage = () => setSelectedImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    const handleNextImage = () => setSelectedImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    const handlePrevGallerySlide = () => setCurrentGallerySlide(prev => Math.max(0, prev - 1));
    const handleNextGallerySlide = () => setCurrentGallerySlide(prev => Math.min(Math.ceil(galleryImages.length / 4) - 1, prev + 1));

    return (
        /*
          THE FIX: wrap everything in a div with explicit dir + text-align.
          This creates a new "direction context" that fully overrides any
          parent dir="rtl" on <html> or <body>.
        */
        <div style={{
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left',
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            fontFamily: '"Noto Kufi Arabic", serif',
        }}>

            {/* Breadcrumb */}
            <div style={{
                position: 'fixed', top: 70, left: 0, zIndex: 50, width: '100%',
                borderBottom: '1px solid #d1d5db', backgroundColor: '#f5f5f5', padding: '8px 20px',
            }}>
                <div style={{ textAlign: 'center', fontFamily: '"Noto Kufi Arabic", serif', fontSize: '1rem' }}>
                    <Link to="/" style={{ color: '#0865a8', fontWeight: 700, textDecoration: 'none' }}
                        onMouseEnter={e => e.target.style.color = '#f57c00'}
                        onMouseLeave={e => e.target.style.color = '#0865a8'}>
                        {t('nav.home')}
                    </Link>
                    <span style={{ color: '#6b7280', margin: '0 6px' }}>•</span>
                    <span style={{ color: '#374151' }}>ICEMT Webinar - CEA Program</span>
                </div>
            </div>

            <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, px: { xs: 2, sm: 3, md: 4 }, mt: `${NAV_HEIGHT + 60}px` }}>

                {/* ── Header ── */}
                <Box sx={{ mb: { xs: 4, md: 6 } }}>

                    {/* Title — always centered */}
                    <Typography variant="h3" sx={{
                        fontFamily: '"Noto Kufi Arabic", serif', fontWeight: 'bold', mb: 2,
                        color: '#000', fontSize: { xs: '1.5rem', md: '2.5rem' }, textAlign: 'center',
                    }}>
                        ICEMT Webinar - CEA Program
                    </Typography>

                    {/* Subtitle — centered */}
                    <Typography variant="h6" sx={{
                        color: '#f57c00', fontFamily: '"Noto Kufi Arabic", serif', mb: 4,
                        fontSize: { xs: '1rem', md: '1.25rem' }, textAlign: 'center',
                    }}>
                        {t('cea.subtitle')}
                    </Typography>

                    {/* Intro paragraphs — inherit direction from wrapper */}
                    <Typography variant="body1" sx={{
                        fontFamily: '"Noto Kufi Arabic", serif', lineHeight: 1.9, mb: 3,
                        color: '#000', fontSize: { xs: '0.95rem', md: '1.05rem' },
                    }}>
                        {t('cea.intro1')}
                    </Typography>
                    <Typography variant="body1" sx={{
                        fontFamily: '"Noto Kufi Arabic", serif', lineHeight: 1.9, mb: 3,
                        color: '#000', fontSize: { xs: '0.95rem', md: '1.05rem' },
                    }}>
                        {t('cea.intro2')}
                    </Typography>
                </Box>

                {/* ── Objectives ── */}
                <Box sx={{ mb: { xs: 5, md: 6 }, maxWidth: '900px', mx: 'auto' }}>
                    {[1, 2].map(n => (
                        <Box key={n} sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            flexDirection: isRTL ? 'row-reverse' : 'row',
                            mb: 2.5, bgcolor: '#fff',
                            p: { xs: 2, md: 2.5 }, borderRadius: '12px', border: '1px solid #f0f0f0',
                            transition: 'all 0.3s ease',
                            '&:hover': { boxShadow: '0 4px 12px rgba(245,124,0,0.1)', borderColor: '#f57c00' },
                        }}>
                            <CheckCircle sx={{
                                color: '#f57c00',
                                ml: isRTL ? 2 : 0, mr: isRTL ? 0 : 2,
                                mt: 0.5, fontSize: { xs: 24, md: 28 }, flexShrink: 0,
                            }} />
                            <Typography variant="body1" sx={{
                                fontFamily: '"Noto Kufi Arabic", serif', flex: 1,
                                color: '#000', lineHeight: 1.9, fontSize: { xs: '0.95rem', md: '1.05rem' },
                            }}>
                                {t(`cea.objective${n}`)}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* ── Stages Accordion ── */}
                <Box sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography variant="h4" sx={{
                        fontFamily: '"Noto Kufi Arabic", serif', fontWeight: 'bold', mb: 4,
                        textAlign: 'center', color: '#0865a8', fontSize: { xs: '1.5rem', md: '2rem' },
                    }}>
                        {t('cea.stagesTitle')}
                    </Typography>
                    {[1, 2, 3].map(n => (
                        <Accordion key={n} sx={{
                            mb: 2, borderRadius: '12px !important', border: '1px solid #f0f0f0',
                            '&:before': { display: 'none' },
                            '&.Mui-expanded': { boxShadow: '0 4px 12px rgba(8,101,168,0.1)' },
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: '#f57c00', fontSize: 32 }} />}
                                sx={{
                                    bgcolor: 'white', borderRadius: '12px', '&:hover': { bgcolor: '#f8f9fa' },
                                    // flip chevron to correct side
                                    flexDirection: isRTL ? 'row-reverse' : 'row',
                                    '& .MuiAccordionSummary-expandIconWrapper': {
                                        marginLeft: isRTL ? 0 : 'auto',
                                        marginRight: isRTL ? 'auto' : 0,
                                    },
                                }}
                            >
                                <Typography variant="h6" sx={{
                                    fontFamily: '"Noto Kufi Arabic", serif', fontWeight: 'bold',
                                    color: '#0865a8', fontSize: { xs: '1.1rem', md: '1.25rem' },
                                }}>
                                    {t(`cea.stage${n}Title`)}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'white', p: { xs: 2, md: 3 } }}>
                                <Typography sx={{
                                    fontFamily: '"Noto Kufi Arabic", serif', lineHeight: 1.9,
                                    color: '#000', fontSize: { xs: '0.95rem', md: '1.05rem' },
                                }}>
                                    {t(`cea.stage${n}Content`)}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>

                {/* ── Gallery Slider ── */}
                <Box sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography variant="h4" sx={{
                        fontFamily: '"Noto Kufi Arabic", serif', fontWeight: 'bold', mb: 4,
                        textAlign: 'center', color: '#0865a8', fontSize: { xs: '1.5rem', md: '2rem' },
                    }}>
                        {t('cea.galleryTitle')}
                    </Typography>
                    <Box sx={{ position: 'relative', overflow: 'hidden', px: { xs: 0, md: 6 } }}>
                        <Box sx={{ display: 'flex', transition: 'transform 0.5s ease-in-out', transform: `translateX(${currentGallerySlide * -100}%)` }}>
                            {Array.from({ length: Math.ceil(galleryImages.length / 2) }).map((_, slideIndex) => (
                                <Box key={slideIndex} sx={{ minWidth: '100%', display: 'flex', px: 1 }}>
                                    <Grid container spacing={{ xs: 2, md: 3 }}>
                                        {galleryImages.slice(slideIndex * 4, slideIndex * 4 + 4).map((image, index) => {
                                            const actualIndex = slideIndex * 4 + index;
                                            return (
                                                <Grid item xs={6} sm={6} md={3} key={actualIndex}>
                                                    <Card onClick={() => handleImageClick(actualIndex)} sx={{
                                                        position: 'relative', height: { xs: 180, sm: 220, md: 260 },
                                                        overflow: 'hidden', borderRadius: '12px', cursor: 'pointer',
                                                        transition: 'all 0.4s ease',
                                                        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' },
                                                        '&:hover .image': { transform: 'scale(1.1)' },
                                                    }}>
                                                        <CardMedia component="img" height="100%" image={image.src} alt="" className="image"
                                                            sx={{ height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                        <IconButton onClick={handlePrevGallerySlide} disabled={currentGallerySlide === 0}
                            sx={{ position: 'absolute', right: { xs: -10, md: 0 }, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.95)', color: '#0865a8', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', '&:hover': { bgcolor: '#f57c00', color: 'white' }, '&.Mui-disabled': { bgcolor: 'rgba(200,200,200,0.5)', color: '#999' }, zIndex: 2 }}>
                            <ChevronLeft sx={{ fontSize: { xs: 28, md: 36 } }} />
                        </IconButton>
                        <IconButton onClick={handleNextGallerySlide} disabled={currentGallerySlide >= Math.ceil(galleryImages.length / 4) - 1}
                            sx={{ position: 'absolute', left: { xs: -10, md: 0 }, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.95)', color: '#0865a8', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', '&:hover': { bgcolor: '#f57c00', color: 'white' }, '&.Mui-disabled': { bgcolor: 'rgba(200,200,200,0.5)', color: '#999' }, zIndex: 2 }}>
                            <ChevronRight sx={{ fontSize: { xs: 28, md: 36 } }} />
                        </IconButton>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
                            {Array.from({ length: Math.ceil(galleryImages.length / 4) }).map((_, index) => (
                                <Box key={index} onClick={() => setCurrentGallerySlide(index)}
                                    sx={{ width: currentGallerySlide === index ? 30 : 10, height: 10, borderRadius: 5, bgcolor: currentGallerySlide === index ? '#f57c00' : '#d1d5db', cursor: 'pointer', transition: 'all 0.3s ease', '&:hover': { bgcolor: currentGallerySlide === index ? '#f57c00' : '#9ca3af' } }} />
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* ── Videos ── */}
                <Box sx={{ mb: { xs: 6, md: 8 } }}>
                    <Typography variant="h4" sx={{
                        fontFamily: '"Noto Kufi Arabic", serif', fontWeight: 'bold', mb: 4,
                        textAlign: 'center', color: '#0865a8', fontSize: { xs: '1.5rem', md: '2rem' },
                    }}>
                        {t('cea.videosTitle')}
                    </Typography>
                    <Grid container spacing={{ xs: 3, md: 4 }} direction="row">
                        {videos.map(video => (
                            <Grid item xs={12} sm={6} key={video.id}>
                                <Card sx={{
                                    position: 'relative', height: { xs: 250, md: 300 }, overflow: 'hidden',
                                    borderRadius: '16px', cursor: 'pointer', transition: 'all 0.4s ease',
                                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.2)' },
                                    '&:hover .play-icon': { transform: 'scale(1.2)', bgcolor: '#f57c00' },
                                }} onClick={() => setOpenVideo(video.id)}>
                                    {openVideo === video.id ? (
                                        <Box sx={{ height: '100%', width: '100%' }}>
                                            <iframe src={video.videoUrl} allow="autoplay; fullscreen" allowFullScreen style={{ width: '100%', height: '100%', border: 'none' }} />
                                        </Box>
                                    ) : (
                                        <>
                                            <CardMedia component="img" height="100%" image={video.thumbnail} alt={video.title} sx={{ height: '100%', objectFit: 'cover' }} />
                                            <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IconButton className="play-icon" sx={{ width: { xs: 60, md: 80 }, height: { xs: 60, md: 80 }, bgcolor: '#0865a8', color: 'white', transition: 'all 0.3s ease', '&:hover': { bgcolor: '#f57c00' } }}>
                                                    <PlayArrow sx={{ fontSize: { xs: 30, md: 40 } }} />
                                                </IconButton>
                                            </Box>
                                            {/* Video titles: always LTR English */}
                                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)', color: 'white', p: { xs: 2, md: 3 } }}>
                                                <Typography variant="body1" sx={{ fontFamily: '"Noto Kufi Arabic", serif', textAlign: 'left', direction: 'ltr', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                    {video.title}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* Image Modal */}
            <Dialog open={openImageModal} onClose={handleCloseImageModal} maxWidth="lg" fullWidth
                PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.95)', boxShadow: 'none' } }}>
                <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                    <IconButton onClick={handleCloseImageModal} sx={{ position: 'absolute', top: 10, right: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: '#f57c00' }, zIndex: 2 }}><Close /></IconButton>
                    <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: '#f57c00' }, zIndex: 2 }}><ChevronLeft sx={{ fontSize: 40 }} /></IconButton>
                    <IconButton onClick={handleNextImage} sx={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: '#f57c00' }, zIndex: 2 }}><ChevronRight sx={{ fontSize: 40 }} /></IconButton>
                    <Box component="img" src={galleryImages[selectedImageIndex].src} alt="" sx={{ maxWidth: '90%', maxHeight: '85vh', objectFit: 'contain' }} />
                    <Box sx={{ position: 'absolute', top: 20, left: 20, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', px: 2, py: 1, borderRadius: 1 }}>
                        <Typography sx={{ fontFamily: '"Noto Kufi Arabic", serif', fontSize: '0.9rem' }}>
                            {selectedImageIndex + 1} / {galleryImages.length}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CEAProgram;