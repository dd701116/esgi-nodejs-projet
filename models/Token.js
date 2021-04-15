const jsonwebtoken = require("jsonwebtoken");

const Token = {
    create: function(user, key){
        let secondInOneDay = 86400;
        return jsonwebtoken.sign({ sub: user.username, exp: Date.now() + secondInOneDay }, key);
    },
    verify: function(token, key){
        return jsonwebtoken.verify(token, key);
    }
};

module.exports = Token;





