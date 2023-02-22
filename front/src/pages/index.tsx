import type {NextPage} from 'next';
import {authApi} from "@/auth/data/auth.api";
import {useEffect, useState} from "react";
import dynamic from "next/dynamic";

const CLIENT_ID = "todoapp-client"; // название должен совпадать c клиентом из KeyCloak

// !! в каждой версии KeyCloak могут меняться URI - поэтому нужно сверяться с документацией
const KEYCLOAK_URI = "http://localhost:8180/realms/todoapp-realm/protocol/openid-connect"; // общий URI KeyCloak
const AUTH_CODE_REDIRECT_URI = 'http://localhost:3000/redirect'; // куда auth server будет отправлять auth code

const Home: NextPage = () => {

    const [login] = authApi.useLoginMutation()

    // https://github.com/crouchcd/pkce-challenge
    const pkceChallenge = require("pkce-challenge").default;

    const [state, setState] = useState<string>("")

    // https://www.rfc-editor.org/rfc/rfc7636.html#page-8
    const [codeVerifier, setCodeVerifier] = useState<string>("")
    const [codeChallenge, setCodeChallenge] = useState<string>("")

    useEffect(() => {
        const challenge = pkceChallenge()
        let tmpState = generateState(30)
        setState(tmpState)
        setCodeVerifier(challenge.code_verifier)
        setCodeChallenge(challenge.code_challenge)
        // login({state, codeChallenge})

        let url = requestAuthCode(tmpState, challenge.code_challenge)
        window.open(url, '_self');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestAuthCode])

    return (
        <div className="flex flex-col m-2">
            <div className="text-red-600">state: {state}</div>
            <div className="text-blue-700">codeVerifier: {codeVerifier}</div>
            <div className="text-green-700">codeChallenge: {codeChallenge}</div>

        </div>
    );
};

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

// function requestAuthCode(state: string, codeChallenge: string) {
//
//     // в каждой версии KeyCloak может изменяться URL - поэтому нужно сверяться с документацией
//     let authUrl = KEYCLOAK_URI + "/auth";
//
//     authUrl += "?response_type=" + RESPONSE_TYPE_CODE; // указываем auth server, что хотим получить auth code
//     authUrl += "&client_id=" + CLIENT_ID; // берем из auth server
//     authUrl += "&state=" + state; // auth server сохранит это значение себе и отправит в след. запросе (вместе с access token) и клиент сможет убедиться, что ответ пришел именно на его запрос
//     authUrl += "&scope=" + SCOPE; // какие данные хотите получить от auth server, помимо access token
//     authUrl += "&code_challenge=" + codeChallenge; // чтобы auth server убедился - запрос пришел именно то того пользователя, кто авторизовался ранее и получил auth code
//     authUrl += "&code_challenge_method=" + S256; // функция применяется к code_verifier, которые auth server получил в прошлом запросе - затем он сравнит результат с переданным code_challenge
//     authUrl += "&redirect_uri=" + encodeURIComponent(AUTH_CODE_REDIRECT_URI); // куда auth server будет отправлять ответ
//
//     // открываем окно для авторизации
//     // если сделаете размер меньше, будет мобильная версия (KeyCloak автоматически изменит стиль окна)
//     // window.open(authUrl, 'auth window', 'width=800,height=600,left=350,top=200');
//     console.log(authUrl)
//     // window.open(authUrl, '_self');
// }

function requestAuthCode(state: string, codeChallenge: string): string {
    const params = [
        'response_type=code', // хотим получить auth code, который затем поменяем на токены
        'state=' + state, // защита клиента - что ответ от auth server пришел именно на его запрос
        'client_id=' + CLIENT_ID, // настройки из KC
        'scope=openid', // какие именно данные хотим получить от auth server (какие токены и пр.)
        'code_challenge=' + codeChallenge, //  в след. запросе на получение токенов - значение codeChallenge будет сравниваться в auth server со значением на основе code_verifier - чтобы убедиться, что оба запроса пришли от того же пользователя
        // 'code_challenge=' + '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU', //  в след. запросе на получение токенов - значение codeChallenge будет сравниваться в auth server со значением на основе code_verifier - чтобы убедиться, что оба запроса пришли от того же пользователя
        'code_challenge_method=S256',
        // 'redirect_uri=' + encodeURIComponent(AUTH_CODE_REDIRECT_URI),
        'redirect_uri=' + AUTH_CODE_REDIRECT_URI,
    ];

    // итоговый URL вместе с параметрами
    let url = KEYCLOAK_URI + '/auth' + '?' + params.join('&');

    console.log(url)

    return url
}

export default dynamic(() => Promise.resolve(Home), {
    ssr: false,
})
