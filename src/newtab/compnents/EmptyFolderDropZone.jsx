import { Flex } from 'antd';

import { useDndContext, useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';

/**
 * 空文件夹的放置区域
 * 当文件夹为空且有拖拽操作时显示，用于接收拖拽的书签
 *
 * @param {object} props
 * @param {string} props.folderId - 文件夹ID，用于标识放置目标
 */
function EmptyFolderDropZone({ folderId }) {
    // 使用特殊的ID格式标识空文件夹放置区域
    const dropId = `empty-${folderId}`;

    const { setNodeRef, isOver } = useDroppable({
        id: dropId,
    });

    // 检测是否有活动的拖拽操作
    const { active } = useDndContext();
    const isDragging = !!active;

    // 只有在拖拽时才显示
    if (!isDragging) {
        return null;
    }

    return (
        <Flex
            ref={setNodeRef}
            justify="center"
            align="center"
            className={classNames(
                'grow h-full w-full rounded-lg border-2 border-dashed transition-colors',
                isOver
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-300 dark:border-gray-600',
            )}
        >
            <div className="text-secondary text-center">
                {isOver ? '松开以放置书签' : '拖拽书签到此处'}
            </div>
        </Flex>
    );
}

export default EmptyFolderDropZone;
