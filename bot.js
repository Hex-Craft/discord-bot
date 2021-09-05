const { Client, Intents } = require('discord.js');
const config = require("./config.json");
const mysql = require("mysql2");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const prefix = '!';

function getUserGroup(msg, server, token) {
  const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    database: config.mysql.database + server,
    password: config.mysql.password
  });

  const connectionSite = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    database: config.mysql.database_site,
    password: config.mysql.password
  });

  connection.connect(function(err){ if (err) return console.error("Ошибка: " + err.message); });
  connectionSite.connect(function(err){ if (err) return console.error("Ошибка: " + err.message); });

  let query = 'SELECT name, discord_token FROM dle_users WHERE discord_token = ?';
  let user;
  let result;

  connectionSite.query(query, token,
      function(err, results) {
        if (err != null) console.log(err);
        if (results.length > 0) user = results[0].name;
        else {
          result = false;
          return;
        }

        msg.guild.members.cache.get(msg.author.id).roles.add('730038645918007306'); // Выдача роли Player

        query = 'SELECT luckperms_user_permissions.permission AS Perm FROM luckperms_players ' +
            'INNER JOIN luckperms_user_permissions ON luckperms_user_permissions.uuid = luckperms_players.uuid WHERE luckperms_players.username = ?';

        connection.query(query, user,
            function(err, results) {
              if (err != null) console.log(err);
              console.log(results[0].Perm);

              if (results[0].Perm) {
                giveUserDiscordRole(results[0].Perm, msg); // Выдача привилегии
                giveUserDiscordRole(server, msg); // Присвоение сервера на котором играет
                result = true;
              } else result = false;
            });
      });
  return result;
}

function giveUserDiscordRole(role, msg) {
  switch (role) {
    case 'group.headadmin':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'HEADADMIN')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('730038348248514571');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'group.supersponsor':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'SUPERSPONSOR')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('789588617219670036');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'group.sponsor':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'SPONSOR')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('786746363055964202');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'group.elite':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'ELITE')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('883787907490537523');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'group.ultra':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'ULTRA')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('765569705917284352');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'group.gold':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'PREMIUM')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('765569520462987296');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'group.vip':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'VIP')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('765569290493493278');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'classic':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'CLASSIC')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('850511187623411712');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'hitech':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'HI-TECH')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('850511306658414642');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
    case 'magic':
      if (msg.guild.members.cache.get(msg.author.id).roles.cache.some(role => role.name === 'MAGIC')) break;
      msg.guild.members.cache.get(msg.author.id).roles.add('883788571755040809');
      console.log('Игроку ' + msg.author.username + ' была присвоена роль ' + role);
      break;
  }
}

function generateToken(user) {
  let length = 16,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      newToken = "";
  for (let i = 0, n = charset.length; i < length; ++i)
    newToken += charset.charAt(Math.floor(Math.random() * n));
  console.log('Новый токен: ' + newToken);
  const connectionSite = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    database: config.mysql.database_site,
    password: config.mysql.password
  });

  connectionSite.connect(function(err){ if (err) return console.error("Ошибка: " + err.message); });

  let query = 'UPDATE dle_users SET discord_token = ? WHERE name = ?';
  let value = [newToken, user];
  let response;

  connectionSite.query(query, value,
      function(err, results) {
        if (err != null) {
          console.log(err);
          response = 0;
        }
        else response = 1;
      });

  connectionSite.end(function(err) { if (err) return console.log("Ошибка: " + err.message); });
  return response;
}

client.on('ready', () => { console.log(`Бот ${client.user.username} запустился`); })

const whiteList = ['404387076461821953'];
client.on('interactionCreate', interaction => { if (!whiteList.includes(interaction.user.id)) return; });

client.on("message", msg => {
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.trim().split(/ +/g);
  const cmd = args[0].slice(prefix.length).toLowerCase();

  console.log('Введена команда: ' + cmd);

  switch (cmd) {
    case 'ping':
      msg.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
      break;
    case 'mimbol':
      msg.reply("biblol");
      break;
    case 'token':
      msg.delete();
      let token = args[1];
      let reply;
      console.log('Токен: ' + token);
      if (getUserGroup(msg, 'classic', token) === true || getUserGroup(msg, 'hitech', token) === true || getUserGroup(msg, 'magic', token) === true)
      {
        reply = 'Вы были успешно аутентифицированы. Привилении были перенесены.';
        if (msg.channel.type != 'dm')
        {
          console.log('Сообщение было написано в канал: ' + msg.channel.name);
          if (generateToken(msg.author.username) == 1) reply += 'Ваш токен был автоматически обновлён. ';
        }
      }
      else reply = 'Токен не был найден. ';
      msg.reply(reply);
      break;
  }
})

client.login(config.token);