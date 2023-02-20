import {FC, PropsWithChildren} from 'react'
import {Provider} from "react-redux";
import {store} from "@/auth/data/store";

const MainProvider: FC<PropsWithChildren> = ({children}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default MainProvider
