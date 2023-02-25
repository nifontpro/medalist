import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TypeRootState, useTypedSelector} from "@/auth/data/store";

interface IAuthState {
    isAuth: boolean
    isLogin: boolean
    accessToken: string | undefined
}

const initialState: IAuthState = {
    isAuth: false,
    isLogin: false,
    accessToken: undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload
            state.isAuth = true
        },
        setLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload
        },
        logout: (state) => {
            state.accessToken = undefined
            state.isAuth = false
        },
    }
})

export const authActions = authSlice.actions
export const useAuthState = () => useTypedSelector((state: TypeRootState) => state.auth)