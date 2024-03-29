import React, { useState, useContext } from "react";
import { Loader } from "semantic-ui-react";

import { TurnipContext } from "../../contexts";
import { setOwnedQuantity, setOwnedPrice } from "../../services";
import { getLastSunday } from '../../utils';
import { ReactComponent as BellsPerTurnip } from "../../res/images/bells-per-turnip-2.svg";
import { ReactComponent as Turnip } from "../../res/images/turnip-flat.svg";
import { ReactComponent as Check } from "../../res/images/little-check.svg";

const TurnipOwnedInput = ({ turnipsOwned, turnipsOwnedValue }) => {
  const { dispatch } = useContext(TurnipContext);
  
  const [isSavingQuantity, setIsSavingQuantity] = useState(false);
  const [isDefaultQuantityLabel, setIsDefaultQuantityLabel] = useState(true);
  const [quantityTimer, setQuantityTimer] = useState(null);

  const [isSavingPrice, setIsSavingPrice] = useState(false);
  const [isDefaultPriceLabel, setIsDefaultPriceLabel] = useState(true);
  const [priceTimer, setPriceTimer] = useState(null);

  const handleChangedQuantity = (value) => {
    const saveTurnipQuantity = async (newQuantity) => {
      try {
        setIsSavingQuantity(true);

        const trend = await setOwnedQuantity(
          getLastSunday(),
          newQuantity
        );

        setIsDefaultQuantityLabel(false);

        dispatch({ type: "UPDATE_TREND", trend });
      } catch (err) {
        console.log(err);
      } finally {
        setIsSavingQuantity(false);
      }
    };

    if (quantityTimer) clearTimeout(quantityTimer);
    if (value) {
      setQuantityTimer(setTimeout(() => saveTurnipQuantity(value), 1000));
    }
  };

  const handleChangedPrice = (value) => {
    const saveTurnipPrice = async (newPrice) => {
      try {
        setIsSavingPrice(true);
        
        const trend = await setOwnedPrice(
          getLastSunday(),
          newPrice
        );

        setIsDefaultPriceLabel(false);

        dispatch({ type: "UPDATE_TREND", trend });
      } catch (err) {
        console.log(err);
      } finally {
        setIsSavingPrice(false);
      }
    };

    if (priceTimer) clearTimeout(priceTimer);
    if (value) {
      setPriceTimer(setTimeout(() => saveTurnipPrice(value), 1000));
    }
  };

  return (
    <div className="turnip-input--container">
      <span>Combien de navets as-tu achete pour cette semaine ?</span>

      <div className="turnip-input" style={{marginBottom: '2rem'}}>
        <Turnip style={{margin: '0.1rem 0px'}}/>
        <input
          type="number"
          pattern="\d*"
          id="turnip-quantity-input"
          name="turnip-quantity-input"
          defaultValue={turnipsOwned}
          onChange={(e) => handleChangedQuantity(e.target.value)}
        />
        <span className="turnip-input--label">
          {isSavingQuantity ? (
            <Loader active inline size="mini" />
          ) : isDefaultQuantityLabel ? (
            "nombre"
          ) : (
            <Check style={{ marginBottom: "-2px" }} />
          )}
        </span>
      </div>
      

      <span>Quel etait le prix du navet ?</span>

      <div className="turnip-input">
        <BellsPerTurnip />
        <input
          type="number"
          pattern="\d*"
          id="unitary-turnip-price-input"
          name="unitary-turnip-price-input"
          defaultValue={turnipsOwnedValue}
          onChange={(e) => handleChangedPrice(e.target.value)}
        />
        <span className="turnip-input--label">
          {isSavingPrice ? (
            <Loader active inline size="mini" />
          ) : isDefaultPriceLabel ? (
            "prix unitaire"
          ) : (
            <Check style={{ marginBottom: "-2px" }} />
          )}
        </span>
      </div>
    </div>
  );
};

export default TurnipOwnedInput;
