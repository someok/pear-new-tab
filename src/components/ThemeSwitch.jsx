import { CheckOutlined, DesktopOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';

import { useTheme } from '../hooks';

function ThemeSwitch() {
    const { setMode, mode } = useTheme();

    function onClick({ key }) {
        setMode(key);
    }

    const items = [{
        key: 'system',
        label: 'System',
        icon: <DesktopOutlined />,
    }, {
        key: 'light',
        label: 'Light',
        icon: <SunOutlined />,
    }, {
        key: 'dark',
        label: 'Dark',
        icon: <MoonOutlined />,
    }];
    items.forEach((item) => {
        if (item.key === mode) {
            item.extra = <CheckOutlined />;
        } else {
            item.extra = <div className="h-3 w-3" />;
        }
    });

    function getIcon() {
        return items.find((item) => item.key === mode).icon;
    }

    return (
        <Dropdown menu={{ items, onClick, selectedKeys: [mode] }}>
            <Button size="small" variant="text" color="default" icon={getIcon()} />
        </Dropdown>
    );
}

export default ThemeSwitch;
