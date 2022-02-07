import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import api from "../API/index";
import { SERVER_URL } from "../Url";

const RightPanel = ({
  channelName,
  userData,
  setisOpenImage,
  setselectedImage,
}) => {
  const token = localStorage.getItem("token");
  const [socket, setsocket] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [message, setmessage] = useState("");
  const [profilePics, setprofilePics] = useState({});
  const [messageList, setmessageList] = useState([]);
  const [isSendingMessage, setisSendingMessage] = useState(false);
  const [atBottom, setatBottom] = useState(false);
  const [newMessage, setnewMessage] = useState(false);
  const bottomDiv = useRef(null);

  const checkBottom = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      setatBottom(true);
      setnewMessage(false);
    } else {
      setatBottom(false);
    }
  };

  const getMessages = async () => {
    const token = localStorage.getItem("token");
    const data = await api.getMessages(token, channelName);
    if (data.status === "OK") {
      setmessageList((messageList) => data.messages);

      const uniqueUsers = {};

      data.messages.forEach((message) => {
        if (!uniqueUsers[message.username]) {
          uniqueUsers[message.username] = message.username;
        }
      });

      Object.keys(uniqueUsers).map(async (user) => {
        const data = await api.getProfilePic(user);
        setprofilePics((profilePics) => ({
          ...profilePics,
          [user]: data.profilePic,
        }));
      });
    }

    setisLoading(false);
  };

  useEffect(() => {
    setsocket(io(SERVER_URL));

    io(SERVER_URL).on("receivemessage", async (message) => {
      if (!profilePics[message.username]) {
        const data = await api.getProfilePic(message.username);
        setprofilePics((profilePics) => ({
          ...profilePics,
          [message.username]: data.profilePic,
        }));
      }
      setmessageList((messageList) => [...messageList, message]);
      setisSendingMessage(false);
      if (!atBottom) setnewMessage(true);
    });

    getMessages();
  }, []);

  const goAtLast = () => {
    if (bottomDiv.current !== null) {
      bottomDiv.current.scrollIntoView({ behavior: "smooth" });
      setnewMessage(false);
    }
  };

  useEffect(() => {
    goAtLast();
  }, [bottomDiv.current]);

  useEffect(() => {
    if (bottomDiv.current !== null && atBottom) {
      bottomDiv.current.scrollIntoView({ behavior: "smooth" });
      setnewMessage(false);
    }
  }, [messageList.length]);

  const sendMessage = (event, method) => {
    if (event.key === "Enter" && method === "enter") {
      if (message.length !== 0) {
        setisSendingMessage(true);
        event.preventDefault();
        setmessage("");
        const date = new Date();
        const time = `${date.toDateString()} ${date.toLocaleTimeString()}`;
        socket.emit("sendmessage", {
          channelName: channelName,
          token: token,
          message: message,
          time: time,
          type: "TEXT",
        });
      }
    } else if (method === "click") {
      if (message.length !== 0) {
        setisSendingMessage(true);
        event.preventDefault();
        setmessage("");
        const date = new Date();
        const time = `${date.toDateString()} ${date.toLocaleTimeString()}`;
        socket.emit("sendmessage", {
          channelName: channelName,
          token: token,
          message: message,
          time: time,
          type: "TEXT",
        });
      }
    }
  };

  const sendMessageImage = async (event) => {
    if (event.target.files.length > 0) {
      setisSendingMessage(true);
      const date = new Date();
      const time = `${date.toDateString()} ${date.toLocaleTimeString()}`;
      const formdata = new FormData();
      formdata.append("imagemessage", event.target.files[0]);
      const data = await api.sendMessageImage(formdata);

      if (data.status === "OK") {
        socket.emit("sendmessage", {
          channelName: channelName,
          token: token,
          message: data.link,
          time: time,
          type: "IMAGE",
        });
      }
    }
  };

  return (
    <div className="channel-container w-full h-full bg-gray-900 flex flex-col justify-between">
      <div className="channel-header flex items-center h-16 px-16 text-lg font-bold text-white shadow-md uppercase">
        {channelName}
      </div>
      {isLoading ? (
        <div className="h-full w-full flex justify-center items-center text-white text-xl">
          Loading Messages...
        </div>
      ) : (
        <div
          className="chat-window text-white px-16 p-8 w-full h-full relative overflow-y-scroll"
          onScroll={checkBottom}
        >
          {messageList.map((message) => {
            return (
              <div
                key={Math.random(2000)}
                className="flex items-start justify-start mb-12 gap-4"
              >
                <div className="h-12 w-12 bg-gray-800 relative rounded-md">
                  {profilePics[message.username] !== "" && (
                    <img
                      src={profilePics[message.username]}
                      alt=""
                      className="absolute h-full w-full object-cover rounded-md"
                    />
                  )}
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-300">
                      {message.username}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {message.time}
                    </span>
                  </div>
                  <div className="mt-2">
                    {message.type === "IMAGE" ? (
                      <div
                        className="h-60 w-80 relative rounded-md cursor-pointer"
                        onClick={() => {
                          setisOpenImage(true);
                          setselectedImage(message.message);
                        }}
                      >
                        <img
                          src={message.message}
                          alt=""
                          className="absolute w-full h-full object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      message.message
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomDiv} className="h-0" />
          <div
            className="fixed h-8 w-8 bottom-28 right-16 text-white font-bold rounded-full bg-gray-700 flex justify-center items-center shadow-md cursor-pointer"
            onClick={goAtLast}
          >
            <span className="material-icons">keyboard_arrow_down</span>
          </div>
        </div>
      )}

      <div className="type-chat w-full h-32 items-center flex justify-center px-16 relative">
        {isSendingMessage && (
          <div className="bg-gray-700 rounded-md font-bold p-2 text-white bottom-full absolute text-xs z-2">
            sending message
          </div>
        )}

        {newMessage && !isSendingMessage && (
          <div className="bg-gray-700 rounded-md font-bold p-2 text-white bottom-full absolute text-xs z-2">
            new message
          </div>
        )}

        <div className="bg-gray-200 rounded-md bg-opacity-25 text-white w-full h-10 flex items-center justify-center">
          <input
            type="text"
            className="h-full w-full bg-transparent p-4 text-sm focus:outline-0"
            placeholder="Type a message here..."
            value={message}
            onChange={(event) => setmessage(event.target.value)}
            onKeyDown={(event) => sendMessage(event, "enter")}
          />
          <div className="h-full flex items-center gap-4">
            <label htmlFor="imagemessage" className="cursor-pointer">
              <div className="flex items-center flex-col justify-center opacity-25 scale-75">
                <div className="bg-white h-1 w-3 rounded-t-md" />
                <div className="bg-white  rounded-md h-5 w-7 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full border-2 border-black" />
                </div>
              </div>
            </label>

            <input
              type="file"
              accept="image/png, image/jpeg"
              id="imagemessage"
              name="imagemessage"
              className="hidden"
              onChange={sendMessageImage}
            />

            <button
              className="bg-blue-500 h-full text-sm focus:outline-0 w-32 font-bold shadow-md rounded-md"
              onClick={(event) => sendMessage(event, "click")}
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
