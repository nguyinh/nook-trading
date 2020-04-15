import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";

const Navigation = () => {
  let { pathname } = useLocation();
  return (
    <nav className="navigation-bar">
      <Menu widths={3}>
        <Menu.Item name="home" active={pathname === "/"}>
          <Link to="/market">
            <Icon name="home" />
            Home
          </Link>
        </Menu.Item>
        <Menu.Item name="messages" active={pathname === "/navet-trend"}>
          <Link to="/navet-trend">
            <Icon name="leaf" />
            Cours Navet
          </Link>
        </Menu.Item>
        <Menu.Item name="messages" active={pathname === "/profile"}>
          <Link to="/profile">
            <Icon name="user" />
            Profile
          </Link>
        </Menu.Item>
      </Menu>
    </nav>
  );
};

export default Navigation;
