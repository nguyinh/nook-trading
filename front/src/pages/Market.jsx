import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../contexts";
import { getDailyPosts } from "../services";
import {
  Button,
  Form,
  Header,
  Divider,
  Segment,
  Dimmer,
  Loader,
  Image,
} from "semantic-ui-react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    setIsLoading(true);
    let posts = await getDailyPosts();

    posts = posts.map((post) => ({
      ...post,
      shopPictureSrc: Buffer.from(post.shopPicture.data, "base64"),
    }));

    setPosts(posts);
    setIsLoading(false);
  };

  const formatDate = (date) => {
    return `${days[date.getDay()]} ${date.getDate()} ${
      months[date.getMonth()]
    } `;
  };

  const backFromCreator = () => {
    fetchPosts();
    setIsCreating(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {" "}
      {isCreating ? (
        <PostCreator backFromCreator={backFromCreator} />
      ) : (
        <div className="market">
          <div className="market--header">
            <Header
              as="h2"
              style={{ margin: 0 }}
              className="market--header--container"
            >
              {formatDate(new Date())}
              {!!posts.length && (
                <div className="market--header--post-count">{posts.length}</div>
              )}
            </Header>
            <Button
              size="mini"
              color="olive"
              onClick={() => setIsCreating(true)}
            >
              + Créer annonce
            </Button>
          </div>
          {isLoading ? (
            <Loader
              active
              inline="centered"
              size="big"
              style={{ marginTop: "5rem" }}
            >
              Chargement des annonces...
            </Loader>
          ) : (
            <>
              {!!posts.length ? (
                posts.map((post) => (
                  <div className="market-post">
                    <Header as="h3">{post.author.pseudo}</Header>

                    <div className="market--post--shop-picture">
                      <img src={post.shopPictureSrc} className="shop-picture" />
                    </div>

                    {post.items.length ? (
                      post.items.map(({ name, price }) => (
                        <div className="market-items--input">
                          <div className="market-items--post--item">
                            <span className="market-items--creator--item-name">
                              {name}
                            </span>
                            {price && (
                              <span className="market-items--creator--item-price">{`${price}$`}</span>
                            )}
                          </div>
                          <Button color="teal" compact onClick={null}>
                            👈 I want it
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className='market-items--no-item'>
                        <Button color="teal" compact size='large' onClick={null}>
                          I want something 🙏
                        </Button>
                      </div>
                    )}
                    <Divider style={{ margin: "3rem 3rem 2rem" }} />
                  </div>
                ))
              ) : (
                <div className="no-data">
                  Pas d'annonce pour le moment, créé en une 👆
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Market;
