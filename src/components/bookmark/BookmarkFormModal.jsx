import { useRef } from 'react';

import { antdModalV5, create, show, useModal } from '@ebay/nice-modal-react';

import { loadWorkspaceBookmarks } from '@/store/bookmarkStore';

import DraggableModal from '../DraggableModal';

import BookmarkForm from './BookmarkForm';

function BookmarkFormModal({ item }) {
    const modal = useModal();
    const formRef = useRef(null);

    function onOk() {
        formRef.current.submit();
    }

    async function onFinish(values) {
        // console.log('onFinish', values);
        const node = await chrome.bookmarks.update(item.id, values);
        console.log('node', node);
        await loadWorkspaceBookmarks();
        await modal.hide();
    }

    return (
        <DraggableModal {...antdModalV5(modal)} title="书签编辑" onOk={onOk}>
            <BookmarkForm ref={formRef} title={item.title} url={item.url} onFinish={onFinish} />
        </DraggableModal>
    );
}

const NiceModal = create(BookmarkFormModal);

export function showBookmarkFormModal({ item }) {
    return show(NiceModal, { item });
}
