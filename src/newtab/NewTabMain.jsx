import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Result } from 'antd';

import { isEmpty } from 'lodash-es';

import icon_svg from '@/assets/icon.svg';
import { ThemeSwitch } from '@/components';
import { useBookmarkStore } from '@/store/bookmarkStore';

import useAddFolder from './hooks/use-add-folder';
import { BookmarkContent, BookmarkSelectBar, Workspace } from './compnents';

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
        <>
            <Flex vertical className="h-screen w-screen overflow-hidden">
                <Flex align="center" justify="space-between" className="h-12 px-6">
                    <img alt="logo" src={icon_svg} className="w-5" />
                    <Workspace />
                    <ThemeSwitch />
                </Flex>
                <Flex flex={1} justify="center" className="h-full w-full overflow-hidden">
                    {isEmpty(folders) && (
                        <Flex justify="center" align="center" className="h-full w-full">
                            <Empty />
                        </Flex>
                    )}
                    <BookmarkContent folders={folders} />
                </Flex>
            </Flex>
            <BookmarkSelectBar />
        </>
    );
}

export default NewTabMain;
