import {
  signup,
  signin,
  getUserData,
  uploadProfilePic,
  getProfilePic,
} from "./user";
import {
  getMessages,
  sendMessageImage,
  addChannel,
  getChannelData,
  getAllChannels,
  addExistingChannel,
} from "./channel";

const api = {
  signup,
  signin,
  getUserData,
  uploadProfilePic,
  getMessages,
  getProfilePic,
  sendMessageImage,
  addChannel,
  addExistingChannel,
  getChannelData,
  getAllChannels,
};

export default api;
