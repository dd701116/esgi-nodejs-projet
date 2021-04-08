module.exports = fastify => {

    //Créer la note
    fastify.put('/notes', (req, res) => {
        res.send('Créer la note');
    });

    fastify.patch('/notes/:id', (req, res) => {
        res.send('Mettre a jour la note')
    });

    fastify.delete('/notes/:id', (req, res) => {
        res.send('Supprimer la note');
    });
}