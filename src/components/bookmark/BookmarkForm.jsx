import { useImperativeHandle } from 'react';

import { FontColorsOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

function BookmarkForm({ ref, title, url, onFinish }) {
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
        getForm: () => form,
        submit: () => form.submit(),
    }));

    return (
        <Form form={form} layout="vertical" variant="filled" onFinish={onFinish} initialValues={{ title, url }}>
            <Form.Item name="title" rules={[{ required: true, message: '请输入标题' }]}>
                <Input autoFocus allowClear size="large" showCount placeholder="标题" prefix={<FontColorsOutlined />} />
            </Form.Item>
            <Form.Item name="url" rules={[{ required: true, message: '请输入链接' }]}>
                <Input allowClear size="large" showCount placeholder="链接" prefix={<LinkOutlined />} />
            </Form.Item>

            <Form.Item hidden>
                <Button htmlType="submit" />
            </Form.Item>
        </Form>
    );
}

export default BookmarkForm;
