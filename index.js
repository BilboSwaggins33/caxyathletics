
import { Provider as StoreProvider } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";

import { store } from "./redux/store";

import App from "./App"
export default function Index() {

    return (
        <StoreProvider store={store}>
            <PaperProvider>
                <App />
            </PaperProvider>
        </StoreProvider>
    );
}

