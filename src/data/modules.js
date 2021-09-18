class modules {
  constructor() {}

  get Discord() {
    return require(`discord.js`);
  }

  get FS() {
    return require(`fs-extra-promise`);
  }

  get Mongoose() {
    return require(`mongoose`);
  }

  get Chalk() {
    return require(`chalk`);
  }

  get Klaw() {
    return require(`klaw`);
  }

  get Path() {
    return require(`path`);
  }
}

module.exports = modules;
