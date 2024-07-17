import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import dialogReducer from '../features/dialog/dialogSlice';
import errorSlice from '../features/error/errorSlice';
import authSlice from '../features/auth/authSlice';
import themeSlice from '../features/theme/themeSlice';
import messagePhotoSlice from '../features/messagePhoto/messagePhotoSlice';
import profilePhotoSlice from '../features/profilePhoto/profilePhotoSlice';
import audioSlice from '../features/audio/audioSlice';


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    error : errorSlice,
    auth : authSlice,
    theme  : themeSlice,
    dialog : dialogReducer,
    messagePhoto : messagePhotoSlice,

    audio : audioSlice,
    profilePhoto : profilePhotoSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;