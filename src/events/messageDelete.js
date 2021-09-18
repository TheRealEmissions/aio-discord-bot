class MessageDelete {
  constructor(App) {
    this.App = App;
  }

  run(message) {
    if (message.author.bot) return;
    if (this.App.Config.debugging)
      this.App.utils.Logger.delete(
        `${message.guild.name} (${message.guild.id}) => #${message.channel.name} (${message.channel.id}) => @${message.author.tag} (${message.author.id}) => ${message.content}`
      );
  }
}

module.exports = MessageDelete;
