import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";



export interface MessagePhotoType {
    photos : {
        [photoId : string] : string
    },
    audioThumbs : {
      [photoId : string] : string
    }
}



const initialState : MessagePhotoType = {
    photos : {},
    audioThumbs : {}
}   



const messagePhotoSlice = createSlice({
  name: "messagePhoto",
  initialState,
  reducers: {
    addPhoto : function (state , action) {

        const photoId = action.payload.photoId;
        const objectUrl = action.payload.url;
        state.photos[photoId] = objectUrl;
        return state;
    },

    addAudioThumb (state , action) {
        const photoId = action.payload.photoId;
        const objectUrl = action.payload.url;
        state.audioThumbs[photoId] = objectUrl;
        return state;
    }
  },
});



export function selectOnePhoto  (state : RootState ,photoId  : string) {
   return state.messagePhoto.photos[photoId];
}

export function selectThumbPhoto (photoId  : string) {
  return (state : RootState ) => state.messagePhoto.audioThumbs[photoId] ;
}

export const { addPhoto , addAudioThumb } = messagePhotoSlice.actions;
export default messagePhotoSlice.reducer;