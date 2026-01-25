import { Flex } from 'antd';

import { ThemeSwitch } from '@/components';
import bookmarks from '@/store/test-data';

import { BookmarkFolder, BookmarkItem, BookmarkWorkspace } from './compnents';

function NewTabMain() {
    return (
        <Flex vertical className="h-screen w-screen overflow-hidden">
            <Flex align="center" justify="space-between" className="h-12 px-6">
                <BookmarkWorkspace />
                <ThemeSwitch />
            </Flex>
            <Flex gap={24} className="flex-1 overflow-hidden overflow-x-auto px-6">
                {bookmarks.filter((folder) => folder.dateGroupModified).map((folder) => (
                    <BookmarkFolder key={folder.id} {...folder}>
                        {folder.children
                            .filter((item) => !item.dateGroupModified)
                            .map((item) => <BookmarkItem key={item.id} {...item} />)}
                    </BookmarkFolder>
                ))}
            </Flex>
        </Flex>
    );
}

export default NewTabMain;
