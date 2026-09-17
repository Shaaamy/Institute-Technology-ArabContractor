import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: false
    },
    optimizeDeps: {
        include: [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
            '@clerk/clerk-react'
        ],
        exclude: [
            'exceljs',
            'xlsx',
            'jspdf',
            'jspdf-autotable',
            'docx'
        ]
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Export libraries — lazy loaded only when user clicks export
                    if (
                        id.includes('exceljs') ||
                        id.includes('xlsx') ||
                        id.includes('jspdf') ||
                        id.includes('jspdf-autotable') ||
                        id.includes('docx') ||
                        id.includes('jszip')
                    ) {
                        return 'vendor-export';
                    }
                    // Charts — only loaded on pages that use recharts
                    if (id.includes('recharts') || id.includes('d3-') || id.includes('victory')) {
                        return 'vendor-charts';
                    }
                    // Animations
                    if (id.includes('framer-motion')) {
                        return 'vendor-framer';
                    }
                    // Icons — both libraries together
                    if (id.includes('lucide-react') || id.includes('react-icons')) {
                        return 'vendor-icons';
                    }
                    if (id.includes('@clerk')) {
                        return 'vendor-clerk';
                    }
                    if (id.includes('gsap') || id.includes('swiper')) {
                        return 'vendor-animation';
                    }
                    if (id.includes('@mui')) {
                        return 'vendor-mui';
                    }
                    if (id.includes('node_modules')) {
                        return 'vendor-core';
                    }
                }
            }
        }
    }
})