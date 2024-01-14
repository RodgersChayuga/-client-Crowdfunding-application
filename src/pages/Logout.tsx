import { useDisconnect } from "@thirdweb-dev/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const disconnect = useDisconnect();
  const navigate = useNavigate();

  const handleLogout = () => {
    disconnect();
    navigate("/");
  };

  const cancelLogout = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
      <button
        onClick={handleLogout}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Disconnect your Address
        </span>
      </button>

      <button
        onClick={cancelLogout}
        type="button"
        class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
      >
        Stay Connected
      </button>
    </div>
  );
};

export default Logout;
