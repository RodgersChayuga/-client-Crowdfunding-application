"use client";

import React, { useState } from "react";
import { useDisconnect } from "@thirdweb-dev/react";

import CustomButton from "./CustomButton";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";

const DisconnectButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setToggleDrawer, address } = useStateContext();

  const disconnect = useDisconnect();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  async function handleDisconnect() {
    if (address) navigate("create-campaign");
    disconnect();
    setIsOpen((prev) => !prev);
    setToggleDrawer(false);
  }

  return (
    <div className="relative inline-block text-left">
      <CustomButton
        btnType="button"
        styles={
          "bg-[#dc2626] !rounded-[100%] min-w-[52px] flex justify-center items-center"
        }
        title={"⌄"}
        buttonId="options-menu"
        handleClick={toggleDropdown}
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <CustomButton
            btnType="button"
            title={"Disconnect"}
            styles={"bg-[#1dc071] w-[100%]"}
            handleClick={handleDisconnect}
          />
        </div>
      )}
    </div>
  );
};

export default DisconnectButton;
