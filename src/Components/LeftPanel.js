import { useState } from "react";
import api from "../API/index";
import { useNavigate } from "react-router-dom";

const LeftPanel = ({ channelName, userData, setuserData }) => {
  const [openMenu, setopenMenu] = useState(false);
  const navigate = useNavigate();

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
    navigate("/");
  };

  return (
    <div className="channel-list-container w-1/4 h-full bg-black flex flex-col justify-between">
      <div className="channel-list-header flex items-center h-16 px-8 text-lg font-bold text-white shadow-md">
        Channels
      </div>
      <div className="channel-list text-white p-8 w-full h-full overflow-x-hidden whitespace-nowrap text-ellipsis">
        {userData.channelList.map((channel) => {
          return (
            <h1
              className={
                "uppercase text-xl cursor-pointer w-full p-4 hover:bg-gray-800 " +
                (channelName === channel ? "bg-gray-800" : null)
              }
              key={Math.random(1000)}
            >
              {channel}
            </h1>
          );
        })}
      </div>
      <div className="relative text-white">
        <div
          className={
            "logged-in-user w-full h-20  flex items-center px-4 justify-between hover:bg-gray-800 cursor-pointer " +
            (openMenu ? "bg-gray-800" : null)
          }
          onClick={() => setopenMenu(!openMenu)}
        >
          <div className="user flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-800 relative">
              {userData.profilePic !== "" && (
                <img
                  src={userData.profilePic}
                  alt=""
                  className="absolute h-full w-full object-cover"
                />
              )}
            </div>
            <span className="overflow-x-hidden whitespace-nowrap text-ellipsis uppercase text-lg font-bold">
              {userData.username}
            </span>
          </div>
          <span className="material-icons flex items-center justify-center p-2">
            expand_less
          </span>
        </div>
        {openMenu && (
          <div className="absolute right-4 bottom-full mb-2 flex flex-col text-center z-5 shadow-md">
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
