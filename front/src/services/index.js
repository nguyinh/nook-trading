import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://172.20.10.3:2020";
// TODO: handle PROD env

const signUpUser = async (email, password, pseudo, islandName) => {
  const {
    data: { user },
  } = await axios.post("/api/auth/signin", {
    email,
    password,
    pseudo,
    islandName,
  });

  return user;
};

const logInUser = async (email, password) => {
  const {
    data: { user },
  } = await axios.post("/api/auth/login", {
    email,
    password,
  });

  return user;
};

const connectUser = async () => {
  const {
    data: { user },
  } = await axios.post("/api/auth/connect");

  return user;
};

const logOutUser = async () => {
  await axios.post("/api/auth/logout");

  return;
};

const getDailyPosts = async (items, shopPicture) => {
  const {
    data: { posts },
  } = await axios.get("/api/posts", { params: { onlyDaily: 'true' } });

  return posts;
};

const createPost = (items, shopPicture) => {
  return axios.post("/api/posts", {
    items,
    shopPicture,
  });
};

export { signUpUser, logInUser, connectUser, logOutUser, createPost, getDailyPosts };
