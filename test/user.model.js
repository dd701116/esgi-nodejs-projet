const assert = require('assert');
const User = require('../models/User');
const {CustomError, ErrorFactory} = require('../models/CustomError');
const bcrypt = require('bcrypt');

describe("The User module", () => {
  it(`Should create a User object`, async () => {
    let username = "username";
    let password = "password";
    let result = User.create(username,password);
    assert.strictEqual(result.username, username);
    assert(bcrypt.compareSync(password, result.password));
  });

  it(`Should show 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées' when username = succèss`, async () => {
    assert.throws(() => {
      let result = User.create("succèss", "password");
    }, ErrorFactory("user.usernameFormat"));
  });

  it(`Should show 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées' when username = Success`, async () => {
    assert.throws(() => {
      let result = User.create("Success", "password");
    }, ErrorFactory("user.usernameFormat"));
  });

  it(`Should show 'Votre identifiant doit contenir entre 2 et 20 caractères' when username length < 2`, async () => {
    assert.throws(() => {
      let result = User.create("s", "password");
    }, ErrorFactory("user.usernameLenght"));
  });

  it(`Should show 'Votre identifiant doit contenir entre 2 et 20 caractères' when username length > 20`, async () => {
    assert.throws(() => {
      let result = User.create("sssssssssssssssssssss", "password");
    }, ErrorFactory("user.usernameLenght"));
  });

  it(`Should show 'Le mot de passe doit contenir au moins 4 caractères' when password length < 4`, async () => {
    assert.throws(() => {
      let result = User.create("success", "p");
    }, ErrorFactory("user.passwordLenght"));
  });

  it(`Should be show 'Le mot de passe doit contenir au moins 4 caractères' when password length < 4`, async () => {
    assert.throws(() => {
      let result = User.create("success", "p    ");
    }, ErrorFactory("user.passwordLenght"));
  });

  it(`Should parse a User object`, async () => {
    let username = "username";
    let password = "password";
    let result = User.parse(username,password);
    assert.deepStrictEqual({username:result.username, password: result.password}, {username, password});
  });

});
