import {
  signup,
  signin,
  getUserData,
  uploadProfilePic,
  getProfilePic,
} from "./user";
import { getMessages, sendMessageImage } from "./channel";

const api = {
  signup,
  signin,
  getUserData,
  uploadProfilePic,
  getMessages,
  getProfilePic,
  sendMessageImage,
};

export default api;
