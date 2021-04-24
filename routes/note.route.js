const noteController = require('../controllers/note.controllers');

module.exports = fastify => {

    //Créer la note
    fastify.put('/notes', noteController.create);

    fastify.patch('/notes/:id', noteController.change);

    fastify.delete('/notes/:id', (req, res) => {
        res.send('Supprimer la note');
    });

    
    // recupérer plusieurs notes 
    fastify.get('/notes/:Id', noteController.getAllNotesByUser);
}
