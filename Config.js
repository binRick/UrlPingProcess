module.exports = {
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'database'
    },
    Data: {
        ProcessComplete: function(exitCode, Stdout, Stderr) {
            return ' Process completed with code: ' + exitCode;
            console.log('stdout log lines', Stdout);
        },
        stdoutLines: function(lines) {
            console.log('stdout log lines', lines);
            return 'new lines' + lines.length;
        },
        stderrLines: function(lines) {
            console.log('stderr log lines', lines);
            return 'new err lines' + lines.length;
        },
    },
    urlMatch: '/:device_id',
    queryBuilder: function(parameters) {
        return 'delete from ports_vlans where device_id="' + parameters.device_id + '"';
    },
    spawnCommand: '/opt/observium/discovery.php',
    spawnCommandArguments: function(parameters) {
        return ['-h', parameters.device_id];
    },
};
