import {FC, PropsWithChildren} from 'react'
import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import {persistor, store} from "@/app/storage/store";

const MainProvider: FC<PropsWithChildren> = ({children}) => {
    return (

        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                {/*<AuthProvider>*/}
                {children}
                {/*</AuthProvider>*/}
            </PersistGate>
        </Provider>
    )
}

export default MainProvider
