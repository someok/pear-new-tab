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
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Flex
            ref={setNodeRef}
            justify="center"
            align="center"
            style={style}
            className={classNames(
                'px-3  h-8 select-none',
                'hover:bg-cyan-500 hover:text-white',
                isDragging ? 'bg-cyan-500' : 'cursor-grab bg-cyan-200',
            )}
            {...attributes}
            {...listeners}
        >
            {title}
        </Flex>
    );
}

export default SortableWorkspaceItem;
