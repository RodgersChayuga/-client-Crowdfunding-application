import React, { useContext, createContext } from "react";
import {
  useConnect,
  metamaskWallet,
  useAddress,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";

interface StateContextType {
  address: string | null;
  contract: any; // Adjust the type according to your contract type
  connect: any; // Replace 'useMetamask' with 'ConnectWallet'
  createCampaign: (form: {
    title: string;
    description: string;
    target: string;
    deadline: string;
    image: string;
  }) => Promise<void>;
  getCampaigns: () => Promise<any[]>;
  getUserCampaigns: () => Promise<any[]>;
  donate: (pId: number, amount: string) => Promise<void>;
  getDonations: (pId: number) => Promise<any[]>;
}

const walletConfig = metamaskWallet();

const StateContext = createContext({} as StateContextType);

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0x6289c4aDB1F1D16771403C5C1B95700c9F876c84"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const connect = useConnect();
  const walletConfig = metamaskWallet();
  const address = useAddress();

  const publishCampaign = async (form) => {
    if (!contract) {
      console.log("Contract is not defined");
      return;
    }

    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(), // deadline,
          form.image,
        ],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    if (!contract) {
      console.log("Contract is not defined");
      return;
    }

    const campaigns = await contract.call("getCampaigns");

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    if (!contract) {
      console.log("Contract is not defined");
      return;
    }
    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId: number) => {
    if (!contract) {
      console.log("Contract is not defined");
      return;
    }
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations: { donator: any; donation: string }[] = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        contract,
        connect, // Replace 'useMetamask' with 'ConnectWallet'
        walletConfig,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
