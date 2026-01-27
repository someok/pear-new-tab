import { isEmpty, noop } from 'lodash-es';
import { proxy, subscribe, useSnapshot } from 'valtio';

import { isDev } from '../utils/envUtils';

const WORKSPACES_KEY = 'app-workspaces';
const ACTIVE_WORKSPACE_ID_KEY = 'app-workspaces-active-id';

/**
 * @typedef {import('@/types/bookmarkTypes').WorkspaceItem} WorkspaceItem
 * @typedef {import('@/types/bookmarkTypes').BookmarkFolder} BookmarkFolder
 */

const state = proxy({
    /** @type WorkspaceItem[] */
    workspaces: [],

    activeWorkspaceId: null,

    /** @type BookmarkFolder[] */
    bookmarks: [],

    selectedBookmarkIds: [],
});

function log(msg, ...extra) {
    console.log(`%c[store] %c${msg}`, 'color: #eb2f96; font-weight: bold', 'color: #1890ff', ...extra);
}

if (isDev) {
    subscribe(state, () => log('state has changed to', state));
}

async function loadWorkspaceBookmarks(workspaceId) {
    const result = await chrome.bookmarks.getSubTree(workspaceId);
    log('load workspace bookmarks', result);

    state.bookmarks = result?.[0]?.children ?? [];
}

async function updateBookmarks(parentId) {
    try {
        await loadWorkspaceBookmarks(parentId);
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

// 保存 workspaces 到 storage
async function saveSyncWorkspaces(activeWorkspaceId) {
    const workspaces = state.workspaces.map((workspace) => ({ ...workspace }));
    await chrome.storage.sync.set({ [WORKSPACES_KEY]: workspaces, [ACTIVE_WORKSPACE_ID_KEY]: activeWorkspaceId });
}

export async function addWorkspace({ id, title }) {
    state.workspaces.push({ id, title });
    state.activeWorkspaceId = id;

    await updateBookmarks(id);

    // 保存 workspaces 到 storage
    await saveSyncWorkspaces(id);
}

export async function removeWorkspace(id) {
    state.workspaces = state.workspaces.filter((w) => w.id !== id);
    // 如果删除的是 activeWorkspaceId，则激活剩余的第一个工作区，否则为空值
    if (state.activeWorkspaceId === id) {
        state.activeWorkspaceId = state.workspaces[0]?.id || null;

        if (state.activeWorkspaceId) {
            await updateBookmarks(state.activeWorkspaceId);
        } else {
            state.bookmarks = [];
        }
    }
    await saveSyncWorkspaces(state.activeWorkspaceId);
}

export async function activeWorkspace(id) {
    state.activeWorkspaceId = id;
    await updateBookmarks(id);
}

export function toggleBookmark(id) {
    if (state.selectedBookmarkIds.includes(id)) {
        state.selectedBookmarkIds = state.selectedBookmarkIds.filter((i) => i !== id);
    } else {
        state.selectedBookmarkIds.push(id);
    }
}

export function updateFolders(newFolders) {
    state.bookmarks = newFolders;
}

/**
 * 在同一个文件夹中移动书签
 *
 * @param id 书签 ID
 * @param srcIndex 源索引
 * @param destIndex 目标索引
 * @return {Promise<void>}
 */
export async function moveBookmarkAtSameFolder(id, srcIndex, destIndex) {
    // 如果是在同一个文件夹内移动，且是向后移（Index变大）
    // 实际上需要插入到目标位置的下一个锚点之前
    let finalIndex = destIndex;
    if (srcIndex < destIndex) {
        finalIndex += 1;
    }

    await chrome.bookmarks.move(id, { index: finalIndex });
    // console.log('moveBookmark', node, destIndex);

    await loadWorkspaceBookmarks(state.activeWorkspaceId);
}
