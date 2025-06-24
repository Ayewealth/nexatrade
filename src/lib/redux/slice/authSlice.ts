import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  kyc_status: string;
  profile_pic: string;
}

interface UserInfo {
  userData: UserData;
}

export interface AuthState {
  userInfo: UserInfo;
  isAuthenticated: boolean;
  isNewUser: boolean;
}

const initialState: AuthState = {
  userInfo: {
    userData: {
      id: 0,
      username: "",
      full_name: "",
      email: "",
      phone_number: "",
      address: "",
      date_of_birth: "",
      kyc_status: "",
      profile_pic: "",
    },
  },
  isAuthenticated: false,
  isNewUser: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{
        userData: UserData;
      }>
    ) => {
      const { userData } = action.payload;
      state.userInfo.userData = userData;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserData>>) => {
      state.userInfo.userData = {
        ...state.userInfo.userData,
        ...action.payload, // Merge updated fields with the current state
      };
    },
    clearUserInfo: (state) => {
      state.userInfo = initialState.userInfo;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
  },
});

export const {
  setUserInfo,
  updateUserInfo,
  clearUserInfo,
  setIsAuthenticated,
  setIsNewUser,
} = authSlice.actions;

export default authSlice.reducer;

export type AuthActions =
  | ReturnType<typeof setUserInfo>
  | ReturnType<typeof updateUserInfo>
  | ReturnType<typeof clearUserInfo>
  | ReturnType<typeof setIsAuthenticated>
  | ReturnType<typeof setIsNewUser>;
