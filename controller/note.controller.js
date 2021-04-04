const note = require('../models/note.model');
const customError = require('../models/CustomError');
const mongodb = require("../db/client.db");


exports.create = async (req, res) => {
    
    //Si pas de body
    if (!req.body || !req.body.content) {
        return res.send(new customError("Le contenu est requis", 401));
    }
    const content = req.body.content;
    
    const newNote = note.create(1324, content);

    //Si pas d'erreur on rajoute la note a la BDD
    let client = mongodb.getConnection();

    try{
        const result = await client.db("esgi").collection("note").insertOne(newNote);
        return res.send({note: result.ops[0]});
    }catch(e){
        throw new customError("Impossible de rajouter la note", 402);
    }
};