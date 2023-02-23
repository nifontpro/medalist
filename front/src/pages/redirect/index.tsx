import {NextPage} from "next";
import {useRouter} from "next/router";
import React from "react";

const Redirect: NextPage = () => {

    const {query} = useRouter()
    const codeVerifier = localStorage.getItem("codeVerifier")
    const state = localStorage.getItem("state")
    // const {state, codeVerifier} = useAuthState();

    // const {data} = authApi.useGetAccessTokenQuery({
    //     code: query.code as string,
    //     codeVerifier
    // }, {skip: typeof (query.code) != "string"})

    // console.log(data)

    return (
        <div className="flex flex-col m-2 text-3xl">
            <div>Login successful!</div>
            <div>Code verifier: {codeVerifier}</div>
            <div>1 step state: {state}</div>
            <div>2 step state: {query.state}</div>
            <div className="text-red-600">code: {query.code}</div>
        </div>
    )
}

export default Redirect