import { useBookmarkStore } from '@/store/bookmarkStore';

import BookmarkItem from './BookmarkItem';
import BookmarkItemMergedCardOverlay from './BookmarkItemMergedCardOverlay';
import { getFolderItems, parseUniqueId } from './utils';

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
        return <BookmarkItemMergedCardOverlay count={selectedBookmarkIds.length} />;
    }

    // 否则显示单个书签
    return (
        <BookmarkItem overlay item={item} />
    );
}

export default BookmarkItemDragOverlay;
