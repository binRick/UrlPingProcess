#!/usr/bin/env node

var Config = require('./Config'),
    express = require('express'),
    app = new express(),
    logger = require('morgan'),
    mysql = require('mysql'),
    connection = mysql.createConnection(Config.connection),
    util = require('util'),
    spawn = require('child_process').spawn;

connection.connect();
app.use(logger());

app.get(Config.urlMatch, function(req, res) {
    connection.query(Config.queryBuilder(req.params), function(err, rows, fields) {
        if (err) throw err;
        var OutLines = {
            stdout: '',
            stderr: ''
        };
        var Spawn = spawn(Config.spawnCommand, Config.spawnCommandArguments(req.params) || []);
        Spawn.stdout.setEncoding('utf8');
        Spawn.stdout.on('data', function(data) {
            var str = data.toString(),
                lines = str.split(/(\r?\n)/g);
            OutLines.stdout.concat(lines);
            res.write(Config.Data.stdoutLines(lines));
        });
        Spawn.stderr.on('data', function(data) {
            var str = data.toString(),
                lines = str.split(/(\r?\n)/g);
            OutLines.stderr.concat(lines);
            res.write(Config.Data.stderrLines(lines));
        });
        Spawn.on('exit', function(code) {
            res.end(Config.Data.ProcessComplete(code, OutLines.stdout, OutLines.stderr));
        });
    });
});
app.listen(process.env.PORT || 49009, process.env.HOST || '127.0.0.1');
