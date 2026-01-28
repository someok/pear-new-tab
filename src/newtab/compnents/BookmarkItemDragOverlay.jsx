import { Badge, Flex, Typography } from 'antd';

import { useBookmarkStore } from '@/store/bookmarkStore';

import BookmarkItem from './BookmarkItem';
import { getFolderItems, parseUniqueId } from './utils';

/**
 * 合并卡片形式的拖拽覆盖层
 *
 * @param {object} props
 * @param {number} props.count - 选中的书签数量
 */
function MergedCardOverlay({ count }) {
    return (
        <Badge count={count} offset={[-10, 10]}>
            <Flex
                align="center"
                justify="center"
                className="relative h-16 w-64 bg-white shadow-lg dark:bg-gray-700"
                style={{ borderRadius: 8 }}
            >
                {/* 堆叠效果 - 底层卡片 */}
                <div
                    className="absolute -top-2 left-2 h-full w-full rounded-lg border border-gray-100 bg-gray-200 dark:border-gray-700 dark:bg-gray-900"
                    style={{ zIndex: -2 }}
                />
                <div
                    className="dark:bg-gray-850 absolute -top-1 left-1 h-full w-full rounded-lg border border-gray-50 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                    style={{ zIndex: -1 }}
                />
                <Typography.Text strong>
                    移动
                    {' '}
                    {count}
                    {' '}
                    个书签
                </Typography.Text>
            </Flex>
        </Badge>
    );
}

function BookmarkItemDragOverlay({ activeId, activeDragType, folders }) {
    const { selectedBookmarkIds } = useBookmarkStore();
    // console.log('BookmarkItemDragOverlay', activeId, activeDragType);

    const [folderId, itemId] = parseUniqueId(activeId);
    const folder = folders.find((folder) => folder.id === folderId);
    const folderItems = getFolderItems(folder);
    const item = folderItems.find((item) => item.id === itemId);

    if (!activeId || activeDragType !== 'ITEM') {
        return null;
    }

    // 判断被拖拽的书签是否在已选列表中
    const isSelectedItem = selectedBookmarkIds.includes(itemId);

    // 如果在已选列表中且有多个选中项，显示合并卡片
    if (isSelectedItem && selectedBookmarkIds.length > 1) {
        return <MergedCardOverlay count={selectedBookmarkIds.length} />;
    }

    // 否则显示单个书签
    return (
        <BookmarkItem overlay item={item} />
    );
}

export default BookmarkItemDragOverlay;
