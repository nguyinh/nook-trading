import React, { useState, useRef, useContext } from "react";
import Compressor from "compressorjs";

import { uploadAvatar } from "../../services";
import "./UserProfile.css";
import { AppContext } from "../../contexts/AppContext";
import { Input, TextArea, Loader, Dimmer } from "semantic-ui-react";
import { ReactComponent as AvatarInput } from "../../res/images/input-avatar.svg";
import { ReactComponent as Apple } from "../../res/images/apple-selection.svg";
import { ReactComponent as Cherry } from "../../res/images/cherry-selection.svg";
import { ReactComponent as Orange } from "../../res/images/orange-selection.svg";
import { ReactComponent as Peach } from "../../res/images/peach-selection.svg";
import { ReactComponent as Pear } from "../../res/images/pear-selection.svg";

const HEMISPHERES = [
  { code: "NORTH", label: "Nord" },
  { code: "SOUTH", label: "Sud" },
  { code: "", label: "Pas précisé" },
];

const FRUITS = [
  { code: "APPLE", component: () => <Apple className="user-fruit" /> },
  { code: "CHERRY", component: () => <Cherry className="user-fruit" /> },
  { code: "ORANGE", component: () => <Orange className="user-fruit" /> },
  { code: "PEACH", component: () => <Peach className="user-fruit" /> },
  { code: "PEAR", component: () => <Pear className="user-fruit" /> },
  { code: "", label: "Pas précisé" },
];

const ProfilePicture = ({ pseudo, nativeFruit, avatarPicture }) => {
  const {
    dispatch,
  } = useContext(AppContext);

  const [userAvatar, setUserAvatar] = useState(
    avatarPicture ? Buffer.from(avatarPicture.data, "base64") : null
  );
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const inputRef = useRef(null);
  const userFruit =
    FRUITS.find(({ code, component }) => code === nativeFruit) || null;

  const onInputChange = async (evt) => {
    const file = evt.target.files[0];

    new Compressor(file, {
      width: 100,
      height: 100,
      minWidth: 100,
      minHeight: 100,
      convertSize: 1000000, // 1000 kB
      quality: 0.8,
      success: (blob) => {
        const reader = new FileReader();

        reader.onload = async () => {
          setUserAvatar(reader.result);
          try {
            setIsAvatarLoading(true);

            const user = await uploadAvatar(new Buffer(reader.result, "utf8"));

            dispatch({ type: "SET_USER", user });
          } catch (err) {
            console.log(err);
          } finally {
            setIsAvatarLoading(false);
          }
        };

        reader.readAsDataURL(blob);
      },
      error: (err) => {
        console.error(err.message);
      },
    });
  };

  return (
    <div className="avatar-baseline">
      <div className="avatar-container">
        <div className="avatar-input">
          <Dimmer active={isAvatarLoading} className="rounded-borders">
            <Loader />
          </Dimmer>
          {userAvatar ? (
            <img
              src={userAvatar}
              className="user-avatar-image"
              onClick={() => inputRef.current.click()}
            />
          ) : (
            <AvatarInput onClick={() => inputRef.current.click()} />
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onInputChange}
            style={{ visibility: "hidden", display: "none" }}
          />

          {userFruit && userFruit.component()}
        </div>
        <span className="avatar--pseudo">{pseudo}</span>
      </div>
    </div>
  );
};

const NookInput = ({ label, placeholder, textArea, value, disabled }) => {
  return (
    <div className="nook-input-container">
      <span className="nook-input--label">{label}</span>

      {textArea ? (
        <TextArea
          placeholder={placeholder}
          className="nook-text-area"
          value={value}
          disabled={disabled}
        />
      ) : (
        <Input
          className="profile-input nook-input"
          width={12}
          placeholder={placeholder}
          name="pseudo"
          value={value}
          disabled={disabled}
          // onChange={(_, { value }) => setPseudo(value)}
        />
      )}
    </div>
  );
};

const UserProfile = () => {
  const {
    state: { currentUser, isAutoConnecting },
    dispatch,
  } = useContext(AppContext);

  const userHemisphere = HEMISPHERES.find(
    ({ code }) => currentUser.hemisphere === code
  );

  return (
    <div className="user-profile-container">
      <ProfilePicture
        pseudo={currentUser.pseudo}
        nativeFruit={currentUser.nativeFruit}
        avatarPicture={currentUser.avatar}
      />

      <NookInput
        label="Nom de l'île"
        placeholder="Nom de l'île"
        disabled
        value={currentUser.islandName || "Pas précisé"}
      />

      <NookInput
        label="Hemisphere"
        placeholder="Hemisphere"
        disabled
        value={userHemisphere ? userHemisphere.label : "Pas précisé"}
      />

      <NookInput
        label="Code ami"
        placeholder="Code ami"
        disabled
        value={currentUser.friendCode || "Pas précisé"}
      />

      <NookInput
        label="More ?"
        placeholder="Nookazon link / horaires de l'île..."
        textArea
        disabled
        value={currentUser.profileDescription}
      />
    </div>
  );
};

export default UserProfile;
