import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import theme, { cacheRtl } from './theme/theme.js';
import './index.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import ErrorBoundary from './pages/ErrorBoundary.jsx';
const PUBLISHABLE_KEY = "pk_test_bWlnaHR5LWJhc2lsaXNrLTExLmNsZXJrLmFjY291bnRzLmRldiQ"
import './i18n/index.js'; // ← ADD THIS LINE (before App)
//const PUBLISHABLE_KEY = "pk_live_Y2xlcmsuYWN3ZWJzaXRlLWljbWV0LXRlc3QuYXp1cmV3ZWJzaXRlcy5uZXQk"

if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
}
ReactDOM.createRoot(document.getElementById('root')).render(
    //<React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <div dir="rtl">
                        <ErrorBoundary>
                            <App />
                        </ErrorBoundary>
                    </div>
                </BrowserRouter>
            </ThemeProvider>
        </CacheProvider>
    </ClerkProvider>
    //</React.StrictMode>
);