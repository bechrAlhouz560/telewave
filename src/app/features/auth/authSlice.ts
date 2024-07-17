import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';


export interface UserType {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    phone: string;
    self: boolean;
    contact: boolean;
    mutualContact: boolean;
    deleted: boolean;
    bot: boolean;
    verified: boolean;
    restricted: boolean;
    photo: string;
}
interface AuthState {
  loggedIn: boolean;
  user ?: UserType
}

const initialState: AuthState = {
  loggedIn : false,
};

const errorSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setUser: (state , action : PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export function getUser (state : RootState) {
  return state.auth.user
}
export function checkIsLoggedIn (state : RootState) {
  return state.auth.loggedIn;
}
export const { setLoggedIn, setUser , } = errorSlice.actions;
export default errorSlice.reducer;
