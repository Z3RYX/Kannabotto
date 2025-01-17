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

module.exports = {
	name: 'advice',
	category: '[🧩] fun',
	description: 'I\'ll give you some great advice, I\'m just too kind.',
	example: `${bot_prefix}advice`,
	run: (client, message) => {
		require('request')('http://api.adviceslip.com/advice', function(error, response, body) {
			if (!error && response.statusCode == 200) {
				message.channel.send(`${JSON.parse(body).slip.advice}`);
			}
			else {
				message.channel.send('I couldn\'t think of any advice...');
			}
		});
	},
};