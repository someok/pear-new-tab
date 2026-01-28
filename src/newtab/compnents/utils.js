/**
 * @typedef {import('@/types/bookmarkTypes').BookmarkFolder} BookmarkFolder
 * @typedef {import('@/types/bookmarkTypes').BookmarkNode} BookmarkNode
 */

/**
 * 使用目录 id 和书签条目 Id 拼接成唯一 id
 * @param folderId
 * @param itemId
 * @return {string}
 */
export function getUniqueId(folderId, itemId) {
    return `${folderId}-${itemId}`;
}

export function parseUniqueId(uniqueId) {
    return uniqueId.split('-');
}

/**
 * 返回给定目录下的所有书签条目
 *
 * @param {BookmarkFolder} folder
 * @return {BookmarkNode[]}
 */
export function getFolderItems(folder) {
    if (!folder || !folder.children) {
        return [];
    }

    // 存在 dateGroupModified 字段的表示是文件夹
    return folder.children
        .filter((item) => !item.dateGroupModified);
}
