import type {NextPage} from 'next';
import {authApi} from "@/auth/data/auth.api";

const Home: NextPage = () => {

    const {data: info} = authApi.useTestDataQuery()

    console.log(info)

    return (
        <div>
            Hello world!
            {info?.data}
        </div>
    );
};

export default Home;
