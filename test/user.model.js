const assert = require('assert');
const User = require('../models/User');
const CustomError = require('../models/CustomError');

describe("The User module", () => {
  it(`Should create a User object`, async () => {
    let result = User.create("success", "password");
    assert.strictEqual(result.constructor.name, "User");
  });

  it(`Should show 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées' when username = succèss`, async () => {
    assert.throws(() => {
      let result = User.create("succèss", "password");
    }, new CustomError("Votre identifiant ne doit contenir que des lettres minuscules non accentuées", 400));
  });

  it(`Should show 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées' when username = Success`, async () => {
    assert.throws(() => {
      let result = User.create("Success", "password");
    }, new CustomError("Votre identifiant ne doit contenir que des lettres minuscules non accentuées", 400));
  });

  it(`Should show 'Votre identifiant doit contenir entre 2 et 20 caractères' when username length < 2`, async () => {
    assert.throws(() => {
      let result = User.create("s", "password");
    }, new CustomError("Votre identifiant doit contenir entre 2 et 20 caractères", 400));
  });

  it(`Should show 'Votre identifiant doit contenir entre 2 et 20 caractères' when username length > 20`, async () => {
    assert.throws(() => {
      let result = User.create("sssssssssssssssssssss", "password");
    }, new CustomError("Votre identifiant doit contenir entre 2 et 20 caractères", 400));
  });

  it(`Should show 'Le mot de passe doit contenir au moins 4 caractères' when password length < 4`, async () => {
    assert.throws(() => {
      let result = User.create("success", "p");
    }, new CustomError("Le mot de passe doit contenir au moins 4 caractères", 400));
  });

  it(`Should be show 'Le mot de passe doit contenir au moins 4 caractères' when password length < 4`, async () => {
    assert.throws(() => {
      let result = User.create("success", "p    ");
    }, new CustomError("Le mot de passe doit contenir au moins 4 caractères", 400));
  });

  it(`Should parse a User object`, async () => {
    let result = User.parse("username","password");
    assert.strictEqual(result.constructor.name, "User");
  });

});
