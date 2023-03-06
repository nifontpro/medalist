import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TypeRootState, useTypedSelector} from "@/app/storage/store";

interface IAuthState {
    isAuth: boolean
}

const initialState: IAuthState = {
    isAuth: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload
        },
    }
})

export const authActions = authSlice.actions
export const useAuthState = () => useTypedSelector((state: TypeRootState) => state.auth)