import { CheckOutlined, HolderOutlined, PictureOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

import BookmarkIcon from './BookmarkIcon';

function faviconURL(pageUrl, size = 32) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', pageUrl);
    url.searchParams.set('size', size.toString());
    return url.toString();
}

/**
 * 书签条目
 *
 * @param {import('./bookmarkTypes').Bookmark} props - props
 * @return {React.ReactNode}
 */
function BookmarkItem(props) {
    // 去除 url 的协议部分
    const url = props?.url?.replace(/https?:\/\//, '');

    return (
        <Flex
            gap={8}
            className="group/item h-16 w-full overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800"
        >
            <Flex align="center" className="group/item-icon relative h-full w-8">
                <BookmarkIcon
                    src={faviconURL(props.url)}
                    fallback={(
                        <Flex justify="center" align="center" className="h-full w-full">
                            <PictureOutlined className="text-xl text-gray-500" />
                        </Flex>
                    )}
                />
                <Flex
                    justify="center"
                    align="center"
                    vertical
                    className="absolute top-0 right-0 bottom-0 left-0 hidden cursor-pointer bg-gray-200 group-hover/item-icon:flex dark:bg-gray-900"
                >
                    <Flex flex={1} justify="center" align="center" className="w-full active:bg-gray-300 dark:active:bg-gray-950">
                        <CheckOutlined />
                    </Flex>
                    <Flex flex={1} justify="center" align="center" className="w-full active:bg-gray-300 dark:active:bg-gray-950">
                        <HolderOutlined />
                    </Flex>
                </Flex>
            </Flex>
            <a href={props.url} className="flex flex-1 overflow-auto py-2 text-current">
                <Flex vertical justify="center" gap={4} className="w-full">
                    <Typography.Text strong ellipsis>{props.title}</Typography.Text>
                    <Typography.Text type="secondary" ellipsis className="text-xs">{url}</Typography.Text>
                </Flex>
            </a>
        </Flex>
    );
}

export default BookmarkItem;
