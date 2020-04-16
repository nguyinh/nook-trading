import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";

const Navigation = () => {
  let { pathname } = useLocation();
  return (
    <nav className="navigation-bar">
      <Menu widths={3}>
        <Menu.Item name="market" active={pathname === "/"}>
          <Link to="/market">
            <Icon name="bullhorn" />
            Market
          </Link>
        </Menu.Item>
        <Menu.Item name="messages" active={pathname === "/navet-trend"}>
          <Link to="/turnip-trend">
            <Icon name="leaf" />
            Cours Navet
          </Link>
        </Menu.Item>
        <Menu.Item name="messages" active={pathname === "/profile"}>
          <Link to="/profile">
            <Icon name="user" />
            Profil
          </Link>
        </Menu.Item>
      </Menu>
    </nav>
  );
};

export default Navigation;
