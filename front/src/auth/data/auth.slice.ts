import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IAuthResponse} from "@/auth/data/auth.api";
import {TypeRootState, useTypedSelector} from "@/auth/data/store";

interface IAuthState {
    isAuth: boolean
    accessToken: string | undefined
    refreshToken: string | undefined
    idToken: string | undefined
}

const initialState: IAuthState = {
    isAuth: false,
    accessToken: undefined,
    refreshToken: undefined,
    idToken: undefined,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<IAuthResponse>) => {
            state.accessToken = action.payload.access_token
            state.refreshToken = action.payload.refresh_token
            state.idToken = action.payload.id_token
            localStorage.setItem("refresh", action.payload.refresh_token)
            localStorage.setItem("it", action.payload.id_token)
            state.isAuth = true
        },

        setNoAuth: (state) => {
            state.accessToken = undefined
            localStorage.removeItem("refresh")
            state.isAuth = false
        },

        setNoAccess: (state) => {
            state.accessToken = undefined
            localStorage.removeItem("refresh")
        },
    }
})

export const authActions = authSlice.actions
export const useAuthState = () => useTypedSelector((state: TypeRootState) => state.auth)