import NiceModal from '@ebay/nice-modal-react';

import AntdProvider from './AntdProvider';

function AppProvider({ children }) {
    return (
        <AntdProvider>
            <NiceModal.Provider>
                {children}
            </NiceModal.Provider>
        </AntdProvider>
    );
}

export default AppProvider;
