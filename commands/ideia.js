const Discord = require("discord.js");
const config = require('.././config.json');
exports.run = async (client, message, args) => {
message.delete();
const content = args.join(" ");

if (!args[0]) {
  return message.channel.send(`${message.author.username}, escreva a sugestão após o comando`)
} else if (content.length > 1000) {
  return message.channel.send(`${message.author.username}, forneça uma sugestão de no máximo 1000 caracteres.`);
} else {
  const msg = await message.channel.send(
    new Discord.MessageEmbed()
    .setColor("5567ED")
    .addField("Autor:", message.author)
    .addField("Conteúdo", content)
    .setTimestamp()
  );
  await message.channel.send(`${message.author} a mensagem foi enviada com sucesso!`);

  const emojis = ["✔️", "❎"];

  for (const i in emojis) {
    await msg.react(emojis[i])
  }
}
};