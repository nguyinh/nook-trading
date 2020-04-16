import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts";
import { getPosts } from "../services";
import { Button, Form, Header, Divider } from "semantic-ui-react";
import PostCreator from "./PostCreator";

const days = new Array(
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi"
);
const months = new Array(
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre"
);

const Market = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    let posts = await getPosts();
    console.log(posts);
    posts = posts.map((post) => ({
      ...post,
      shopPictureSrc: Buffer.from(post.shopPicture.data, "base64"),
    }));

    setPosts(posts);
  };

  const formatDate = (date) => {
    return `${days[date.getDay()]} ${date.getDate()} ${
      months[date.getMonth()]
    } `;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {" "}
      {isCreating ? (
        <PostCreator />
      ) : (
        <div className="market">
          <div className="market--header">
            <Header as="h2" style={{ margin: 0 }}>
              {formatDate(new Date())}
            </Header>
            <Button
              size="mini"
              color="olive"
              onClick={() => setIsCreating(true)}
            >
              + Créer annonce
            </Button>
          </div>
          {!!posts.length &&
            posts.map((post) => (
              <>
                <Header as="h3">{post.author.pseudo}</Header>

                <div className="market--post--shop-picture">
                  <img src={post.shopPictureSrc} className="shop-picture" />
                </div>

                {post.items.map(({ name, price }) => (
                  <div className="market-items--input">
                    <div className="market-items--post--item">
                      <span className="market-items--creator--item-name">
                        {name}
                      </span>
                      <span className="market-items--creator--item-price">{`${price}$`}</span>
                    </div>
                    <Button color="teal" compact onClick={null}>
                      👈 I want it
                    </Button>
                  </div>
                ))}
                <Divider style={{margin: '3rem 3rem 2rem'}}/>
              </>
            ))}
        </div>
      )}
    </>
  );
};

export default Market;
