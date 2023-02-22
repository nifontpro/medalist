import {FC, PropsWithChildren} from 'react'
import {Provider} from "react-redux";
import {store} from "@/auth/data/store";

// https://www.npmjs.com/package/react-keycloak-id
// https://mobihack.me/blog/2021-12-31-keycloak-nextjs/

const MainProvider: FC<PropsWithChildren> = ({children}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default MainProvider
