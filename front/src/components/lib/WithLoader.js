import React from "react";
import { Loader } from 'semantic-ui-react';

const WithLoader = ({ active, children }) => {
  return (
    <>
      {active ? (
        <Loader
          active
          inline="centered"
          size="big"
          style={{ marginTop: "5rem" }}
        >
          Recherche du correspondant{" "}
          <span role="img" aria-label="hold-emoji">
            ✋
          </span>
        </Loader>
      ) : (
        children
      )}
    </>
  );
};

export default WithLoader;
