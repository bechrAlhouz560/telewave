import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import Message from "../../../api/telegram/message";

export interface MessageDialogType {
  id: number;
  message: string;
  mentioned: boolean;
  senderId: string;
  date: string;
  chatId: string;

  mediaType ?: string,

  photoId ?: string
}

export interface DialogType {
  archived: boolean;
  date: string;
  isChannel: boolean;
  isGroup: boolean;
  isUser: boolean;
  pinned: boolean;
  unreadCount: number;
  unreadMentionsCount: number;
  folderId: number;
  id: string;
  name: string;
  title: string;
  message: MessageDialogType;
  entity: string;
  draft: string;
  photo: string;
}

export interface DialogState {
  dialogs: DialogType[];
}

const initialState: DialogState = {
  dialogs: [],
};

const dialogSlice = createSlice({
  name: "dialogs",
  initialState,
  reducers: {
    setDialogs(state, action: PayloadAction<DialogType[]>) {
      state.dialogs = action.payload;
    },

    updatePhotoProfile(state, action: PayloadAction<{ id: string; photo: string }>) {
      const data = action.payload;
      state.dialogs = state.dialogs.map(d => 
        d.id === data.id ? { ...d, photo: data.photo } : d
      );

      return state;
    },

    updateDialogMessage (state , action : PayloadAction<{
      id : string , 
      newMessage : MessageDialogType
    }>) {
      const id  = action.payload.id;
      const newMessage = action.payload.newMessage;
      state.dialogs =  state.dialogs.map(d => {

       
        return d.entity === id || d.id === id ?  {...d , message : newMessage} : d
      });
      return state;
    }
  },
});

export const selectAllDialogs = (state: RootState) => {
  return state.dialog.dialogs.slice()
        .sort((a, b) => {
          if (a.pinned && !b.pinned) {
            return -1;
          }
          if (!a.pinned && b.pinned) {
            return 1;
          }
          const dateA = new Date(a.message.date);
          const dateB = new Date(b.message.date);

          return dateB.getTime() - dateA.getTime();
        });
};



export const { setDialogs, updatePhotoProfile ,updateDialogMessage } = dialogSlice.actions;
export default dialogSlice.reducer;
