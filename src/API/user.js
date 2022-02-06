import axios from "axios";

//const URL = "http://localhost:5000";
const URL = "https://chat-app-mkgwar.herokuapp.com";

export const signup = async (userData) => {
  const { data } = await axios.post(`${URL}/user/signup`, userData);
  return data;
};

export const signin = async (userData) => {
  const { data } = await axios.post(`${URL}/user/signin`, userData);
  return data;
};

export const getUserData = async (token) => {
  const { data } = await axios.get(`${URL}/user/getuserdata`, {
    headers: {
      authorization: token,
    },
  });

  return data;
};

export const uploadProfilePic = async (imageData, token) => {
  const { data } = await axios.post(`${URL}/user/profilepic`, imageData, {
    headers: {
      authorization: token,
    },
  });

  return data;
};

export const getProfilePic = async (username) => {
  const { data } = await axios.get(
    `${URL}/user/getprofilepic?user=${username}`
  );
  return data;
};
