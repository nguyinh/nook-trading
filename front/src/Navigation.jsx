import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import "./Navigation.css";
import { ReactComponent as MenuIcon } from "./res/images/menu-icon.svg";
import { ReactComponent as NookTrading } from "./res/images/nook-trading.svg";
import { ReactComponent as MarketIcon } from "./res/images/market-menu-icon.svg";
import { ReactComponent as TurnipIcon } from "./res/images/turnip-menu-icon.svg";
import { ReactComponent as ProfileIcon } from "./res/images/profile-menu-icon.svg";
import { CSSTransition } from "react-transition-group";

const AppMenu = ({ useMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useMenu;
  const [isMenuRendered, setIsMenuRendered] = useState(isMenuOpen);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (!isMenuOpen) {
      // Set timeout to remove AppMenu from DOM
      setTimer(
        setTimeout(() => {
          setIsMenuRendered(false);
        }, 300)
      );
    } else {
      // Remove timeout if menu re-opened
      if (timer) clearTimeout(timer);
      setIsMenuRendered(true);
    }
  }, [isMenuOpen]);

  return (
    <div
      className="app-menu-baseline"
      style={{ display: isMenuRendered ? "block" : "none" }}
    >
      <div className="app-menu-relative">
        <CSSTransition
          in={isMenuOpen}
          unmountOnExit
          timeout={300}
          classNames="app-menu-anim"
        >
          <div className="app-menu-container">
            <div className="app-menu-icons-container">
              <div className="app-menu-icon-row">
                <div className="app-menu-icon-col">
                  <Link to="/market">
                    <MarketIcon onClick={() => setIsMenuOpen(false)} />
                  </Link>
                </div>
                <div className="app-menu-icon-col">
                  <Link to="/turnip-trend">
                    <TurnipIcon onClick={() => setIsMenuOpen(false)} />
                  </Link>
                </div>
                <div className="app-menu-icon-col">
                  <Link to="/profile">
                    <ProfileIcon onClick={() => setIsMenuOpen(false)} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

const Navigation = () => {
  let { pathname } = useLocation();
  let [isMenuOpen, setIsMenuOpen] = useState();

  return (
    <>
      <AppMenu useMenu={[isMenuOpen, setIsMenuOpen]} />

      <div className="navbar">
        <Link to="/">
          <NookTrading />
        </Link>
        <MenuIcon
          className="menu-icon-svg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>
    </>
  );
};

export default Navigation;
