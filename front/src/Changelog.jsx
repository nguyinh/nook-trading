import React, { useContext } from "react";
import "./Changelog.css";
import { Header, List } from "semantic-ui-react";
import { AppContext } from "./contexts/AppContext";

const Changelog = () => {
  const {
    state: { currentVersion },
    dispatch,
  } = useContext(AppContext);

  return (
    <>
      {(currentVersion && !!currentVersion.changelogs.length) && (
        <div
          className="changelog-background"
          onClick={() => dispatch({ type: "VALID_VERSION" })}
        >
          <div className="changelog-baseline">
            <div className="changelog-content-container">
              <Header as="h2">{`What's new in ${currentVersion.number}`}</Header>
              <List>
                {currentVersion.changelogs.map((log) => (
                  <List.Item>{log}</List.Item>
                ))}
              </List>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Changelog;
