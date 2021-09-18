const BaseApp = require(`./BaseApp`);
class App extends BaseApp {
  /**
   * @param {Date} date
   */
  constructor(date) {
    super();

    // @ts-ignore
    process.on("unhandledRejection", (err) => this.utils.Logger.error(err));

    // set date of bot starting
    this.date = date;

    // set utils
    this.utils = {
      Logger: new (require(`./utils/Logger.js`))(this),
    };

    this.addons = {};

    // run controllers
    this.controllers = {
      priority: [],
      secondary: [],
    };
    this.controller();
  }

  priority(controllers) {
    return new Promise(async (resolve, reject) => {
      await Promise.all(
        controllers.map((f) =>
          new (require(`./controller/${f}`))(this)
            .init()
            .catch((e) => this.utils.Logger.error(e, e.stack))
        )
      );
      return resolve();
    });
  }

  secondary(controllers) {
    return new Promise(async (resolve, reject) => {
      await Promise.all(
        controllers.map((f) => {
          if (f === ".login.js")
            return new (require(`./controller/${f}`))(this)
              .init()
              .catch((e) => this.utils.Logger.error(e, e.stack));
          else
            return new Promise((r, re) =>
              this.Client.once("ready", () => {
                return r(
                  new (require(`./controller/${f}`))(this)
                    .init()
                    .catch((e) => this.utils.Logger.error(e, e.stack))
                );
              })
            );
        })
      );
      return resolve();
    });
  }

  async controller() {
    // Get all controllers in array
    const files = await this.modules.FS.readdirAsync(
      `${__dirname}${this.pathSep}controller`
    ).catch((e) => this.utils.Logger.error(e, e.stack));

    // Loop through array of files
    for (const file of files instanceof Array ? files : Array(files)) {
      // require file
      const f = require(`./controller/${file}`);

      // push to arrays
      if (f.prototype.priority) this.controllers.priority.push(file);
      else this.controllers.secondary.push(file);

      continue;
    }

    // handle controllers
    await this.priority(this.controllers.priority);
    await this.secondary(this.controllers.secondary);
  }
}

module.exports = App;
