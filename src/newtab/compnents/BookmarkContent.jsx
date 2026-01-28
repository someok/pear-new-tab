import { useState } from 'react';

import { Flex } from 'antd';

import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    pointerWithin,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';

import {
    moveBookmarkAtSameFolder,
    moveBookmarkToFolder,
    moveSelectedBookmarksToFolder,
    updateFolders,
    useBookmarkStore,
} from '@/store/bookmarkStore';

import BookmarkFolder from './BookmarkFolder';
import BookmarkItem from './BookmarkItem';
import BookmarkItemDragOverlay from './BookmarkItemDragOverlay';
import EmptyFolderDropZone from './EmptyFolderDropZone';
import TailDropZone from './TailDropZone';
import { getFolderItems, getUniqueId, parseUniqueId } from './utils';

/**
 * @typedef {import('@/types/bookmarkTypes').BookmarkFolder} BookmarkFolder
 * @typedef {import('@/types/bookmarkTypes').BookmarkNode} BookmarkNode
 */

/**
 * 顶级文件夹
 *
 * @param {object} props - props
 * @param {BookmarkFolder[]} props.folders - 文件夹列表
 * @return {React.ReactNode}
 */
function BookmarkContent({ folders }) {
    const { selectedBookmarkIds } = useBookmarkStore();
    const columnFolderIds = folders.map((folder) => folder.id);

    // 拖拽状态
    const [activeId, setActiveId] = useState(null);
    const [activeDragType, setActiveDragType] = useState(/** @type { 'FOLDER' | 'ITEM' | null } */ (null));

    function findFolder(id) {
        return folders.find((folder) => folder.id === id);
    }

    /**
     * @param {import('@dnd-kit/core').DragStartEvent} event
     */
    function handleDragStart(event) {
        // console.log('handleDragStart', event);
        const { active } = event;
        const id = active.id;

        setActiveId(id);

        if (columnFolderIds.includes(id)) {
            setActiveDragType('FOLDER');
        } else {
            setActiveDragType('ITEM');
        }
    }

    /**
     * 自定义碰撞检测算法
     * 对于空文件夹放置区域使用 pointerWithin（指针在区域内即触发）
     * 对于其他元素使用 closestCenter（中心点最近）
     */
    function customCollisionDetection(args) {
        // 先检查 pointerWithin，优先处理空文件夹和尾部放置区域
        const pointerCollisions = pointerWithin(args);
        const specialCollision = pointerCollisions.find(
            (collision) => typeof collision.id === 'string'
                && (collision.id.startsWith('empty-') || collision.id.startsWith('tail-')),
        );

        if (specialCollision) {
            return [specialCollision];
        }

        // 其他情况使用 closestCenter
        return closestCenter(args);
    }

    /**
     * @param {import('@dnd-kit/core').DragOverEvent} event
     */
    function handleDragOver(event) {
        console.log('handleDragOver', event);
    }

    /**
     * 解析空文件夹放置区域的 ID
     * @param {string} id
     * @returns {string|null}
     */
    function parseEmptyDropId(id) {
        if (typeof id === 'string' && id.startsWith('empty-')) {
            return id.replace('empty-', '');
        }
        return null;
    }

    /**
     * 解析尾部放置区域的 ID
     * @param {string} id
     * @returns {string|null}
     */
    function parseTailDropId(id) {
        if (typeof id === 'string' && id.startsWith('tail-')) {
            return id.replace('tail-', '');
        }
        return null;
    }

    /**
     * @param {import('@dnd-kit/core').DragEndEvent} event
     */
    async function handleDragEnd(event) {
        console.log('handleDragEnd', event);
        const { active, over } = event;

        setActiveDragType(null);

        if (!over || !over.id) {
            return;
        }

        if (activeDragType === 'FOLDER') {
            if (active.id !== over.id) {
                // 获取目标文件夹
                const srcFolder = findFolder(active.id);
                const destFolder = findFolder(over.id);
                // console.log('destFolder', destFolder);

                // 获取源文件夹和目标文件夹的索引，注意这儿是数组的索引，而不是书签自身的 index 属性
                const oldIndex = folders.findIndex((folder) => folder.id === active.id);
                const newIndex = folders.findIndex((folder) => folder.id === over.id);
                const newFolders = arrayMove(folders, oldIndex, newIndex);
                // console.log('newFolders', oldIndex, newIndex, newFolders);

                // 更新文件夹顺序和实际的 chrome 接口调用分成两个方法，以便页面显示更加流畅
                updateFolders(newFolders);
                await moveBookmarkAtSameFolder(active.id, srcFolder.index, destFolder.index);
            }
        } else if (activeDragType === 'ITEM') {
            // 检查是否放置到空文件夹
            const emptyFolderId = parseEmptyDropId(over.id);
            if (emptyFolderId) {
                // 拖放到空文件夹
                const [srcFolderId, srcItemId] = parseUniqueId(active.id);
                const srcFolder = findFolder(srcFolderId);
                const destFolder = findFolder(emptyFolderId);

                if (!srcFolder || !destFolder)
                    return;

                // 判断被拖拽的书签是否在已选列表中
                const isSelectedItem = selectedBookmarkIds.includes(srcItemId);

                if (isSelectedItem && selectedBookmarkIds.length > 1) {
                    // 批量移动到空文件夹（放在最前面）
                    await moveSelectedBookmarksToFolder(
                        selectedBookmarkIds,
                        emptyFolderId,
                        0,
                    );
                } else {
                    // 单个书签移动到空文件夹
                    await moveBookmarkToFolder(srcItemId, emptyFolderId, 0);
                }
                return;
            }

            // 检查是否放置到尾部区域
            const tailFolderId = parseTailDropId(over.id);
            if (tailFolderId) {
                // 拖放到列表尾部
                const [srcFolderId, srcItemId] = parseUniqueId(active.id);
                const srcFolder = findFolder(srcFolderId);
                const destFolder = findFolder(tailFolderId);

                if (!srcFolder || !destFolder)
                    return;

                const destItems = getFolderItems(destFolder);
                // 放置到最后一个位置
                const lastIndex = destItems.length > 0 ? destItems[destItems.length - 1].index + 1 : 0;

                // 判断被拖拽的书签是否在已选列表中
                const isSelectedItem = selectedBookmarkIds.includes(srcItemId);

                if (isSelectedItem && selectedBookmarkIds.length > 1) {
                    // 批量移动到列表末尾
                    await moveSelectedBookmarksToFolder(
                        selectedBookmarkIds,
                        tailFolderId,
                        lastIndex,
                    );
                } else {
                    // 单个书签移动到列表末尾
                    await moveBookmarkToFolder(srcItemId, tailFolderId, lastIndex);
                }
                return;
            }

            // 处理书签拖拽
            const [srcFolderId, srcItemId] = parseUniqueId(active.id);
            const [destFolderId, destItemId] = parseUniqueId(over.id);

            // 找到源和目标文件夹
            const srcFolder = findFolder(srcFolderId);
            const destFolder = findFolder(destFolderId);

            if (!srcFolder || !destFolder)
                return;

            const srcItems = getFolderItems(srcFolder);
            const destItems = getFolderItems(destFolder);

            // 找到源书签和目标书签的索引
            const srcIndex = srcItems.findIndex((item) => item.id === srcItemId);
            const destIndex = destItems.findIndex((item) => item.id === destItemId);

            if (srcIndex === -1 || destIndex === -1)
                return;

            // 判断被拖拽的书签是否在已选列表中
            const isSelectedItem = selectedBookmarkIds.includes(srcItemId);

            if (srcFolderId === destFolderId) {
                // 同目录内移动
                if (srcIndex !== destIndex) {
                    if (isSelectedItem && selectedBookmarkIds.length > 1) {
                        // 批量移动选中的书签
                        await moveSelectedBookmarksToFolder(
                            selectedBookmarkIds,
                            destFolderId,
                            srcItems[destIndex].index,
                        );
                    } else {
                        // 单个书签移动
                        await moveBookmarkAtSameFolder(
                            srcItemId,
                            srcItems[srcIndex].index,
                            srcItems[destIndex].index,
                        );
                    }
                }
            } else {
                // 跨目录移动
                const targetIndex = destItems[destIndex].index;

                if (isSelectedItem && selectedBookmarkIds.length > 1) {
                    // 批量移动选中的书签到目标目录
                    await moveSelectedBookmarksToFolder(
                        selectedBookmarkIds,
                        destFolderId,
                        targetIndex,
                    );
                } else {
                    // 单个书签移动到目标目录
                    await moveBookmarkToFolder(srcItemId, destFolderId, targetIndex);
                }
            }
        }
    }

    function handleDragCancel() {
        setActiveId(null);
        setActiveDragType(null);
    }

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor),
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={customCollisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <Flex gap={24} className="scrollbar-thin relative overflow-x-auto overflow-y-hidden px-6">
                <SortableContext
                    items={columnFolderIds}
                    strategy={horizontalListSortingStrategy}
                >
                    {folders.map((folder) => {
                        /** @type {BookmarkNode[]} */
                        const items = getFolderItems(folder);
                        const urls = items.map((item) => item.url);

                        const sortableItems = items.map((item) => getUniqueId(folder.id, item.id));

                        return (
                            <BookmarkFolder
                                key={folder.id}
                                id={folder.id}
                                folder={folder}
                                urls={urls}
                            >
                                <Flex vertical gap={4} className="min-h-full">
                                    {activeDragType === 'ITEM' && items.length === 0 ? (
                                        <EmptyFolderDropZone folderId={folder.id} />
                                    ) : (
                                        <>
                                            <SortableContext
                                                key={folder.id}
                                                items={sortableItems}
                                            >
                                                {items.map((item) => {
                                                    const uniqueId = getUniqueId(folder.id, item.id);
                                                    return (
                                                        <BookmarkItem
                                                            key={uniqueId}
                                                            uniqueId={uniqueId}
                                                            item={item}
                                                        />
                                                    );
                                                })}
                                            </SortableContext>
                                            <TailDropZone folderId={folder.id} />
                                        </>
                                    )}
                                </Flex>
                            </BookmarkFolder>
                        );
                    })}
                </SortableContext>
            </Flex>

            {activeDragType === 'ITEM' && (

                <DragOverlay>
                    <BookmarkItemDragOverlay
                        activeId={activeId}
                        activeDragType={activeDragType}
                        folders={folders}
                    />
                </DragOverlay>
            )}
        </DndContext>
    );
}

export default BookmarkContent;
