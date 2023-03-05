import {NextPage} from "next";
import {NextRouter, useRouter} from "next/router";
import React, {useEffect} from "react";
import {authApi} from "@/auth/data/auth.api";
import {useAuthState} from "@/auth/data/auth.slice";

const Redirect: NextPage = () => {

    const router = useRouter()
    const push = router.push
    const query = router.query
    const pathname = router.pathname

    const [getLoginData] = authApi.useGetLoginDataMutation()
    const {accessToken} = useAuthState();

    const codeVerifier = localStorage.getItem("codeVerifier")
    const codeChallenge = localStorage.getItem("codeChallenge")

    useEffect(() => {

        const state = localStorage.getItem("state")
        const queryCode = query.code

        if (queryCode == undefined) {
            return
        }

        if (state != query.state || codeVerifier == null || typeof (queryCode) != 'string') {
            console.log('Invalid grant')
            return
        }

        console.log('GET LOGIN DATA')
        getLoginData({code: queryCode, codeVerifier})
            .unwrap()
            .then(async () => {
                await push('/')
            })

    }, [codeVerifier, getLoginData, pathname, push, query.code, query.state, router])

    return (
        <div className="flex flex-col m-2 text-3xl break-all">
            <div>Login successful!</div>
            <div>codeVerifier: {codeVerifier}</div>
            <div>codeChallenge: {codeChallenge}</div>
            <div>2 step state: {query.state}</div>
            <div className="text-red-600">code: {query.code}</div>
            <div className="text-blue-700">{accessToken}</div>
        </div>
    )
}

export default Redirect

export const removeQueryParams = (
    router: NextRouter,
    paramsToRemove: Array<string> = []
) => {
    if (paramsToRemove.length > 0) {
        paramsToRemove.forEach((param) => delete router.query[param])
    } else {
        // Remove all query parameters
        Object.keys(router.query).forEach((param) => delete router.query[param])
    }
    router.replace(
        {
            pathname: router.pathname,
            query: router.query,
        },
        undefined,
        /**
         * Do not refresh the page when the query params are removed
         */
        {shallow: true}
    ).then()
}