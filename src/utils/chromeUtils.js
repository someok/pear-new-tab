// 1. 定义合法的颜色类型，防止拼写错误
// type ColorEnum = "grey" | "blue" | "red" | "yellow" | "green" | "pink" | "purple" | "cyan" | "orange";

/**
 * 打开一组 URL 并将其放入同一个标签组
 *
 * @param {string[]} urls 要打开的链接数组
 * @param {string=} title 标签组的名称
 * @param {chrome.tabGroups.Color=} color 标签组颜色 (可选)
 */
export async function openTabsInGroup(
    urls,
    title = 'My Group',
    color = 'blue',
) {
    try {
        // 【关键步骤 1】显式获取当前窗口 ID
        const currentWindow = await chrome.windows.getCurrent();
        const windowId = currentWindow.id;

        if (!windowId)
            throw new Error('无法获取当前窗口 ID');

        // 2. 在指定窗口创建 Tabs
        const tabPromises = urls.map((url) =>
            chrome.tabs.create({
                url,
                active: false,
                windowId, // 强制指定窗口
            }),
        );

        const tabs = await Promise.all(tabPromises);
        const tabIds = tabs
            .map((t) => t.id)
            .filter((id) => id !== undefined);

        if (tabIds.length === 0)
            return;

        // 3. 分组 (显式传入 createProperties 指定窗口，虽然通常会自动推断)
        const groupId = await chrome.tabs.group({
            tabIds,
            createProperties: { windowId },
        });

        // 4. 更新组信息
        await chrome.tabGroups.update(groupId, {
            title,
            color,
            collapsed: false,
        });

        console.log(`成功创建分组: ${title} (ID: ${groupId})`);
    } catch (error) {
        // 【关键步骤 2】捕获错误信息
        console.error('创建分组失败:', error);
        // 检查是否有 Chrome 内部错误信息
        if (chrome.runtime.lastError) {
            console.error('Chrome Runtime Error:', chrome.runtime.lastError.message);
        }
    }
}

/**
 * 批量删除书签
 *
 * @param {string[]} ids
 * @return {Promise<{successIds: string[], failedIds: string[]}>} 返回成功删除的 ID 列表和失败的 ID 列表
 */
export async function batchDeleteBookmarks(ids) {
    if (!ids || ids.length === 0)
        return { successIds: [], failedIds: [] };

    const results = await Promise.all(ids.map(async (id) => {
        try {
            await chrome.bookmarks.remove(id);
            return { id, status: 'success' };
        } catch (error) {
            console.error(`删除书签 ${id} 失败:`, error);
            return { id, status: 'error', error };
        }
    }));

    // 统计结果
    const successIds = results.filter((r) => r.status === 'success').map((r) => r.id);
    const failedIds = results.filter((r) => r.status === 'error').map((r) => r.id);

    return { successIds, failedIds };
}
