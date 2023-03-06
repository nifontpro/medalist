import type {NextPage} from 'next';
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {authActions, useAuthState} from "@/app/auth/data/auth.slice";
import {resourceApi} from "@/app/resource/data/resource.api";

const Home: NextPage = () => {

    const {push} = useRouter()
    const {isAuth} = useAuthState()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isAuth) {
            push("/login").then()
        }
    }, [dispatch, isAuth, push])

    // const [getInfo] = testApi.useGetTestDataMutation()
    const {data: getInfo} = resourceApi.useGetTestDataQuery()

    const buttonHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        logoutWin("")
    };

    return (
        <div className="flex flex-col m-2 break-all">
            <div className="text-red-700">info: {getInfo?.data}</div>
            <button onClick={buttonHandler} className="m-3 border-2 text-blue-700">
                Logout
            </button>
        </div>
    );

    function logoutWin(idToken?: string) {

        dispatch(authActions.setAuth(false))
        console.log(idToken)
        if (idToken == undefined) {
            return
        }
    }

};

export default Home;
