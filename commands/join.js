const Discord = require("discord.js");
const config = require('.././config.json');
const google = require("googleapis");
const ytdl = require("ytdl-core");
const YT = new google.youtube_v3.Youtube({
  version: 'v3',
  auth: config.googleKey
});
 

exports.run = async (client, message, args) => {
  if (message.member.voice.channel){
        config.servidores.serve.con = await message.member.voice.channel.join();    
      }
  let oQueTocar = message.content.slice(6);
  if(oQueTocar.length === 0){
    message.channel.send("O que devo Tocar? (Adicione um link ou o nome da musica!)");
    return;
  }else{
    if(ytdl.validateURL(oQueTocar)){
      config.servidores.serve.fila.push(oQueTocar);
      tocaMusicas();
    }else{
      YT.search.list({
        q: oQueTocar,
        part: 'snippet',
        fields: 'items(id(videoId),snippet(title,channelTitle))',
        type: 'video'
        }, function(err,resultado){
        if(err){
          console.log(err);
        }
        if(resultado){
          const listaResultados = [];
          for(let i in resultado.data.items){
            const montaItem = {
              'tituloVideo': resultado.data.items[i].snippet.title,
              'nomeCanal': resultado.data.items[i].snippet.channelTitle,
              'id': 'https://www.youtube.com/watch?v=' + resultado.data.items[i].id.videoId
            }
          listaResultados.push(montaItem);
          }
          const embed = new Discord.MessageEmbed()
          .setColor("5567ED")
          .setAuthor("Autor: Chitos")
          .setDescription("Escolha sua musica!");
          for(let i in listaResultados){
            embed.addField(
            `${parseInt(i)+1}: ${listaResultados[i].tituloVideo}`,
            listaResultados[i].nomeCanal);
          }
          message.channel.send(embed)
          .then((embedMessage)=>{
            const possiveisReacoes = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣']
          for(let i = 0; i<possiveisReacoes.length; i++){
            embedMessage.react(possiveisReacoes[i]);
          }

          const filtro = (reaction, user) =>{
            return possiveisReacoes.includes(reaction.emoji.name) &&
            user.id === message.author.id;
          }

          embedMessage.awaitReactions(filtro,{max:1, time:100000, errors:['time']})
          .then((collected)=>{
            const reaction = collected.first();
            const idOpcaoEscolhida = possiveisReacoes.indexOf(reaction.emoji.name);
            message.channel.send(`Você escolheu ${listaResultados[idOpcaoEscolhida].tituloVideo} de ${listaResultados[idOpcaoEscolhida].nomeCanal} o link é ${listaResultados[idOpcaoEscolhida].id}`);
            config.servidores.serve.fila.push(listaResultados[idOpcaoEscolhida].id);
            tocaMusicas();
          }).catch((error)=>{
            message.reply("Você não escolheu uma opção valida");
          });
          });

        }
        });
    }
  }
};


const tocaMusicas = () =>{
  if(config.servidores.serve.estouTocando === false){
    const tocando = config.servidores.serve.fila[0];
    config.servidores.serve.estouTocando = true;
    config.servidores.serve.dispatcher = config.servidores.serve.con.play(ytdl(tocando));
    config.servidores.serve.dispatcher.on('finish',()=>{
      config.servidores.serve.fila.shift();
      config.servidores.serve.estouTocando = false;
      if(config.servidores.serve.fila.length > 0){
        tocaMusicas();
      }else{
        config.servidores.serve.dispatcher = null;
      }
    });
  }
}