import React, { useContext, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import "./Changelog.css";
import { Header, List } from "semantic-ui-react";
import { AppContext } from "./contexts/AppContext";
import { ReactComponent as LeafIcon } from "./res/images/leaf-icon.svg";
import { ReactComponent as NookHead } from "./res/images/nook-head.svg";

const Changelog = () => {
  const {
    state: { currentVersion, currentUser },
    dispatch,
  } = useContext(AppContext);

  const [islandName, setIslandName] = useState("");
  const [number, setNumber] = useState("");
  const [preMessage, setPreMessage] = useState("");
  const [changelogs, setChangelogs] = useState([]);
  const [postMessage, setPostMessage] = useState("");

  useEffect(() => {
    if (currentVersion) {
      setIslandName(currentUser.islandName);
      setNumber(currentVersion.number);
      setPreMessage(currentVersion.preMessage);
      setChangelogs(currentVersion.changelogs);
      setPostMessage(currentVersion.postMessage);
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
            <div>
              <Header as="h2">{`What's new in ${number} ?`}</Header>

              <div className="changelog--pre-message--container">
                <span className="changelog--pre-message">{`Cher resident${
                  islandName ? " de " : ""
                }`}</span>
                <span style={{ color: "#ec8fc4" }}>{islandName}</span>
                <span>{`, ${preMessage}`}</span>
              </div>

              {changelogs.map((log) => (
                <div className="changelog--log--container">
                  <LeafIcon style={{ marginRight: "1rem" }} />{" "}
                  <span style={{ flex: 20, fontSize: "1.1rem" }}>{log}</span>
                </div>
              ))}

              <div className="changelog--post-message--container">
                <span className="changelog--post-message">{`${postMessage || 'A bientot !'}`}</span>{" "}
                <NookHead className="nook-head" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Changelog;
