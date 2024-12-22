import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeButton={false}
        rtl={false}
        draggable
        pauseOnHover
        theme="dark"
        className="rounded-lg p-4 shadow-lg"
      />
    </div>
  );
};

export default Notification;
