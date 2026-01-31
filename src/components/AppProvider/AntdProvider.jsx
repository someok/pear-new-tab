import { StyleProvider } from '@ant-design/cssinjs';
import { App, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { useTheme } from '@/hooks';

function AntdProvider({ children }) {
    const { isDark } = useTheme();

    return (
        <StyleProvider layer>
            <ConfigProvider
                locale={zhCN}
                theme={{
                    algorithm: isDark ? [theme.darkAlgorithm] : [theme.defaultAlgorithm],
                    cssVar: {
                        key: 'antd-theme',
                    },
                    hashed: false,
                    token: {
                        borderRadius: 0,
                    },
                }}
            >
                <App>
                    {children}
                </App>
            </ConfigProvider>
        </StyleProvider>
    );
}

export default AntdProvider;
