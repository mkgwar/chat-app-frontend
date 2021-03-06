import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../API/index";
import OpenImage from "./OpenImage";
import AddChannel from "./AddChannel";

const blankUserData = { username: "", profilePic: "", channelList: [] };

const ChannelPage = () => {
  const { channelName } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const [userData, setuserData] = useState(blankUserData);
  const [isOpenImage, setisOpenImage] = useState(false);
  const [token, settoken] = useState("");
  const [openAddChannel, setopenAddChannel] = useState(false);
  const [selectedImage, setselectedImage] = useState("");
  const [allChannels, setallChannels] = useState({});
  const navigate = useNavigate();

  const getUserData = async (token) => {
    const data = await api.getUserData(token);

    if (data.status === "OK") {
      setuserData({ ...data._doc });
      setisLoading(false);
    }
  };

  useEffect(() => {
    const currToken = localStorage.getItem("token") || "NO_TOKEN_FOUND";
    settoken(currToken);

    if (currToken !== "NO_TOKEN_FOUND") getUserData(currToken);
  }, []);

  return (
    <>
      {isLoading && token !== "NO_TOKEN_FOUND" && (
        <div className="text-white h-screen w-screen flex justify-center items-center text-xl bg-gray-900">
          Loading...
        </div>
      )}

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

      {!isLoading && token !== "NO_TOKEN_FOUND" && (
        <div className="h-screen w-screen flex">
          <LeftPanel
            channelName={channelName}
            userData={userData}
            settoken={settoken}
            setuserData={setuserData}
            setopenAddChannel={setopenAddChannel}
            setallChannels={setallChannels}
            allChannels={allChannels}
          />
          <RightPanel
            channelName={channelName}
            userData={userData}
            setuserData={setuserData}
            setisOpenImage={setisOpenImage}
            setselectedImage={setselectedImage}
          />
        </div>
      )}

      {isOpenImage && (
        <OpenImage
          setisOpenImage={setisOpenImage}
          selectedImage={selectedImage}
        />
      )}
      {openAddChannel && (
        <AddChannel
          setopenAddChannel={setopenAddChannel}
          setuserData={setuserData}
          userData={userData}
          allChannels={allChannels}
          setallChannels={setallChannels}
        />
      )}
    </>
  );
};

export default ChannelPage;
