import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

// const KEYCLOAK_URI = "https://localhost:8443/realms/todoapp-realm/protocol/openid-connect"
const KEYCLOAK_URI = "http://localhost:8180/realms/todoapp-realm/protocol/openid-connect"
const CLIENT_ID = "todoapp-client"
const AUTH_CODE_REDIRECT_URI = "http://localhost:3000/redirect"

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({baseUrl: KEYCLOAK_URI}),
    tagTypes: ['Auth'],
    endpoints: (build) => ({

        getAccessToken: build.query<any, { code: string, codeVerifier: string }>({
            query: (params) => {
                const formData = new URLSearchParams()
                formData.append('grant_type', 'authorization_code')
                formData.append('client_id', CLIENT_ID)
                formData.append('code', params.code)
                formData.append('redirect_uri', AUTH_CODE_REDIRECT_URI + "/token")
                formData.append('code_verifier', params.codeVerifier)
                return {
                    method: 'POST',
                    url: '/token',
                    body: formData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            },
            // invalidatesTags: ['Auth'],
            providesTags: ['Auth'],
        })

    })
})