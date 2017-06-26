var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'Rach',
    password: 'sourcream',
    database: 'Chirper'
});

var clientPath = path.join(__dirname, '../client');
var app = express();
app.use(express.static(clientPath));
app.use(bodyParser.json());

//load landing page
app.get('/', function(req,res){
    res.sendFile(path.join(clientPath, 'index.html'));
});
//load all chirps page
app.get('/chirps', function(req,res){
    res.sendFile(path.join(clientPath, 'list.html'));
});
//load single update page
app.get('/chirps/*/update', function(req,res){
    res.sendFile(path.join(clientPath, 'single_update.html'));
});
//load single view page
app.get('/chirps/*', function(req,res){
    res.sendFile(path.join(clientPath, 'single_view.html'));
});

//GET ALL
app.get('/api/chirps', function(req, res){
    rows('GetChirps')
    .then(function(chirps) {
        res.send(chirps);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

//CREATE & POST NEW ONE
app.post('/api/chirps', function(req,res) {
   row('InsertChirp',[req.body.userid, req.body.message])
    .then(function(id) {
        res.status(201).send(id);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

//GET ONE
app.get('/api/chirps/:id', function(req, res){
    row('GetChirp', [req.params.id])
    .then(function(chirp) {
        res.send(chirp);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

//UPDATE ONE
app.put('/api/chirps/:id', function(req, res) {
    empty('UpdateChirp', [req.body.message, req.params.id])
    .then(function() {
        res.sendStatus(204);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

//DELETE ONE
app.delete('/api/chirps/:id', function(req, res) {
    empty('DeleteChirp', [req.params.id])
    .then(function() {
        res.sendStatus(204);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    });
});

//ask for user
app.get('/api/users', function(req, res) {
    rows('GetUsers')
    .then(function(users) {
        res.send(users);
    }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
    })
});

//server port
app.listen(3000);

//-------------general functions----------------- 

function callProcedure(procedureName, args) {
    return new Promise (function(resolve,reject) {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            }
            else {
                placeholders = '';
                if (args && args.length > 0) {
                    for (var i = 0; i < args.length; i++) {
                        if (i === args.length -1) {
                            placeholders += '?';
                        }
                        else {
                            placeholders += '?,';
                        }
                    }
                }
                var callString = 'CALL ' + procedureName + '(' + placeholders + ');';
                connection.query(callString, args, function(err, resultsets) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(resultsets);
                    }
                });
            }
        });
    });
}

function rows(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultsets) {
            return resultsets[0];
        });
}

function row(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function(resultsets){
            return resultsets[0][0];
        });
}

function empty(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function() {
            return;
        });
}