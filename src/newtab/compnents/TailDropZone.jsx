import { useDndContext, useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';

import DropIndicator from './DropIndicator';

/**
 * 列表尾部的放置区域
 * 当拖拽书签时显示，用于将书签放置到列表末尾
 *
 * @param {object} props
 * @param {string} props.folderId - 文件夹ID，用于标识放置目标
 */
function TailDropZone({ folderId }) {
    // 使用特殊的ID格式标识尾部放置区域
    const dropId = `tail-${folderId}`;

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
        <div
            ref={setNodeRef}
            className={classNames(
                'h-8 w-full rounded transition-colors',
                isOver
                    ? 'bg-primary/20'
                    : 'bg-transparent',
            )}
        >
            {/* 高亮横线指示器 */}
            {isOver && (
                <div className="flex items-center">
                    <DropIndicator />
                </div>
            )}
        </div>
    );
}

export default TailDropZone;
