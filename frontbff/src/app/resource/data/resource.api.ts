import {createApi} from '@reduxjs/toolkit/dist/query/react';
import {baseQueryWithLogout} from "@/app/resource/data/base.api";

export const resourceApi = createApi({
    reducerPath: 'Resource',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['Resource'],
    endpoints: (build) => ({

        getUserData: build.query<{ res: string }, void>({
            query: () => {
                return {
                    method: 'POST',
                    body: {res: "Test User Body"},
                    url: 'bff/data',
                }
            },
            providesTags: ['Resource']
        }),

        getAdminData: build.query<{ res: string }, void>({
            query: () => {
                return {
                    method: 'POST',
                    body: {res: "Test Admin Body"},
                    url: 'bff/admin_data',
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