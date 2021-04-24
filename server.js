// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });
const mongodb = require("./db/client.db");
const Token = require("./models/Token");
const CustomError = require("./models/CustomError");
const fs = require('fs');

const config_default = JSON.parse(fs.readFileSync("config.default.json"));
let config;

//  Cree la config
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
fastify.post('/', async (request, reply) => {
  return { hello: 'world' };
});



//Déclaration des routes
require('./routes/note.route')(fastify);
require('./routes/user.route')(fastify);

//  Verifie le token
fastify.addHook('preValidation', async (request, reply) => {
  let token_verified = false;
  try {
    const token = request.headers["x-access-token"];
    if (token) {
      token_verified = Token.verify(token, config.JWT_KEY);
    }
  } catch (e) {
    token_verified = false;
  }
  request.body = { ...request.body, _token: token_verified, _config:config };
});


//  Ajoute error = null avant d'envoyer le resultat
fastify.addHook('onSend', async (request, reply, payload) => {
  //const newPayload = payload.replace('some-text', 'some-new-text')
  const newPayload = JSON.parse(payload);
  if (!newPayload.error) {
    newPayload.error = null;
  }
  console.log(newPayload);
  return JSON.stringify(newPayload);
});

//  En cas d'erreur, la renvoyer avec le bon format
fastify.setErrorHandler((err, req, res) => {
  if (err instanceof CustomError) {
    res.status(err.code).send({error: err.message});
  }else {
    res.status(500).send({error: err.message});
  }
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(config.PORT, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

//Ouverture de la connexion mongodb
console.log("Connecting to db...");
mongodb().then(res => {
  console.log("Connecting to db...OK");
  console.log("Starting to server...");
  start();
  console.log("Starting to server...OK");
}).catch(e => {
  console.error("Connecting to db...FAILED");
  console.error(e);
})
