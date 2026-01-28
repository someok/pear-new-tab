import { useState } from 'react';

import { Flex } from 'antd';

import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';

import { moveBookmarkAtSameFolder, updateFolders } from '@/store/bookmarkStore';

import BookmarkFolder from './BookmarkFolder';
import BookmarkItem from './BookmarkItem';
import BookmarkItemDragOverlay from './BookmarkItemDragOverlay';
import { getFolderItems, getUniqueId } from './utils';

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
     * @param {import('@dnd-kit/core').DragOverEvent} event
     */
    function handleDragOver(event) {
        console.log('handleDragOver', event);
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
            collisionDetection={closestCenter}
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

                        const sortableItems = items.map((item) => getUniqueId(folder.id, item.id));

                        return (
                            <BookmarkFolder
                                key={folder.id}
                                id={folder.id}
                                folder={folder}
                                itemCount={items.length}
                            >
                                <Flex vertical gap={4}>
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
