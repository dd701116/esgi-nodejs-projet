// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const mongodb = require("./db/client.db");
const fs = require('fs');

const config_default = JSON.parse(fs.readFileSync("config.default.json"));
let config;

if (config_default.production){
  if (!process.env.PORT || !process.env.MONGODB_URI || !process.env.JWT_KEY) {
    console.error("I need some information to work in production mode !");
    console.error(`{ PORT: ${process.env.PORT} , MONGODB_URI: ${process.env.MONGODB_URI}, JWT_KEY: ${process.env.JWT_KEY}}`);
    process.exit(1);
  }
  config = {
    production: true,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_KEY: process.env.JWT_KEY
  };
}else{
  config = config_default;
}

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

//Ouverture de la connexion mongodb
mongodb();

//Déclaration des routes pour les notes
require('./routes/note.route')(fastify);

// Run the server!
const start = async () => {
  try {
    await fastify.listen(config.PORT, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();
