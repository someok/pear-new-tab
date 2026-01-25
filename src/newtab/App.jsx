import { AppProvider } from '../components';

import NewTabMain from './NewTabMain';

export default function App() {
    return (
        <AppProvider>
            <NewTabMain />
        </AppProvider>
    );
}
