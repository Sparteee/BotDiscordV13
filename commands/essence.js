const { MessageActionRow, MessageEmbed } = require("discord.js");
const Axios = require("axios");
const { MessageSelectMenu} = require('discord.js');

module.exports = {
    name:'essence',
    description : 'Voir les prix des carburants',
    async execute(message,args,client){
		const filter = () => true
        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Choisir un lieu')
					.addOptions([
						{
							label: 'Saint Savinien - 17350',
							description: 'Voir les prix des carburants de Saint Savinien',
							value: 'Saint-Savinien',
						},
						{
							label: 'Angoulins - 17690',
							description: 'Voir les prix des carburants d\'\Angoulins',
							value: 'Angoulins',
						},
						{
							label : 'Saintes - 17100',
							description : 'Voir les prix des carburants de Saintes',
							value : 'Saintes'
						},
						{
							label : 'Aytré - 17440',
							description: 'Voir les prix des carburants de Aytré',
							value: 'Aytré'
						},
						{
							label : 'Saint Jean d\'\Angély - 17400',
							description : 'Voir les prix des carburants de Saint Jean d\'\Angély',
							value : 'Saint-Jean-d\'\Angély'
						}
					]),
			
			);
			
                   let msg = await message.reply({components: [row] })
				   let reponse = await msg.awaitMessageComponent({ filter, componentType: 'SELECT_MENU' })

				   
				   let response = await Axios.get(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=prix_des_carburants_j_7&q=&refine.city=${reponse.values[0].toUpperCase()}`)
				 
					let data = response.data.records
					let desc = ""
					const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

					let condition = data.length > 10 ? 10 : data.length

					// console.log(data)

					for(i = 0; i < condition; i++){
						const update = new Date(data[i].fields.update)
						desc += `**${data[i].fields.name} **\n\n**Adresse de la station : **${data[i].fields.address}\n** Marque : **${data[i].fields.brand}\n**Prix Gazole : ** ${data[i].fields.price_gazole *1000} €\n** Prix SP98 : ** ${data[i].fields.price_sp98 *1000} €\n**Prix SP95 : ** ${data[i].fields.price_sp95*1000} € **\n Prix E10 : ** ${data[i].fields.price_e10 *1000} €\n** Prix Éthanol : ** ${data[i].fields.price_e85*1000} €\n** Prix GPL : ** ${data[i].fields.price_gplc*1000} €\n\n**Mise à jour des données : ** ${update.toLocaleDateString(undefined,  options)}\n\n----------------------\n\n`
						// console.log(data[i].fields)
					}

					const embedStation = new MessageEmbed()
					.setTitle(`${reponse.values[0]}`)
					.setDescription(desc)
					.setFooter("Demandé par : " + message.member.user.tag , message.author.displayAvatarURL({dynamic: true}))
					
					let msgembed = await message.channel.send({embeds : [embedStation]})
				
					setTimeout(() => {
						msgembed.delete()
					}, 45000);
					msg.delete()
    }   
    
}