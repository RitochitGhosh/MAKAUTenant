import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  WishlistCount: 0,
  wishlist: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setWishList: (state, action) => {
      const exists = state.wishlist.find(
        (item) => item._id === action.payload._id
      );
      if (!exists) {
        state.wishlist.push(action.payload);
        state.WishlistCount = state.wishlist.length;
      }
    },

    unsetWishList: (state, action) => {
      const id = action.payload;
      state.wishlist = state.wishlist.filter((item) => item._id !== id);
      state.WishlistCount = state.wishlist.length;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOut,
  setUser,
  setWishList,
  unsetWishList,
} = userSlice.actions;

export default userSlice.reducer;
