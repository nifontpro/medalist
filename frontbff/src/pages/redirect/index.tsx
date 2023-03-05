import type {NextPage} from 'next';
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {bffApi} from "@/app/resource/data/bffApi";
import {STATE_KEY, USE_REFRESH_KEY} from "@/pages";

const Redirect: NextPage = () => {

    const {query} = useRouter()
    const [exchangeRefreshToAccessToken] = bffApi.useExchangeRefreshToAccessTokenMutation()
    const [sendCodeToBff] = bffApi.useSendCodeToBFFMutation()

    useEffect(() => {
        checkAuthCode()
    }, [checkAuthCode])

    return (
        <div className="flex flex-col m-2 break-all">
            <div className="text-blue-700 text-2xl">Redirect page</div>
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
            sendCodeToBff(authCode).unwrap().then(() => {
                // флаг, что в куках есть refresh token и его можно обменивать потом на новые access token
                localStorage.setItem(USE_REFRESH_KEY, "true");

                // получаем данные с API Resource Server
                // getDataFromResourceServer();
            })

        } else {
            // initAccessToken(); // если ошибка - заново отправляем для ввода логин-пароль
            console.log('Init access token')
        }
    }

};

export default Redirect;