import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === "development" && "http://172.20.10.4:2020";
// TODO: handle PROD env

const checkAvailability = async (pseudo) => {
  const {
    data: { isAvailable },
  } = await axios.get(`/api/auth/checkAvailability/${pseudo}`);

  return isAvailable;
};

const signUpUser = async (
  pseudo,
  password,
  hemisphere,
  nativeFruit,
  islandName,
  friendCode
) => {
  const {
    data: { user },
  } = await axios.post("/api/auth/signin", {
    pseudo,
    password,
    hemisphere,
    nativeFruit,
    islandName,
    friendCode,
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
    data: { user, currentVersion },
  } = await axios.post("/api/auth/connect");

  return { user, currentVersion };
};

const logOutUser = async () => {
  await axios.post("/api/auth/logout");

  return;
};

const getDailyPosts = async () => {
  const {
    data: { posts },
  } = await axios.get("/api/posts", { params: { onlyDaily: "true" } });

  return posts.reverse();
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

const uploadAvatar = async (avatarData) => {
  const {
    data: { user },
  } = await axios.post(`/api/users/avatar`, { avatarData });

  return user;
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
  checkAvailability,
  uploadAvatar
};
