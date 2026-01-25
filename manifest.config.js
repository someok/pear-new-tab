import { defineManifest } from '@crxjs/vite-plugin';

import pkg from './package.json';

export default defineManifest({
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    icons: {
        48: 'public/logo.png',
    },
    permissions: [
        'sidePanel',
        'contentSettings',
        'storage',
        'bookmarks',
        'favicon',
    ],
    web_accessible_resources: [
        {
            resources: ['_favicon/*'],
            matches: ['<all_urls>'],
            extension_ids: ['*'],
        },
    ],
    action: {
        default_icon: {
            48: 'public/logo.png',
        },
        default_popup: 'src/popup/index.html',
    },
    content_scripts: [{
        js: ['src/content/main.jsx'],
        matches: ['https://*/*'],
    }],
    side_panel: {
        default_path: 'src/sidepanel/index.html',
    },
    chrome_url_overrides: {
        newtab: 'src/newtab/index.html',
    },
});
