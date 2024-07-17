import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";




export interface ProfilePhotoType {
    photos : {
        [photoId : string] : string
    }
}



const initialState : ProfilePhotoType = {
    photos : {}
}   



const profilePhotoSlice = createSlice({
  name: "profilePhoto",
  initialState,
  reducers: {
    addProfilePhoto : function (state , action : PayloadAction<{
        photoId: string,
        url : string
    }>) {

        const photoId = action.payload.photoId;
        const objectUrl = action.payload.url;
        state.photos[photoId] = objectUrl;
        return state;
    }
  },
});



export function selectOneProfilePhoto  (state : RootState ,photoId  : string) {
   return state.profilePhoto.photos[photoId];
}
export const { addProfilePhoto } = profilePhotoSlice.actions;
export default profilePhotoSlice.reducer;