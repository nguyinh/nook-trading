export default ({ author, ...rest }) => ({
  ...rest,
  author: {
    ...author,
    avatar: author.avatar ? Buffer.from(author.avatar.data, "base64") : null,
  },
});