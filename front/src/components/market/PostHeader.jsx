import React from "react";
import { Link } from "react-router-dom";
import { Header, Dropdown } from "semantic-ui-react";
import { ReactComponent as DotsMenu } from "../../res/images/dots.svg";
import { ReactComponent as DiscordIcon } from "../../res/images/discord-icon-purple.svg";

const PostHeader = ({ currentUser, author, postId, deletePost}) => {
  const sendDiscordDM = () => {
    window.open(`https://discordapp.com/users/${author.discord.id}`);
  };

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
      {author.pseudo === currentUser.pseudo ? (
        <Dropdown icon={<DotsMenu />} direction="left" style={{ padding: 0 }}>
          <Dropdown.Menu>
            <Dropdown.Item
              text="Supprimer"
              icon="trash"
              onClick={() => deletePost(postId, author._id)}
            />
          </Dropdown.Menu>
        </Dropdown>
      )
    : (
      author.discord && <DiscordIcon onClick={sendDiscordDM}/>
    )}
    </div>
  );
};

export default PostHeader;
