import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import {PROXY_SERVER_URL} from "@/app/resource/data/base.api";
import {authActions} from "@/app/auth/data/auth.slice";

const BFF_URI = `${PROXY_SERVER_URL}/bff`

export const accessQuery = fetchBaseQuery({
    baseUrl: BFF_URI,
    credentials: "include",
})

export const bffApi = createApi({
    reducerPath: 'BFF',
    baseQuery: accessQuery,
    tagTypes: ['Bff'],
    endpoints: (build) => ({

        sendCodeToBFF: build.mutation<string, string>({
            query: (body) => {
                return {
                    method: 'POST',
                    url: 'token',
                    body: body
                }
            },
            invalidatesTags: ['Bff']
        }),

        logout: build.mutation<void, void>({
            query: () => {
                return {
                    method: 'GET',
                    url: 'logout',
                }
            },
            invalidatesTags: ['Bff'],
            async onQueryStarted(args, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    await dispatch(authActions.setAuth(false));
                } catch (error) {
                    console.error(`LOGOUT ERROR!`, error)
                }
            },

        }),

    })
})