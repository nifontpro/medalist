import type {NextPage} from 'next';
import dynamic from "next/dynamic";
import useAuth from "@/auth/data/useAuth";

const Home: NextPage = () => {

    const isLogin = useAuth()

    return isLogin ? (

        <div className="flex flex-col m-2">
            Login successful
        </div>
    ) : <div>
        Not Login
    </div>
};

export default dynamic(() => Promise.resolve(Home), {
    ssr: false,
})
