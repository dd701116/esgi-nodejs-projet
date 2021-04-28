const fs = require('fs');
const locales = {
  EN:JSON.parse(fs.readFileSync("locales/en.json")),
  FR:JSON.parse(fs.readFileSync("locales/fr.json"))
};

class CustomError extends Error{
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const ErrorFactory = (name, lang="FR") => {
  let locale;
  if (/^[a-zA-Z]*\.[a-zA-Z]*$/.test(name)) {
    let section = name.split(".");
    locale = locales[lang].error[section[0]][section[1]];
  }else{
    locale = locales[lang].error[name];
  }
  return new CustomError(locale.message, locale.code);
}
module.exports = {
  CustomError,
  ErrorFactory
};
