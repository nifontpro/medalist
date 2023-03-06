import {createApi} from '@reduxjs/toolkit/dist/query/react';
import {baseQuery} from "@/app/resource/data/base.api";

export const resourceApi = createApi({
    reducerPath: 'Resource',
    // baseQuery: baseQueryWithReauth,
    baseQuery: baseQuery,
    tagTypes: ['Resource'],
    endpoints: (build) => ({

        getTestData: build.query<{ data: string }, void>({
            query: () => {
                return {
                    method: 'GET',
                    url: 'bff/data',
                }
            },
            providesTags: ['Resource']
        }),

        getTest: build.mutation<{ data: string }, void>({
            query: () => {
                return {
                    method: 'GET',
                    url: '/admin/test',
                }
            },
            invalidatesTags: ['Resource']
        })

    })
})