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
const Jimp = require('jimp');
const { getMember } = require('../../functions');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'greyscale',
	description: 'remove colour from the image',
	category: '[📷] image manipulation',
	example: `${bot_prefix}greyscale [username | attachment]`,
	usage: '[username | attachment]',
	run: async (client, message, args) => {
		const member = await getMember(message, args.join(' '));
		const image = message.attachments.first() || await member.user.displayAvatarURL({ format: 'jpg', size: 4096 }) || message.author.displayAvatarURL({ format: 'jpg', size: 4096 });
		if (!image) return message.reply(`the right syntax is \`${prefixes[message.guild.id]}greyscale [username | attachment]\`.`);
		if (image === undefined) return message.channel.send('Oops sorry, I can\'t manipulate that image');
		await Jimp.read(image)
			.then(i => {
				return i
					.greyscale()
					.write('./images/greyscale.png');
			});

		const m = await message.channel.send('Please Wait...');
		message.channel.send({ files: ['./images/greyscale.png'] }).then(() => m.delete());
	},
};