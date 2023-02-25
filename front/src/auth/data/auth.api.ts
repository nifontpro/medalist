import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

// const KEYCLOAK_URI = "https://localhost:8443/realms/todoapp-realm/protocol/openid-connect"
export const KEYCLOAK_URI = "http://localhost:8180/realms/todoapp-realm/protocol/openid-connect"
export const CLIENT_ID = "todoapp-client"
export const AUTH_CODE_REDIRECT_URI = "http://localhost:3000/login/redirect"

export interface IAuthResponse {
    access_token: string
    refresh_token: string
    expires_in: number
    refresh_expires_in: number
    token_type: string
    id_token: string
    session_state: string
    scope: string
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({baseUrl: KEYCLOAK_URI}),
    tagTypes: ['Auth'],
    endpoints: (build) => ({

        getAccessToken: build.mutation<IAuthResponse, { code: string, codeVerifier: string }>({
            query: (params) => {
                const formData = new URLSearchParams()
                formData.append('grant_type', 'authorization_code')
                formData.append('client_id', CLIENT_ID)
                formData.append('code', params.code)
                formData.append('redirect_uri', AUTH_CODE_REDIRECT_URI)
                formData.append('code_verifier', params.codeVerifier)
                return {
                    method: 'POST',
                    url: '/token',
                    body: formData,
                }
            },
            invalidatesTags: ['Auth'],
        })

    })
})