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
  getChannelData,
};

export default api;
