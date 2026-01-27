import { useState } from 'react';

import { CloseCircleFilled, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';

import { isEmpty } from 'lodash-es';

import { activeWorkspace, removeWorkspace, useBookmarkStore } from '@/store/bookmarkStore';

import useAddFolder from '../hooks/use-add-folder';

function BookmarkWorkspace() {
    const { workspaces, activeWorkspaceId } = useBookmarkStore();
    const [draggable, setDraggable] = useState(false);

    const { onAddClick } = useAddFolder();

    function onActiveClick(id) {
        return async () => {
            await activeWorkspace(id);
        };
    }

    function onRemoveClick(id) {
        return async () => {
            await removeWorkspace(id);
        };
    }

    if (isEmpty(workspaces)) {
        return null;
    }

    return (
        <Space>
            {workspaces.map(({ id, title }) => (
                <div key={id} className="group/workspace relative">
                    <Button
                        variant={draggable ? 'outlined' : 'filled'}
                        color={draggable ? 'default' : id === activeWorkspaceId ? 'primary' : 'default'}
                        onClick={onActiveClick(id)}
                    >
                        {title}
                    </Button>
                    {!draggable && (
                        <CloseCircleFilled
                            className="absolute -top-1 -right-1 hidden cursor-pointer text-red-500 group-hover/workspace:block"
                            onClick={onRemoveClick(id)}
                        />
                    )}
                </div>
            ))}
            <Tooltip title="选择书签目录">
                <Button
                    variant="filled"
                    color="default"
                    disabled={draggable}
                    icon={<PlusOutlined />}
                    onClick={onAddClick}
                />
            </Tooltip>
            {workspaces?.length > 1 && (
                <Tooltip title={draggable ? '停用拖动排序' : '启用拖动排序'}>
                    <Button
                        variant={draggable ? 'solid' : 'text'}
                        color={draggable ? 'primary' : 'default'}
                        icon={<SwapOutlined />}
                        onClick={() => setDraggable(!draggable)}
                    />
                </Tooltip>
            )}
        </Space>
    );
}

export default BookmarkWorkspace;
