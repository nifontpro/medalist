import type {NextPage} from 'next';
import React, {useEffect} from "react";
import {APP_URL, CLIENT_ID, KEYCLOAK_URI} from "@/app/auth/data/auth.api";

export const STATE_KEY = "ST";
export const RESPONSE_TYPE_CODE = "code"; // для получения authorization code
export const SCOPE = "openid"; // какие данные хотите получить помимо access token (refresh token, id token, email и пр.) - можно через пробел указывать неск значений

const Login: NextPage = () => {

    useEffect(() => {
        const state = generateState(30);
        localStorage.setItem(STATE_KEY, state);
        requestAuthCode(state);
    }, [])

    return (
        <div className="flex flex-col m-2 break-all">
            <div className="text-blue-700 text-2xl">Login page</div>
        </div>
    );

// запрос в auth server на получение auth code (который потом будем менять на access token и другие токены)
// для BFF можно применять grantType = authorization code (вместо PKCE), т.к. токены теперь не будут храниться в браузере
// поэтому параметры codeVerifier и codeChallenge не нужны
    function requestAuthCode(state: string) {

        // в каждой версии KeyCloak может изменяться URL - поэтому нужно сверяться с документацией
        let authUrl = KEYCLOAK_URI + "/auth"; // здесь не исп. BFF, а обращаемся напрямую

        authUrl += "?response_type=" + RESPONSE_TYPE_CODE; // указываем auth server, что хотим получить auth code
        authUrl += "&client_id=" + CLIENT_ID; // берем из auth server
        authUrl += "&state=" + state; // auth server сохранит это значение себе и отправит в запросе (вместе с access token) и клиент сможет убедиться, что ответ пришел именно на его запрос
        authUrl += "&scope=" + SCOPE; // какие данные хотите получить от auth server, помимо access token
        authUrl += "&redirect_uri=" + APP_URL + "/login/redirect"; // куда auth server будет отправлять ответ
        // authUrl += "&redirect_uri=" + APP_URL // куда auth server будет отправлять ответ

        window.open(authUrl, '_self'); // открываем в этом же окне (self) окно авторизации KeyCloak
    }
};

export default Login;

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