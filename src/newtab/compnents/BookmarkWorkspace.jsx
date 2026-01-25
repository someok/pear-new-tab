import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

function BookmarkWorkspace() {
    return (
        <Space>
            <Button variant="filled" color="primary">😎 hello</Button>
            <Button variant="filled" color="default">world</Button>
            <Button variant="filled" color="default" icon={<PlusOutlined />} />
        </Space>
    );
}

export default BookmarkWorkspace;
