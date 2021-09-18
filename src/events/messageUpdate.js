class MessageUpdate {
  constructor(App) {
    this.App = App;
  }

  async run(message, newMessage) {
    if (message.author.bot) return;
    if (this.App.Config.debugging)
      this.App.utils.Logger.edit(
        `${message.guild.name} (${message.guild.id}) => #${message.channel.name} (${message.channel.id}) => @${message.author.tag} (${message.author.id}) =>\nOLD: ${message.content}\nNEW: ${newMessage.content}`
      );
  }
}

module.exports = MessageUpdate;
