import axios from "axios";
import { SERVER_URL } from "../Url";

export const signup = async (userData) => {
  const { data } = await axios.post(`${SERVER_URL}/user/signup`, userData);
  return data;
};

export const signin = async (userData) => {
  const { data } = await axios.post(`${SERVER_URL}/user/signin`, userData);
  return data;
};

export const getUserData = async (token) => {
  const { data } = await axios.get(`${SERVER_URL}/user/getuserdata`, {
    headers: {
      authorization: token,
    },
  });

  return data;
};

export const uploadProfilePic = async (imageData, token) => {
  const { data } = await axios.post(
    `${SERVER_URL}/user/profilepic`,
    imageData,
    {
      headers: {
        authorization: token,
      },
    }
  );

  return data;
};

export const getProfilePic = async (username) => {
  const { data } = await axios.get(
    `${SERVER_URL}/user/getprofilepic?user=${username}`
  );
  return data;
};
