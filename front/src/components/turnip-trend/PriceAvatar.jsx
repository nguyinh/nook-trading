import React from "react";

import AvatarDefault from "../../res/images/avatar-default.png";

const PriceAvatar = ({ src, onClick }) => (
  <div className="price--author-avatar--container" onClick={onClick}>
    <img className="price--author-avatar" src={src || AvatarDefault} alt='avatar'/>
  </div>
);

export default PriceAvatar;
