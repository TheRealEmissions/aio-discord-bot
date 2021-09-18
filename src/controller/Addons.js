class Addons {
  constructor(App) {
    this.App = App;
  }

  init() {
    return new Promise(async (resolve, reject) => {
      const files = await this.App.modules.FS.readdirAsync(`./src/addons`);
      if (files.length < 1) {
        if (this.App.debug)
          new (require(`../utils/Logger`))(this.App).debug(
            `No add-ons to load!`
          );
        return resolve();
      }
      for (const file of files) {
        if (
          !this.App.modules.FS.lstatSync(`./src/addons/${file}`).isDirectory()
        )
          continue;
        if (this.App.debug)
          new (require(`../utils/Logger`))(this.App).debug(
            `Loaded: add-on "${file}"`
          );
        new (require(`./Loader`))(this.App, `../addons/${file}/`, true).init();
        if (!this.App.addons) this.App.addons = {};
        Object.assign(this.App.addons, {
          [file]: true,
        });
      }
      return resolve();
    });
  }

  get priority() {
    return true;
  }
}

module.exports = Addons;
