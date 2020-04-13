import React, { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
console.log(axios.defaults.baseURL);
axios.defaults.baseURL = "http://172.20.10.4:2020";
// TODO: handle PROD env

const Main = () => {
  const [user, setUser] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [pics, setPics] = useState([]);

  useEffect(() => {
    try {
      async function connect() {
        const {
          data: { user },
        } = await axios.post("/api/auth/connect");
        console.log(user);
        setUser(user);
      }
      connect();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const login = async () => {
    try {
      const {
        data: { user },
      } = await axios.post("/api/auth/login", {
        email: "dev@dev.com",
        password: "dev",
        pseudo: "dev",
        islandName: "devIsland",
      });
      setUser(user);
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {
      console.log(err);
    }
  };

  const savePost = async () => {
    try {
      const { post } = await axios.post("/api/posts", {
        _id: user._id,
        articles: [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getPosts = async () => {
    try {
      const {
        data: { posts },
      } = await axios.get("/api/posts");
      console.log(posts);
      const sp = posts.map((post) =>
        Buffer.from(post.shopPicture.data, "base64")
      );
      setPics(sp);
    } catch (err) {
      console.log(err);
    }
  };

  const onInputChange = async (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      console.log(reader.result);
      setImageSrc(reader.result);

      const buf = new Buffer(reader.result, "utf8");
      console.log(buf);
      try {
        const test = await axios.post("/api/posts", {
          _id: user._id,
          articles: [],
          shopPicture: buf,
        });
        console.log(test);
      } catch (err) {
        console.log(err);
      }
      // const arrayBuffer = reader.result;
      // const array = new Uint8Array(arrayBuffer);
      // const binaryString = String.fromCharCode.apply(null, array);
      // console.log(binaryString);

      // reader.readAsDataURL(file);

      // reader.onload = () => {
      //   console.log(reader.result);
      // }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h3>Hello {user && user.pseudo}</h3>
      {user ? (
        <>
          <input
            // id={id}
            // className="checklist-body--media--camera-input"
            type="file"
            accept="image/*"
            // capture="environment"
            // onClick={onInputClick}
            onChange={onInputChange}
          />
          <button onClick={savePost}>Save Post</button>
          <img src={imageSrc} />
          <button onClick={getPosts}>Get Posts</button>
          {pics.length && pics.map((pic, i) => <img key={i} src={pic} />)}
        </>
      ) : (
        <>
        <button onClick={login}>Log in</button>
        </>
      )}
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default Main;
