import type {NextPage} from 'next';
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {bffApi} from "@/app/resource/data/bffApi";
import {setRefreshTokenCookieExists, STATE_KEY} from "@/pages/login";
import {useDispatch} from "react-redux";
import {authActions} from "@/app/auth/data/auth.slice";

const Redirect: NextPage = () => {

    const {query} = useRouter()
    const [exchangeRefreshToAccessToken] = bffApi.useExchangeRefreshToAccessTokenMutation()
    const [sendCodeToBff] = bffApi.useSendCodeToBFFMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        checkAuthCode()
    }, [checkAuthCode])

    return (
        <div className="flex flex-col m-2 break-all">
            <div className="text-blue-700 text-2xl">Redirect login page</div>
        </div>
    );

    // проверяем, если в текущем запросе есть параметры ответа от auth server - значит это ответ с новым auth code
    function checkAuthCode() {
        console.log(query);

        const authCode = query.code as string | undefined,
            state = query.state as string | undefined,
            error = query.error,
            errorDescription = query.error_description

        // если такого параметра нет
        if (!authCode || !state) {
            return false;
        }

        sendCodeToBFF(state, authCode) // получаем новые токены

        return true;
    }

    // отправляем auth code в BFF, чтобы он получил все токены и сохранил их в куках
    function sendCodeToBFF(stateFromAuthServer: string, authCode: string) { // idea может показывать, что функция нигде не используется, но это не так, просто он не может определить вызов из другого window

        // console.log(authCode);
        const originalState = localStorage.getItem(STATE_KEY);

        // убеждаемся, что это ответ именно на наш запрос, который отправляли ранее (для авторизации на auth server)
        if (stateFromAuthServer === originalState) {

            localStorage.removeItem(STATE_KEY);
            // отправляем auth code в BFF, чтобы он получил все токены и сохранил их в куках
            console.log('Send code to bff')
            sendCodeToBff(authCode).unwrap().then(() => {
                setRefreshTokenCookieExists(true)
                dispatch(authActions.setAuth(true))
                // получаем данные с API Resource Server
                // getDataFromResourceServer();
            })
                .catch(()=>{
                    console.log('ERROR: Send code to bff')
                })

        } else {
            dispatch(authActions.setAuth(false)) // если ошибка - заново отправляем для ввода логин-пароль
        }
    }

};

export default Redirect;