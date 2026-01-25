import { PictureOutlined } from '@ant-design/icons';
import { Flex, Image, Typography } from 'antd';

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
        <a href={props.url} className="text-current">
            <Flex
                align="center"
                gap={8}
                className="group/item w-full cursor-pointer overflow-hidden p-2 pl-0 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <Flex justify="center" align="center" className="h-12 w-12">
                    <BookmarkIcon
                        src={faviconURL(props.url)}
                        fallback={(
                            <Flex justify="center" align="center" className="h-full w-full">
                                <PictureOutlined className="text-xl text-gray-500" />
                            </Flex>
                        )}
                    />
                </Flex>
                <Flex vertical flex={1} gap={4} className="w-0">
                    <Typography.Text strong ellipsis>{props.title}</Typography.Text>
                    <Typography.Text type="secondary" ellipsis className="text-xs">{url}</Typography.Text>
                </Flex>
                {/* <div className="hidden group-hover/item:block">
                </div> */}
            </Flex>
        </a>
    );
}

export default BookmarkItem;
