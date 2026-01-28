import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';

import useAddFolder from '@/newtab/hooks/use-add-folder';
import { activeWorkspace, removeWorkspace } from '@/store/bookmarkStore';

function WorkspaceList({ workspaces, activeWorkspaceId }) {
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

    return (
        <Space>
            {workspaces.map(({ id, title }) => (
                <div key={id} className="group/workspace relative">
                    <Button
                        variant="text"
                        color={id === activeWorkspaceId ? 'primary' : 'default'}
                        onClick={onActiveClick(id)}
                    >
                        {title}
                    </Button>
                    <CloseCircleFilled
                        className="absolute -top-1 -right-1 hidden cursor-pointer text-red-500 group-hover/workspace:block"
                        onClick={onRemoveClick(id)}
                    />
                </div>
            ))}
            <Tooltip title="选择书签目录">
                <Button
                    variant="text"
                    color="default"
                    icon={<PlusOutlined />}
                    onClick={onAddClick}
                />
            </Tooltip>
        </Space>
    );
}

export default WorkspaceList;
