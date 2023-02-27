import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TypeRootState, useTypedSelector} from "@/auth/data/store";
import {IAuthResponse} from "@/auth/data/auth.api";

interface IAuthState {
    isAuth: boolean
    isLogin: boolean
    accessToken: string | undefined
    refreshToken: string | undefined
}

const initialState: IAuthState = {
    isAuth: false,
    isLogin: false,
    accessToken: undefined,
    refreshToken: undefined,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<IAuthResponse>) => {
            state.accessToken = action.payload.access_token
            state.refreshToken = action.payload.refresh_token
            localStorage.setItem("refresh", action.payload.refresh_token)
            state.isAuth = true
        },
        setLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload
        },
        logout: (state) => {
            state.accessToken = undefined
            state.refreshToken = undefined
            state.isAuth = false
        },
    }
})

export const authActions = authSlice.actions
export const useAuthState = () => useTypedSelector((state: TypeRootState) => state.auth)