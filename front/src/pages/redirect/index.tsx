import {NextPage} from "next";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {authApi, IAuthResponse} from "@/auth/data/auth.api";

const Redirect: NextPage = () => {

    const {query} = useRouter()
    const [getAccessToken] = authApi.useGetAccessTokenMutation()

    const [token, setToken] = useState("")

    useEffect(() => {
        const codeVerifier = localStorage.getItem("codeVerifier")
        // state не описана в pkce, но рекомендуется ее использовать
        const state = localStorage.getItem("state")
        const code = query.code
        if (state != query.state || codeVerifier == null || code == undefined || typeof (code) != 'string') {
            console.log('Invalid grand!')
            return
        }
        getAccessToken({code, codeVerifier})
            .unwrap()
            .then((response: IAuthResponse) => {
                setToken(response.access_token)
            })

    }, [getAccessToken, query.code, query.state])


    return (
        <div className="flex flex-col m-2 text-3xl break-all">
            <div>Login successful!</div>
            <div>2 step state: {query.state}</div>
            <div className="text-red-600">code: {query.code}</div>
            <div className="text-blue-700">token: {token}</div>
        </div>
    )
}

export default Redirect