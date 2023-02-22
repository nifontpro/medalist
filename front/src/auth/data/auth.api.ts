import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

// const KEYCLOAK_URI = "https://localhost:8443/realms/todoapp-realm/protocol/openid-connect"
const KEYCLOAK_URI = "http://localhost:8180/realms/todoapp-realm/protocol/openid-connect"
const S256 = "S256"
const CLIENT_ID = "todoapp-client"
const SCOPE = "openid"
const RESPONSE_TYPE_CODE = "code"
const AUTH_CODE_REDIRECT_URI = "http://localhost:3000/redirect"

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({baseUrl: KEYCLOAK_URI}),
    tagTypes: ['Auth'],
    endpoints: (build) => ({

        login: build.mutation<void, { state: string, codeChallenge: string }>({
            query: (params) => ({
                method: 'GET',
                url: '/auth',
                params: {
                    response_type: RESPONSE_TYPE_CODE,
                    client_id: CLIENT_ID,
                    state: params.state,
                    scope: SCOPE,
                    redirect_uri: encodeURIComponent(AUTH_CODE_REDIRECT_URI),
                    code_challenge: params.codeChallenge,
                    code_challenge_method: S256
                }
            }),
            invalidatesTags: ['Auth'],
        })

    })
})