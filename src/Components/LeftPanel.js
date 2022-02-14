import { useState, useEffect } from "react";
import api from "../API/index";
import { Link, useNavigate } from "react-router-dom";

const blankChannelData = {
  channelName: "",
  desc: "",
  members: [],
  messages: [],
};

const LeftPanel = ({
  channelName,
  userData,
  setuserData,
  setopenAddChannel,
  settoken,
  allChannels,
  setallChannels,
}) => {
  const [openMenu, setopenMenu] = useState(false);
  const navigate = useNavigate();
  const [channelData, setchannelData] = useState(blankChannelData);
  const [isSlide, setisSlide] = useState(false);
  const [channelDataLoading, setchannelDataLoading] = useState(false);
  const [searchTerm, setsearchTerm] = useState("");

  const getAllChannels = async () => {
    const data = await api.getAllChannels();
    if (data.status === "OK") setallChannels((allChannels) => data.channels);
  };

  useEffect(() => {
    getAllChannels();
  }, []);

  const getChannelData = async (channelName) => {
    const data = await api.getChannelData(channelName);

    if (data.status === "OK") setchannelData((channelData) => data.channelData);
  };

  const slide = async (channelName) => {
    setisSlide(true);
    setchannelDataLoading(true);
    await getChannelData(channelName);
    setchannelDataLoading(false);
  };

  const uploadProfilePic = async (event) => {
    if (event.target.files.length > 0) {
      setopenMenu(false);
      const formdata = new FormData();
      const token = localStorage.getItem("token");
      formdata.append("profilepic", event.target.files[0]);

      const data = await api.uploadProfilePic(formdata, token);

      if (data.status === "OK") {
        setuserData({ ...userData, profilePic: data.link });
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    settoken("NO_TOKEN_FOUND");
    navigate("/");
  };

  return (
    <div className="channel-list-container w-1/4 h-full bg-black flex flex-col justify-between overflow-hidden">
      <section
        className={
          "main-section h-full relative transition-transform ease-linear " +
          (isSlide ? "-translate-x-full" : null)
        }
      >
        <div className="channel-list-header flex items-center justify-between h-16 px-8 font-bold text-white shadow-md">
          Channels
          <div
            className="h-6 w-6 border-2 border-white flex justify-center items-center rounded-sm cursor-pointer hover:bg-gray-700"
            onClick={() => setopenAddChannel(true)}
          >
            <span className="material-icons text-white text-base">add</span>
          </div>
        </div>
        <div className="search mx-8 h-40 flex flex-col mt-2">
          <div className="bg-gray-700 bg-opacity-50 flex items-center justify-between h-12 rounded-sm">
            <input
              type="text"
              placeholder="search"
              className="bg-transparent px-4 text-white text-sm focus:outline-0"
              onChange={(event) => setsearchTerm(event.target.value)}
            />
            <span className="material-icons text-gray-300 w-12 text-base h-full flex items-center justify-center">
              search
            </span>
          </div>
          <div className="mt-4 h-full  text-sm">
            {searchTerm.length > 0 && searchTerm.trim().length > 0 ? (
              <div className="h-full w-full overflow-y-auto space-y-1">
                {Object.keys(allChannels)
                  .filter((channel) => {
                    if (channel.includes(searchTerm.toLowerCase()))
                      return channel;
                  })
                  .map((channel, index) => {
                    const link = `/channel/${channel}`;
                    return (
                      <Link
                        to={link}
                        key={index}
                        className="text-white hover:underline block"
                      >
                        {allChannels[channel]}
                      </Link>
                    );
                  })}
              </div>
            ) : (
              <div className="text-white h-full w-full flex items-center justify-center">
                No search term
              </div>
            )}
          </div>
        </div>
        <div className="channel-list text-white text-sm p-8 py-4 w-full h-full overflow-x-hidden whitespace-nowrap text-ellipsis">
          <h1 className="uppercase text-lg font-bold mb-4">My channels</h1>
          {userData.channelList.map((channel, index) => {
            const link = `/channel/${channel}`;
            return (
              <div key={index} className="relative">
                <Link to={link}>
                  <h1
                    className={
                      "uppercase font-bold cursor-pointer w-full p-4 hover:bg-gray-800 " +
                      (channelName === channel ? "bg-gray-800" : null)
                    }
                  >
                    {channel}
                  </h1>
                </Link>
                <div>
                  <span
                    className="material-icons absolute top-0 h-full w-12 flex justify-center items-center cursor-pointer hover:bg-gray-700 right-0"
                    onClick={() => slide(channel)}
                  >
                    navigate_next
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <section className="slide-section absolute left-full top-0 w-full">
          {channelDataLoading ? (
            <div className="h-96 w-full flex justify-center items-end font-bold text-white uppercase">
              Loading...
            </div>
          ) : (
            <>
              <div className="channel-list-header flex items-center justify-between h-16 px-8 font-bold text-white shadow-md w-full relative">
                {channelData.channelName}
                <span
                  className="material-icons absolute right-8 cursor-pointer"
                  onClick={() => setisSlide(false)}
                >
                  close
                </span>
              </div>
              <div className="w-full h-52 p-8 text-white">
                <h1 className="uppercase text-lg font-bold mb-4 ">
                  Description
                </h1>
                <div className="h-full overflow-hidden text-ellipsis text-sm">
                  {channelData.desc.length === 0 ? (
                    <div>No description</div>
                  ) : (
                    <>{channelData.desc}</>
                  )}
                </div>
              </div>
              <div className="channel-list text-white text-sm p-8 pt-0 w-full h-full overflow-x-hidden whitespace-nowrap text-ellipsis">
                <h1 className="uppercase text-lg font-bold mb-4">Members</h1>
                <div className="overflow-y-auto h-96 space-y-2">
                  {channelData.members.length === 0 ? (
                    <h1>There are no members.</h1>
                  ) : (
                    <>
                      {channelData.members.map((member) => {
                        return (
                          <h1
                            className="uppercase w-full"
                            key={Math.random(2000)}
                          >
                            {member}
                          </h1>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </section>

      <div className="relative text-white">
        <div
          className={
            "logged-in-user w-full h-16  flex items-center px-4 justify-between hover:bg-gray-800 cursor-pointer " +
            (openMenu ? "bg-gray-800" : null)
          }
          onClick={() => setopenMenu(!openMenu)}
        >
          <div className="user flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-800 relative">
              {userData.profilePic !== "" && (
                <img
                  src={userData.profilePic}
                  alt=""
                  className="absolute h-full w-full object-cover"
                />
              )}
            </div>
            <span className="overflow-x-hidden whitespace-nowrap text-sm text-ellipsis uppercase font-bold">
              {userData.username}
            </span>
          </div>
          <span className="material-icons flex items-center justify-center p-2">
            expand_less
          </span>
        </div>
        {openMenu && (
          <div className="absolute text-xs right-4 bottom-full mb-2 flex flex-col text-center z-5 shadow-md">
            <input
              type="file"
              name="profilepic"
              id="profilepic"
              className="hidden"
              onChange={uploadProfilePic}
              accept="image/png, image/jpeg"
            />

            <label
              className="uppercase w-full font-bold p-4 bg-gray-800 cursor-pointer hover:bg-gray-700"
              htmlFor="profilepic"
            >
              Upload profile pic
            </label>

            <span
              className="uppercase w-full font-bold p-4 bg-gray-800 cursor-pointer hover:bg-gray-700"
              onClick={logout}
            >
              Logout
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
