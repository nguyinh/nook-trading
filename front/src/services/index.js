import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === "development" && "http://172.20.10.4:2020";
// TODO: handle PROD env

/* USERS */
export async function checkAvailability(pseudo) {
  const {
    data: { isAvailable },
  } = await axios.get(`/api/auth/checkAvailability/${pseudo}`);

  return isAvailable;
};

export async function getUser(pseudo) {
  const {
    data: { user },
  } = await axios.get(`/api/users`, { params: { pseudo } });

  return user;
};

export async function updateUser(
  nativeFruit,
  islandName,
  hemisphere,
  friendCode,
  profileDescription
) {
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

export async function signUpUser(
  pseudo,
  password,
  hemisphere,
  nativeFruit,
  islandName,
  friendCode
) {
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

export async function logInUser(pseudo, password) {
  const {
    data: { user },
  } = await axios.post("/api/auth/login", {
    pseudo,
    password,
  });

  return user;
};

export async function connectUser() {
  const {
    data: { user, currentVersion },
  } = await axios.post("/api/auth/connect");

  return { user, currentVersion };
};

export async function logOutUser() {
  await axios.post("/api/auth/logout");

  return;
};

export async function uploadAvatar(avatarData) {
  const {
    data: { user },
  } = await axios.post(`/api/users/avatar`, { avatarData });

  return user;
};


/* MARKET */
export async function getDailyPosts() {
  const {
    data: { posts },
  } = await axios.get("/api/posts", { params: { onlyDaily: "true" } });

  return posts.reverse();
};

export async function createPost (items, shopPicture) {
  return axios.post("/api/posts", {
    items,
    shopPicture,
  });
};

export async function bookItem(itemId) {
  const {
    data: { item },
  } = await axios.post(`/api/items/${itemId}/bookings`);

  return item;
};

export async function unbookItem(itemId) {
  const {
    data: { item },
  } = await axios.delete(`/api/items/${itemId}/bookings`);

  return item;
};

export async function bookPost(postId) {
  const {
    data: { post },
  } = await axios.post(`/api/posts/${postId}/bookings`);

  return post;
};

export async function unbookPost(postId) {
  const {
    data: { post },
  } = await axios.delete(`/api/posts/${postId}/bookings`);

  return post;
};

/* TURNIP TREND */
export async function fetchTurnipPrices(day, hour, thisSunday) {
  const {
    data: { trends },
  } = await axios.get("/api/turnipTrends/prices", {
    params: { day, hour, thisSunday },
  });

  return trends;
};

export async function addCurrentPrice(day, hour, thisSunday, newPrice) {
  const {
    data: { price },
  } = await axios.post("/api/turnipTrends/prices", {
    day,
    hour,
    thisSunday,
    price: newPrice,
  });

  return price;
};

export async function setSundayPrice(thisSunday, price) {
  const {
    data: { trend },
  } = await axios.post("/api/turnipTrends/prices/sunday", {
    thisSunday,
    price,
  });

  return trend;
};

export async function setOwnedQuantity(thisSunday, quantity) {
  const {
    data: { trend },
  } = await axios.post("/api/turnipTrends/ownedQuantity", {
    thisSunday,
    quantity,
  });

  return trend;
};

export async function setOwnedPrice(thisSunday, price) {
  const {
    data: { trend },
  } = await axios.post("/api/turnipTrends/ownedPrice", {
    thisSunday,
    price,
  });

  return trend;
};


export async function fetchTrend(authorId, thisSunday) {
  const {
    data: { trend },
  } = await axios.get("/api/turnipTrends", {
    params: { authorId, thisSunday },
  });

  return trend;
};

export async function fetchAllTrends(thisSunday) {
  const {
    data: { trends },
  } = await axios.get("/api/turnipTrends", {
    params: { thisSunday, withSundayPrices: true },
  });

  return trends;
};
