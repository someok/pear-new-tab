import { PictureOutlined } from '@ant-design/icons';
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
            align="center"
            gap={8}
            className="group/item w-full overflow-hidden p-2 pl-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <Flex justify="center" align="center" className="h-8 w-8">
                <BookmarkIcon
                    src={faviconURL(props.url)}
                    fallback={(
                        <Flex justify="center" align="center" className="h-full w-full">
                            <PictureOutlined className="text-xl text-gray-500" />
                        </Flex>
                    )}
                />
            </Flex>
            <a href={props.url} className="flex flex-1 overflow-auto text-current">
                <Flex vertical gap={4} className="w-full">
                    <Typography.Text strong ellipsis>{props.title}</Typography.Text>
                    <Typography.Text type="secondary" ellipsis className="text-xs">{url}</Typography.Text>
                </Flex>
            </a>
            {/* <div className="hidden group-hover/item:block">
                </div> */}
        </Flex>
    );
}

export default BookmarkItem;
