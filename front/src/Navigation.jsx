import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import "./Navigation.css";
import { ReactComponent as MenuIcon } from "./res/images/menu-icon.svg";
import { ReactComponent as NookTrading } from "./res/images/nook-trading.svg";
import { ReactComponent as MarketIcon } from "./res/images/market-menu-icon.svg";
import { ReactComponent as TurnipIcon } from "./res/images/turnip-menu-icon.svg";
import { ReactComponent as ProfileIcon } from "./res/images/profile-menu-icon.svg";
import { CSSTransition } from "react-transition-group";

const AppMenu = ({ isMenuOpen }) => {
  return (
    <div className="app-menu-baseline">
      <div className="app-menu-relative">
        <CSSTransition
          in={isMenuOpen}
          unmountOnExit
          timeout={500}
          classNames="app-menu-anim"
        >
          <div className="app-menu-container">
            <div className="app-menu-icons-container">
              <div className="app-menu-icon-row">
                <div className="app-menu-icon-col">
                  <MarketIcon />
                </div>
                <div className="app-menu-icon-col">
                  <TurnipIcon />
                </div>
                <div className="app-menu-icon-col">
                  <ProfileIcon />
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
      {/* <CSSTransition
        in={isMenuOpen}
        unmountOnExit
        timeout={500}
        classNames="app-menu-anim"
      >
        <div className="app-menu-container">
          <div className="app-menu-icons-container">
            <div className="app-menu-icon-row">
              <div className="app-menu-icon-col">
                <MarketIcon />
              </div>
              <div className="app-menu-icon-col">
                <TurnipIcon />
              </div>
              <div className="app-menu-icon-col">
                <ProfileIcon />
              </div>
            </div>
          </div>
        </div>
      </CSSTransition> */}
    </div>
  );
};

{
  /* <div className="app-menu-baseline">
<CSSTransition
  in={isMenuOpen}
  unmountOnExit
  timeout={500}
  classNames="app-menu-anim"
>
  <div className="app-menu-container">
    <div className="app-menu-icons-container">
      <div className="app-menu-icon-row">
        <div className="app-menu-icon-col">
          <MarketIcon />
        </div>
        <div className="app-menu-icon-col">
          <TurnipIcon />
        </div>
        <div className="app-menu-icon-col">
          <ProfileIcon />
        </div>
      </div>
    </div>
  </div>
</CSSTransition>
</div> */
}

const Navigation = () => {
  let { pathname } = useLocation();
  let [isMenuOpen, setIsMenuOpen] = useState();

  return (
    <>
      <AppMenu isMenuOpen={isMenuOpen} />

      <div className="navbar">
        <NookTrading />
        <MenuIcon
          className="menu-icon-svg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>
    </>
    // <nav className="navigation-bar">
    //   <Menu widths={3} className='navigation-bar--menu'>
    //     <Menu.Item name="market" className='navigation-bar--item' active={pathname === "/market"}>
    //       <Link to="/market"  style={{color: 'black'}}>
    //         <Icon name="shopping basket" />
    //         Marché
    //       </Link>
    //     </Menu.Item>
    //     <Menu.Item name="messages" className='navigation-bar--item' active={pathname === "/turnip-trend"}>
    //       <Link to="/turnip-trend" style={{color: 'black'}}>
    //         <Icon name="leaf" />
    //         Cours Navet
    //       </Link>
    //     </Menu.Item>
    //     <Menu.Item name="messages" className='navigation-bar--item' active={pathname === "/profile"}>
    //       <Link to="/profile" style={{color: 'black'}}>
    //         <Icon name="user" />
    //         Profil
    //       </Link>
    //     </Menu.Item>
    //   </Menu>
    // </nav>
  );
};

export default Navigation;
