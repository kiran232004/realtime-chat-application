import Chatlist from "./listdetails/Chatlist"; 
import Userinfo from "./listdetails/Userinfo";

const List = () => {
  return (
    <div className="flex flex-col flex-1 bg-transparent bg-opacity-80 rounded-lg w-full max-w-[90vw] md:w-[40vh] h-[90vh]">
      <Userinfo />
      <Chatlist />
    </div>
  );
};

export default List;
