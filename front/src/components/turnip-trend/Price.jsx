import React, { useEffect, useState, useContext } from "react";

import "./BuyingPrice.css";
import { ReactComponent as BellsPerTurnip } from "../../res/images/bells-per-turnip.svg";

const Price = ({ price, label }) => (
  <div className="price-per-turnip--container">
    <div className="price-per-turnip">
      <span>{price}</span>

      <BellsPerTurnip />
    </div>

    <span className="price-per-turnip--label">{label}</span>
  </div>
);

export default Price;
