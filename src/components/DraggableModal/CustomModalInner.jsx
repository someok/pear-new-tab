import * as React from 'react';

import { Modal } from 'antd';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function CustomModalInner(props) {
    const {
        coordinates: { top, left },
        title,
        ...rest
    } = props;
    const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
        id: 'draggable',
    });

    const style = transform
        ? {
                transform: CSS.Translate.toString(transform),
            }
        : undefined;

    const headerStyle = isDragging ? { cursor: 'grabbing' } : { cursor: 'grab' };

    function renderTitle() {
        return (
            <div style={headerStyle} {...listeners} {...attributes}>
                {title}
            </div>
        );
    }

    function modalRender(modal) {
        return (
            <div ref={setNodeRef} style={{ position: 'relative', top, left, ...style }}>
                {modal}
            </div>
        );
    }

    return <Modal title={renderTitle()} modalRender={modalRender} {...rest} />;
}

export default CustomModalInner;
