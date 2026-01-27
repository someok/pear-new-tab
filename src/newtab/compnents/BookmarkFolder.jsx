import { HolderOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';

/**
 * 顶级文件夹
 *
 * @param {object} props - props
 * @param {string} props.id - 文件夹ID
 * @param {import('@/types/bookmarkTypes').BookmarkFolder} props.folder - 文件夹
 * @param {number} props.itemCount - 该目录下的书签数量
 * @param {React.ReactNode} props.children - 子元素
 * @return {React.ReactNode}
 */
function BookmarkFolder({ id, folder, itemCount, children }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    // console.log('isDragging', isDragging);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        // opacity: isDragging ? 0.5 : 1,
    };
    // console.log('style', style);

    return (
        <Flex
            ref={setNodeRef}
            style={style}
            vertical
            className={classNames(
                'group/folder h-full w-90 shrink-0',
                isDragging && 'bg-gray-100 dark:bg-gray-800',
            )}
        >
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

                <div
                    {...attributes}
                    {...listeners}
                    className={classNames(
                        'hidden cursor-grab p-1 group-hover/folder-header:block',
                        'hover:bg-gray-300 active:bg-gray-400',
                        'dark:hover:bg-gray-900 dark:active:bg-gray-950',
                        isDragging && 'cursor-grabbing',
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
