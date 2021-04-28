const note = require('../models/note.model');
const {ErrorFactory} = require('../models/CustomError');
const mongodb = require("../db/client.db");
const ObjectId = require('mongodb').ObjectID;


exports.create = async (req, res) => {
    
    //Si pas de body
    if (!req.body || !req.body.content) {
        throw ErrorFactory("note.noContent", req.query.lang);
    }
    if (req.body._token===false) {
        throw ErrorFactory("user.notConnected", req.query.lang);
    }

    const client = mongodb.getConnection();

    const userID = ObjectId(req.body._token.sub);

    const content = req.body.content;

    const newNote = note.create(userID, content, req.query.lang);

    const result = await client.db("esgi").collection("note").insertOne(newNote);
    return res.send({note: result.ops[0]});
};

exports.change = async (req, res) => {

    if (!req.params || !req.params.id) {
        throw ErrorFactory("note.notFound", req.query.lang);
    }
    if (!req.body || !req.body.content) {
        throw ErrorFactory("note.noContent", req.query.lang);
    }
    if (req.body._token===false) {
        throw ErrorFactory("user.notConnected", req.query.lang);
    }

    //Si pas d'erreur on rajoute la note a la BDD
    let client = mongodb.getConnection();

    const userID = req.body._token.sub;
    const noteId = req.params.id;
    const content = req.body.content;
    const filter = {  "_id" :ObjectId(noteId)};
    const note = await client.db("esgi").collection("note").findOne(filter);
    
    if (!note) {
        throw ErrorFactory("note.notFound", req.query.lang);
    }

    if (note.userId.toString()!==userID) {
        throw ErrorFactory("note.accessForbiden", req.query.lang);
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
        throw ErrorFactory("note.notFound", req.query.lang);
    }
    if (req.body._token===false) {
        throw ErrorFactory("user.notConnected", req.query.lang);
    }

    const userID = req.body._token.sub;
    const noteId = req.params.id;
    let client = mongodb.getConnection();

    const filter = {  "_id" :ObjectId(noteId)};
    const note = await client.db("esgi").collection("note").findOne(filter);
    
    if (!note) {
        throw ErrorFactory("note.notFound", req.query.lang);
    }

    if (note.userId.toString()!==userID) {
        throw ErrorFactory("note.accessForbiden", req.query.lang);
    }

    await client.db("esgi").collection("note").deleteOne(filter);

    return res.send({});
}

exports.getAllNotesByUser = async (req, res ) => { 
    if (req.body._token===false) {
        throw ErrorFactory("user.notConnected", req.query.lang);
    }
    
    const userID = req.body._token.sub;
    let client = mongodb.getConnection();

    const filter = {"userId" :ObjectId(userID)}

    const option = {
        sort: {createdAt : -1}  
     }
     const result = await client.db("esgi").collection("note").find(filter, option).toArray();
     return res.send({notes: result});
}

