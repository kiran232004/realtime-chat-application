import AddUser from "./AddUser";
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { db } from "../../../lib/firebase";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (chat) => {
    const userChatsRef = doc(db, "userchats", currentUser.id);
    const updatedChats = chats.filter((item) => item.chatId !== chat.chatId);

    try {
      await updateDoc(userChatsRef, {
        chats: updatedChats,
      });
      // Optionally delete from other user's chats if needed
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="overflow-y-scroll w-full md:w-[30vw] h-screen scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
        <div className="flex items-center flex-1 bg-gray-300 rounded-lg p-3">
          <img src="./search.png" alt="" className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent placeholder:text-black border-none outline-none text-white flex-1 ml-3"
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="w-8 h-8 bg-opacity-50 bg-gray-800 p-2 rounded-lg cursor-pointer"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {filteredChats.map((chat) => (
        <div
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          className={`flex flex-col sm:flex-row items-center gap-4 p-4 cursor-pointer border-b ${chat?.isSeen ? "bg-transparent" : "bg-blue-700"}`}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-400 text-black text-xl font-bold">
            {chat.user.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <span className="font-medium text-black">{chat.user.username}</span>
            <p className="text-sm text-black opacity-80">{chat.lastMessage}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(chat);
            }}
            className="bg-[#dc2f02] text-white px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md "
          >
            Delete
          </button>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
