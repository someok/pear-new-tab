import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Result } from 'antd';

import { isEmpty } from 'lodash-es';

import icon_svg from '@/assets/icon.svg';
import { ThemeSwitch } from '@/components';
import { useBookmarkStore } from '@/store/bookmarkStore';

import useAddFolder from './hooks/use-add-folder';
import { BookmarkFolder, BookmarkItem, BookmarkWorkspace } from './compnents';

function NewTabMain() {
    const { workspaces, bookmarks } = useBookmarkStore();
    // console.log(bookmarks);
    const { onAddClick } = useAddFolder();

    const folders = bookmarks.filter((folder) => folder.dateGroupModified);

    if (isEmpty(workspaces)) {
        return (
            <Flex justify="center" align="center" className="h-screen w-screen">
                <Result
                    status="info"
                    icon={<img src={icon_svg} alt="LOGO" className="w-24" />}
                    title="初次使用 Pear New Tab？"
                    subTitle={(
                        <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick}>选择书签文件夹</Button>
                    )}
                />
            </Flex>
        );
    }

    return (
        <Flex vertical className="h-screen w-screen overflow-hidden">
            <Flex align="center" justify="space-between" className="h-12 px-6">
                <BookmarkWorkspace />
                <ThemeSwitch />
            </Flex>
            <Flex gap={24} className="scrollbar-thin flex-1 overflow-hidden overflow-x-auto px-6">
                {isEmpty(folders) && (
                    <Flex justify="center" align="center" className="h-full w-full">
                        <Empty />
                    </Flex>
                )}
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
        </Flex>
    );
}

export default NewTabMain;
