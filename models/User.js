const CustomError = require('./CustomError');
const utils = require('../utils');
const bcrypt = require('bcrypt');

class User{
  constructor(username, password) {
    this.username = username,
    this.password = password
  }
};

const UserFactory = {
  create: (username, password) => {
    if (username === username.toLowerCase().trim() && username === utils.removeAccent(username).trim()) {
      if (username.length>=2 && username.length<=20) {
        if (password.trim().length>=4) {
          return new User(username, bcrypt.hashSync(password,1));
        }else{
          throw new CustomError("Le mot de passe doit contenir au moins 4 caractères", 400);
        }
      }else{
        throw new CustomError("Votre identifiant doit contenir entre 2 et 20 caractères", 400);
      }
    }else{
      throw new CustomError("Votre identifiant ne doit contenir que des lettres minuscules non accentuées", 400);
    }
  },
  parse: (data) => {
    if (data.username && data.password) {
      return new User(data.username, data.password);
    }
    throw new CustomError("Le serveur rencontre un problème durant la récupération de vos données (#USERFACTORY:PARSE)", 500);
  }
};

module.exports = UserFactory;
