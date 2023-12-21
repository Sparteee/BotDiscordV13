const Discord = require('discord.js');

module.exports = {
  name: 'clear',
  description: 'Supprime les messages',
  execute(message, args) {
    const nbClear = args[0];
    const embedclear = new Discord.MessageEmbed()
      .setFooter(`Demandé par : ${message.member.user.tag}, ${message.author.displayAvatarURL({ dynamic: true })}`);
    if (!args.length) {
      return message.channel.send({ embeds: [embedclear.setDescription('**Précisez le nombre de messages que vous voulez supprimés !**')] });
    }

    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      return message.channel.send({ embeds: [embedclear.setDescription("**Vous n'avez pas la permission d'utiliser cette commande !**")] });
    }

    if (nbClear > 2 || nbClear < 100) {
      message.channel.bulkDelete(nbClear).then(() => {
        message.channel.send({ embeds: [embedclear.setDescription(`**${nbClear} messages supprimés !**`)] });
      });
    }
    return true;
  },
};
