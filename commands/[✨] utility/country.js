// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefix = require('../../database/prefix.json');
const axios = require('axios');

module.exports = {
	name: 'country',
	aliases: ['countryinfo'],
	category: '[✨] utility',
	example: `${bot_prefix}country <country>`,
	usage: '<country>',
	run: async (client, message, args) => {
		if (!args.length) return message.channel.send(`The right syntax is \`${prefix[message.guild.id]}country <country>\``);
		let name = args.join(' ').toLowerCase();
		let url = `https://restcountries.eu/rest/v2/name/${name}`;
		if (name === 'usa' || name === 'united states') name = 'united states of america';
		if (name === 'india') url = `https://restcountries.eu/rest/v2/name/${name}?fullText=true`;
		const m = await message.channel.send('*Please Wait...*');

		axios({
			method: 'get',
			url: url,
		}).then(res => {
			res.data[0].flag = `https://www.countryflags.io/${res.data[0].alpha2Code}/shiny/64.png`;
			const data = res.data[0];
			const currencies = [];
			const languages = [];
			const regionalBlocs = [];
			for (let i = 0; i < data.currencies.length; i++) {
				currencies.push(data.currencies[i].name);
			}
			for (let i = 0; i < data.languages.length; i++) {
				languages.push(data.languages[i].name);
			}
			for (let i = 0; i < data.regionalBlocs.length; i++) {
				regionalBlocs.push(data.regionalBlocs[i].name);
			}

			const embed = new Discord.MessageEmbed()
				.setAuthor(data.name, data.flag)
				.setThumbnail(data.flag)
				.setColor('RANDOM')
				.addField('Country Information', `**• Name:** ${data.name}\n**• Top Level Domain:** ${data.topLevelDomain.join(', ')}\n**• Alpha 2 Code:** ${data.alpha2Code}\n**• Alpha 3 Code:** ${data.alpha3Code}\n**• Calling Codes:** +${data.callingCodes.join(', +')}\n**• Capital:** ${data.capital}\n**• Alt Spellings:** ${data.altSpellings.join(', ')}\n**• Region:** ${data.region}\n**• Sub Region:** ${data.subregion}\n**• Population:** ${data.population.toLocaleString()}`, true)
				.addField('Country Information 2', `**• Cioc:** ${data.cioc}\n**• Currencies:** ${currencies.join(', ')}\n**• Numeric Code:** ${data.numericCode}\n**• Native Name:** ${data.nativeName}\n**• Languages:** ${languages.join(', ')}\n**• Borders:** ${data.borders.join(', ')}\n**• Gini:** ${data.gini === null ? 'none' : data.gini}\n**• Area:** ${data.area.toLocaleString()}\n**• Demonym:** ${data.demonym}\n**• lat lng:** (${data.latlng.join(', ')})`, true)
				.addField('Regional Blocs', regionalBlocs.join(',\n'))
				.addField('Timezones', data.timezones.join(', '));

			m.delete();
			message.channel.send(embed);
		}).catch(() => {
			m.delete();
			message.channel.send('I didn\'t found any information of that country.');
		});
	},
};