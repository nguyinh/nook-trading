import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";

const Navigation = () => {
  let { pathname } = useLocation();
  console.log(pathname)
  return (
    <nav className="navigation-bar">
      <Menu widths={3}>
        <Menu.Item name="market" active={pathname === "/market"}>
          <Link to="/market"  style={{color: 'black'}}>
            <Icon name="bullhorn" />
            Marché
          </Link>
        </Menu.Item>
        <Menu.Item name="messages" active={pathname === "/turnip-trend"}>
          <Link to="/turnip-trend" style={{color: 'black'}}>
            <Icon name="leaf" />
            Cours Navet
          </Link>
        </Menu.Item>
        <Menu.Item name="messages" active={pathname === "/profile"}>
          <Link to="/profile" style={{color: 'black'}}>
            <Icon name="user" />
            Profil
          </Link>
        </Menu.Item>
      </Menu>
    </nav>
  );
};

export default Navigation;
