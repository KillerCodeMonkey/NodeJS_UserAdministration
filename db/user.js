// MongoDB - Init db and provide db-functions.
var mongo  = require('mongodb'),
    crypto = require('crypto');

var Server = mongo.Server,
    Db     = mongo.Db,
    BSON   = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
    db     = new Db('userdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'userdb' database");
        db.createCollection('users',{w:1}, function(err, collection) {
            if (!err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB(collection);
            }
        });
    } else {
        console.log('db.open: ' + err);
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByUserName = function(req, res) {
    var username = req.params.username;
    console.log('Retrieving user: ' + username);
    db.collection('users', function(err, collection) {
        collection.findOne({'username':username}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    delete wine._id;
    console.log('Updating user: ' + id);
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.login = function(req, res) {
    var username = req.body.username,
        password = req.body.password;

    db.collection('users', function (err, collection) {
        collection.findOne({'username': username, 'password': password}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                if(result) {
                    req.session.user = result;
                    res.send({'isWarn':0, 'msg': ''});
                } else {
                    res.send({'isWarn':1, 'msg': 'wuasd'});
                }
            }
        });
    });
}

exports.register = function(req, res) {
    var username = req.body.username,
        password = req.body.password,
        salt     = generateSalt();

    db.collection('users', function (err, collection) {
        collection.findOne({'username': username}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                if(result) {
                    res.send({
                       'isWarn' : 1,
                        'msg'   : 'User "' + username + '" already exists!'
                    });    
                } else {
                    collection.insert({
                        'username': username,
                        'password': password,
                        'salt': salt
                    }, {safe:true}, function(err, result) {
                        if (err) {
                            res.send({'error':'An error has occurred'});
                        } else {
                            console.log('Success: ' + JSON.stringify(result[0]));
                            res.send(result[0]);
                        }
                    });
                }
            }
        });
    });
}

// ToDo: crypt pw and store salt.
var generateSalt = function() {
    return crypto.randomBytes(128).toString('base64');
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function(collection) {

    var users = [
        {
            username: "busen",
            password: "wuasd",
            salt: "todo"
        }
    ];

    collection.insert(users, {safe:true}, function(err, result) {});

};