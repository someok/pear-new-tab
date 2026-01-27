import { Flex } from 'antd';

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
    return (
        <Flex gap={24} className="scrollbar-thin flex-1 overflow-hidden overflow-x-auto px-6">
            {folders.map((folder) => {
                /** @type {BookmarkItem[]} */
                const items = folder.children.filter((item) => !item.dateGroupModified);
                return (
                    <BookmarkFolder key={folder.id} folder={folder} itemCount={items.length}>
                        <Flex vertical gap={4}>
                            {items.map((item) => <BookmarkItem key={item.id} item={item} />)}
                        </Flex>
                    </BookmarkFolder>
                );
            })}
        </Flex>
    );
}

export default BookmarkContent;
