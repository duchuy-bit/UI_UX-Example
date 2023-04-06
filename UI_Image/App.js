import React, {Suspense} from 'react';
import { SafeAreaView, Text, View, LogBox } from 'react-native';
import ConfigureStore from './src/sagas/ConfigureStore';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingScreen from './src/screens/Loading/LoadingScreen';
import MainNavigation from './src/screens/Navigation';

LogBox.ignoreAllLogs()

const store = ConfigureStore();

function App(){
    return (
        <Provider store={store.store}>
            <PersistGate loading={<LoadingScreen />} persistor={store.persistor} >
                <Suspense fallback={<LoadingScreen />}>
                    <MainNavigation />
                </Suspense>
            </PersistGate>
        </Provider>
    )
}

export default App;
