import { ClearOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Popconfirm } from 'antd';

import { useDraggable } from '@dnd-kit/core';
import classNames from 'classnames';

import { clearSelectedBookmarkIds, loadWorkspaceBookmarks } from '@/store/bookmarkStore';
import { batchDeleteBookmarks } from '@/utils/chromeUtils';

function BookmarkSelectBarInner({ selectedBookmarkIds, top, left }) {
    const { attributes, isDragging, listeners, setNodeRef, transform }
        = useDraggable({ id: 'draggable' });

    async function onDeleteClick() {
        await batchDeleteBookmarks(selectedBookmarkIds);
        clearSelectedBookmarkIds();
        await loadWorkspaceBookmarks();
    }

    const style = { transform: `translate3d(${transform ? transform.x : 0}px, ${transform ? transform.y : 0}px, 0) scale(${isDragging ? 1.03 : 1})` };
    return (
        <Flex
            justify="center"
            className="pointer-events-none fixed bottom-20 z-10 w-full"
        >
            {/* 拖动时全屏显示这个 div，以防止拖动的时候影响到其它的 dnd context */}
            {isDragging && (
                <div className="pointer-events-auto fixed top-0 right-0 bottom-0 left-0" />
            )}
            <Flex
                ref={setNodeRef}
                align="center"
                gap={8}
                className={classNames(
                    'relative h-10 bg-component p-2 pointer-events-auto',
                    isDragging ? 'shadow-xl/20' : 'shadow-xl',
                )}
                style={{ ...style, top, left }}
                {...attributes}
            >
                <div
                    className={classNames(
                        'hover:bg-component-hover active:bg-component-active',
                        isDragging ? 'cursor-grabbing' : 'cursor-grab',
                    )}
                    {...listeners}
                >
                    <HolderOutlined />
                </div>
                <Button
                    variant="text"
                    color="default"
                    size="small"
                    icon={<ClearOutlined />}
                    onClick={clearSelectedBookmarkIds}
                >
                    清除
                    {' '}
                    {selectedBookmarkIds.length}
                    {' '}
                    个选择
                </Button>
                <Divider orientation="vertical" />
                <Popconfirm
                    title="提醒"
                    description={`确定删除 ${selectedBookmarkIds.length} 个书签？`}
                    okButtonProps={{ danger: true }}
                    onConfirm={onDeleteClick}
                >

                    <Button
                        size="small"
                        variant="filled"
                        color="danger"
                        icon={<DeleteOutlined />}
                    >
                        删除
                    </Button>
                </Popconfirm>
            </Flex>
        </Flex>
    );
}

export default BookmarkSelectBarInner;
