import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

import { isEmpty } from 'lodash-es';

import { activeWorkspace, removeWorkspace, useBookmarkStore } from '@/store/bookmarkStore';

import useAddFolder from '../hooks/use-add-folder';

function BookmarkWorkspace() {
    const { workspaces, activeWorkspaceId } = useBookmarkStore();

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
                        variant="filled"
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
            <Button
                variant="filled"
                color="default"
                icon={<PlusOutlined />}
                onClick={onAddClick}
            />
        </Space>
    );
}

export default BookmarkWorkspace;
