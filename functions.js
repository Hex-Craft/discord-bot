module.exports = {
    "query": async function (server, query, params = null) {
        const site_mysql = await mysql.createConnection({
            host: config.db.host,
            user: config.db.user,
            database: config.db.name[server],
            password: config.db.password
        });
        site_mysql.connect(function (err) {
            if (err) return console.error("Ошибка: " + err.message); else console.log(server + ' database connected.');
        });
        const result = await site_mysql.query(query, params);
        this.logger('MySQL', 'Query  ', query);
        console.log(result[0]);
        return result[0][0];
    },

    "logger": function (type, username, output) {
        console.log('[' + this.getDateTime() + '][' + type + ']\t' + username + ': ' + output);
    },

    "getDateTime": function () {
        var date = new Date();
        var hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        hour = (hour < 10 ? "0" : "") + hour,
        min = (min < 10 ? "0" : "") + min,
        sec = (sec < 10 ? "0" : "") + sec;
        return hour + ":" + min + ":" + sec;
    },


    "getUserBalance": function (username) {
        let balance = this.query('site', 'SELECT user_balance FROM dle_users WHERE name = ?', username).then(function (result) {
            this.logger('MySQL', 'Result ', result.user_balance);
            return result.user_balance;
        });
        return balance;
    },

    "getUserPermissions": function (username, server) {
        let perms = this.query(server, 'SELECT username, permission, expiry FROM luckperms_players JOIN luckperms_user_permissions ON luckperms_players.uuid = luckperms_user_permissions.uuid WHERE username = ?', username).then(function (result) {
            this.logger('MySQL', 'Result ', result);

            let perms;

            Object.keys(result).forEach(function (key) {
                function addPerm(currentValue) {
                    perms.push(currentValue.permission);
                }
            });

            return perms;

        });

        return perms;
    }
}