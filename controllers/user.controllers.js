const CustomError = require('../models/CustomError');
const mongodb = require('../db/client.db');
const token = require('../models/Token');
const config = require('../config.default.json');
const bcrypt = require('bcrypt');
//Permet a un utilisateur de s'identifier

exports.signin = async (req, res) => {

    if (!req.body || !req.body.username || !req.body.password){
        throw new CustomError('Merci de spécifier votre username & password', 403);
    }

    const user = {
        username: req.body.username,
        password: req.body.password
    };

    let client = mongodb.getConnection();
    const filter = {  "username" : user.username};

    try{
        const result = await client.db("esgi").collection("user").findOne(filter);
        if (!result){
            throw new CustomError("Username incorrect", 407);
        }

        const samePassword = await !bcrypt.compare(user.password, result.password);

        if (!samePassword){
            throw new CustomError("Mot de passe incorrect", 408);
        }

        res.send({accessToken: token.create(user, config.JWT_KEY)});

    }catch(e){
        throw new CustomError(e.message, 406);
    }
}