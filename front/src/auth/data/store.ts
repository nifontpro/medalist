import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import {authApi} from '@/auth/data/auth.api';

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
        ),
});

export type TypeRootState = ReturnType<typeof store.getState>;
// export const useAppSelector: TypedUseSelectorHook<TypeRootState> = useSelector
