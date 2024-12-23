import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useUserStore } from "../lib/userStore";
import { format } from "timeago.js";
import { db } from "../lib/firebase";
import { useChatStore } from "../lib/chatStore";

const Chat = ({ chat }) => {
  const [chatData, setChatData] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { currentUser } = useUserStore();
  const { chatId, user, changeChat } = useChatStore();
  const endRef = useRef(null);

  // Scroll to the latest message when chat data updates
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  // Fetch chat data from Firestore
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChatData(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => {
    if (text.trim() === "") return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(), // Ensure this is a proper Firestore timestamp if needed
        }),
      });
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBack = () => {
    changeChat(null, null); // Reset chatId and user when going back to the ChatList
  };

  return (
    <div className="flex flex-col border-l border-r border-gray-200 h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#0d1b2a] flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="text-white">
            <img src="/arrowUp.png" alt="Back" className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white text-black text-lg font-bold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <span className="block text-base sm:text-lg font-bold truncate text-white">
              {user?.username}
            </span>
            <p className="text-xs sm:text-sm text-white">
              Hey, I am using a Chatting app.
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-0">
          <img src="/phone.png" alt="Call" className="w-4 h-4 sm:w-5 sm:h-5" />
          <img src="/video.png" alt="Video Call" className="w-4 h-4 sm:w-5 sm:h-5" />
          <img src="/info.png" alt="Info" className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-scroll p-2 sm:p-4 space-y-2 sm:space-y-4">
        {chatData?.messages?.map((message, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              message.senderId === currentUser?.id ? "items-end" : "items-start"
            }`}
          >
            <p
              className={`p-2 sm:p-4 rounded-lg ${
                message.senderId === currentUser?.id
                  ? "bg-blue-300 text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              {message.text}
            </p>
            <span className="text-xs text-black">
              {format(message.createdAt?.toDate())}
            </span>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      {/* Chat Input */}
      <div
        className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-4 border-t border-gray-200 bg-blue-300 ${
          chatId ? "block" : "hidden"
        }`}
      >
        <div className="relative">
          <img
            src="/emoji.png"
            alt="Emoji Picker"
            className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="absolute bottom-10">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-white text-black p-2 sm:p-3 rounded-lg text-sm sm:text-base"
        />
        <button
          className="bg-[#4361ee] text-white px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

