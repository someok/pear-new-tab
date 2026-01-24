import { Flex } from 'antd';

import { ThemeSwitch } from '@/components';

function NewTabMain() {
    return (
        <Flex vertical className="h-screen w-screen overflow-hidden">
            <Flex align="center" justify="space-between" className="h-12 px-4">
                <div>header</div>
                <ThemeSwitch />
            </Flex>

            <div className="flex-1 overflow-hidden border">
                main
            </div>
        </Flex>
    );
}

export default NewTabMain;
