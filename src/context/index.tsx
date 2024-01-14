import React, { useContext, createContext, ReactNode } from "react";
import {
  useConnect,
  useAddress,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";

import { ethers } from "ethers";

interface StateContextType {
  address: string | undefined;
  contract: any; // Adjust the type according to your contract type
  connect: any; // Replace 'useMetamask' with 'useConnect'
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
  getDonations: (pId: number) => Promise<{ donator: any; donation: string }[]>;
  printMe: string;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateContextProviderProps {
  children: ReactNode;
}

export const StateContextProvider: React.FC<StateContextProviderProps> = ({
  children,
}: StateContextProviderProps) => {
  const { contract } = useContract(
    "0x6289c4aDB1F1D16771403C5C1B95700c9F876c84"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const connect = useConnect();
  const address = useAddress();

  const publishCampaign = async (form: {
    title: string;
    description: string;
    target: string;
    deadline: string;
    image: string;
  }) => {
    if (!contract) {
      console.error("Contract is not defined");
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
      console.error("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    if (!contract) {
      console.error("Contract is not defined");
      return [];
    }

    const campaigns = await contract.call("getCampaigns");

    console.log("From web3: ", campaigns);

    const parsedCampaigns = campaigns.map((campaign: any, i: number) => ({
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

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId: number, amount: string) => {
    if (!contract) {
      console.error("Contract is not defined");
      return;
    }

    const data = await contract.call("donateToCampaign", [pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId: number) => {
    if (!contract) {
      console.error("Contract is not defined");
      return [];
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

  const printMe = "I am from the global store";

  return (
    <StateContext.Provider
      value={{
        contract,
        connect,
        address,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        printMe,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  console.log("Consuming context values:");
  if (!context) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider"
    );
  }
  return context;
};
