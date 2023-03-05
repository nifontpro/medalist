import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

const BFF_URI = "http://localhost:8902/bff"

export const accessQuery = fetchBaseQuery({
    baseUrl: BFF_URI,
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
                    url: 'newaccesstoken',
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