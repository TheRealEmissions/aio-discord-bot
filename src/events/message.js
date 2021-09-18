class Message {
  constructor(App) {
    this.App = App;
  }

  async run(message) {
    if (message.author.bot) return;
    if (this.App.Config.debugging)
      this.App.utils.Logger.message(
        `${message.guild.name} (${message.guild.id}) => #${message.channel.name} (${message.channel.id}) => @${message.author.tag} (${message.author.id}) => ${message.content}`
      );
    let prefix = process.env.PREFIX || this.App.Config.defaults.prefix;
    let args = message.content.slice(prefix.length).split(" ");
    let command = args[0];
    let arg = args[1];
    let cmd = await this.App.utils.Command.getCommand(
      command,
      arg ? arg : null
    );
    if (cmd)
      if (
        await this.App.utils.Command.hasAccess(
          message.member,
          cmd,
          arg ? arg : null
        )
      )
        cmd.run(message, args);
  }
}

module.exports = Message;
