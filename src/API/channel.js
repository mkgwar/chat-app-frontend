import axios from "axios";
import { SERVER_URL } from "../Url";

export const getMessages = async (token, channelName) => {
  const { data } = await axios.get(
    `${SERVER_URL}/channel/getmessages?channel=${channelName}`,
    {
      headers: {
        authorization: token,
      },
    }
  );

  return data;
};

export const sendMessageImage = async (imageData) => {
  const { data } = await axios.post(
    `${SERVER_URL}/channel/sendmessageimage`,
    imageData
  );
  return data;
};
