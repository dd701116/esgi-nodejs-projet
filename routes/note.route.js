const noteController = require('../controller/note.controller');

module.exports = fastify => {

    //Créer la note
    fastify.put('/notes', noteController.create);

    fastify.patch('/notes/:id', (req, res) => {
        res.send('Mettre a jour la note')
    });

    fastify.delete('/notes/:id', (req, res) => {
        res.send('Supprimer la note');
    });
}