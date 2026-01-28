import BookmarkItem from './BookmarkItem';
import { getFolderItems, parseUniqueId } from './utils';

function BookmarkItemDragOverlay({ activeId, activeDragType, folders }) {
    // console.log('BookmarkItemDragOverlay', activeId, activeDragType);

    const [folderId, itemId] = parseUniqueId(activeId);
    const folder = folders.find((folder) => folder.id === folderId);
    const folderItems = getFolderItems(folder);
    const item = folderItems.find((item) => item.id === itemId);

    if (!activeId || activeDragType !== 'ITEM') {
        return null;
    }

    return (
        <BookmarkItem overlay item={item} />
    );
}

export default BookmarkItemDragOverlay;
