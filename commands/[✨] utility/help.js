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

const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'help',
	aliases: ['h'],
	category: '[✨] utility',
	description: 'Returns all commands, or one specific command info',
	example: `${bot_prefix}help [command | alias]`,
	usage: '[command | alias]',
	run: async (client, message, args) => {
		if (args[0]) {
			return getCMD(client, message, args[0]);
		}
		else {
			return getAll(client, message);
		}
	},
};

function getAll(client, message) {
	const embed = new MessageEmbed()
		.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
		.setColor('RANDOM')
		.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
		.setTimestamp()
		.setFooter(`Type "${prefixes[message.guild.id]}help [command]" for more info on a command!`, client.user.avatarURL({ dynamic: true }))
		.setTitle('Kanna Help Command');

	const commands = (category) => {
		return client.commands
			.filter(cmd => cmd.category === category)
			.map(cmd => ' ' + `\`${cmd.name}\``);
	};

	const info = client.categories
		.map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
		.reduce((string, category) => string + '\n' + category);

	return message.channel.send(embed.setDescription(info).setTimestamp());
}

function getCMD(client, message, input) {
	const embed = new MessageEmbed();

	const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

	let info = `No information found for command **${input.toLowerCase()}**`;

	if (!cmd) {
		return message.channel.send(embed.setColor('RED').setDescription(info));
	}

	if (cmd.name) info = `**Command name**: ${cmd.name}`;
	if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(', ')}`;
	if (cmd.description) info += `\n**Description**: ${cmd.description}`;
	if (cmd.example) info += `\n**Example**: \`${cmd.example}\``;
	if (cmd.usage) {
		info += `\n**Usage**: \`${cmd.usage}\``;
		embed.setFooter('Syntax: <> = required, [] = optional');
	}

	return message.channel.send(embed.setColor('GREEN').setDescription(info).setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true })).setTimestamp());
}