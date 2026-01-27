import { Flex } from 'antd';

import { BookmarkFolder, BookmarkItem } from './index';

function BookmarkContent({ folders }) {
    return (
        <Flex gap={24} className="scrollbar-thin flex-1 overflow-hidden overflow-x-auto border px-6">
            {folders.map((folder) => {
                const items = folder.children.filter((item) => !item.dateGroupModified);
                return (
                    <BookmarkFolder key={folder.id} count={items.length} {...folder}>
                        <Flex vertical gap={4}>
                            {items.map((item) => <BookmarkItem key={item.id} {...item} />)}
                        </Flex>
                    </BookmarkFolder>
                );
            })}
        </Flex>
    );
}

export default BookmarkContent;
