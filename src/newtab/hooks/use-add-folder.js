import { App } from 'antd';

import { addWorkspace, useBookmarkStore } from '@/store/bookmarkStore';

import { showBookmarkFolderTreeModal } from '../compnents';

function useAddFolder() {
    const { message } = App.useApp();
    const { workspaces } = useBookmarkStore();

    async function onAddClick() {
        const folder = await showBookmarkFolderTreeModal();
        const exist = workspaces.some((workspace) => workspace.id === folder.id);
        if (exist) {
            message.warning('该书签文件夹已存在');
        } else {
            await addWorkspace(folder);
        }
    }

    return {
        onAddClick,
    };
}

export default useAddFolder;
