class Logger {
  constructor(App) {
    this.App = App;
    this.chalk = App.modules.Chalk;
  }

  get timestamp() {
    return new Date().toLocaleString();
  }

  /**
   * @param {String} type
   */
  msgDate(type = null) {
    return this.chalk.cyan.bold(
      `[${this.timestamp}] ${type === null ? `` : `${type} `}=> `
    );
  }

  /**
   * @param {String[]} message
   */
  log(...message) {
    console.log(this.msgDate(), this.chalk.yellow(...message));
  }

  /**
   * @param {String[]} message
   */
  warn(...message) {
    console.log(this.chalk.yellow.bold(`[WARN] [${this.timestamp}] => `));
    console.warn(...message);
    console.log(this.chalk.yellow.bold(`[/WARN]`));
  }

  /**
   * @param {String[]} message
   */
  error(...message) {
    console.log(this.chalk.red.bold(`[ERROR] [${this.timestamp}] => `));
    console.warn(...message);
    console.log(this.chalk.red.bold(`[/ERROR]`));
  }

  /**
   * @param {String[]} message
   */
  info(...message) {
    console.log(this.msgDate(`INFO`), this.chalk.yellow(...message));
  }

  /**
   * @param {String[]} message
   */
  db(...message) {
    console.log(this.msgDate(`DATABASE`), this.chalk.yellow(...message));
  }

  /**
   * @param {String[]} message
   */
  debug(...message) {
    console.log(this.msgDate(`DEBUG`), this.chalk.yellow(...message));
  }

  /**
   * @param {String} type
   * @param {String[]} message
   */
  discord(type, ...message) {
    console.log(
      this.msgDate(`DISCORD`),
      this.chalk.yellow(`${type} => `),
      this.chalk.yellow(...message)
    );
  }

  /**
   * @param {String[]} message
   */
  message(...message) {
    this.discord("MESSAGE", ...message);
  }

  /**
   * @param {String[]} message
   */
  delete(...message) {
    this.discord("DELETE", ...message);
  }

  /**
   * @param {String[]} message
   */
  edit(...message) {
    this.discord("EDIT", ...message);
  }
}

module.exports = Logger;
