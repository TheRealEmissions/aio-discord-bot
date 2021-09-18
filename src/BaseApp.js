class BaseApp {
  constructor() {
    // Initialize the Discord Client
    this.modules = require(`./data/modules`).prototype;
    this.Config = require(`../config.json`);
    this.auth = require(`./data/auth`).prototype;
    this.debug = process.env.DEBUG || this.Config.debugging;
    this.dev_mode = process.env.DEV_MODE || this.auth.DEV_MODE;
    this.Client = new this.modules.Discord.Client({});
  }

  get pathSep() {
    return this.dev_mode ? `\\` : `/`;
  }
}

module.exports = BaseApp;
