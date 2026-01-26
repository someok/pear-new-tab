import { HolderOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

/**
 * 顶级文件夹
 *
 * @param {import('./bookmarkTypes').BookmarkFolder & {count: number, children: React.ReactNode}} props - props
 * @return {React.ReactNode}
 */
function BookmarkFolder(props) {
    return (
        <Flex vertical className="group/folder h-full w-90 shrink-0">
            <Flex
                align="center"
                justify="space-between"
                className="group/folder-header h-12 w-full border-b-4 border-gray-200 px-2 group-hover/folder:border-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
            >
                <Flex align="flex-end" gap={8}>
                    <Typography.Text ellipsis strong className="text-base">
                        {props.title}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                        (
                        {props.count}
                        )
                    </Typography.Text>
                </Flex>

                <div className="hidden cursor-pointer p-1 group-hover/folder-header:block hover:bg-gray-300 active:bg-gray-400 dark:hover:bg-gray-900 dark:active:bg-gray-950">
                    <HolderOutlined />
                </div>
            </Flex>
            <div className="flex-1 overflow-y-auto py-3">
                {props.children}
            </div>
        </Flex>
    );
}

export default BookmarkFolder;
