import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

import { isEmpty } from 'lodash-es';

import { activeWorkspace, useBookmarkStore } from '@/store/bookmarkStore';

import useAddFolder from '../hooks/use-add-folder';

function BookmarkWorkspace() {
    const { workspaces, activeWorkspaceId } = useBookmarkStore();

    const { onAddClick } = useAddFolder();

    function onActiveClick(id) {
        return async () => {
            await activeWorkspace(id);
        };
    }

    if (isEmpty(workspaces)) {
        return null;
    }

    return (
        <Space>
            {workspaces.map(({ id, title }) => (
                <Button
                    key={id}
                    variant="filled"
                    color={id === activeWorkspaceId ? 'primary' : 'default'}
                    onClick={onActiveClick(id)}
                >
                    {title}
                </Button>
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
