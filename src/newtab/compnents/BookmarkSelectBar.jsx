import { ClearOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { Button, Divider, Flex } from 'antd';

import { isEmpty } from 'lodash-es';

import { clearSelectedBookmarkIds, useBookmarkStore } from '@/store/bookmarkStore';

function BookmarkSelectBar() {
    const { selectedBookmarkIds } = useBookmarkStore();

    if (isEmpty(selectedBookmarkIds)) {
        return null;
    }

    return (
        <Flex justify="center" className="fixed bottom-20 w-full">
            <Flex align="center" gap={8} className="bg-gray-200 p-2 shadow-lg dark:bg-gray-800">
                <Button variant="filled" color="danger" size="small" icon={<ClearOutlined />} onClick={clearSelectedBookmarkIds}>
                    清除
                    {' '}
                    {selectedBookmarkIds.length}
                    {' '}
                    个选择
                </Button>
                <Divider orientation="vertical" />
                <Button size="small" variant="filled" color="default" icon={<DeleteOutlined />}>删除</Button>
                <Button size="small" variant="filled" color="default" icon={<DragOutlined />}>移动</Button>
            </Flex>
        </Flex>
    );
}

export default BookmarkSelectBar;
