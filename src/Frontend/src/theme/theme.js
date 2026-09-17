import { createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

export const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
    direction: 'rtl',
    palette: {
        primary: {
            main: '#0865A8',
        },
        background: {
            default: '#F5F7E1',
            paper: '#ffffff',
        },
        grey: {
            300: '#D9D9D9',
        },
    },
    typography: {
        fontFamily: '"Noto Kufi Arabic", serif',
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#393939',
                },
            },
        },
        MuiFooter: {
            styleOverrides: {
                root: {
                    backgroundColor: '#D9D9D9',
                    color: '#393939',
                },
            },
        },
    },
});

export default theme;