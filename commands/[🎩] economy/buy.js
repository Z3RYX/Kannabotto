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

const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const prefixes = require('../../database/prefix.json');
const Models = require('../../create-model');

module.exports = {
	name: 'buy',
	category: '[🎩] economy',
	description: 'buy an item in the shop',
	example: `${bot_prefix}buy <item> [amount]`,
	usage: '<item> [amount]',
	run: async (client, message, args) => {
		const user = message.author.id;

		const Disable = Models.Disable();
		const Bag = Models.Bag();
		const Blacklist = Models.Blacklist();
		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Economy = Models.Economy();

		if (!await Disable.findOne({ where: { guildId: message.guild.id } })) {
			await Disable.create({
				guildId: message.guild.id,
			});
		}
		const disable = await Disable.findOne({ where: { guildId: message.guild.id } });


		if (!await Bag.findOne({ where: { userId: user } })) {
			await Bag.create({
				userId: user,
			});
		}
		const bag = await Bag.findOne({ where: { userId: user } });

		const warn = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('This command is disabled for this guild')
			.setDescription('This is most likely because this guild has broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();

		if (disable.get('economy') === 1) return message.channel.send(warn);


		if (!await Blacklist.findOne({ where: { userId: message.author.id } })) {
			await Blacklist.create({
				userId: message.author.id,
			});
		}
		const blacklist = await Blacklist.findOne({ where: { userId: message.author.id } });

		const warn1 = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('You have been blacklisted from this command')
			.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();


		if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);


		if (!await Cooldown.findOne({ where: { userId: user } })) {
			await Cooldown.create({
				userId: user,
			});
		}


		if (!await Inventory.findOne({ where: { userId: user } })) {
			await Inventory.create({
				userId: user,
			});
		}
		const inventory = await Inventory.findOne({ where: { userId: user } });


		if (!await Economy.findOne({ where: { userId: user } })) {
			await Economy.create({
				userId: user,
			});
		}
		const economy = await Economy.findOne({ where: { userId: user } });

		if (!args[0]) return message.channel.send(`**${message.author.username}**, the right syntax is \`${prefixes[message.guild.id]}buy <item>\``);
		const content = args[0].toLowerCase();

		let amount = parseInt(args[1]);
		if (!amount) amount = 1;
		if (isNaN(amount)) return message.channel.send(`**${message.author.username}**, please provide a real amount of item you want to buy.`);
		if (content === 'dog') {
			if (economy.get('balance') < 1000 * amount) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 1000 * amount }, { where: { userId: user } });
			await Inventory.update({ dog: inventory.get('dog') + 1 * amount }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought **${amount}** <:dog:868105109647810600> **Dog**!`);
		}
		else if (content === 'fishing-rod') {
			if (economy.get('balance') < 5000 * amount) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 5000 * amount }, { where: { userId: user } });
			await Inventory.update({ fishingRod: inventory.get('fishingRod') + 1 * amount }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought **${amount}** 🎣 **Fishing-Rod**!`);
		}
		else if (content === 'hunting-rifle') {
			if (economy.get('balance') < 5000 * amount) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 5000 * amount }, { where: { userId: user } });
			await Inventory.update({ huntingRifle: inventory.get('huntingRifle') + 1 * amount }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought **${amount}** <:huntingrifle:868724539121610783> **Hunting-Rifle**!`);
		}
		else if (content === 'pickaxe') {
			if (economy.get('balance') < 5100 * amount) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 5100 * amount }, { where: { userId: user } });
			await Inventory.update({ pickaxe: inventory.get('pickaxe') + 1 * amount }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought **${amount}** ⛏️ **Pickaxe**!`);
		}
		else if (content === 'guard') {
			if (economy.get('balance') < 5000 * amount) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 5000 * amount }, { where: { userId: user } });
			await Inventory.update({ guard: inventory.get('guard') + 1 * amount }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought **${amount}** <:bearguard:868105110289543188> **Guard**!`);
		}
		else if (content === 'bear') {
			if (economy.get('balance') < 3000 * amount) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 3000 * amount }, { where: { userId: user } });
			await Inventory.update({ bear: inventory.get('bear') + 1 * amount }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought **${amount}** <a:angrybear:868105109853327370> **Bear**!`);
		}
		else if (content === 'sword') {
			if (bag.get('sword') === 1) return;
			if (economy.get('balance') < 5000) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 5000 }, { where: { userId: user } });
			await Bag.update({ sword: 1 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought <:sword:868105110100779028> **Sword**! Do \`${prefixes[message.guild.id]}equip\` to equip a weapon`);
		}
		else if (content === 'staff') {
			if (bag.get('staff') === 1) return;
			if (economy.get('balance') < 5000) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 5000 }, { where: { userId: user } });
			await Bag.update({ staff: 1 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought <:staff:868105110138519582> **Staff**! Do \`${prefixes[message.guild.id]}equip\` to equip a weapon`);
		}
		else if (content === 'shield') {
			if (bag.get('shield') === 1) return;
			if (economy.get('balance') < 8000) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 8000 }, { where: { userId: user } });
			await Bag.update({ shield: 1 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought 🛡️ **Shield**! Do \`${prefixes[message.guild.id]}equip\` to equip a weapon`);
		}
		else if (content === 'bow') {
			if (bag.get('bow') === 1) return;
			if (economy.get('balance') < 10000) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 10000 }, { where: { userId: user } });
			await Bag.update({ bow: 1 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought 🏹 **Bow**! Do \`${prefixes[message.guild.id]}equip\` to equip a weapon`);
		}
		else if (content === 'fire-sword') {
			if (bag.get('swordFire') === 1) return;
			if (economy.get('balance') < 10000) return message.channel.send(`**${message.author.username}**, You don't have enough money in your pocket to buy this item!`);
			await Economy.update({ balance: economy.get('balance') - 10000 }, { where: { userId: user } });
			await Bag.update({ swordFire: 1 }, { where: { userId: user } });
			message.channel.send(`**${message.author.username}**, You have bought <a:firesword:868105110176301086> **Fire-Sword**! Do \`${prefixes[message.guild.id]}equip\` to equip a weapon`);
		}
		else if (content === 'laptop') {
			if (economy.get('balance') < 3000 * amount) return message.channel.send(`**${message.author.username}**, you don't have enough coins to buy that item.`);
			await Economy.update({ balance: economy.get('balance') - 3000 * amount }, { where: { userId: user } });
			await Inventory.update({ laptop: inventory.get('laptop') + 1 }, { where: { userId: user } });
			return message.channel.send(`**${message.author.username}**, You have bought **${amount}** <:laptop:868105109379379221> **Laptop**!`);
		}
		else {
			message.channel.send(`**${message.author.username}**, no item found in the shop and the market??`);
		}
	},
};
