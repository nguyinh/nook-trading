import React, { useState, useRef, useEffect } from "react";
import { createPost, getNames, getALL } from "../services";
import { Button, Segment, Header, Icon, Input, Label } from "semantic-ui-react";
import bellsImage from "../res/images/bells-2.png";
import Compressor from 'compressorjs';
import { Search, Divider } from 'semantic-ui-react'
const initialState = { isLoading: false, results: [], value: '' }
var _ = require('lodash');

const PostCreator = ({ backFromCreator }) => {
  const [shopPicture, setShopPicture] = useState(null);
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [nameError, setNameError] = useState("");
  const [publishError, setPublishError] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const inputRef = useRef(null);
  const nameInputRef = useRef(null);
  const priceInputRef = useRef(null);
  const [options, setOptions] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);

  const addItemPrice = (price) => {
    const digitRegex = /^\d+$/;

    const value = price.trim();

    if (!digitRegex.test(value) && value !== "") return;

    setItemPrice(value);
    addItemToList();
  };

  const addItemToList = () => {
    if (itemName === "") {
      setNameError("Frère tu forces, indique au moins le nom de l'item");
      return;
    }
    if (items.some(({ name }) => name === itemName)) {
      setNameError("T'as déjà rentré l'item frero");
      return;
    }

    setItems([...items, { name: itemName, price: itemPrice && parseInt(itemPrice) , img: itemImage}]);
    setItemName("");
    setItemPrice("");
    setNameError("");
    /* nameInputRef.current.focus(); */
  };

  const publish = async () => {
    // if (itemName && itemPrice) addItemToList();
    if (!shopPicture) {
      setPublishError(true);
      return;
    }

    setIsPublishing(true);
    await createPost(items, new Buffer(shopPicture, "utf8"));
    setIsPublishing(false);
    setIsPublished(true);

    setTimeout(() => backFromCreator(), 1000);
  };

  const simulateInputClick = () => {
    inputRef.current.click();
  };

  const onInputChange = async (evt) => {
    const file = evt.target.files[0];
    new Compressor(file, {
      maxWidth: 500,
      maxHeight: 500,
      convertSize: 100000, // 100 kB
      quality: 0.8,
      success: blob => {
        const reader = new FileReader();

        reader.onload = async () => {
          setShopPicture(reader.result);
        };

        reader.readAsDataURL(blob);
      },
      error: err => {
        console.error(err.message);
      }
    });
  };

  const setSearchOptions = async () => {
    const formattedList = [];
    // Ask to server autocompleting datas
    getALL().then((data) => {
      data = data.filter((value) => value.french)
      data.forEach((entry) => {
        let computedID = entry.id;
        if (entry.idVariant && entry.idVariant !== "NA") {
          computedID += entry.idVariant
        }
        if (entry.french) {
          formattedList.push({key: computedID, value: computedID, title: entry.french, image: entry.image, price: entry.sell.toString() })
        }
      });
      setOptions(formattedList);
    });
  }

  useEffect(() => {
    setSearchOptions()
  }, []);

  const handleResultSelect = (e, { result }) => {
    setItemName(result.title);
    setItemImage(result.image);
    addItemPrice(result.price);
  };

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setValue(value.toLowerCase());

    setTimeout(() => {
      if (!value) {
        setIsLoading(initialState.isLoading); 
        setValue(initialState.value); 
        setResults(initialState.results);
        return;
      }
      setIsLoading(false);
      setResults(options.filter((entry) => entry.title.startsWith(value)));
    }, 300)
  }


  
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
        <div
          className="market--post--shop-picture"
          onClick={simulateInputClick}
        >
          <img src={shopPicture} className="shop-picture" />
        </div>
      ) : (
        <Segment
          placeholder
          onClick={simulateInputClick}
          className="shop-picture--input"
          style={{ backgroundColor: publishError && "#fff6f5" }}
        >
          <Header icon>
            <Icon name="plus" />
            Ajoute une photo de ton shop 📸
          </Header>
        </Segment>
      )}


      <div className="market-items--creator">
        <Header as="h3">Ajoute tes items</Header>
        
        
        {items.map(({ name, price, img }) => (
          <div className="market-items--input">
            <div className="market-items--creator--item">
              <span><img src={img}className='market-items--bell-image'/></span>
              <span className="market-items--creator--item-name">{name}</span>
              {price && (
                <>
                  <span className="market-items--creator--item-price">{`${price}`}</span>
                  <img
                    src={bellsImage}
                    className='market-items--bell-image'
                  />
                </>
              )}
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

        <div className="market-items--input-with-error">
          <div className="market-items--input">

            <Label
              icon="tag"
              iconPosition="left"
              placeholder="Nom item"
            ><Icon name="tag"></Icon>{itemName}</Label>
            
            <Label
              icon="dollar"
              iconPosition="left"
              placeholder="Prix"
              className="market-items--price-input"
            ><Icon name= "dollar"></Icon>{itemPrice}</Label>

            <Button icon color="olive" onClick={addItemToList}>
              <Icon name="plus" />
            </Button>
          </div>
          {nameError && <span>{nameError}</span>}
        </div>

        <Divider />

        <Search
          loading={isLoading}
          fluid
          placeholder= {`Cherche ton item ici`}
          minCharacters={3}
          size={"massive"}
          onResultSelect={handleResultSelect}
          onSearchChange={_.debounce(handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
      />

        <Button
          icon={isPublished}
          fluid
          primary
          size="huge"
          color={isPublished ? "green" : "blue"}
          className="market-items--publish"
          onClick={publish}
          loading={isPublishing}
          disabled={isPublishing || isPublished}
        >
          {isPublished ? <Icon name="check" /> : "Publier"}
        </Button>
      </div>
    </div>
  );
};

export default PostCreator;
