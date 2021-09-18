class login {
  constructor(App) {
    this.App = App;
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      if (!this.App.Config.login) {
        this.App.utils.Logger.info(
          `Skipped logging in due to "login" false in config.json!`
        );
        return resolve(false);
      }
      await this.App.Client.login(this.App.auth.CLIENT_TOKEN).catch(reject);
      this.App.Client.once("ready", () => {
        this.App.utils.Logger.info(
          `Discord Client initialized in ${
            new Date().getTime() - this.App.date
          }ms`
        );
        this.App.utils.Logger.info(
          `Connected to ${this.App.Client.guilds.cache.array().length} guild${
            this.App.Client.guilds.cache.array().length > 1 ? "s" : ""
          } | ${this.App.Client.channels.cache.array().length} channel${
            this.App.Client.channels.cache.array().length > 1 ? "s" : ""
          } | ${this.App.Client.guilds.cache.reduce(
            (p, c) => p + c.memberCount,
            0
          )} user${
            this.App.Client.guilds.cache.reduce(
              (p, c) => p + c.memberCount,
              0
            ) > 1
              ? "s"
              : ""
          }`
        );
        this.App.utils.Logger.info(
          `Authenticated as ${this.App.Client.user.tag} with ID ${this.App.Client.user.id}`
        );
        return resolve();
      });
    });
  }

  get priority() {
    return false;
  }
}

module.exports = login;
