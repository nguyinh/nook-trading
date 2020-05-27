const { MessageEmbed, MessageAttachment } = require("discord.js");
const client = require("./client");

const formatImageBuffer = buf => buf.toString("utf8").split(";base64,").pop();

const sendDM = async (userId, message, image) => {
  const user = await client.users.fetch(userId);

  const base64Image = formatImageBuffer(image.buffer);

  const attachment = new MessageAttachment(
    Buffer.from(base64Image, "base64"),
    "img.png"
  );

  return user.send(message, attachment);
};

const sendDMAsEmbed = async (userId, title, description, image) => {
  const user = await client.users.fetch(userId);

  const base64Image = formatImageBuffer(image.buffer);

  const exampleEmbed = new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .attachFiles([
      { name: "img.png", attachment: Buffer.from(base64Image, "base64") },
    ])
    .setImage("attachment://image.png");

  return user.send(exampleEmbed);
};

module.exports = {
  client,
  sendDM,
  sendDMAsEmbed,
};
