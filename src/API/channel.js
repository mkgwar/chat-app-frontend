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
