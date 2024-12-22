import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Userinfo = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              name: userData.username || "User",
              email: userData.email,
            });
          } else {
            console.error("User document not found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear current user data after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="w-full md:w-[30vw] flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-400 border-b border-white">
  <div className="flex items-center gap-3">
    <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-white flex items-center justify-center text-black text-lg font-bold">
      {currentUser?.name?.charAt(0).toUpperCase() || "U"}
    </div>
    <h2 className="text-white text-lg">{currentUser?.name || "User"}</h2>
  </div>
  <div className="flex gap-4 items-center mt-3 sm:mt-0">
    <img src="./video.png" alt="Video Call" className="w-5 h-5 cursor-pointer" />
    <img src="./edit.png" alt="Edit" className="w-5 h-5 cursor-pointer" />
    <div className="relative">
      <img
        src="./more.png"
        alt="More"
        className="w-5 h-5 cursor-pointer"
        onClick={() => setShowDropdown((prev) => !prev)}
      />
      {showDropdown && (
        <div className="absolute top-full right-0 bg-white shadow-lg rounded-md mt-2 w-40 text-sm">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default Userinfo;
