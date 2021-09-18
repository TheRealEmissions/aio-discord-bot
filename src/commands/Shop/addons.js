class Command {
  constructor(App, Lang) {
    this.App = App;
    this.Lang = Lang;
    this.conf = {
      aliases: [],
    };
  }
}

module.exports = Command;
