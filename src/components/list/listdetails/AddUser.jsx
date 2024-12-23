import { useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useUserStore } from "../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // Track error message

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
        setErrorMessage(null); // Clear error message if user is found
      } else {
        setUser(null);
        setErrorMessage("User not found!"); // Set error message
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred while searching."); // Handle any unexpected errors
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addUser p-6 bg-white text-black rounded-lg shadow-lg mx-auto max-w-md">
      <form onSubmit={handleSearch} className="flex gap-5 mb-5">
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="p-5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button className="p-5 rounded-lg bg-orange-500 text-white cursor-pointer hover:bg-orange-600">
          Search
        </button>
      </form>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
      {user && (
        <div className="user flex items-center justify-between mt-8">
          <div className="detail flex items-center gap-5">
            <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
              {user.username[0].toUpperCase()}
            </div>
            <span className="text-black">{user.username}</span>
          </div>
          <button
            onClick={handleAdd}
            className="p-2 rounded-lg bg-[#006d77] text-white cursor-pointer hover:bg-orange-600"
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;