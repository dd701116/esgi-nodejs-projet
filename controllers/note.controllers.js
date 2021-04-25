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

    const client = mongodb.getConnection();

    const userID = req.body._token.sub;

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

    //Si pas d'erreur on rajoute la note a la BDD
    let client = mongodb.getConnection();

    const userID = req.body._token.sub;
    const noteId = req.params.id;
    const content = req.body.content;
    const filter = {  "_id" :ObjectId(noteId)};
    const note = await client.db("esgi").collection("note").findOne(filter);
    
    if (!note) {
        throw new customError("L'id n'est pas valable", 406);
    }

    if (note.userId!==userID) {
        throw new customError("Accès non autorisé à cette note", 403);
    }

    const updateDoc = {
        $set: {
            content : content,
            lastUpdateAt : Date.now()
        }
    };

    const result = await client.db("esgi").collection("note").findOneAndUpdate(filter, updateDoc, {returnNewDocument : true, returnOriginal: false});
    return res.send(result.value);
}

exports.delete = async (req, res) => {
    if (!req.params || !req.params.id) {
        throw new customError("L'id de la note est requis", 403);
    }
    if (req.body._token===false) {
        throw new customError("Utilisateur non connecté", 401);
    }

    const userID = req.body._token.sub;
    const noteId = req.params.id;
    let client = mongodb.getConnection();

    const filter = {  "_id" :ObjectId(noteId)};
    const note = await client.db("esgi").collection("note").findOne(filter);
    
    if (!note) {
        throw new customError("L'id n'est pas valable", 406);
    }

    if (note.userId!==userID) {
        throw new customError("Accès non autorisé à cette note", 403);
    }

    await client.db("esgi").collection("note").deleteOne(filter);

    return res.send({});
}

exports.getAllNotesByUser = async (req, res ) => { 
    if (!req.params || !req.params.Id) {
        throw new customError("L'id de la note est requis", 403);
    }
    
    //onst uId = req.local.userID;
    const uId = req.params.Id;
    let client = mongodb.getConnection();
    const db = client.db("esgi")

    try {
        const filter = {"_id" :ObjectId(uId)}
        const result = db.collection("user").findOne(filter);
        console.log(result);
    } catch(e) {
        throw new customError("L'id de l'user est incorrecte", 404);
    }

    let filter;

    try {
        filter = { "userId" : uId};
    } catch(e) {
        throw new customError("L'id n'est pas valable", 404);
    }

    try {
        const option = {
           sort: {createdAt : -1}  
        }
        const result = await db.collection("note").find(filter, option).toArray();
        return res.send(result);
    } catch(e) {
        throw new customError("Impossible de récupérer la note", 402);
    }
}

