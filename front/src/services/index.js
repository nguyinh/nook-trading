import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://172.20.10.3:2020";
// TODO: handle PROD env

const signUpUser = async (pseudo, password, islandName) => {
  const {
    data: { user },
  } = await axios.post("/api/auth/signin", {
    pseudo,
    password,
    islandName,
  });

  return user;
};

const logInUser = async (pseudo, password) => {
  const {
    data: { user },
  } = await axios.post("/api/auth/login", {
    pseudo,
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
  } = await axios.post(`/api/items/${itemId}/bookings`);

  return item;
};

const unbookItem = async (itemId) => {
  const {
    data: { item },
  } = await axios.delete(`/api/items/${itemId}/bookings`);

  return item;
};

const bookPost = async (postId) => {
  const {
    data: { post },
  } = await axios.post(`/api/posts/${postId}/bookings`);

  return post;
};

const unbookPost = async (postId) => {
  const {
    data: { post },
  } = await axios.delete(`/api/posts/${postId}/bookings`);

  return post;
};

export {
  signUpUser,
  logInUser,
  connectUser,
  logOutUser,
  createPost,
  getDailyPosts,
  bookItem,
  unbookItem,
  bookPost,
  unbookPost,
};
