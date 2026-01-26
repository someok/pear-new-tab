import { CheckOutlined, HolderOutlined, PictureOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

import classNames from 'classnames';

import { toggleBookmark, useBookmarkStore } from '@/store/bookmarkStore';

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
    const { selectedBookmarkIds } = useBookmarkStore();

    // 去除 url 的协议部分
    const url = props?.url?.replace(/https?:\/\//, '');

    function onCheckClick() {
        toggleBookmark(props.id);
    }

    const selected = selectedBookmarkIds?.includes(props.id);

    return (
        <Flex
            gap={8}
            className={classNames(
                'group/item h-16 w-full overflow-hidden relative',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'after:content-[""] after:absolute after:inset-0 after:border-3 after:transition-colors after:transition-discrete after:duration-300 after:pointer-events-none',
                !selected && 'after:border-transparent',
                selected && 'after:border-primary',
            )}
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
                    className={classNames(
                        'absolute top-0 right-0 bottom-0 left-0 hidden cursor-pointer group-hover/item-icon:flex',
                        'bg-gray-200 dark:bg-gray-900',
                    )}
                >
                    <Flex
                        flex={1}
                        justify="center"
                        align="center"
                        className="w-full active:bg-gray-300 dark:active:bg-gray-950"
                        onClick={onCheckClick}
                    >
                        <CheckOutlined />
                    </Flex>
                    <Flex
                        flex={1}
                        justify="center"
                        align="center"
                        className="w-full active:bg-gray-300 dark:active:bg-gray-950"
                    >
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
