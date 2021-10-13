module.exports = function (msg,funct,config) {
    if (!msg.content.startsWith(config.discord.prefix)) return;

    const args = msg.content.trim().split(/ +/g);
    const cmd = args[0].slice(config.discord.prefix.length).toLowerCase();

    funct.logger('Command', msg.author.username, cmd);

    switch (cmd) {
        case 'ping':
            msg.reply('Websocket heartbeat: ${client.ws.ping}ms.');
            break;
        case 'mimbol':
            msg.reply("biblol");
            break;
        case 'balance':
            funct.getUserBalance(msg.author.username).then(function (result) {
                msg.reply('Ваш баланс: ' + result + ' хекселей')
            });
            break;
        case 'token':
            let perms_classic;
            funct.getUserPermissions(msg.author.username, 'classic').then(function (result) {
                perms_classic = result
            });
            //console.log(perms_classic);
            break;
    }

}
