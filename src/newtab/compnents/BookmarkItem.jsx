import { CheckOutlined, HolderOutlined, PictureOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
 * @param {object} props - props
 * @param {string} props.uniqueId - 格式：folderId-bookmarkId
 * @param {boolean=} props.overlay - 是否为拖拽 overlay
 * @param {import('@/types/bookmarkTypes').BookmarkNode} props.item - props
 * @return {React.ReactNode}
 */
function BookmarkItem({ uniqueId, overlay = false, item }) {
    const { selectedBookmarkIds } = useBookmarkStore();

    const { attributes, listeners, setNodeRef, transform, transition, isDragging }
        = useSortable({ id: uniqueId });
    // console.log('attributes, transform, transition, isDragging', attributes, transform, transition, isDragging);
    // console.log('BookmarkItem render', uniqueId, isDragging, overlay);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        // zIndex: isDragging ? 10 : 0,
        opacity: isDragging && !overlay ? 0.5 : 1,
    };

    // 去除 url 的协议部分
    const url = item?.url?.replace(/https?:\/\//, '');

    function onCheckClick() {
        toggleBookmark(item.id);
    }

    const selected = selectedBookmarkIds?.includes(item.id);

    return (
        <Flex
            ref={setNodeRef}
            gap={8}
            className={classNames(
                'group/item h-16 w-full overflow-hidden relative',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'after:content-[""] after:absolute after:inset-0 after:border-3 after:transition-colors after:transition-discrete after:duration-300 after:pointer-events-none',
                !selected && 'after:border-transparent',
                selected && 'after:border-primary',
            )}
            style={style}
        >
            <Flex align="center" className="group/item-icon relative h-full w-8">
                <BookmarkIcon
                    src={faviconURL(item.url)}
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
                        className="w-full cursor-grab active:bg-gray-300 dark:active:bg-gray-950"
                        {...listeners}
                        {...attributes}
                    >
                        <HolderOutlined />
                    </Flex>
                </Flex>
            </Flex>
            <a href={item.url} className="flex flex-1 overflow-auto py-2 text-current">
                <Flex vertical justify="center" gap={4} className="w-full">
                    <Typography.Text strong ellipsis>{`${item.id}:${item.title}`}</Typography.Text>
                    <Typography.Text type="secondary" ellipsis className="text-xs">{url}</Typography.Text>
                </Flex>
            </a>
        </Flex>
    );
}

export default BookmarkItem;
