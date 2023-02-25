import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError
} from '@reduxjs/toolkit/dist/query/react';
import {TypeRootState} from "@/auth/data/store";

export const API_SERVER_URL = "http://localhost:8765/msm-user"
// export const API_SERVER_URL = "http://localhost:2005"

// refresh:
// https://stackoverflow.com/questions/73426775/how-to-handle-jwt-token-refresh-cycle-with-react-and-rtk-query-refetching-the-f
/*

export const accessQuery = fetchBaseQuery({
    baseUrl: API_SERVER_URL,
    credentials: "same-origin",
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as TypeRootState).auth.accessToken
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})
*/


const baseQuery = fetchBaseQuery({
    baseUrl: API_SERVER_URL,
    prepareHeaders: (headers, {getState}) => {
        const accessToken = (getState() as TypeRootState).auth.accessToken
        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    return baseQuery(args, api, extraOptions);
};

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