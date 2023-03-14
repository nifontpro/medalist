import {BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {authActions} from "@/app/auth/data/auth.slice";

export const PROXY_SERVER_URL = "https://localhost:8902"
// export const PROXY_SERVER_URL = "https://localhost"

export const baseQuery = fetchBaseQuery({
    baseUrl: PROXY_SERVER_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
        return headers
    }
})

export const baseQueryWithLogout: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
    async (args, api, extraOptions,) => {
        let result = await baseQuery(args, api, extraOptions)

        if (result.error && result.error.status === 407) {
            api.dispatch(authActions.setAuth(false))
        }

        return result
    }
