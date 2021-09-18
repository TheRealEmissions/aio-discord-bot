class DiscordPaging {
  constructor(App) {
    this.App = App;
  }

  /**
   * @param {Array} embeds
   */
  handle(embeds, { user, msg, channel, leftArrow, rightArrow }) {
    return new Promise(async (resolve, reject) => {
      if (!msg && !channel)
        return reject(
          `No channel specified when msg is undefined! ${__dirname}`
        );
      if (!msg)
        msg = await this.App.utils.Respond.send({
          c: channel,
          response: embeds[0],
          paging: { page: 1, max: embeds.length },
        });
      if (embeds.length === 1) return resolve("none");
      msg.react(leftArrow);
      msg.react(rightArrow);
      const collector = new this.App.modules.Discord.ReactionCollector(
        msg,
        (r, u) =>
          [leftArrow, rightArrow].includes(r.emoji.name) && u.id === user.id,
        { time: 600000 }
      );
      let data = {
        currentIndex: 0,
      };
      collector.on("collect", (r, u) => {
        r.users.remove(u);
        if (r.emoji.name === leftArrow) {
          if (data.currentIndex === 0) data.currentIndex = embeds.length - 1;
          else data.currentIndex -= 1;
        }
        if (r.emoji.name === rightArrow) {
          if (data.currentIndex === embeds.length - 1) data.currentIndex = 0;
          else data.currentIndex += 1;
        }
        this.App.utils.Respond.edit({
          msg: msg,
          response: embeds[data.currentIndex],
          paging: {
            page: data.currentIndex + 1,
            max: embeds.length,
          },
        });
      });
      resolve(collector);
    });
  }

  create(
    embed,
    { fieldsPerEmbed = this.App.Config.defaults.paging.fieldsPerEmbed, fields }
  ) {
    return new Promise(async (resolve, reject) => {
      let embeds = [];
      if (typeof fields === "undefined" && embed.fields.length > 0) {
        fields = embed.fields;
        embed.fields = [];
      }
      for (const i of fields) {
        if (embeds.length < 1) embeds.push(this.App.modules.rfdc(embed));
        if (embeds.length >= 1)
          if (embeds[embeds.length - 1].fields.length >= fieldsPerEmbed)
            embeds.push(this.App.modules.rfdc(embed));
        embeds[embeds.length - 1].fields.push(this.App.modules.rfdc(i));
      }
      return resolve(embeds);
    });
  }
}

module.exports = DiscordPaging;
