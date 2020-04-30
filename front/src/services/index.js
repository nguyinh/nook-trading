import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === "development" && "http://172.20.10.4:2020";
// TODO: handle PROD env

/* USERS */
const checkAvailability = async (pseudo) => {
  const {
    data: { isAvailable },
  } = await axios.get(`/api/auth/checkAvailability/${pseudo}`);

  return isAvailable;
};

const getUser = async (pseudo) => {
  const {
    data: { user },
  } = await axios.get(`/api/users`, { params: { pseudo } });

  return user;
};

const updateUser = async (
  nativeFruit,
  islandName,
  hemisphere,
  friendCode,
  profileDescription
) => {
  const {
    data: { user },
  } = await axios.put("/api/users", {
    nativeFruit,
    islandName,
    hemisphere,
    friendCode,
    profileDescription,
  });

  return user;
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

const uploadAvatar = async (avatarData) => {
  const {
    data: { user },
  } = await axios.post(`/api/users/avatar`, { avatarData });

  return user;
};


/* MARKET */
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

/* TURNIP TREND */
const fetchTurnipPrices = async (day, hour, lastSunday) => {
  const {
    data: { trends },
  } = await axios.get("/api/turnipTrends/prices", {
    params: { day, hour, lastSunday },
  });

  return trends;
};

const addCurrentPrice = async (day, hour, lastSunday, newPrice) => {
  const {
    data: { price },
  } = await axios.post("/api/turnipTrends/prices", {
    day,
    hour,
    lastSunday,
    price: newPrice,
  });

  return price;
};

const setSundayPrice = async (thisSunday, price) => {
  const {
    data: { trend },
  } = await axios.post("/api/turnipTrends/prices/sunday", {
    thisSunday,
    price,
  });

  return trend;
};

const setOwnedQuantity = async (thisSunday, quantity) => {
  const {
    data: { trend },
  } = await axios.post("/api/turnipTrends/ownedQuantity", {
    thisSunday,
    quantity,
  });

  return trend;
};

const fetchTrend = async (authorId, lastSunday) => {
  const {
    data: { trend },
  } = await axios.get("/api/turnipTrends", {
    params: { authorId, lastSunday },
  });

  return trend;
};

const fetchAllTrends = async (lastSunday) => {
  const {
    data: { trends },
  } = await axios.get("/api/turnipTrends", {
    params: { lastSunday, withSundayPrices: true },
  });

  return trends;
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
  getUser,
  updateUser,
  uploadAvatar,
  fetchTurnipPrices,
  addCurrentPrice,
  setOwnedQuantity,
  setSundayPrice,
  fetchTrend,
  fetchAllTrends,
};
