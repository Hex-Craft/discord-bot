
const { Client, Intents } = require('discord.js'),
    config = require("./config.json"),
    mysql = require("mysql2/promise");

var func = require("./functions.js");
var comm = require("./commands.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => { console.log('Bot started.'); })
client.on("message", (msg)=>{comm(msg,func,config)})
client.login(config.discord.token);
