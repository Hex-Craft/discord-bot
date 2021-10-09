const { Client, Intents } = require('discord.js');
const config = require("./config.json");
const mysql = require("mysql2/promise");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const prefix = '!';

//FUNCTIONS

function logger(type, username, output) {
    console.log('[' + getDateTime() + '][' + type + ']\t' + username + ': ' + output);
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return hour + ":" + min + ":" + sec;
}

async function query(server, query, params = null) {
    const site_mysql = await mysql.createConnection({ host: config.db.host, user: config.db.user, database: config.db.name[server], password: config.db.password});
    site_mysql.connect(function(err){ if (err) return console.error("Ошибка: " + err.message); else console.log(server + ' database connected.');});
    const result = await site_mysql.query(query, params);
    logger('MySQL', 'Query  ', query);
    console.log(result[0]);
    return result[0][0];
}

function getUserBalance(username) {
    let balance = query('site', 'SELECT user_balance FROM dle_users WHERE name = ?', username).then( function(result) { logger('MySQL', 'Result ', result.user_balance); return result.user_balance; } );
    return balance;
}

function getUserPermissions(username, server) {
    let perms = query(server, 'SELECT username, permission, expiry FROM luckperms_players JOIN luckperms_user_permissions ON luckperms_players.uuid = luckperms_user_permissions.uuid WHERE username = ?', username).then( function(result) {
        logger('MySQL', 'Result ', result);
        
        let perms;
        
        Object.keys(result).forEach(function (key){
            function addPerm( currentValue ) {
            perms.push(currentValue.permission);
          }
        });
        
        return perms;
        
    } );
    
    return perms;
}

//COMMANDS

client.on('ready', () => { console.log('Bot started.'); })

client.on("message", msg => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.trim().split(/ +/g);
  const cmd = args[0].slice(prefix.length).toLowerCase();

  logger('Command', msg.author.username, cmd);

  switch (cmd) {
    case 'ping':
      msg.reply('Websocket heartbeat: ${client.ws.ping}ms.');
      break;
    case 'balance':
      getUserBalance(msg.author.username).then( function(result) { msg.reply('Ваш баланс: ' + result + ' хекселей') } );
      break;
    case 'token':
      let perms_classic;
      getUserPermissions(msg.author.username, 'classic').then( function(result) { perms_classic = result } );
      //console.log(perms_classic);
      break;
  }
})

client.login(config.token);
