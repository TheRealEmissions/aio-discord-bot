class Command {
  constructor(App, Lang) {
    this.App = App;
    this.Lang = Lang;
    this.conf = {
      aliases: this.App.Config.commands.help.aliases,
    };
  }

  async run(msg, args) {}
}

module.exports = Command;
