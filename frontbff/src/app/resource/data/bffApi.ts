import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';
import {PROXY_SERVER_URL} from "@/app/resource/data/base.api";

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

        exchangeRefreshToAccessToken: build.mutation<{ data: string }, void>({
            query: () => {
                return {
                    method: 'GET',
                    url: 'refresh',
                }
            },
            invalidatesTags: ['Bff']
        }),

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

    })
})