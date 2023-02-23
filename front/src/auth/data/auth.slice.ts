import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TypeRootState, useTypedSelector} from "@/auth/data/store";

interface IAuthState {
    state: string
    codeVerifier: string
    codeChallenge: string
}

const initialState: IAuthState = {
    state: "",
    codeVerifier: "",
    codeChallenge: ""
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setState: (thisState, action: PayloadAction<IAuthState>) => {
            thisState.state = action.payload.state
            thisState.codeVerifier = action.payload.codeVerifier
            thisState.codeChallenge = action.payload.codeChallenge
        },
    }
})

export const authActions = authSlice.actions
export const useAuthState = () => useTypedSelector((state: TypeRootState) => state.auth)