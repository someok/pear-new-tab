import { useState } from 'react';

import { DragOutlined } from '@ant-design/icons';
import { Flex, Space, Typography } from 'antd';

import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import classNames from 'classnames';

import { saveNewWorkspaces, updateSortedWorkspaces } from '@/store/bookmarkStore';

import SortableWorkspaceItem from './SortableWorkspaceItem';

function SortableWorkspaceList({ workspaces }) {
    const [activeId, setActiveId] = useState(null);
    // console.log('activeId', activeId);

    /**
     * @param {import('@dnd-kit/core').DragStartEvent} event
     */
    function handleDragStart(event) {
        // console.log('handleDragStart', event);
        const { active } = event;
        const id = active.id;

        setActiveId(id);
    }

    function updateWorkspace(active, over) {
        if (!over || !over.id || active.id === over.id) {
            return;
        }

        const oldIndex = workspaces.findIndex((workspace) => workspace.id === active.id);
        const newIndex = workspaces.findIndex((workspace) => workspace.id === over.id);
        const newWorkspaces = arrayMove(workspaces, oldIndex, newIndex);
        // console.log('newWorkspaces', newWorkspaces);
        updateSortedWorkspaces(newWorkspaces);
        return newWorkspaces;
    }

    /**
     * @param {import('@dnd-kit/core').DragOverEvent} event
     */
    function handleDragOver(event) {
        // console.log('handleDragOver', event);

        const { active, over } = event;

        // 因为只在 handleDragEnd 做更新的话，在放开鼠标时 DragOverlay 的元素的掉落动画会先返回原位而不是新的位置
        // 导致动画看起来很生硬，所以这里提前更新
        updateWorkspace(active, over);
    }

    /**
     * @param {import('@dnd-kit/core').DragEndEvent} event
     */
    async function handleDragEnd(event) {
        // console.log('handleDragEnd', event);

        const { active, over } = event;

        // 清理状态
        setActiveId(null);

        const newWorkspaces = updateWorkspace(active, over);
        await saveNewWorkspaces(newWorkspaces);
    }

    function renderOverlay() {
        if (!activeId) {
            return null;
        }

        const { title } = workspaces.find((workspace) => workspace.id === activeId);
        return (
            <Flex
                justify="center"
                align="center"
                className={classNames(
                    'px-3  h-8 select-none  hover:text-white',
                    'cursor-grabbing bg-cyan-500',
                )}
            >
                {title}
            </Flex>
        );
    }

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor),
    );

    const ids = workspaces.map(({ id }) => id);
    return (
        <>
            <div className="fixed top-0 right-0 bottom-0 left-0 z-20" />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[snapCenterToCursor, restrictToWindowEdges]}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <Space className="relative z-30">
                    <Typography.Text type="secondary">
                        <Space size="small">
                            <DragOutlined />
                            拖动排序
                        </Space>
                    </Typography.Text>
                    <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
                        <Space>
                            {workspaces.map(({ id, title }) => (
                                <SortableWorkspaceItem key={id} id={id} title={title} />
                            ))}
                        </Space>
                    </SortableContext>
                </Space>

                {/* 拖拽层：用于显示随鼠标移动的元素 */}
                <DragOverlay>
                    {renderOverlay()}
                </DragOverlay>
            </DndContext>
        </>
    );
}

export default SortableWorkspaceList;
