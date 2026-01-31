import { Flex } from 'antd';

import { AppProvider, BookmarkForm } from '@/components';

export default function App() {
    function onFinish(values) {
        console.log('values', values);
    }

    return (
        <AppProvider>
            <Flex className="h-50 w-100 p-4">
                <div className="w-full">

                    <BookmarkForm onFinish={onFinish} />
                </div>
            </Flex>
        </AppProvider>
    );
}
