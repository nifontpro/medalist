import type {NextPage} from 'next';
import React, {useEffect} from "react";
import {resourceApi} from "@/app/resource/data/resource.api";
import {authActions, useAuthState} from "@/auth/data/auth.slice";
import {APP_URI, CLIENT_ID, KEYCLOAK_URI} from "@/auth/data/auth.api";
import {useJwt} from "react-jwt";
import {IPayload} from "@/app/resource/model/idToken";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";

const Home: NextPage = () => {

    const {push} = useRouter()
    const {isAuth} = useAuthState()
    const {idToken} = useAuthState()
    const dispatch = useDispatch()
    const {decodedToken, isExpired} = useJwt(idToken || '');
    const payload = decodedToken as IPayload | undefined

    useEffect(() => {
        if (!isAuth) {
            push("/login").then()
        }
    }, [dispatch, isAuth, push])

    // const [getInfo] = testApi.useGetTestDataMutation()
    const {data: getInfo} = resourceApi.useGetTestDataQuery()
    // const [getInfo] = resourceApi.useGetTestMutation()

    const buttonHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        logoutWin(idToken)
        await dispatch(authActions.setNoAccess())
    };

    return (
        <div className="flex flex-col m-2 break-all">
            <div className="text-red-700">info: {getInfo?.data}</div>
            <button onClick={buttonHandler} className="m-3 border-2 text-blue-700">
                Logout
            </button>
            <div className="text-blue-700">name: {payload?.name}</div>
            <div className="text-green-700">email: {payload?.email}</div>
        </div>
    );

    function logoutWin(idToken?: string) {

        console.log(idToken)
        if (idToken == undefined) {
            return
        }

        const params = [
            'post_logout_redirect_uri=' + APP_URI,
            'id_token_hint=' + idToken,
            'client_id=' + CLIENT_ID,
        ];

        const url = KEYCLOAK_URI + '/logout' + '?' + params.join('&')
        window.open(url, '_self');
    }

};

export default Home;
