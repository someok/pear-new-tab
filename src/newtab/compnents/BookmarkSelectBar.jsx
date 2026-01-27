import { useState } from 'react';

import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { isEmpty } from 'lodash-es';

import { useBookmarkStore } from '@/store/bookmarkStore';

import BookmarkSelectBarInner from './BookmarkSelectBarInner';

const defaultCoordinates = {
    x: 0,
    y: 0,
};

function BookmarkSelectBar() {
    const { selectedBookmarkIds } = useBookmarkStore();

    const [{ x, y }, setCoordinates] = useState(defaultCoordinates);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor),
    );

    if (isEmpty(selectedBookmarkIds)) {
        return null;
    }

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={({ delta }) => {
                setCoordinates(({ x, y }) => {
                    return {
                        x: x + delta.x,
                        y: y + delta.y,
                    };
                });
            }}
        >
            <BookmarkSelectBarInner selectedBookmarkIds={selectedBookmarkIds} top={y} left={x} />
        </DndContext>
    );
}

export default BookmarkSelectBar;
