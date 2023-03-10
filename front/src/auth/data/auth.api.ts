import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import {authActions} from "@/auth/data/auth.slice";

// const KEYCLOAK_URI = "https://localhost:8443/realms/todoapp-realm/protocol/openid-connect"
export const KEYCLOAK_URI = "http://localhost:8180/realms/todoapp-realm/protocol/openid-connect"
export const CLIENT_ID = "todoapp-client"
export const APP_URI = "http://localhost:3000"
export const AUTH_CODE_REDIRECT_URI = APP_URI + "/login/redirect"

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

        getLoginData: build.mutation<IAuthResponse, { code: string, codeVerifier: string }>({
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
            async onQueryStarted(args, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    await dispatch(authActions.setAuthData(data));
                } catch (error) {
                    console.error(`ERROR LOGIN!`, error)
                }
            },
        }),

    })
})