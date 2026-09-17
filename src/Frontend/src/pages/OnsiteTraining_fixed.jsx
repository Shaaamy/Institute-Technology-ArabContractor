import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Modal, IconButton } from '@mui/material';
import { CheckCircle, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


const NAV_HEIGHT = 70;

const OnsiteTraining = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const benefits = [
        'هو تدريب تطبيقي علي المشروعات تحت التنفيذ ويتم بناء علي طلب العميل في المشروع المطلوب التدريب فيه للمهندسين / المشرفين / العمالة',
        'التدريب بناء علي مستندات المشروع ( المقايسة - المواصفات الفنية - الرسومات )',
        'يتم الإستعانة بخبراء متخصصين في كافة المجالات ( خرسانة - تشطيبات - كهروميكانيك ) لشرح وتطبيق المعلومات علي بنود العمل في المشروع وكذلك التدريب علي اكتشاف عيوب الصناعة وأسس استلام بنود الأعمال المختلفة.',
        'يتم عمل اختبار في نهاية البرنامج لقياس كفاءة المتدربين ومدي استيعابهم لموضوعات التدريب المختلفة'
    ];

    const projects = [
        {
            title: 'التدريب بمشروع محور روض الفرج',
            image: '/images/on-site-01.jpg'
        },
        {
            title: 'التدريب بمشروع محور روض الفرج',
            image: '/images/on-site-02.jpg'
        },
        {
            title: 'التدريب بمشروع العاصمة الإدارية الجديدة',
            image: '/images/on-site-03.jpg'
        },
        {
            title: 'التدريب بمشروع العاصمة الإدارية الجديدة',
            image: '/images/on-site-04.jpg'
        },
        {
            title: 'التدريب بمشروع العاصمة الإدارية الجديدة',
            image: '/images/on-site-05.jpg'
        }
    ];

    const handleOpenModal = (index) => {
        setSelectedImageIndex(index);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowLeft') {
            handleNextImage();
        } else if (event.key === 'ArrowRight') {
            handlePrevImage();
        } else if (event.key === 'Escape') {
            handleCloseModal();
        }
    };

    useEffect(() => {
        document.title = '      التدريب في الموقع - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#ffffff',
                fontFamily: '"Noto Kufi Arabic", serif',
            }}
            dir="rtl"
            lang="ar"
        >
           
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
                    <span style={{ color: '#374151', marginRight: '8px' }}>التدريب في الموقعة</span>
                </div>
            </div>            <Container
                maxWidth="lg"
                sx={{
                    pt: { xs: 18, md: 20 },
                    pb: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 3, md: 4 }
                }}
            >
                <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: '"Noto Kufi Arabic", serif',
                            fontWeight: 'bold',
                            mb: 2,
                            color: '#000000',
                            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }
                        }}
                    >
                        التدريب في الموقع
                    </Typography>
                </Box>

                <Box sx={{ mb: { xs: 4, md: 6 }, maxWidth: "900px", mx: "auto" }}>
                    {benefits.map((benefit, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                mb: 3,
                                textAlign: 'left',
                                bgcolor: '#ffffff',
                                p: { xs: 2, md: 2.5 },
                                borderRadius: '12px',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(8, 101, 168, 0.1)',
                                    borderColor: '#0865a8',
                                }
                            }}
                        >
                            <CheckCircle
                                sx={{
                                    color: '#f57c00',
                                    ml: 2,
                                    mt: 0.5,
                                    fontSize: { xs: 24, md: 28 },
                                    flexShrink: 0
                                }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: '"Noto Kufi Arabic", serif',
                                    lineHeight: 1.9,
                                    flex: 1,
                                    color: '#000000',
                                    fontSize: { xs: "0.95rem", md: "1.05rem" }
                                }}
                            >
                                {benefit}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: '"Noto Kufi Arabic", serif',
                            fontWeight: 'bold',
                            color: '#0865a8',
                            fontSize: { xs: "1.25rem", md: "1.5rem" }
                        }}
                    >
                        مشاريع التدريب
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', pb: 4 }}>
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                        effect="coverflow"
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView="auto"
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={true}
                        dir="rtl"
                        style={{
                            paddingTop: '20px',
                            paddingBottom: '50px',
                        }}
                    >
                        {projects.map((project, index) => (
                            <SwiperSlide
                                key={index}
                                style={{
                                    width: '400px',
                                    maxWidth: '90vw',
                                }}
                            >
                                <Box
                                    onClick={() => handleOpenModal(index)}
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 300, sm: 350, md: 400 },
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                                        transition: 'all 0.4s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                                        },
                                        '&:hover .overlay': {
                                            opacity: 1,
                                        },
                                        '&:hover .image': {
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={project.image}
                                        alt={project.title}
                                        className="image"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.4s ease',
                                        }}
                                    />
                                    <Box
                                        className="overlay"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'linear-gradient(to top, rgba(8, 101, 168, 0.95) 0%, rgba(8, 101, 168, 0.7) 70%, transparent 100%)',
                                            color: 'white',
                                            p: 3,
                                            opacity: 0,
                                            transition: 'opacity 0.4s ease',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            minHeight: '100px',
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: '"Noto Kufi Arabic", serif',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                width: '100%',
                                                fontSize: { xs: "1rem", md: "1.15rem" }
                                            }}
                                        >
                                            {project.title}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: 0,
                                            height: 0,
                                            borderStyle: 'solid',
                                            borderWidth: '0 70px 70px 0',
                                            borderColor: 'transparent #f57c00 transparent transparent',
                                            opacity: 0.9,
                                        }}
                                    />
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <Box
                        className="swiper-button-prev-custom"
                        sx={{
                            position: 'absolute',
                            right: { xs: 10, md: 20 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            width: { xs: 40, md: 50 },
                            height: { xs: 40, md: 50 },
                            bgcolor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#0865a8',
                                '& svg': {
                                    color: 'white',
                                }
                            }
                        }}
                    >
                        <ChevronLeft sx={{ fontSize: { xs: 28, md: 36 }, color: '#0865a8' }} />
                    </Box>

                    <Box
                        className="swiper-button-next-custom"
                        sx={{
                            position: 'absolute',
                            left: { xs: 10, md: 20 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            width: { xs: 40, md: 50 },
                            height: { xs: 40, md: 50 },
                            bgcolor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#0865a8',
                                '& svg': {
                                    color: 'white',
                                }
                            }
                        }}
                    >
                        <ChevronRight sx={{ fontSize: { xs: 28, md: 36 }, color: '#0865a8' }} />
                    </Box>
                </Box>

                <style>
                    {`
                        .swiper-pagination-bullet {
                            background: #0865a8 !important;
                            opacity: 0.5;
                        }
                        .swiper-pagination-bullet-active {
                            background: #f57c00 !important;
                            opacity: 1;
                        }
                        .swiper-3d .swiper-slide-shadow-left,
                        .swiper-3d .swiper-slide-shadow-right {
                            background-image: linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0));
                        }
                    `}
                </style>
            </Container>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                onKeyDown={handleKeyDown}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
                        height: { xs: '70%', sm: '75%', md: '80%', lg: '85%' },
                        maxWidth: 1400,
                        maxHeight: 900,
                        bgcolor: 'transparent',
                        outline: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconButton
                        onClick={handleCloseModal}
                        sx={{
                            position: 'absolute',
                            top: { xs: -10, md: -20 },
                            right: { xs: -10, md: -20 },
                            bgcolor: 'white',
                            color: '#0865a8',
                            zIndex: 1500,
                            '&:hover': {
                                bgcolor: '#f57c00',
                                color: 'white',
                            },
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <Close />
                    </IconButton>

                    <IconButton
                        onClick={handlePrevImage}
                        sx={{
                            position: 'absolute',
                            right: { xs: -15, md: -30 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'white',
                            color: '#0865a8',
                            zIndex: 1500,
                            '&:hover': {
                                bgcolor: '#f57c00',
                                color: 'white',
                            },
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            width: { xs: 40, md: 50 },
                            height: { xs: 40, md: 50 },
                        }}
                    >
                        <ChevronLeft sx={{ fontSize: { xs: 28, md: 36 } }} />
                    </IconButton>

                    <IconButton
                        onClick={handleNextImage}
                        sx={{
                            position: 'absolute',
                            left: { xs: -15, md: -30 },
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'white',
                            color: '#0865a8',
                            zIndex: 1500,
                            '&:hover': {
                                bgcolor: '#f57c00',
                                color: 'white',
                            },
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            width: { xs: 40, md: 50 },
                            height: { xs: 40, md: 50 },
                        }}
                    >
                        <ChevronRight sx={{ fontSize: { xs: 28, md: 36 } }} />
                    </IconButton>

                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src={projects[selectedImageIndex].image}
                            alt={projects[selectedImageIndex].title}
                            sx={{
                                maxWidth: '100%',
                                maxHeight: 'calc(100% - 80px)',
                                objectFit: 'contain',
                                borderRadius: 2,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            }}
                        />

                        <Box
                            sx={{
                                mt: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.95)',
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontFamily: '"Noto Kufi Arabic", serif',
                                    color: '#0865a8',
                                    textAlign: 'center',
                                    fontSize: { xs: "0.95rem", md: "1.1rem" }
                                }}
                            >
                                {projects[selectedImageIndex].title}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: '"Noto Kufi Arabic", serif',
                                    color: '#6b7280',
                                    textAlign: 'center',
                                    mt: 0.5,
                                    fontSize: { xs: "0.8rem", md: "0.9rem" }
                                }}
                            >
                                {selectedImageIndex + 1} / {projects.length}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Box >
    );
};

export default OnsiteTraining;