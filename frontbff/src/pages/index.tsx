import type {NextPage} from 'next';
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {APP_URL, CLIENT_ID, KEYCLOAK_URI} from "@/app/auth/data/auth.api";
import {bffApi} from "@/app/resource/data/bffApi";

// ключи для сохранения в localStorage
export const USE_REFRESH_KEY = "USE_RT"; //
export const STATE_KEY = "ST";
export const RESPONSE_TYPE_CODE = "code"; // для получения authorization code
export const SCOPE = "openid"; // какие данные хотите получить помимо access token (refresh token, id token, email и пр.) - можно через пробел указывать неск значений

const Home: NextPage = () => {

    const {query} = useRouter()
    const [refreshTokenCookieExists, setRefreshTokenCookieExists] = useState("")
    const [exchangeRefreshToAccessToken] = bffApi.useExchangeRefreshToAccessTokenMutation()
    const [sendCodeToBff] = bffApi.useSendCodeToBFFMutation()

    useEffect(() => {
        if (!checkAuthCode()) { // если текущий запрос - это не ответ от auth server с новым code (через redirect uri)

            // флаг true или false (не значение токена), был ли ранее сохранен кук с Refresh Token
            // чтобы сэкономить время и не делать лишние запросы в BFF и KeyCloak и не обрабатывать ошибку
            // само значение токена сохраняется в куке и отправляется на сервер автоматически
            // флаг можено сохранять в localStorage, т.к. это не sensitive information
            setRefreshTokenCookieExists(localStorage.getItem(USE_REFRESH_KEY) || "");

            if (refreshTokenCookieExists) {
                exchangeRefreshToAccessToken().unwrap() // запрашиваем новый Access Token с помощью сохраненного ранее Refresh Token (в куке браузера)
                    .then(() => {
                        // флаг, что в куках есть refresh token и его можно обменивать потом на новые access token
                        localStorage.setItem(USE_REFRESH_KEY, "true");
                        // получаем данные с API Resrouce Server
                        // getDataFromResourceServer();
                    })
                    .catch()
            } else {
                initAccessToken(); // никакой из других вариантов не запустился - значит запускаем полный цикл получения токенов с вводом логин-пароль
            }

        }
    }, [])

    return (
        <div className="flex flex-col m-2 break-all">
            <div className="text-blue-700 text-2xl">Hello BFF Frontend</div>
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

// запускаем цикл действий для grant type = PKCE (Proof Key for Code Exchange), который хорошо подходит для JS приложений в браузере
// https://www.rfc-editor.org/rfc/rfc7636
    function initAccessToken() {
        // нужен только для первого запроса (авторизация), чтобы клиент убедился, что ответ от AuthServer (после авторизации) пришел именно на его нужный запрос
        // защита от CSRF атак
        const state = generateState(30);
        console.log("state = " + state)
        localStorage.setItem(STATE_KEY, state);

        // запрашиваем auth code (вводим логин-пароль)
        requestAuthCode(state);

    }

// запрос в auth server на получение auth code (который потом будем менять на access token и другие токены)
// для BFF можно применять granttype = authorization code (вместо PKCE), т.к. токены теперь не будут храниться в браузере
// поэтому параметры codeVerifier и codeChallenge не нужны
    function requestAuthCode(state: string) {

        // в каждой версии KeyCloak может изменяться URL - поэтому нужно сверяться с документацией
        let authUrl = KEYCLOAK_URI + "/auth"; // здесь не исп BFF, а обращаемся напрямую

        authUrl += "?response_type=" + RESPONSE_TYPE_CODE; // указываем auth server, что хотим получить auth code
        authUrl += "&client_id=" + CLIENT_ID; // берем из auth server
        authUrl += "&state=" + state; // auth server сохранит это значение себе и отправит в след. запросе (вместе с access token) и клиент сможет убедиться, что ответ пришел именно на его запрос
        authUrl += "&scope=" + SCOPE; // какие данные хотите получить от auth server, помимо access token
        authUrl += "&redirect_uri=" + APP_URL + "/redirect"; // куда auth server будет отправлять ответ
        // authUrl += "&redirect_uri=" + APP_URL // куда auth server будет отправлять ответ

        window.open(authUrl, '_self'); // открываем в этом же окне (self) окно авторизации KeyCloak
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
            initAccessToken(); // если ошибка - заново отправляем для ввода логин-пароль
        }
    }

};

export default Home;

const generateState = (length: number) => {
    let state = "";
    // noinspection SpellCheckingInspection
    let alphaNumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let alphaNumericCharactersLength = alphaNumericCharacters.length;
    for (let i = 0; i < length; i++) {
        state += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphaNumericCharactersLength));
    }

    return state;
}