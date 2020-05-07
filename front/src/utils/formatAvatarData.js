export default ({ author, ...rest }) => ({
  ...rest,
  author: {
    ...author,
    avatar: author.avatar
      ? author.avatar.data
        ? Buffer.from(author.avatar.data, "base64")
        : author.avatar
      : null,
  },
});
