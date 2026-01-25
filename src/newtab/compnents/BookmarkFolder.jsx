import { Flex, Typography } from 'antd';

/**
 * 顶级文件夹
 *
 * @param {import('./bookmarkTypes').BookmarkFolder & {children: React.ReactNode}} props - props
 * @return {React.ReactNode}
 */
function BookmarkFolder(props) {
    return (
        <Flex vertical className="group h-full w-70 shrink-0">
            <Flex align="center" justify="space-between" className="h-12 w-full border-b-4 border-gray-200 px-2 group-hover:border-gray-500 dark:border-gray-700">
                <Typography.Text ellipsis strong>
                    {props.title}
                </Typography.Text>
                <div></div>
            </Flex>
            <div className="flex-1 overflow-y-auto">
                {props.children}
            </div>
        </Flex>
    );
}

export default BookmarkFolder;
