import React, { useEffect, useState, useContext } from "react";

const TurnipsOwned = ({ trend }) => {
  return (
    <div className="turnips-owned--container">

      <div className="turnips-owned--questions-inputs">
        <div className="turnips-owned--input-row">
          <span className="turnip-owned--label-question">Quantite</span>

          <input
            className="turnip-owned--input large"
            placeholder="..."
            defaultValue="XX"
            type="number"
            pattern="\d*"
          />
        </div>

        <div className="turnips-owned--input-row">
          <span className="turnip-owned--label-question">Prix par navet</span>

          <input
            className="turnip-owned--input"
            placeholder="..."
            defaultValue="XX"
            type="number"
            pattern="\d*"
          />
        </div>
      </div>

      <span className="turnips-owned--label">Tes navets</span>
    </div>
  );
};

export default TurnipsOwned;
