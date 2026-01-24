import { AppProvider } from '@/components';

import { NewTabMain } from './compnents';

export default function App() {
    return (
        <AppProvider>
            <NewTabMain />
        </AppProvider>
    );
}
