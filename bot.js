const { Client, Intents } = require('discord.js');
const config = require("./config.json");
const mysql = require("mysql2");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  database: config.mysql.database,
  password: config.mysql.password
});

connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });

 function getUserData(msg) {
    var user = msg.author.username;
    var query = 'SELECT * FROM cmi_users WHERE username=?';
    connection.query(query, user,
        function(err, results) {
        console.log(err);
        console.log(results); // собственно данные
    });
    return "GOT SOME DATA FOR " + user + " BRUH";
  }

client.on('ready', () => {
  console.log(`Бот ${client.user.username} запустился`);
})

client.on("message", msg => {
  switch (msg.content) {
    case 'ping':
      msg.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
      break;
    case 'mimbol':
      msg.reply("biblol");
      break;
    case 'mysql':
      msg.reply(getUserData(msg));
      break;
  }
})

client.login(config.token);