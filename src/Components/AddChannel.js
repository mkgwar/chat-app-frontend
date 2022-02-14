import { useState } from "react";
import api from "../API/index";

const AddChannel = ({
  setopenAddChannel,
  setuserData,
  userData,
  allChannels,
  setallChannels,
}) => {
  const [channelData, setchannelData] = useState({ channelName: "", desc: "" });
  const [errorMessage, seterrorMessage] = useState("");

  const addChannel = async () => {
    let { channelName } = channelData;
    channelName = channelName.trim();
    if (channelName.length === 0)
      seterrorMessage("Channel Name can't be empty.");
    else {
      channelName = channelName.replace(/\s+/g, "-").trim().toLowerCase();
      const token = localStorage.getItem("token");

      if (token !== null) {
        const data = await api.addChannel(token, {
          ...channelData,
          channelName: channelName,
        });

        if (data.status === "OK") {
          setopenAddChannel(false);

          setallChannels((allChannels) => ({
            ...allChannels,
            [data.channelName]: data.channelName,
          }));

          setuserData((userData) => ({
            ...userData,
            channelList: [...userData.channelList, data.channelName],
          }));
        } else if (data.status == "ERROR") seterrorMessage(data.message);
      } else seterrorMessage("Token not found.");
    }
  };

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setchannelData((channelData) => ({ ...channelData, [name]: value }));
  };

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center shadow-md">
      <div className="bg-gray-800 shadow-md text-white h-3/5 w-2/5 p-8 flex flex-col">
        <h1 className="text-2xl uppercase font-bold">Add a Channel</h1>
        <div className="flex flex-col h-full mt-8 justify-between">
          <label className="uppercase font-bold">Name</label>
          <input
            type="text"
            className="bg-black text-white p-2 focus:outline-0 mt-2"
            onChange={handleInput}
            name="channelName"
          />
          <label className="uppercase font-bold mt-4">Description</label>
          <textarea
            className="h-36 resize-none bg-black text-white focus:outline-0 p-2 mt-2"
            name="desc"
            onChange={handleInput}
          />
          <span className="mt-2 text-sm h-4 text-red-500">{errorMessage}</span>
          <div className="flex items-center gap-2 mt-4 relative left-full -translate-x-full w-min">
            <button
              className="font-bold bg-gray-700 p-2 py-1 shadow-md text-sm"
              onClick={() => setopenAddChannel(false)}
            >
              CANCEL
            </button>
            <button
              className="font-bold bg-blue-500 p-2 py-1 shadow-md text-sm"
              onClick={addChannel}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChannel;
