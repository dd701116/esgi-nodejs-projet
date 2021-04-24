const mongodb = require("mongodb");
const config = require("../config.default.json");

const MONGODB_URI = process.env.MONGODB_URI || config.MONGODB_URI;
let client;

module.exports = async () => {

    try{
        client = await mongodb.connect(MONGODB_URI, {
            //Evite les Warning dans la console
            useNewUrlParser: true,
            useUnifiedTopology : true
        });
    }catch(e){
        throw new Error("Couldn't connect to mongodb");
    }
}

module.exports.getConnection = () => client;

module.exports.close = () => client.close();
