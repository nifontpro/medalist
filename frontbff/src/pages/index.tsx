import type {NextPage} from 'next';
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {useAuthState} from "@/app/auth/data/auth.slice";
import {resourceApi} from "@/app/resource/data/resource.api";
import {bffApi} from "@/app/resource/data/bffApi";

const Home: NextPage = () => {

    const {push} = useRouter()
    const {isAuth} = useAuthState()

    useEffect(() => {
        if (!isAuth) {
            push("/login").then()
        }
    }, [isAuth, push])

    const {data: userData} = resourceApi.useGetTestDataQuery()
    const {data: adminData} = resourceApi.useGetAdminDataQuery()
    const [logout] = bffApi.useLogoutMutation()

    console.log(userData?.res)

    const logoutHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        await logout()
    }

    return (
        <div className="flex flex-col m-2 break-all">
            <div className="text-red-700">User data: {userData?.res}</div>
            <div className="text-green-700">Admin data: {adminData?.res}</div>
            <div className="text-blue-700">Auth: {isAuth ? <div>True</div> : <div>False</div>}</div>
            <button onClick={logoutHandler} className="m-3 border-2 text-blue-700">
                Logout
            </button>
        </div>
    );

};

export default Home;
