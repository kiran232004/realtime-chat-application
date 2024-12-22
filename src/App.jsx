
import Chat from "./components/Chat";
import List from "./components/list/List";
import Login from "./components/Login";
import Notification from "./components/Notification";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="w-screen h-screen bg-white text-black flex flex-col md:flex-row overflow-hidden">
      {currentUser ? (
        <>
          {/* List Section */}
          <div className="w-full md:w-[30%] h-full border-b md:border-r border-gray-300 bg-gray-50 ">
            <List />
          </div>

          {/* Chat Section */}
          <div className="w-full md:w-[70%] h-full border-b md:border-r border-gray-300 bg-white ">
            {chatId ? (
              <Chat />
            ) : (
              <div className="flex justify-center items-center h-full">
                Select a Chat
              </div>
            )}
          </div>
        </>
      ) : (
        <Login />
      )}

      <Notification />
    </div>
  );
};

export default App;
