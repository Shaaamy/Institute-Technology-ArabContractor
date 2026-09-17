import React from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
} from "@mui/material";
import {
    Engineering,
    Business,
    MenuBook,
    LocationOn,
    Chair,
} from "@mui/icons-material";
import { useEffect } from "react";

const NAV_HEIGHT = 70; // Adjust this if your navbar height is different

const TrainingMethods = () => {
    const features = [
        {
            icon: <Engineering sx={{ fontSize: { xs: 50, md: 60 }, color: "#f57c00" }} />,
            title: "الثروة البشرية",
            description:
                "لدينا ثروة بشرية هائلة لديها خبرات تراكمية تكونت عبر سنوات من العمل الطويل في المشروعات القومية سواء كان ذلك في داخل جمهورية مصر العربية أو خارجها",
        },
        {
            icon: <Business sx={{ fontSize: { xs: 50, md: 60 }, color: "#f57c00" }} />,
            title: "المواد العلمية والتدريبية",
            description:
                "نمتلك مجموعة كبيرة من المواد العلمية والتدريبية (حوالي 2500 مادة تدريبية) موضوعة من خلال مجموعة منتقاه من الخبراء وأساتذة الجامعات ومن خلالها يمكن تنفيذ دورات تدريبية محددة طبقاً لخطة المعهد أو طبقاً لإحتياجات العميل",
        },
        {
            icon: <MenuBook sx={{ fontSize: { xs: 50, md: 60 }, color: "#f57c00" }} />,
            title: "مركز المعلومات والمكتبة",
            description:
                "نمتلك مركز للمعلومات ومكتبة متخصصة في العلوم (الهندسية - المالية - الإدارية) بكافة أنواعها لخدمة قطاع البناء والتشييد والقطاعات الأخرى بالدولة",
        },
        {
            icon: <LocationOn sx={{ fontSize: { xs: 50, md: 60 }, color: "#f57c00" }} />,
            title: "التدريب في الموقع",
            description:
                "لدينا ميزة التدريب في الموقع والمشروعات التابعة للشركة والمنتشرة في جميع أنحاء الجمهورية",
        },
        {
            icon: <Chair sx={{ fontSize: { xs: 50, md: 60 }, color: "#f57c00" }} />,
            title: "قاعات التدريب",
            description:
                "نمتلك قاعات تدريب مجهزة بأحدث وسائل العرض والمساعدات التدريبية",
        },
    ];

    useEffect(() => {
        document.title = '       خدمات تدريبية مميزة - المعهد التكنولوجي لهندسة التشييد والإدارة';
    }, []);

    return (
        <Box
            dir="ltr"
            lang="ar"
            sx={{
                minHeight: "100vh",
                bgcolor: "#ffffff",
                fontFamily: '"Noto Kufi Arabic", serif',
            }}
        >
            {/* Fixed Overview Bar - positioned under navbar */}
           
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
                    <span style={{ color: '#374151', marginRight: '8px' }}>  خدمات تدريبية مميزة</span>
                </div>
            </div>
            {/* Main Content - with top padding to account for fixed bar */}
            <Container
                maxWidth="lg"
                sx={{
                    pt: { xs: `${NAV_HEIGHT + 60}px`, md: `${NAV_HEIGHT + 80}px` },
                    pb: { xs: 6, md: 8 },
                    px: { xs: 2, sm: 3, md: 4 }
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "#000000",
                            fontFamily: '"Noto Kufi Arabic", serif',
                            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" }
                        }}
                    >
                        أحدث طرق التدريب
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "#000000",
                            fontFamily: '"Noto Kufi Arabic", serif',
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            px: { xs: 2, md: 0 }
                        }}
                    >
                        يمتلك المعهد مجموعة من المقومات التي تأهله لتقديم خدمات تدريبية مميزة
                    </Typography>
                </Box>

                {/* Features Grid */}
                <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item key={index} xs={12} sm={6} lg={4} sx={{ display: "flex", justifyContent: "center" }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    width: { xs: "100%", sm: "320px", md: "350px" },
                                    height: { xs: "auto", sm: "400px" },
                                    minHeight: "380px",
                                    p: { xs: 3, md: 3.5 },
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    bgcolor: "#ffffff",
                                    borderRadius: "20px",
                                    border: "2px solid #f0f0f0",
                                    transition: "all 0.4s ease",
                                    fontFamily: '"Noto Kufi Arabic", serif',
                                    position: "relative",
                                    overflow: "hidden",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: "4px",
                                        background: "linear-gradient(90deg, #f57c00 0%, #0865a8 100%)",
                                    },
                                    "&:hover": {
                                        transform: "translateY(-10px)",
                                        boxShadow: "0 12px 24px rgba(8, 101, 168, 0.15)",
                                        borderColor: "#0865a8",
                                    },
                                }}
                            >
                                {/* Icon Container */}
                                <Box
                                    sx={{
                                        mb: 2.5,
                                        mt: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "50%",
                                        bgcolor: "#fff5f0",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            bgcolor: "#ffe9dc",
                                            transform: "scale(1.1)",
                                        }
                                    }}
                                >
                                    {feature.icon}
                                </Box>

                                {/* Title */}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 2,
                                        color: "#0865a8",
                                        fontFamily: '"Noto Kufi Arabic", serif',
                                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                                        textAlign: "center",
                                    }}
                                >
                                    {feature.title}
                                </Typography>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#000000",
                                        textAlign: "left",
                                        lineHeight: 1.8,
                                        fontFamily: '"Noto Kufi Arabic", serif',
                                        fontSize: { xs: "0.85rem", md: "0.9rem" },
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default TrainingMethods;