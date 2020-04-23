import React, { useContext, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import "./Changelog.css";
import { Header, List } from "semantic-ui-react";
import { AppContext } from "./contexts/AppContext";

const Changelog = () => {
  const {
    state: { currentVersion },
    dispatch,
  } = useContext(AppContext);

  const [number, setNumber] = useState("");
  const [changelogs, setChangelogs] = useState([]);

  useEffect(() => {
    if (currentVersion) {
      setNumber(currentVersion.number);
      setChangelogs(currentVersion.changelogs);
    }
  }, [currentVersion]);

  return (
    <CSSTransition
      in={currentVersion}
      unmountOnExit
      timeout={500}
      classNames="changelog-anim"
    >
      <div
        className="changelog-background"
        onClick={() => dispatch({ type: "VALID_VERSION" })}
      >
        <div className="changelog-baseline">
          <div className="changelog-content-container">
            <Header as="h2">{`What's new in ${number}`}</Header>
            <List>
              {changelogs.map((log) => (
                <List.Item>{log}</List.Item>
              ))}
            </List>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Changelog;
