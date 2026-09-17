import React from 'react';
import {
    Box, Container, Typography, Grid,
    Link as MuiLink, IconButton, Stack
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import FaxIcon from '@mui/icons-material/Fax';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const quickLinks = [
        { key: 'footer.links.about', path: '/overview' },
        { key: 'footer.links.news', path: '/news' },
        { key: 'footer.links.contact', path: '/contact' },
    ];

    const headingAfter = {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: isRTL ? 'auto' : 0,
        right: isRTL ? 0 : 'auto',
        width: 40,
        height: 2,
        bgcolor: '#f57c00',
    };

    return (
        <Box
            component="footer"
            dir={isRTL ? 'rtl' : 'ltr'}
            sx={{
                backgroundImage: 'linear-gradient(#070707,#0865a8)',
                color: 'white',
                py: { xs: 4, md: 6 },
                borderTop: '3px solid #f57c00',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '100%',
                    background: 'radial-gradient(circle at 20% 50%, rgba(245,124,0,0.05) 0%, transparent 50%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>

                    {/* ── Col 1: Institute name & address ── */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{
                            fontWeight: 'bold', mb: 2, color: '#f57c00',
                            fontFamily: '"Noto Kufi Arabic",serif',
                            fontSize: { xs: '1rem', md: '1.1rem' }, lineHeight: 1.4,
                        }}>
                            {t('footer.instituteName')}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                            <LocationOnIcon fontSize="small" sx={{ color: '#f57c00', mt: 0.3, fontSize: '1.2rem', flexShrink: 0 }} />
                            <Typography variant="body2" sx={{
                                lineHeight: 1.7, fontFamily: '"Noto Kufi Arabic",serif',
                                color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem',
                            }}>
                                {t('footer.address')}
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            bgcolor: 'rgba(245,124,0,0.1)', py: 1, px: 1.5,
                            borderRadius: 1, border: '1px solid rgba(245,124,0,0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': { bgcolor: 'rgba(245,124,0,0.15)', borderColor: 'rgba(245,124,0,0.4)' },
                        }}>
                            <EmailIcon fontSize="small" sx={{ color: '#f57c00', fontSize: '1.1rem', flexShrink: 0 }} />
                            <MuiLink href="mailto:icemt@arabcont.com" color="inherit" underline="hover"
                                sx={{ fontFamily: '"Noto Kufi Arabic",serif', fontSize: '0.85rem', color: 'white', '&:hover': { color: '#f57c00' } }}>
                                icemt@arabcont.com
                            </MuiLink>
                        </Box>
                    </Grid>

                    {/* ── Col 2: Contact ── */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }} sx={{
                        borderInlineStart: { xs: 'none', md: '1px solid rgba(255,255,255,0.15)' },
                        paddingInlineStart: { xs: 0, md: 4 },
                    }}>
                        <Typography variant="h6" gutterBottom sx={{
                            fontWeight: 'bold', mb: 2.5,
                            fontFamily: '"Noto Kufi Arabic",serif', color: 'white',
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            position: 'relative',
                            '&::after': headingAfter,
                        }}>
                            {t('footer.contactUs')}
                        </Typography>
                        <Stack spacing={2}>
                            {[
                                { icon: <PhoneIcon fontSize="small" sx={{ color: '#0865a8', fontSize: '1.1rem', flexShrink: 0 }} />, label: t('footer.phone'), value: '+2 02 23892120' },
                                { icon: <FaxIcon fontSize="small" sx={{ color: '#0865a8', fontSize: '1.1rem', flexShrink: 0 }} />, label: t('footer.fax'), value: '+2 02 23892025' },
                            ].map(({ icon, label, value }) => (
                                <Box key={label} sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: isRTL ? 'translateX(-3px)' : 'translateX(3px)',
                                        '& .MuiSvgIcon-root': { color: '#f57c00' },
                                    },
                                }}>
                                    {icon}
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: '"Noto Kufi Arabic",serif', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', mb: 0.2 }}>
                                            {label}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: '"Noto Kufi Arabic",serif', fontSize: '0.85rem' }}>
                                            {value}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Grid>

                    {/* ── Col 3: Working Hours ── */}
                    <Grid size={{ xs: 12, sm: 6, md: 2.5 }} sx={{
                        borderInlineStart: { xs: 'none', md: '1px solid rgba(255,255,255,0.15)' },
                        paddingInlineStart: { xs: 0, md: 4 },
                    }}>
                        <Typography variant="h6" gutterBottom sx={{
                            fontWeight: 'bold', mb: 2.5,
                            fontFamily: '"Noto Kufi Arabic",serif', color: 'white',
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            position: 'relative',
                            '&::after': headingAfter,
                        }}>
                            {t('footer.workingHours')}
                        </Typography>
                        <Box sx={{
                            display: 'flex', alignItems: 'flex-start', gap: 1.5,
                            bgcolor: 'rgba(8,101,168,0.2)', p: 2, borderRadius: 1,
                            border: '1px solid rgba(8,101,168,0.3)',
                        }}>
                            <AccessTimeIcon fontSize="small" sx={{ color: '#f57c00', mt: 0.3, fontSize: '1.2rem', flexShrink: 0 }} />
                            <Box>
                                <Typography variant="body2" sx={{ mb: 1, fontFamily: '"Noto Kufi Arabic",serif', color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                    {t('footer.workDays')}
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: '"Noto Kufi Arabic",serif', color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                    {t('footer.workTime')}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* ── Col 4: Quick Links ── */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{
                        borderInlineStart: { xs: 'none', md: '1px solid rgba(255,255,255,0.15)' },
                        paddingInlineStart: { xs: 0, md: 4 },
                    }}>
                        <Typography variant="h6" gutterBottom sx={{
                            fontWeight: 'bold', mb: 2.5,
                            fontFamily: '"Noto Kufi Arabic",serif', color: 'white',
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            position: 'relative',
                            '&::after': headingAfter,
                        }}>
                            {t('footer.quickLinks')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {quickLinks.map(({ key, path }) => (
                                <MuiLink key={key} component={Link} to={path} color="inherit" underline="none" sx={{
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    fontFamily: '"Noto Kufi Arabic",serif', fontSize: '0.85rem',
                                    color: 'rgba(255,255,255,0.85)', transition: 'all 0.2s ease', py: 0.5,
                                    '&:hover': {
                                        color: '#f57c00',
                                        transform: isRTL ? 'translateX(-5px)' : 'translateX(5px)',
                                        '& .arrow': { color: '#f57c00' },
                                    },
                                }}>
                                    <Box component="span" className="arrow" sx={{ color: '#0865a8', fontWeight: 'bold', fontSize: '0.7rem', transition: 'color 0.2s ease', flexShrink: 0 }}>
                                        {isRTL ? '◄' : '►'}
                                    </Box>
                                    {t(key)}
                                </MuiLink>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                {/* ── Bottom bar ── */}
                <Box sx={{
                    mt: { xs: 5, md: 6 }, pt: 3,
                    borderTop: '1px solid rgba(245,124,0,0.3)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, md: 0 },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                }}>
                    <Box>
                        <Typography variant="body2" sx={{
                            color: 'rgba(255,255,255,0.7)', fontFamily: '"Noto Kufi Arabic",serif',
                            fontSize: { xs: '0.75rem', md: '0.8rem' }, lineHeight: 1.6, mb: 1,
                        }}>
                            {t('footer.rights')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#f57c00', display: 'block', fontFamily: '"Noto Kufi Arabic",serif', fontSize: '0.9rem' }}>
                            {t('footer.designedBy')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        {[
                            { href: 'https://www.facebook.com/arabcont.icemt', icon: <FacebookIcon fontSize="small" />, hoverBg: '#1877F2', shadow: 'rgba(24,119,242,0.4)' },
                            { href: 'https://youtube.com/@ac-icemt?si=dS7CixRAX08votqw', icon: <YouTubeIcon fontSize="small" />, hoverBg: '#FF0000', shadow: 'rgba(255,0,0,0.4)' },
                            { href: 'https://wa.me/201109754459', icon: <WhatsAppIcon fontSize="small" />, hoverBg: '#25D366', shadow: 'rgba(37,211,102,0.4)' },
                            { href: 'https://www.linkedin.com/company/arabcont-icemt/posts/?feedView=all', icon: <LinkedInIcon fontSize="small" />, hoverBg: '#0A66C2', shadow: 'rgba(10,102,194,0.4)' },
                        ].map(({ href, icon, hoverBg, shadow }) => (
                            <IconButton key={href} size="small" component="a" href={href} target="_blank" rel="noopener noreferrer"
                                sx={{
                                    color: 'white', bgcolor: 'rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { color: 'white', bgcolor: hoverBg, transform: 'translateY(-3px)', boxShadow: `0 4px 12px ${shadow}` },
                                }}>
                                {icon}
                            </IconButton>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;