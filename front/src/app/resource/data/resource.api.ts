import {createApi} from '@reduxjs/toolkit/dist/query/react';
import {baseQueryWithReauth} from "@/app/resource/data/base.api";

export const resourceApi = createApi({
    reducerPath: 'Resource',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Resource'],
    endpoints: (build) => ({

        getTestData: build.mutation<{ data: string }, void>({
            query: () => {
                return {
                    method: 'POST',
                    url: 'admin/info',
                }
            },
            invalidatesTags: ['Resource']
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