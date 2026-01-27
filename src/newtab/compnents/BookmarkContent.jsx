import { useState } from 'react';

import { Flex } from 'antd';

import {
    closestCenter,
    DndContext,
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

/**
 * @typedef {import('@/types/bookmarkTypes').BookmarkFolder} BookmarkFolder
 * @typedef {import('@/types/bookmarkTypes').BookmarkItem} BookmarkItem
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
    // const [activeId, setActiveId] = useState(null);
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
        /** @type {string} */
        // const id = active.id;

        if (columnFolderIds.includes(active.id)) {
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
        >
            <Flex gap={24} className="scrollbar-thin relative overflow-x-auto overflow-y-hidden px-6">
                <SortableContext
                    items={columnFolderIds}
                    strategy={horizontalListSortingStrategy}
                >
                    {folders.map((folder) => {
                        /** @type {BookmarkItem[]} */
                        const items = folder.children
                            .filter((item) => !item.dateGroupModified);

                        return (
                            <BookmarkFolder
                                key={folder.id}
                                id={folder.id}
                                folder={folder}
                                itemCount={items.length}
                            >
                                <Flex vertical gap={4}>
                                    {items.map((item) => (
                                        <BookmarkItem
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}
                                </Flex>
                            </BookmarkFolder>
                        );
                    })}
                </SortableContext>
            </Flex>
        </DndContext>
    );
}

export default BookmarkContent;
