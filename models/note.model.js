const CustomError = require('./CustomError');


class Note{
    constructor(userId, content, createdAt, lastUpdateAt){
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
        this.lastUpdateAt = lastUpdateAt;
    }
}



const NoteFactory = {
    create: (userId, content) => {
        if (userId){
            if (content){
                if (typeof content === "string"){
                    return new Note(userId, content, Date.now(), null);
                }else{
                    throw new CustomError("Le format de la note n'est pas accepté", 400);
                }
            }else{
                throw new CustomError("La note ne peut être vide", 400);
            }
        }else{
            throw new CustomError("L'utilisateur ne peut etre vide", 400);
        }
    }
}


module.exports = NoteFactory;
