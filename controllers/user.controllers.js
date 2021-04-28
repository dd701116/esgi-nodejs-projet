const {ErrorFactory} = require('../models/CustomError');
const mongodb = require('../db/client.db');
const token = require('../models/Token');
const User = require('../models/User');
const bcrypt = require('bcrypt');
//Permet a un utilisateur de s'identifier

exports.signin = async (req, res) => {

    if (!req.body.username || !req.body.password){
        throw ErrorFactory("user.noUsernameAndnoPassword", req.query.lang);
    }

    const user = User.parse(req.body.username, req.body.password, req.query.lang);

    let client = mongodb.getConnection();
    const filter = { "username" : user.username};

    const result = await client.db("esgi").collection("user").findOne(filter);
    if (!result){
        throw ErrorFactory("user.usernameNotExists", req.query.lang);
    }

    const samePassword = await bcrypt.compare(user.password, result.password);

    if (!samePassword){
        throw ErrorFactory("user.wrongPassword", req.query.lang);
    }

    user._id = result._id;
    res.send({token: token.create(user, req.body._config.JWT_KEY)});
}

exports.signup = async (req, res) => {

    const user = User.create(req.body.username, req.body.password, req.query.lang);
    const filter = {  "username" : user.username};

    let client = mongodb.getConnection();

    const result = await client.db("esgi").collection("user").findOne(filter);
    if (result) {
        throw ErrorFactory("user.usernameAlreadyExists", req.query.lang);
    }
    await client.db("esgi").collection("user").insertOne(user);
    const result2 = await client.db("esgi").collection("user").findOne(filter);
    user._id = result2._id;
    res.send({token: token.create(user, req.body._config.JWT_KEY)});
}