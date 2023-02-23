import type {NextPage} from 'next';
import {useEffect} from "react";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";

const CLIENT_ID = "todoapp-client"; // название должен совпадать c клиентом из KeyCloak

// !! в каждой версии KeyCloak могут меняться URI - поэтому нужно сверяться с документацией
const KEYCLOAK_URI = "http://localhost:8180/realms/todoapp-realm/protocol/openid-connect"; // общий URI KeyCloak
const AUTH_CODE_REDIRECT_URI = 'http://localhost:3000/redirect'; // куда auth server будет отправлять auth code

const Home: NextPage = () => {

    // const {state, codeVerifier, codeChallenge} = useAuthState();
    // const dispatch = useDispatch();

    const {query} = useRouter()

    // https://github.com/crouchcd/pkce-challenge
    const pkceChallenge = require("pkce-challenge").default;

    useEffect(() => {
        console.log(query.code)
        const challenge = pkceChallenge()
        let tmpState = generateState(30)
        // dispatch(authActions.setState({
        //     state: tmpState,
        //     codeVerifier: challenge.code_verifier,
        //     codeChallenge: challenge.code_challenge
        // }))
        // saveStatesToCookie({state, codeVerifier})
        localStorage.setItem("codeVerifier", challenge.code_verifier)
        localStorage.setItem("state", tmpState)

        let url = requestAuthCode(tmpState, challenge.code_challenge)
        window.open(url, '_self');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-col m-2">
            <div className="text-green-700">Login...</div>
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

function requestAuthCode(state: string, codeChallenge: string): string {
    const params = [
        'response_type=code', // хотим получить auth code, который затем поменяем на токены
        'state=' + state, // защита клиента - что ответ от auth server пришел именно на его запрос
        'client_id=' + CLIENT_ID, // настройки из KC
        'scope=openid', // какие именно данные хотим получить от auth server (какие токены и пр.)
        'code_challenge=' + codeChallenge, //  в след. запросе на получение токенов - значение codeChallenge будет сравниваться в auth server со значением на основе code_verifier - чтобы убедиться, что оба запроса пришли от того же пользователя
        'code_challenge_method=S256',
        'redirect_uri=' + AUTH_CODE_REDIRECT_URI,
    ];

    return KEYCLOAK_URI + '/auth' + '?' + params.join('&')
}

export default dynamic(() => Promise.resolve(Home), {
    ssr: false,
})
