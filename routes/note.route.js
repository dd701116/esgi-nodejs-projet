const noteController = require('../controllers/note.controllers');

module.exports = fastify => {

    //Créer la note
    fastify.put('/notes', noteController.create);

    //Modifier la note
    fastify.patch('/notes/:id', noteController.change);
    
    // recupérer plusieurs notes 
    fastify.get('/notes', noteController.getAllNotesByUser);

    //Supprimer la note
    fastify.delete('/notes/:id', noteController.delete);

}
