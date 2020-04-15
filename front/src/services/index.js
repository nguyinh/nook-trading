import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://172.20.10.5:2020";
// TODO: handle PROD env

const signUpUser = async (email, password, pseudo, islandName) => {
  const { data: user } = await axios.post("/api/auth/signin", {
    email,
    password,
    pseudo,
    islandName,
  });

  return user;
};

const logInUser = async (email, password) => {
  const { data: user } = await axios.post("/api/auth/login", {
    email,
    password,
  });

  return user;
};

const connectUser = async () => {
  const { data: user } = await axios.post("/api/auth/connect");

  return user;
};

const logOutUser = async () => {
  await axios.post("/api/auth/logout");

  return;
};

const createPost = async (items, shopPicture) => {
  console.log('coucou');
  await axios.post("/api/posts", {
    items,
    shopPicture,
  });
  console.log('allez 2');
  return;
};

export { signUpUser, logInUser, connectUser, logOutUser, createPost };
