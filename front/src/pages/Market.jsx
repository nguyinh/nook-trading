import React, { useEffect, useState, useContext } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./Market.css";
import { PostHeader, PostCreator} from "../components/market";
import { AppContext } from "../contexts";
import {
  getDailyPosts,
  deletePost,
  bookItem,
  unbookItem,
  bookPost,
  unbookPost,
} from "../services";
import { Button, Header, Divider, Loader, Dimmer } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { spacify as s } from "../utils";
import bellsImage from "../res/images/bells-2.png";

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
  const {
    state: { currentUser, isAutoConnecting },
  } = useContext(AppContext);

  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemLoading, setItemLoading] = useState(null);
  const [postLoading, setPostLoading] = useState(null);

  const [posts, setPosts] = useState([]);

  const [selectedPicture, setSelectedPicture] = useState(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let posts = await getDailyPosts();

      posts = posts.map((post) => ({
        ...post,
        shopPictureSrc: Buffer.from(post.shopPicture.data, "base64"),
      }));

      setPosts(posts);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId, authorId) => {
    try {
      setIsDeleting(postId);
      const deletedPost = await deletePost(postId, authorId);
      setPosts(posts.filter((post) => post._id !== deletedPost._id));
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleItemBooking = async (itemId) => {
    setItemLoading(itemId);
    try {
      const updatedItem = await bookItem(itemId);

      setPosts(
        posts.map((post) => ({
          ...post,
          items: post.items.map((item) =>
            item._id === itemId ? updatedItem : item
          ),
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setItemLoading(null);
    }
  };

  const handleItemUnbooking = async (itemId) => {
    setItemLoading(itemId);
    try {
      const updatedItem = await unbookItem(itemId);

      setPosts(
        posts.map((post) => ({
          ...post,
          items: post.items.map((item) =>
            item._id === itemId ? updatedItem : item
          ),
        }))
      );
    } catch (err) {
      console.log(err);
    } finally {
      setItemLoading(null);
    }
  };

  const handlePostBooking = async (postId) => {
    setPostLoading(postId);
    try {
      const updatedPost = await bookPost(postId);

      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, ...updatedPost } : post
        )
      );
    } catch (err) {
      console.log(err);
    } finally {
      setPostLoading(null);
    }
  };

  const handlePostUnbooking = async (postId) => {
    setPostLoading(postId);
    try {
      const updatedPost = await unbookPost(postId);

      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...post, ...updatedPost } : post
        )
      );
    } catch (err) {
      console.log(err);
    } finally {
      setPostLoading(null);
    }
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

  const isLastPost = (index) => index + 1 !== posts.length;

  const BookingIndicator = ({ bookingAuthors }) => {
    if (!bookingAuthors.length) return null;

    if (bookingAuthors.length === 1) {
      const isSelfAuthor = bookingAuthors[0]._id === currentUser._id;
      if (isSelfAuthor) return <span>Tu es interréssé 👀</span>;
      else
        return (
          <>
            <span style={{ fontWeight: 700 }}>{bookingAuthors[0].pseudo}</span>
            <span>{` est intéressé`}</span>
          </>
        );
    } else {
      const isSelfAuthor = (_id) => _id === currentUser._id;
      const authorsList = bookingAuthors.map(({ pseudo, _id }, i) =>
        isSelfAuthor(_id) ? `Toi` : pseudo
      );
      authorsList.sort((a, b) => (a === "Toi" ? -1 : 0));
      if (isSelfAuthor)
        return (
          <>
            <span style={{ fontWeight: 700 }}>{authorsList.join(", ")}</span>
            <span>{` ${
              bookingAuthors.some(({ _id }) => _id === currentUser._id)
                ? "êtes"
                : "sont"
            } intéressés`}</span>
          </>
        );
    }

    return null;
  };

  if (isAutoConnecting)
    return (
      <Loader active inline="centered" size="big" style={{ marginTop: "5rem" }}>
        Chargement de l'app ✋
      </Loader>
    );
  else if (!currentUser) return <Redirect to="/profile" />;

  return (
    <>
      {isCreating ? (
        <PostCreator backFromCreator={backFromCreator} />
      ) : (
        <div className="market">
          <CSSTransition
            in={selectedPicture}
            unmountOnExit
            timeout={300}
            classNames="shop-picture-overlay-anim"
          >
            <div
              className="shop-picture--overlay"
              onClick={() => setSelectedPicture(null)}
            >
              <img src={selectedPicture} className="selected-shop-picture" />
            </div>
          </CSSTransition>

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
            {/* TODO: handle update post
            {!isLoading &&
              !posts.some((post) => post.author._id === currentUser._id) && ( */}
            <Button
              size="mini"
              color="olive"
              onClick={() => setIsCreating(true)}
            >
              + Créer annonce
            </Button>
            {/* )} */}
          </div>
          {isLoading ? (
            <Loader
              active
              inline="centered"
              size="big"
              style={{ marginTop: "5rem" }}
            >
              Chargement des annonces ✋
            </Loader>
          ) : (
            <>
              {!!posts.length ? (
                <TransitionGroup className="posts-anim-group">
                  {posts.map(
                    (
                      {
                        _id: postId,
                        author,
                        items,
                        shopPictureSrc,
                        bookings: postBookings,
                      },
                      i
                    ) => (
                      <CSSTransition
                        key={postId}
                        // unmountOnExit
                        timeout={300}
                        classNames="posts-anim"
                      >
                        <div className="market-post">
                          <Dimmer active={isDeleting === postId}>
                            <Loader />
                          </Dimmer>

                          <PostHeader
                            currentUser={currentUser}
                            author={author}
                            postId={postId}
                            deletePost={handleDeletePost}
                          />

                          <div
                            className="market--post--shop-picture"
                            onClick={() => setSelectedPicture(shopPictureSrc)}
                          >
                            <img
                              src={shopPictureSrc}
                              className="shop-picture"
                            />
                          </div>

                          {items.length ? (
                            items.map(
                              ({ _id: itemId, name, price, bookings }) => (
                                <div
                                  className="market-items--input"
                                  key={itemId}
                                >
                                  <div className="market-items--post--item">
                                    <div className="market-items--post--item-label">
                                      <span className="market-items--creator--item-name">
                                        {name}
                                      </span>
                                      {price && (
                                        <>
                                          <span className="market-items--creator--item-price">{`${s(price)}`}</span>
                                          <img
                                            src={bellsImage}
                                            className="market-items--bell-image"
                                          />
                                        </>
                                      )}
                                    </div>
                                    {!!bookings.length && (
                                      <div className="market-items--post--item-bookings">
                                        <BookingIndicator
                                          bookingAuthors={bookings.map(
                                            (booking) => booking.author
                                          )}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  {author._id !== currentUser._id && (
                                    <>
                                      {bookings.some(
                                        (booking) =>
                                          booking.author._id === currentUser._id
                                      ) ? (
                                        <Button
                                          color="orange"
                                          compact
                                          loading={itemLoading === itemId}
                                          disabled={
                                            itemLoading ||
                                            postLoading /* === itemId*/
                                          }
                                          onClick={() =>
                                            handleItemUnbooking(itemId)
                                          }
                                        >
                                          ❌ Annuler
                                        </Button>
                                      ) : (
                                        <Button
                                          color="teal"
                                          compact
                                          loading={itemLoading === itemId}
                                          disabled={
                                            itemLoading ||
                                            postLoading /* === itemId*/
                                          }
                                          onClick={() =>
                                            handleItemBooking(itemId)
                                          }
                                        >
                                          👈 I want it
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              )
                            )
                          ) : (
                            <div className="market-items--no-item">
                              {author._id !== currentUser._id && (
                                <>
                                  {postBookings.some(
                                    (booking) =>
                                      booking.author._id === currentUser._id
                                  ) ? (
                                    <Button
                                      color="orange"
                                      compact
                                      size="large"
                                      loading={postLoading === postId}
                                      disabled={
                                        postLoading ||
                                        itemLoading /* === postId*/
                                      }
                                      onClick={() =>
                                        handlePostUnbooking(postId)
                                      }
                                    >
                                      ❌ Annuler
                                    </Button>
                                  ) : (
                                    <Button
                                      color="teal"
                                      compact
                                      size="large"
                                      loading={postLoading === postId}
                                      disabled={
                                        postLoading ||
                                        itemLoading /* === postId*/
                                      }
                                      onClick={() => handlePostBooking(postId)}
                                    >
                                      I want something 🙏
                                    </Button>
                                  )}
                                </>
                              )}

                              {!!postBookings.length && (
                                <div
                                  className="market-items--post--item-bookings"
                                  style={{ marginTop: "0.5rem", marginLeft: 0 }}
                                >
                                  <BookingIndicator
                                    bookingAuthors={postBookings.map(
                                      (booking) => booking.author
                                    )}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                          {isLastPost(i) && (
                            <Divider style={{ margin: "3rem 3rem 0" }} />
                          )}
                        </div>
                      </CSSTransition>
                    )
                  )}
                </TransitionGroup>
              ) : (
                <div className="no-data">
                  Pas d'annonce aujourd'hui, créé en une 👆
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
