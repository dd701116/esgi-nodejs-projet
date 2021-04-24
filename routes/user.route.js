const userController = require('../controllers/user.controllers');

module.exports = fastify => {
    fastify.post('/signin', userController.signin);
    fastify.post('/signup', userController.signup);
}
