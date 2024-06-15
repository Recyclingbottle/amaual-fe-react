import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  nickname: "",
  userId: "",
  profileImage: "",
  isLoggedIn: false, // 로그인 상태 추가
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { email, nickname, userId, profileImage } = action.payload;
      state.email = email;
      state.nickname = nickname;
      state.userId = userId;
      state.profileImage = profileImage;
      state.isLoggedIn = true; // 로그인 상태 true로 설정
    },
    clearUser(state) {
      state.email = "";
      state.nickname = "";
      state.userId = "";
      state.profileImage = "";
      state.isLoggedIn = false; // 로그인 상태 false로 설정
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
