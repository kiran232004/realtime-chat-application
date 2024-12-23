import { create } from "zustand";
import { useUserStore } from "./userStore";

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  changeChat: (chatId, user) => {
    return set({
      chatId,
      user,
    });
  },

  resetChat: () => {
    set({
      chatId: null,
      user: null,
    });
  },
}));
