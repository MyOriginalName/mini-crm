import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
            // Add SSR entry point
            ssr: 'resources/js/ssr.jsx',
        }),
        react({
            // Add fastRefresh configuration
            fastRefresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'), 
            '@css': path.resolve(__dirname, 'resources/css'),
        },
    },
    // Optimize for production
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', '@inertiajs/react'],
                },
            },
        },
    },
});
