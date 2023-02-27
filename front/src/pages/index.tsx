import type {NextPage} from 'next';
import {useAuthState} from "@/auth/data/auth.slice";
import React, {useState} from "react";
import {resourceApi} from "@/app/resource/data/resource.api";

const Home: NextPage = () => {

    const {accessToken, refreshToken} = useAuthState();
    // const [getInfo] = testApi.useGetTestDataMutation()
    const [getInfo] = resourceApi.useGetTestDataMutation()
    // const [getInfo] = resourceApi.useGetTestMutation()
    const [info, setInfo] = useState("")

    const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        getInfo().unwrap().then((data) => {
            console.log(data.data)
            setInfo(data.data)
        }).catch(data => {
            console.log("Error")
            console.log(data)
        })
    };

    return (
        <div className="flex flex-col m-2 break-all">
            <div className="text-red-700">info: {info}</div>
            <button onClick={buttonHandler} className="m-3 border-2 text-blue-700">
                Get Data
            </button>
            <div className="text-green-700">{accessToken}</div>
            <div className="text-red-700">{refreshToken}</div>
        </div>
    );
};

export default Home;
