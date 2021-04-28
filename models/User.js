const {CustomError, ErrorFactory} = require("./CustomError");
const utils = require('../utils');
const bcrypt = require('bcrypt');

class User{
  constructor(username, password) {
    this.username = username,
    this.password = password
  }
};

const UserFactory = {
  create: (username, password, lang="FR") => {
    if (username === username.toLowerCase().trim() && username === utils.removeAccent(username).trim()) {
      if (username.length>=2 && username.length<=20) {
        if (password.trim().length>=4) {
          return new User(username, bcrypt.hashSync(password,10));
        }else{
          throw ErrorFactory("user.passwordLenght", lang);
        }
      }else{
        throw ErrorFactory("user.usernameLenght", lang);
      }
    }else{
      throw ErrorFactory("user.usernameFormat", lang);
    }
  },
  parse: (username, password, lang="FR") => {
    if (username === username.toLowerCase().trim() && username === utils.removeAccent(username).trim()) {
      if (username.length>=2 && username.length<=20) {
        if (password.trim().length>=4) {
          return new User(username, password);
        }else{
          throw ErrorFactory("user.passwordLenght", lang);
        }
      }else{
        throw ErrorFactory("user.usernameLenght", lang);
      }
    }else{
      throw ErrorFactory("user.usernameFormat", lang);
    }
  }
};

module.exports = UserFactory;
