import { useState } from 'react';

import { SwapOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';

import { isEmpty } from 'lodash-es';

import { useBookmarkStore } from '@/store/bookmarkStore';

import SortableWorkspaceList from './SortableWorkspaceList';
import WorkspaceList from './WorkspaceList';

function Workspace() {
    const { workspaces, activeWorkspaceId } = useBookmarkStore();
    const [draggable, setDraggable] = useState(false);

    if (isEmpty(workspaces)) {
        return null;
    }

    return (
        <Space>
            {draggable
                ? <SortableWorkspaceList workspaces={workspaces} />
                : <WorkspaceList workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} />}
            {workspaces?.length > 1 && (
                <Tooltip title={draggable ? '停用拖动排序' : '启用拖动排序'}>
                    <Button
                        variant={draggable ? 'solid' : 'text'}
                        color={draggable ? 'primary' : 'default'}
                        icon={<SwapOutlined />}
                        className="z-30"
                        onClick={() => setDraggable(!draggable)}
                    />
                </Tooltip>
            )}
        </Space>
    );
}

export default Workspace;
