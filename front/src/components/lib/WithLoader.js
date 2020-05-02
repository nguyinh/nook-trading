import React from "react";
import { Loader } from 'semantic-ui-react';

const WithLoader = ({ active, content, children }) => {
  return (
    <>
      {active ? (
        <Loader
          active
          inline="centered"
          size="big"
          style={{ marginTop: "5rem" }}
        >
          {content}
        </Loader>
      ) : (
        children
      )}
    </>
  );
};

export default WithLoader;
