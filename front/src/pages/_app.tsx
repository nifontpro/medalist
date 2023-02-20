import '@/app/globals.css'
import type {AppProps} from 'next/app'
import MainProvider from "@/app/MainProvider";

function MyApp({Component, pageProps}: AppProps) {
    return <MainProvider>
        <Component {...pageProps} />
    </MainProvider>
}

export default MyApp
