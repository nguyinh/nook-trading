import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header, Dropdown, Dimmer, Loader } from "semantic-ui-react";
import { ReactComponent as DotsMenu } from "../../res/images/dots.svg";

const PostHeader = ({ currentUser, author, postId, deletePost}) => {
  return (
    <div className="market-post--header">
      <Header as="h3" style={{ fontWeight: 400 }}>
        {author.pseudo === currentUser.pseudo ? (
          "Ton shop ✨"
        ) : (
          <>
            <b>
              <Link to={`/profile/${author.pseudo}`}>{author.pseudo}</Link>
            </b>
            <span>{` propose`}</span>
          </>
        )}
      </Header>
      {author.pseudo === currentUser.pseudo && (
        <Dropdown icon={<DotsMenu />} direction="left" style={{ padding: 0 }}>
          <Dropdown.Menu>
            <Dropdown.Item
              text="Supprimer"
              icon="trash"
              onClick={() => deletePost(postId, author._id)}
            />
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default PostHeader;
