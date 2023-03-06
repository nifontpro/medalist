import {createApi} from '@reduxjs/toolkit/dist/query/react';
import {baseQueryWithLogout} from "@/app/resource/data/base.api";

export const resourceApi = createApi({
    reducerPath: 'Resource',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['Resource'],
    endpoints: (build) => ({

        getTestData: build.query<{ res: string }, void>({
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