import type {NextPage} from 'next';
import {authApi} from "@/auth/data/auth.api";

const Home: NextPage = () => {

    const {data: info} = authApi.useTestDataQuery()

    console.log(info)

    return (
        <div className="flex flex-row w-full">
            <div className="basis-1/2 text-blue-700 hover:text-green-700">Hello world!</div>
            <div className="basis-1/4 text-red-600"> Test string</div>
            <div className="basis-1/4">{info?.data}</div>
        </div>
    );
};

export default Home;
