import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../API/index";

const blankUserData = { username: "", profilePic: "", channelList: [] };

const ChannelPage = () => {
  const { channelName } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const [userData, setuserData] = useState(blankUserData);
  const token = localStorage.getItem("token") || "NO_TOKEN_FOUND";
  const navigate = useNavigate();

  const getUserData = async (token) => {
    const data = await api.getUserData(token);
    setuserData({ ...data._doc });
    setisLoading(false);
  };

  useEffect(() => {
    if (token !== "NO_TOKEN_FOUND") getUserData(token);
  }, [channelName]);

  return (
    <>
      {isLoading && token === "NO_TOKEN_FOUND" && (
        <div className="text-white h-screen w-screen flex flex-col gap-20 justify-center items-center bg-gray-900">
          <h1 className="uppercase tracking-widest text-gray-300 text-5xl font-bold">
            Untitled Project
          </h1>
          <div className="text-lg flex items-center gap-4">
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>{" "}
            or{" "}
            <button
              className="px-4 py-2 bg-blue-500"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {isLoading && token !== "NO_TOKEN_FOUND" && (
        <div className="text-white h-screen w-screen flex justify-center items-center text-xl bg-gray-900">
          Loading...
        </div>
      )}

      {!isLoading && token !== "NO_TOKEN_FOUND" && (
        <div className="h-screen w-screen flex">
          <LeftPanel
            channelName={channelName}
            userData={userData}
            setuserData={setuserData}
          />
          <RightPanel channelName={channelName} userData={userData} />
        </div>
      )}
    </>
  );
};

export default ChannelPage;
