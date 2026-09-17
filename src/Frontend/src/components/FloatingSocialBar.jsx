import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTranslation } from 'react-i18next';

const FloatingSocialBar = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const socials = [
        {
            titleKey: 'social.facebook',
            href: 'https://www.facebook.com/arabcont.icemt',
            icon: <FacebookIcon fontSize="large" />,
            color: '#1877F2',
        },
        {
            titleKey: 'social.youtube',
            href: 'https://youtube.com/@ac-icemt?si=dS7CixRAX08votqw',
            icon: <YouTubeIcon fontSize="large" />,
            color: '#FF0000',
        },
        {
            titleKey: 'social.whatsapp',
            href: 'https://wa.me/201109754459',
            icon: <WhatsAppIcon fontSize="large" />,
            color: '#25D366',
        },
        {
            titleKey: 'social.linkedin',
            href: 'https://www.linkedin.com/company/arabcont-icemt/posts/?feedView=all',
            icon: <LinkedInIcon fontSize="large" />,
            color: '#0A66C2',
        },
    ];

    return (
        <Box sx={{
            position: 'fixed',
            right: isRTL ? 16 : 'auto',
            left: isRTL ? 'auto' : 16,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            zIndex: 1300,
        }}>
            {socials.map(({ titleKey, href, icon, color }) => (
                <Tooltip
                    key={titleKey}
                    title={t(titleKey)}
                    placement={isRTL ? 'left' : 'right'}
                >
                    <IconButton
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            bgcolor: 'white',
                            color,
                            boxShadow: 3,
                            width: 50,
                            height: 50,
                            '&:hover': { bgcolor: color, color: 'white' },
                        }}
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            ))}
        </Box>
    );
};

export default FloatingSocialBar;