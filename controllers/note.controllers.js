const note = require('../models/note.model');
const customError = require('../models/CustomError');
const mongodb = require("../db/client.db");
const ObjectId = require('mongodb').ObjectID;


exports.create = async (req, res) => {
    
    //Si pas de body
    if (!req.body || !req.body.content) {
        throw new customError("Le contenu est requis", 401);
    }
    if (req.body._token===false) {
        throw new customError("Utilisateur non connecté", 401);
    }
    
    const filter = {  "username" : req.body._token.sub};

    //Si pas d'erreur on rajoute la note a la BDD
    let client = mongodb.getConnection();

    const user = await client.db("esgi").collection("user").findOne(filter);
    const userID = user._id;
    const content = req.body.content;

    const newNote = note.create(userID, content);

    const result = await client.db("esgi").collection("note").insertOne(newNote);
    return res.send({note: result.ops[0]});
};

exports.change = async (req, res) => {

    if (!req.params || !req.params.id) {
        throw new customError("L'id de la note est requis", 403);
    }
    if (!req.body || !req.body.content) {
        throw new customError("Le nouveau contenu de la note est requis", 403);
    }
    if (req.body._token===false) {
        throw new customError("Utilisateur non connecté", 401);
    }

    const filter1 = {  "username" : req.body._token.sub};

    //Si pas d'erreur on rajoute la note a la BDD
    let client = mongodb.getConnection();

    const user = await client.db("esgi").collection("user").findOne(filter1);
    const userID = user._id;
    const noteId = req.params.id;
    const content = req.body.content;
    const filter2 = {  "_id" :ObjectId(noteId), "userId" : userID};
    const note = await client.db("esgi").collection("note").findOne(filter2);
    
    if (!note) {
        throw new customError("L'id n'est pas valable", 406);
    }

    const updateDoc = {
        $set: {
            content : content,
            lastUpdateAt : Date.now()
        }
    };

    const result = await client.db("esgi").collection("note").findOneAndUpdate(filter2, updateDoc, {returnNewDocument : true, returnOriginal: false});
    return res.send(result.value);
}

exports.delete = async (req, res) => {
    if (!req.params || !req.params.id) {
        throw new customError("L'id de la note est requis", 403);
    }

    const uId = req.locals.userID;
    const noteId = req.params.id;
    let client = mongodb.getConnection();
    let filter;


    try{
        filter = {  "_id" :ObjectId(noteId), "userId" : uId};
    }catch(e){
        throw new customError("L'id n'est pas valable", 404);
    }

    try{
        await client.db("esgi").collection("note").deleteOne(filter);
        return res.send({"error": null});
    }catch(e){
        throw new customError("Impossible de supprimer la note", 402);
    }
}
