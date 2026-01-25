import { useEffect, useState } from 'react';

import { Modal, Tree } from 'antd';

import { antdModalV5, create, show, useModal } from '@ebay/nice-modal-react';
import { isEmpty, noop } from 'lodash-es';

/**
 * 过滤书签树，只保留文件夹节点
 * @param {chrome.bookmarks.BookmarkTreeNode[]} nodes
 * @returns {chrome.bookmarks.BookmarkTreeNode[]}
 */
function filterFoldersOnly(nodes) {
    return nodes
        .filter((node) => !node.url && node.dateGroupModified)
        .map((node) => ({
            ...node,
            children: node.children ? filterFoldersOnly(node.children) : [],
        }));
}

function BookmarkFolderTreeModal() {
    const modal = useModal();

    const [selectedFolder, setSelectedFolder] = useState(null);
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        async function requestChromeBookmarkFolders() {
            const bookmarks = await chrome.bookmarks.getTree();
            const allNodes = bookmarks?.[0]?.children || [];
            setTreeData(filterFoldersOnly(allNodes));
        }

        requestChromeBookmarkFolders().catch(noop);
    }, []);

    function onSelect(selectedKeys, info) {
        const item = info.selectedNodes?.[0];
        if (item) {
            const { id, title } = item;
            setSelectedFolder({ id, title });
        }
    }

    function onOk() {
        modal.resolve(selectedFolder);
        modal.hide();
    }

    return (
        <Modal
            {...antdModalV5(modal)}
            title="书签目录选择"
            onOk={onOk}
            okButtonProps={{ disabled: isEmpty(selectedFolder) }}
        >
            {treeData.length > 0 && (
                <Tree
                    treeData={treeData}
                    fieldNames={{ key: 'id' }}
                    defaultExpandAll
                    blockNode
                    className="p-6"
                    onSelect={onSelect}
                />
            )}
        </Modal>
    );
}

const NiceModal = create(BookmarkFolderTreeModal);

export function showBookmarkFolderTreeModal() {
    return show(NiceModal);
}
