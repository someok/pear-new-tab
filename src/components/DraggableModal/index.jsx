import * as React from 'react';
import { lazy, Suspense } from 'react';

const CustomModal = lazy(() => import('./CustomModal'));

/**
 * 可拖拽的 Modal
 *
 * @param {import('antd').ModalProps} props - 属性
 * @return {React.ReactNode} 可拖拽的 Modal
 */
function DraggableModal(props) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CustomModal {...props} />
        </Suspense>
    );
}

export default DraggableModal;
