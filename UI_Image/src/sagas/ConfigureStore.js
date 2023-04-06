import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from '../reducers';
import rootSaga from '.';



export default () => {
    // Middleware: Redux Persist Config
    const persistConfig = {
        // Root?
        key: 'root',
        // Storage Method (React Native)
        storage: AsyncStorage,
        // Whitelist (Save Specific Reducers)
        // whitelist: ['search'],
        // Blacklist (Don't Save Specific Reducers)
        // blacklist: ['auth'],
    };

    // Middleware: Redux Persist Persisted Reducer
    const persistedReducer = persistReducer(persistConfig, reducers);

    const sagaMiddleware = createSagaMiddleware();
    const middleware = applyMiddleware(sagaMiddleware);
    const store = createStore(persistedReducer, middleware);
    sagaMiddleware.run(rootSaga);

    // Middleware: Redux Persist Persister
    const persistor = persistStore(store);
    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default;
            store.replaceReducer(persistReducer(persistConfig, nextReducer));
        });
    }
    return {store, persistor};
};