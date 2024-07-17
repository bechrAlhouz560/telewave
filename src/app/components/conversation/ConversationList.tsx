import React, { useEffect, useState } from "react";
import Conversation from "./Conversation";
import { DialogType } from "../../features/dialog/dialogSlice";

export default function ConversationList({
  dialogs,
}: {
  dialogs: DialogType[];
}) {
  return (
    <div className="flex-1 overflow-y-scroll">
      {dialogs.map(function (dialog, key) {
        return <Conversation dialog={dialog} key={key}></Conversation>;
      })}
    </div>
  );
}
