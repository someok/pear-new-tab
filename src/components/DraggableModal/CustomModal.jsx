import * as React from 'react';
import { useState } from 'react';

import { DndContext } from '@dnd-kit/core';

import CustomModalInner from './CustomModalInner';

function CustomModal(props) {
    const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });

    function handleDragEnd({ delta }) {
        setCoordinates((prev) => ({
            top: prev.top + delta.y,
            left: prev.left + delta.x,
        }));
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <CustomModalInner coordinates={coordinates} {...props} />
        </DndContext>
    );
}

export default CustomModal;
