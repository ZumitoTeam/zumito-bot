// init require
const { getConfig } = require("@modules/utils/data.js");
const {default: localizify, t} = require('localizify');
const botConfig = require('@config/bot.js');
const { v4: uuidv4 } = require('uuid');
const {sleep} = require('@modules/utils/messages.js');
const fetch = require('node-fetch');

let voices = {
    es: {
        'fernanfloo': 'TM:f21pvbsb0tjt',
        'glados': 'TM:60tmfnpahvbx',
        'petergriffin': 'TM:ge1xb5aev12d',
    }
}

// export module
module.exports = {
	name : "fakeyou",
	description : "",
	aliases : [],
	ussage : null,
	hidden : false,
	admin : false,
	nsfw : false,
    cooldown: 120,
	async execute(client,message,args){
        let guildConfig = await getConfig(message.guild);
        if (args[0] !== undefined && voices[guildConfig.lang] !== undefined && voices[guildConfig.lang][args[0]] !== undefined) {
            if (args[1] !== undefined) {
                let voice = voices[guildConfig.lang][args[0]];
                args.shift()
                let text = args.join(' ');
                let request = await fetch('https://api.fakeyou.com/tts/inference', {
                    method: 'POST',
                    body: JSON.stringify({
                        "uuid_idempotency_token": uuidv4(),
                        "tts_model_token": voice,
                        "inference_text": text,
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json());

                message.reply('Generating audio...');

                let poll;
                let count = 0;
                do {
                    await sleep(20000);
                    poll = await fetch('https://api.fakeyou.com/tts/job/' + request.inference_job_token).then(res => res.json());
                    count++;
                } while (poll.state.status != 'complete_success' && count < 25);

                if (poll.state.status == 'complete_success') {
                    return message.reply({
                        files: [{
                            attachment: 'https://storage.googleapis.com/vocodes-public' + poll.state.maybe_public_bucket_wav_audio_path,
                            name: args.join('_') + '.wav'
                        }],
                    });
                } else {
                    return message.reply('Fakeyou API is taking too long to generate audio. Please try again later.');
                }
            } else {
                return message.reply('No text provided.');
            }
        } else {
            return message.reply({embeds: [
                {
                    "title": t("Invalid voice name"),
                    "color": botConfig.embeds.color,
                    "description": t("Invalid voice name provided. Please use one of the following:") + '\n' + Object.keys(voices[guildConfig.lang] || []).join(', '),
                }
            ]});
        }
	}
}