class commands {
  constructor(App, Dir = `../`, Addon = false) {
    this.App = App;
    this.Dir = Dir;
    this.Addon = Addon;
  }

  getFiles(type) {
    return new Promise(async (resolve, reject) => {
      const dir = this.App.modules.Path.join(__dirname, this.Dir, type);
      await this.App.modules.FS.ensureDirAsync(dir).catch(reject);
      return resolve(this.loadFiles(dir).catch(reject));
    });
  }

  loadFiles(dir) {
    return new Promise((resolve, reject) => {
      let files = [];
      try {
        this.App.modules
          .Klaw(dir)
          .on("data", (item) => {
            let fileInfo = this.App.modules.Path.parse(item.path);
            if (!fileInfo.ext || fileInfo.ext !== ".js") return;
            files.push(fileInfo);
          })
          .on("end", () => {
            return resolve(files);
          })
          .on("error", (root, nodeStatsArray, next) => {
            for (let n of nodeStatsArray) {
              reject(
                `${n.name} - ${n.error.message}` ||
                  `${n.name} - ${n.error.code}: ${n.error.path}`
              );
              next();
            }
          });
      } catch (e) {
        return reject(e);
      }
    });
  }

  load(type, item, file) {
    return new Promise(async (resolve, reject) => {
      if (!file) {
        let files = await this.getFiles(type).catch(reject);
        file = files.filter((f) => f.name === item);
      }
      if (!file || !this.App.modules.FS.existsSync(file))
        return reject(`File not found`);
      let i = require(file);
      try {
        if (!this.App[type]) this.App[type] = {};
        if (this.App[type][item]) return;
        this.App[type][item] = new i(
          this.App,
          this.App.modules.FS.existsSync(
            `./src/${this.Addon ? `${this.Dir.split("../")[1]}` : ``}lang/${
              file.split(this.App.modules.Path.sep)[
                file.split(this.App.modules.Path.sep).length - 2
              ]
            }.js`
          )
            ? new (require(`${this.Dir}lang/${
                file.split(this.App.modules.Path.sep)[
                  file.split(this.App.modules.Path.sep).length - 2
                ]
              }`))(this.App)
            : null
        );
        if (this.App.Config.debugging)
          this.App.utils.Logger.debug(
            `Loaded: ${this.Addon ? `add-on ` : ``}${
              type.endsWith("s") ? type.slice(0, -1) : type
            } "${item}"${
              this.Addon
                ? ` (from ${
                    this.Dir.split("../addons/")[1].split("/")[0]
                  } add-on)`
                : ``
            }`
          );
        if (type === "events")
          this.App.Client.on(item, (...args) =>
            this.App[type][item].run(...args)
          );
        if (type === "commands") {
          if (this.App[type][item].conf.aliases) {
            for (const alias of this.App[type][item].conf.aliases) {
              if (this.App.Config.debugging)
                this.App.utils.Logger.debug(
                  `Loaded: ${
                    this.Addon ? `add-on ` : ``
                  }alias "${alias}" for "${item}"${
                    this.Addon
                      ? ` (from ${
                          this.Dir.split("../addons/")[1].split("/")[0]
                        } add-on)`
                      : ``
                  }`
                );
              this.App.commands[alias] = this.App.commands[item];
            }
          }
        }
        delete require.cache[require.resolve(file)];
        return resolve();
      } catch (e) {
        return reject(
          `Unable to load ${
            type.endsWith("s") ? type.slice(0, -1) : type
          } "${item}" at "${file}"\n \n${e}\n${e.stack}`
        );
      }
    });
  }

  loadAll(type) {
    return new Promise(async (resolve, reject) => {
      const files = await this.getFiles(type);
      for (const file of files) {
        this.load(
          type,
          file.name,
          `${file.dir}${this.App.modules.Path.sep}${file.base}`
        ).catch(reject);
      }
      return resolve();
    });
  }

  init(
    items = ["lang", "commands", "events", "models", "utils"].map((v) =>
      this.App.modules.FS.existsSync(`./src/${v}/`) ? v : "none"
    )
  ) {
    return new Promise(async (resolve, reject) => {
      for (const i of items) {
        if (i === "none") {
          continue;
        }
        await this.loadAll(i).catch(reject);
      }
      return resolve();
    });
  }

  get priority() {
    return true;
  }
}

module.exports = commands;
