import { HolderOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

import classNames from 'classnames';

/**
 * 顶级文件夹
 *
 * @param {object} props - props
 * @param {import('@/types/bookmarkTypes').BookmarkFolder} props.folder - 文件夹
 * @param {number} props.itemCount - 该目录下的书签数量
 * @param {React.ReactNode} props.children - 子元素
 * @return {React.ReactNode}
 */
function BookmarkFolder({ folder, itemCount, children }) {
    return (
        <Flex vertical className="group/folder h-full w-90 shrink-0">
            <Flex
                align="center"
                justify="space-between"
                className={classNames(
                    'group/folder-header h-12 w-full border-b-4 px-2',
                    'border-gray-200 dark:border-gray-800 group-hover/folder:border-gray-500',
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
            >
                <Flex align="flex-end" gap={8}>
                    <Typography.Text ellipsis strong className="text-base">
                        {folder.title}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                        (
                        {itemCount}
                        )
                    </Typography.Text>
                </Flex>

                <div className={classNames(
                    'hidden cursor-grab p-1 group-hover/folder-header:block',
                    'hover:bg-gray-300 active:bg-gray-400',
                    'dark:hover:bg-gray-900 dark:active:bg-gray-950',
                )}
                >
                    <HolderOutlined />
                </div>
            </Flex>
            <div className="scrollbar-thin flex-1 overflow-y-auto py-3">
                {children}
            </div>
        </Flex>
    );
}

export default BookmarkFolder;
