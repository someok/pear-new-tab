import { ClearOutlined, DeleteOutlined, DragOutlined, HolderOutlined } from '@ant-design/icons';
import { Button, Divider, Flex } from 'antd';

import { useDraggable } from '@dnd-kit/core';
import classNames from 'classnames';

import { clearSelectedBookmarkIds } from '@/store/bookmarkStore';

function BookmarkSelectBarInner({ selectedBookmarkIds, top, left }) {
    const { attributes, isDragging, listeners, setNodeRef, transform }
        = useDraggable({ id: 'draggable' });

    const style = { transform: `translate3d(${transform ? transform.x : 0}px, ${transform ? transform.y : 0}px, 0) scale(${isDragging ? 1.03 : 1})` };
    return (
        <Flex
            justify="center"
            className="fixed bottom-20 z-10 w-full"
        >
            {/* 拖动时全屏显示这个 div，以防止拖动的时候影响到其它的 dnd context */}
            {isDragging && (
                <div className="fixed top-0 right-0 bottom-0 left-0" />
            )}
            <Flex
                ref={setNodeRef}
                align="center"
                gap={8}
                className={classNames(
                    'relative h-10 bg-zinc-200 p-2 dark:bg-zinc-700',
                    isDragging ? 'shadow-xl/20' : 'shadow-xl',
                )}
                style={{ ...style, top, left }}
                {...attributes}
            >
                <div
                    className={classNames(
                        'hover:bg-zinc-300 active:bg-zinc-400',
                        'dark:hover:bg-zinc-900 dark:active:bg-zinc-950',
                        isDragging ? 'cursor-grabbing' : 'cursor-grab',
                    )}
                    {...listeners}
                >
                    <HolderOutlined />
                </div>
                <Button variant="filled" color="danger" size="small" icon={<ClearOutlined />} onClick={clearSelectedBookmarkIds}>
                    清除
                    {' '}
                    {selectedBookmarkIds.length}
                    {' '}
                    个选择
                </Button>
                <Divider orientation="vertical" />
                <Button size="small" variant="filled" color="default" icon={<DeleteOutlined />}>删除</Button>
                <Button size="small" variant="filled" color="default" icon={<DragOutlined />}>移动</Button>
            </Flex>
        </Flex>
    );
}

export default BookmarkSelectBarInner;
