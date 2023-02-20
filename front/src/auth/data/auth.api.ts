import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({baseUrl: 'https://localhost:8765/msm-user'}),
    tagTypes: ['Auth'],
    endpoints: (build) => ({

        testData: build.query<{ data: string }, void>({
            query: () => ({
                method: 'GET',
                url: 'admin/info'
            }),
            providesTags: ['Auth'],
        })

    })
})