const Discord = require('discord.js')
const { description } = require('./help')
const Axios = require("axios");
const { TokenTwitter } = require('../config.local.json')

module.exports = {
    name : 'followers',
    description : 'Donne le nombre de followers',

    async execute(message , args , client){
        
          let response = await Axios.get(`https://api.twitter.com/2/users/by/username/${args[0]}?user.fields=id,name,username,public_metrics` , {
            headers: {
                Authorization: `Bearer ${TokenTwitter}`
            }
          })

          NbrFollow = response.data.data.public_metrics.followers_count
         const embedFollow = new Discord.MessageEmbed()
          .setDescription(`**${args[0]} a ${NbrFollow} followers sur Twitter**`)

          let msgfollow = await message.channel.send({embeds : [embedFollow]})
    }   
}