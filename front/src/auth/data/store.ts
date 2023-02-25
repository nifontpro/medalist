import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {authApi} from '@/auth/data/auth.api';
import {authSlice} from "@/auth/data/auth.slice";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import storage from 'redux-persist/lib/storage'
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE} from 'redux-persist'
import {resourceApi} from "@/app/resource/data/resource.api";
import {testApi} from "@/app/resource/data/test.api";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [resourceApi.reducerPath]: resourceApi.reducer,
    [testApi.reducerPath]: testApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }).concat(
            authApi.middleware,
            resourceApi.middleware,
            testApi.middleware,
        ),
});

export const persistor = persistStore(store)

export type TypeRootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<TypeRootState> = useSelector
