import path from 'node:path';

import { crx } from '@crxjs/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import zip from 'vite-plugin-zip-pack';

import manifest from './manifest.config.js';
import { name, version } from './package.json';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve('src'),
        },
    },
    plugins: [
        react(),
        tailwindcss(),
        crx({ manifest }),
        zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
    ],
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173,
        },
        cors: {
            origin: [
                /chrome-extension:\/\//,
            ],
        },
    },
    build: {
        rollupOptions: {
            input: {
                newtab: 'src/newtab/index.html',
            },
        },
    },
    legacy: {
        skipWebSocketTokenCheck: true,
    },
});
