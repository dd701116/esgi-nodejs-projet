const note = require('../models/note.model');
const customError = require('../models/CustomError');
const mongodb = require("../db/client.db");
const ObjectId = require('mongodb').ObjectID;


exports.create = async (req, res) => {

    //Si pas de body
    if (!req.body || !req.body.content) {
        throw new customError("Le contenu est requis", 401);
    }

    const userID = req.locals.userID;
    const content = req.body.content;

    const newNote = note.create(userID, content);

    //Si pas d'erreur on rajoute la note a la BDD
    let client = mongodb.getConnection();

    try{
        const result = await client.db("esgi").collection("note").insertOne(newNote);
        return res.send({note: result.ops[0]});
    }catch(e){
        throw new customError("Impossible de rajouter la note", 402);
    }
};

exports.change = async (req, res) => {

    if (!req.params || !req.params.id) {
        throw new customError("L'id de la note est requis", 403);
    }
    if (!req.body || !req.body.content) {
        throw new customError("Le nouveau contenu de la note est requis", 403);
    }

    const uId = req.locals.userID;
    const noteId = req.params.id;
    const content = req.body.content;
    let client = mongodb.getConnection();
    let filter;


    try{
        filter = {  "_id" :ObjectId(noteId), "userId" : uId};
    }catch(e){
        throw new customError("L'id n'est pas valable", 406);
    }

    const updateDoc = {
        $set: {
            content : content,
            lastUpdateAt : Date.now()
        }
    };

    try{
        const result = await client.db("esgi").collection("note").findOneAndUpdate(filter, updateDoc, {returnNewDocument : true, returnOriginal: false});
        return res.send(result.value);
    }catch(e){
        throw new customError("Impossible de modifier la note", 402);
    }
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
