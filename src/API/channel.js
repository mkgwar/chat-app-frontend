import axios from "axios";

//const URL = "http://localhost:5000";
const URL = "https://chat-app-mkgwar.herokuapp.com";

export const getMessages = async (token, channelName) => {
  const { data } = await axios.get(
    `${URL}/channel/getmessages?channel=${channelName}`,
    {
      headers: {
        authorization: token,
      },
    }
  );

  return data;
};
