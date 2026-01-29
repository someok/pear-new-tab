import { defineManifest } from '@crxjs/vite-plugin';

import pkg from './package.json';

export default defineManifest({
    manifest_version: 3,
    name: pkg.productName,
    version: pkg.version,
    icons: {
        16: 'public/icon-16.png',
        48: 'public/icon-48.png',
        128: 'public/icon-128.png',
    },
    permissions: [
        'storage',
        'bookmarks',
        'favicon',
        'tabs',
        'tabGroups',
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
            16: 'public/icon-16.png',
            48: 'public/icon-48.png',
            128: 'public/icon-128.png',
        },
        default_popup: 'src/popup/index.html',
    },
    chrome_url_overrides: {
        newtab: 'src/newtab/index.html',
    },
});
