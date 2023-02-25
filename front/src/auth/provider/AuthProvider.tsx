import {FC, PropsWithChildren, useEffect} from 'react';
import {useRouter} from 'next/router';
import {authActions, useAuthState} from "@/auth/data/auth.slice";
import {useDispatch} from "react-redux";

const AuthProvider: FC<PropsWithChildren> = ({children}) => {

    const {isAuth, isLogin} = useAuthState()
    const dispatch = useDispatch();
    const {push} = useRouter();

    useEffect(() => {
        if (!isAuth && !isLogin) {
            dispatch(authActions.setLogin(true))
            push("/login").then()
        }
    }, [dispatch, isAuth, isLogin, push])

    return <>{children}</>;
};

export default AuthProvider;
