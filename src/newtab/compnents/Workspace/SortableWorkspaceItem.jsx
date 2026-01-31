import { Flex } from 'antd';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classNames from 'classnames';

function SortableWorkspaceItem({ id, title }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging }
        = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <Flex
            ref={setNodeRef}
            justify="center"
            align="center"
            style={style}
            className={classNames(
                'px-3 h-8 select-none hover:bg-accent/80',
                isDragging ? 'bg-accent/80' : 'cursor-grab bg-accent',
            )}
            {...attributes}
            {...listeners}
        >
            {title}
        </Flex>
    );
}

export default SortableWorkspaceItem;
