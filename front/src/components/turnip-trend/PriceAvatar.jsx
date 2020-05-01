import React from "react";

import AvatarDefault from "../../res/images/avatar-default.png";

const PriceAvatar = ({ src }) => (
  <div className="price--author-avatar--container">
    <img className="price--author-avatar" src={src || AvatarDefault} />
  </div>
);

export default PriceAvatar;
