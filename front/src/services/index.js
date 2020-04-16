import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://172.20.10.5:2020";
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
  } = await axios.get("/api/posts", { params: { onlyDaily: "true" } });
  console.log(posts);
  return posts;
};

const createPost = (items, shopPicture) => {
  return axios.post("/api/posts", {
    items,
    shopPicture,
  });
};

const bookItem = async (itemId) => {
  const {
    data: { item },
  } = await axios.post("/api/bookings", null, { params: { itemId } });

  return item;
};

const unbookItem = async (itemId) => {
  const {
    data: { item },
  } = await axios.delete("/api/bookings", { params: { itemId } });

  return item;
};

export {
  signUpUser,
  logInUser,
  connectUser,
  logOutUser,
  createPost,
  getDailyPosts,
  bookItem,
  unbookItem
};
