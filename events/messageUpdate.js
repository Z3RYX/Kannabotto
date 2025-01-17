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
const fs = require('fs');

module.exports = (client, oldMessage, newMessage) => {

	if (newMessage.author.bot) return;


	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[newMessage.guild.id]) {
		logsetting[newMessage.guild.id] = {
			checker: 1,
		};
	}
	if(!log[newMessage.guild.id]) return;
	const values = logsetting[newMessage.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = newMessage.guild.channels.cache.get(`${log[newMessage.guild.id].channel}`);
		if(!logChannel) return;

		if (newMessage !== oldMessage) {
			const embed = new Discord.MessageEmbed()
				.setAuthor('Message Edited', newMessage.guild.iconURL({ dynamic: true }))
				.setColor('RANDOM')
				.setDescription(`User: <@${newMessage.author.id}>\nChannel: <#${newMessage.channel.id}>`)
				.addField('Before:', oldMessage.content)
				.addField('After:', newMessage.content)
				.setTimestamp()
				.setFooter(`ID: ${newMessage.id}`);

			logChannel.send(embed);
		}
	}
};