import { isEmpty, noop } from 'lodash-es';
import { proxy, subscribe, useSnapshot } from 'valtio';

import { isDev } from '../utils/envUtils';

const WORKSPACES_KEY = 'app-workspaces';
const ACTIVE_WORKSPACE_ID_KEY = 'app-workspaces-active-id';

/**
 *
 * @typedef {import('./bookmarkStoreTypes').WorkspaceItem} WorkspaceItem
 */

const state = proxy({
    /** @type WorkspaceItem[] */
    workspaces: [],

    activeWorkspaceId: null,

    bookmarks: [],
});

function log(msg, ...extra) {
    console.log(`%c[store] %c${msg}`, 'color: #eb2f96; font-weight: bold', 'color: #1890ff', ...extra);
}

if (isDev) {
    subscribe(state, () => log('state has changed to', state));
}

async function updateBookmarks(parentId) {
    try {
        const result = await chrome.bookmarks.getSubTree(parentId);
        state.bookmarks = result?.[0]?.children ?? [];
        await chrome.storage.sync.set({ [ACTIVE_WORKSPACE_ID_KEY]: parentId });
        return [true, null];
    } catch (err) {
        return [null, err];
    }
}

async function getInitialState() {
    const result = await chrome.storage.sync.get([WORKSPACES_KEY, ACTIVE_WORKSPACE_ID_KEY]);
    const workspaces = result[WORKSPACES_KEY] || [];
    const activeWorkspaceId = result[ACTIVE_WORKSPACE_ID_KEY];

    state.workspaces = workspaces;

    if (!isEmpty(workspaces)) {
        // 没有活动工作区，则默认使用第一个工作区
        if (!activeWorkspaceId) {
            state.activeWorkspaceId = workspaces[0].id;
        } else {
            // 存在工作区还得检查 activeWorkspaceId 是否还存在
            const exist = workspaces.some((w) => w.id === activeWorkspaceId);
            if (exist) {
                state.activeWorkspaceId = activeWorkspaceId;
            } else {
                state.activeWorkspaceId = workspaces[0].id;
            }
        }
    }
    await updateBookmarks(state.activeWorkspaceId);
}

// --- 初始化状态 ---
getInitialState().catch(noop);

export const useBookmarkStore = () => useSnapshot(state);

export async function addWorkspace({ id, title }) {
    state.workspaces.push({ id, title });
    state.activeWorkspaceId = id;

    await updateBookmarks(id);

    // 保存 workspaces 到 storage
    const workspaces = state.workspaces.map((workspace) => ({ ...workspace }));
    await chrome.storage.sync.set({ [WORKSPACES_KEY]: workspaces, [ACTIVE_WORKSPACE_ID_KEY]: id });
}

export async function activeWorkspace(id) {
    state.activeWorkspaceId = id;
    await updateBookmarks(id);
}
