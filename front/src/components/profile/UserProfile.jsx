import React, { useState, useEffect, useRef, useContext } from "react";
import Compressor from "compressorjs";

import { uploadAvatar, updateUser } from "../../services";
import "./UserProfile.css";
import { AppContext } from "../../contexts/AppContext";
import {
  Input,
  TextArea,
  Loader,
  Dimmer,
  Button,
  Icon,
} from "semantic-ui-react";
import { ReactComponent as AvatarInput } from "../../res/images/input-avatar.svg";
import { ReactComponent as AvatarDefault } from "../../res/images/avatar-default.svg";
import { ReactComponent as Apple } from "../../res/images/apple-selection.svg";
import { ReactComponent as Cherry } from "../../res/images/cherry-selection.svg";
import { ReactComponent as Orange } from "../../res/images/orange-selection.svg";
import { ReactComponent as Peach } from "../../res/images/peach-selection.svg";
import { ReactComponent as Pear } from "../../res/images/pear-selection.svg";

const HEMISPHERES = [
  { code: "NORTH", label: "Nord" },
  { code: "SOUTH", label: "Sud" },
];

const FRUITS = [
  { code: "APPLE", component: () => <Apple className="user-fruit" /> },
  { code: "CHERRY", component: () => <Cherry className="user-fruit" /> },
  { code: "ORANGE", component: () => <Orange className="user-fruit" /> },
  { code: "PEACH", component: () => <Peach className="user-fruit" /> },
  { code: "PEAR", component: () => <Pear className="user-fruit" /> },
];

const ProfilePicture = ({ _id, pseudo, nativeFruit, avatarPicture }) => {
  const {
    state: { currentUser },
    dispatch,
  } = useContext(AppContext);

  const [userAvatar, setUserAvatar] = useState(
    avatarPicture ? Buffer.from(avatarPicture.data, "base64") : null
  );
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const inputRef = useRef(null);
  const userFruit = FRUITS.find(({ code }) => code === nativeFruit) || null;

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
          try {
            setIsAvatarLoading(true);

            const user = await uploadAvatar(new Buffer(reader.result, "utf8"));

            setUserAvatar(reader.result);

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
              onClick={() => _id === currentUser._id && inputRef.current.click()}
            />
          ) : currentUser._id === _id ? (
            <AvatarInput onClick={() => _id === currentUser._id && inputRef.current.click()} />
          ) : (
            <AvatarDefault />
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

const NookInput = ({
  label,
  placeholder,
  textArea,
  value,
  onChange,
  disabled,
  onClick,
}) => {
  return (
    <div className="nook-input-container" onClick={onClick}>
      <span className="nook-input--label">{label}</span>

      {textArea ? (
        <TextArea
          placeholder={placeholder}
          className="nook-text-area"
          value={value}
          disabled={disabled}
          onChange={(_, { value }) => onChange(value)}
        />
      ) : (
        <Input
          className="profile-input nook-input"
          width={12}
          placeholder={placeholder}
          name="pseudo"
          value={value}
          disabled={disabled}
          onFocus={onClick}
          onChange={(_, { value }) => onChange(value)}
        />
      )}
    </div>
  );
};

const HemisphereButton = ({ active, children, onClick }) => (
  <button
    style={active ? { border: "solid 3px #E2AE65", opacity: 1 } : null}
    onClick={onClick}
  >
    {children}
  </button>
);

const UserProfile = ({ userData }) => {
  const {
    state: { currentUser },
    dispatch,
  } = useContext(AppContext);

  const [userProfile, setUserProfile] = useState(userData || currentUser);

  const [editMode, setEditMode] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [savingButtonDisabled, setSavingButtonDisabled] = useState(false);
  const [savingButtonContent, setSavingButtonContent] = useState("Enregistrer");
  // TODO: update native fruit
  const [nativeFruit, setNativeFruit] = useState(userProfile.nativeFruit);
  const [islandName, setIslandName] = useState(userProfile.islandName);
  const [hemisphere, setHemisphere] = useState(userProfile.hemisphere);
  const [hemisphereEdit, setHemisphereEdit] = useState(false);
  const [friendCode, setFriendCode] = useState(userProfile.friendCode);
  const [profileDescription, setProfileDescription] = useState(
    userProfile.profileDescription
  );

  const updateProfile = async () => {
    try {
      setIsSavingChanges(true);
      setSavingButtonContent("Transmission des données à des sociétés tierces 👨‍💻");
      setSavingButtonDisabled(true);
      const user = await updateUser(
        nativeFruit,
        islandName,
        hemisphere,
        friendCode,
        profileDescription
      );

      dispatch({ type: "SET_USER", user });
      setSavingButtonContent(<Icon name="check" />);
    } catch (err) {
      setSavingButtonDisabled(false);
      setEditMode(false);
      setSavingButtonContent("Enregistrer");
      console.log(err);
    } finally {
      setTimeout(() => {
        setSavingButtonDisabled(false);
        setEditMode(false);
        setSavingButtonContent("Enregistrer");
      }, 2000);
      setIsSavingChanges(false);
    }
  };

  useEffect(() => {
    setEditMode(
      userProfile.nativeFruit !== nativeFruit ||
        userProfile.islandName !== islandName ||
        userProfile.hemisphere !== hemisphere ||
        userProfile.friendCode !== friendCode ||
        userProfile.profileDescription !== profileDescription
    );
  }, [islandName, hemisphere, friendCode, profileDescription]);

  const userHemisphere = HEMISPHERES.find(({ code }) => hemisphere === code);

  return (
    <div className="user-profile-container">
      <ProfilePicture
        _id={userProfile._id}
        pseudo={userProfile.pseudo}
        nativeFruit={userProfile.nativeFruit}
        avatarPicture={userProfile.avatar}
      />

      {editMode && (
        <Button
          onClick={updateProfile}
          loading={isSavingChanges}
          disabled={savingButtonDisabled}
          color="green"
          style={{ margin: "1rem 0" }}
        >
          {savingButtonContent}
        </Button>
      )}

      <NookInput
        label="Nom de l'île"
        placeholder="Nom de l'île"
        disabled={!!userData}
        value={islandName}
        onChange={setIslandName}
      />

      {hemisphereEdit ? (
        <div className="hemisphere-buttons">
          <HemisphereButton
            active={hemisphere === "NORTH"}
            onClick={() => {
              setHemisphere("NORTH");
              setHemisphereEdit(false);
            }}
          >
            Nord
          </HemisphereButton>
          <HemisphereButton
            active={hemisphere === "SOUTH"}
            onClick={() => {
              setHemisphere("SOUTH");
              setHemisphereEdit(false);
            }}
          >
            Sud
          </HemisphereButton>
        </div>
      ) : (
        <NookInput
          label="Hemisphere"
          placeholder="Hemisphere"
          disabled={!!userData}
          value={userHemisphere && userHemisphere.label}
          onClick={() => !userData && setHemisphereEdit(true)}
        />
      )}

      <NookInput
        label="Code ami"
        placeholder="Code ami"
        disabled={!!userData}
        value={friendCode}
        onChange={setFriendCode}
      />

      <NookInput
        label="More ?"
        placeholder="Nookazon link / horaires de l'île..."
        textArea
        disabled={!!userData}
        value={profileDescription}
        onChange={setProfileDescription}
      />
    </div>
  );
};

export default UserProfile;
