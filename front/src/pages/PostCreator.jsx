import React, { useEffect, useState, useRef } from "react";
import { AppContext } from "../contexts";
import { createPost } from "../services";
import { Button, Segment, Header, Icon, Input, Label } from "semantic-ui-react";

const PostCreator = () => {
  const [shopPicture, setShopPicture] = useState(null);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const inputRef = useRef(null);

  const addItemToList = () => {
    setItems([...items, { name: itemName, price: itemPrice }]);
    setItemName("");
    setItemPrice("");
  };

  const publish = async () => {
    if (itemName && itemPrice) addItemToList();

    console.log(new Buffer(shopPicture, "utf8"));
    console.log(items);
    await createPost(items, new Buffer(shopPicture, "utf8"));
    console.log('allez');
  };

  const simulateInputClick = () => {
    inputRef.current.click();
  };

  const onInputChange = async (evt) => {
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      setShopPicture(reader.result);

      // Convert to a stockable format
      const buf = new Buffer(reader.result, "utf8");

      // try {
      //   const test = await axios.post("/api/posts", {
      //     _id: user._id,
      //     articles: [],
      //     shopPicture: buf,
      //   });
      //   console.log(test);
      // } catch (err) {
      //   console.log(err);
      // }
    };

    reader.readAsDataURL(file);
  };
  return (
    <div className="market--post-creator">
      <Header as="h2">Ton annonce du jour</Header>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onInputChange}
        style={{ visibility: "hidden", display: "none" }}
      />

      {shopPicture ? (
        <img src={shopPicture} className="shop-picture" />
      ) : (
        <Segment
          placeholder
          onClick={simulateInputClick}
          className="shop-picture--input"
        >
          <Header icon>
            <Icon name="plus" />
            Ajoute une photo de ton shop 📸
          </Header>
        </Segment>
      )}

      <div className="market-items--creator">
        <Header as="h3">Ajoute tes articles</Header>

        {items.map(({ name, price }) => (
          <div className="market-items--input">
            <div className="market-items--creator--item">
              <span className="market-items--creator--item-name">{name}</span>
              <span className="market-items--creator--item-price">{`${price}$`}</span>
            </div>
            <Button
              icon
              color="red"
              onClick={() =>
                setItems(items.filter((item) => item.name !== name))
              }
            >
              <Icon name="minus" />
            </Button>
          </div>
        ))}
        <div className="market-items--input">
          <Input
            icon="tag"
            iconPosition="left"
            placeholder="Nom article"
            value={itemName}
            onChange={(_, { value }) => setItemName(value)}
          />
          <Input
            icon="dollar"
            iconPosition="left"
            placeholder="Prix"
            className="market-items--price-input"
            value={itemPrice}
            onChange={(_, { value }) => setItemPrice(value)}
          />
          <Button icon color="olive" onClick={addItemToList}>
            <Icon name="plus" />
          </Button>
        </div>

        <Button
          content="Publier"
          fluid
          primary
          size="huge"
          className="market-items--publish"
          onClick={publish}
        />
      </div>
    </div>
  );
};

export default PostCreator;
