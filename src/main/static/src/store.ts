import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import rootReducer from './reducers';
import { kayttooikeusApi } from './api/kayttooikeus';
import { oppijanumerorekisteriApi } from './api/oppijanumerorekisteri';

const isDev = import.meta.env.DEV;
const isClient = typeof window !== 'undefined';

export const store = configureStore({
    reducer: {
        ...rootReducer,
        [kayttooikeusApi.reducerPath]: kayttooikeusApi.reducer,
        [oppijanumerorekisteriApi.reducerPath]: oppijanumerorekisteriApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
            immutableCheck: false,
            serializableCheck: false,
        })
            .concat(kayttooikeusApi.middleware)
            .concat(oppijanumerorekisteriApi.middleware),
    devTools: isDev && isClient,
});

setupListeners(store.dispatch);
const useAppDispatch = () => store.dispatch;

export { useAppDispatch };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
