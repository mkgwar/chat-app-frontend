import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import api from "../API/index";

//const SERVER_URL = "http://localhost:5000";
const SERVER_URL = "https://chat-app-mkgwar.herokuapp.com";

const RightPanel = ({ channelName, userData }) => {
  const token = localStorage.getItem("token");
  const [socket, setsocket] = useState("");
  const [message, setmessage] = useState("");
  const [profilePics, setprofilePics] = useState({});
  const [messageList, setmessageList] = useState([]);
  const bottomDiv = useRef(null);

  const getMessages = async () => {
    const token = localStorage.getItem("token");
    const data = await api.getMessages(token, channelName);
    if (data.status === "OK") {
      data.messages.forEach(async (message) => {
        if (!(message.username in profilePics)) {
          const data = await api.getProfilePic(message.username);
          setprofilePics((profilePics) => ({
            ...profilePics,
            [message.username]: data.profilePic,
          }));
        }
      });

      setmessageList((messageList) => data.messages);
    }
  };

  useEffect(() => {
    setsocket(io(SERVER_URL));

    io(SERVER_URL).on("receivemessage", async (message) => {
      if (!(message.username in profilePics)) {
        const data = await api.getProfilePic(message.username);
        setprofilePics((profilePics) => ({
          ...profilePics,
          [message.username]: data.profilePic,
        }));
      }
      setmessageList((messageList) => [...messageList, message]);
    });

    getMessages();
  }, []);

  const DisplayMessages = () => {
    if (bottomDiv.current !== null)
      bottomDiv.current.scrollIntoView({ behavior: "smooth" });

    return (
      <>
        {messageList.map((message) => {
          return (
            <div
              key={Math.random(2000)}
              className="flex items-start justify-start mb-16 gap-4"
            >
              <div className="h-12 w-12 bg-gray-300 relative rounded-md">
                <img
                  src={profilePics[message.username]}
                  alt=""
                  className="absolute h-full w-full object-cover rounded-md"
                />
              </div>
              <div className="w-full flex flex-col">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold text-gray-300">
                    {message.username}
                  </span>
                  <span className="text-sm font-bold text-gray-400">
                    {message.time}
                  </span>
                </div>
                <div className="mt-2 text-xl">{message.message}</div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    DisplayMessages();
  }, [messageList]);

  const sendMessage = (event, method) => {
    if (event.key === "Enter" && method === "enter") {
      event.preventDefault();
      setmessage("");
      const date = new Date();
      const time = `${date.toDateString()} ${date.toLocaleTimeString()}`;
      socket.emit("sendmessage", {
        channelName: channelName,
        token: token,
        message: message,
        time: time,
      });
    } else if (method === "click") {
      event.preventDefault();
      setmessage("");
      const date = new Date();
      const time = `${date.toDateString()} ${date.toLocaleTimeString()}`;
      socket.emit("sendmessage", {
        channelName: channelName,
        token: token,
        message: message,
        time: time,
      });
    }
  };

  return (
    <div className="channel-container w-full h-full bg-gray-900 flex flex-col justify-between">
      <div className="channel-header flex items-center h-16 px-16 text-lg font-bold text-white shadow-md uppercase">
        {channelName}
      </div>
      <div className="chat-window text-white px-16 p-8 w-full h-full overflow-y-scroll">
        <DisplayMessages />
        <div ref={bottomDiv} />
      </div>
      <div className="type-chat w-full h-40 items-center flex justify-center px-16">
        <div className="bg-gray-200 bg-opacity-25 text-white w-full h-12 flex items-center justify-center ">
          <input
            type="text"
            className="h-full w-full bg-transparent p-4 focus:outline-0"
            placeholder="Type a message here..."
            value={message}
            onChange={(event) => setmessage(event.target.value)}
            onKeyDown={(event) => sendMessage(event, "enter")}
          />
          <button
            className="bg-blue-500 h-full focus:outline-0 w-32 font-bold shadow-md"
            onClick={(event) => sendMessage(event, "click")}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
