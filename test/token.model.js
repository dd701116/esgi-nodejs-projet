const token = require("../models/Token");
const assert = require('assert');
const user = require("../models/User");
const jsonwebtoken = require("jsonwebtoken");

describe('The token module', () => {
    it('Should create a token wich expired in 24h', async () => {
        let secretKey = "blablabla";
        let userObject = user.create("john", "azerty");
        let time = Date.now();
        let result = token.create(userObject, secretKey);
        let decode = jsonwebtoken.verify(result,secretKey);
        assert.deepStrictEqual({sub: decode.sub, exp: decode.exp}, {sub: userObject.username, exp: time + 86400});
    });

    it('Should verify a token', async () => {
        let secretKey = "blablabla";
        let userObject = user.create("john", "azerty");
        let result = token.create(userObject, secretKey);
        let decode = jsonwebtoken.verify(result,secretKey);
        let decode2 = token.verify(result,secretKey);
        assert.deepStrictEqual(decode, decode2);
    });
});