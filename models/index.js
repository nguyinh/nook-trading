const User = require("./User");
console.log(User);
module.exports = {
  User,
  Post: require("./Post"),
  Item: require("./Item"),
};
