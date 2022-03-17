const Discord = require("discord.js");
const config = require('.././config.json');
const google = require("googleapis");
const ytdl = require("ytdl-core");

exports.run = async (client, message, args) => {
      message.member.voice.channel.leave();
      config.servidores.serve.con = null; 
      config.servidores.serve.dispatcher = null;    
      config.servidores.serve.estouTocando = false;
      config.servidores.serve.fila = [];
      if(config.servidores.serve.con == null){
        const embed = new Discord.MessageEmbed()
          .setColor("5567ED")
          .setAuthor("Autor: Chitos")
          .setDescription("Saio da sala de voz!");
          message.channel.send(embed)
          .then(msg => msg.delete({timeout: 5000}));
      }
}
