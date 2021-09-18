class Response {
  constructor(App) {
    this.App = App;

    this.types = {
      success: { color: 0xf72e50 },
      danger: { color: 0xdb4f4f },
      log: { color: 0xffaa28 },
      info: { color: 0x00baee },
    };
  }

  /**
   * Function Used to Build and Send Messages to Discord Channel or User
   *
   * @param {GuildChannel} [c] - Define the Channel if message sent to a Channel
   * @param {GuildMember} [m] - Defines the Member Object if sent as a DM
   * @param {User} [u] - Defines the User Object if sent as a DM
   * @param {(Object|String)} response - Defines the Message to send
   * @param {String} [type=default] - Defines the Type to use when building and sending the message from this.types
   *
   * @param {Channel} [loc] - Location to send the Message to
   * @param {Message} [msg] - Message Resolvable Object after the message is sent
   */
  async send({ c, m, u, response, type = "success", paging }, loc, msg) {
    return new Promise(async (resolve, reject) => {
      if (!c && !m && !u)
        return reject("No supplied method of sending the message.");
      if (!response) return reject("No Content to Send.");
      if (m && !u) u = m.user;
      if (u) loc = u;
      if (c) loc = c;
      let r;
      if (typeof response === "object")
        r = this.Embed({ embed: response, type, paging });
      if (typeof response !== "object")
        msg = await loc
          .send(response)
          .catch((err) => this.App.utils.Logger.error(err));
      else
        msg = await loc
          .send(
            typeof response.content === "undefined" ? "" : response.content,
            { embed: r }
          )
          .catch((err) => this.App.utils.Logger.error(err));
      return resolve(msg);
    });
  }

  /**
   * Function used to Edit Discord Messages
   *
   * @param {Message} msg The Message Object to Edit
   * @param {(Object|String)} response The Content to send in the Message
   * @param {String} type The type of Embed to use
   */
  async edit({ msg, response, type = "success", paging }) {
    return new Promise(async (resolve, reject) => {
      if (!msg) return reject("No Message Object Supplied to Edit.");
      let r;
      if (typeof response === "object")
        r = this.Embed({ embed: response, type, paging });
      let newMsg = await msg
        .edit(typeof response.content === "undefined" ? "" : response.content, {
          embed: r,
        })
        .catch((err) => this.App.utils.Logger.error(err));
      return resolve(newMsg);
    });
  }

  async log({ c, response, type = "success" }) {
    return new Promise(async (resolve, reject) => {
      let msg = await this.send({ c, response, type });
      return resolve(msg);
    });
  }

  Embed({ embed, type, paging }) {
    let Embed = new this.App.modules.Discord.MessageEmbed();
    if (embed) {
      if (typeof embed.author === "object" && embed.author.name !== "none")
        Embed.setAuthor(
          embed.author.name,
          embed.author.icon === "none" ? null : embed.author.icon,
          embed.author.url === "none" ? null : embed.author.url
        );
      if (embed.color && embed.color !== "none") Embed.setColor(embed.color);
      if (embed.url && embed.url !== "none" && embed.title !== "none")
        Embed.setURL(embed.url);
      else if (!embed.color) Embed.setColor(this.types[type].color);
      if (embed.title && embed.title !== "none") Embed.setTitle(embed.title);
      if (embed.description && embed.description !== "none")
        Embed.setDescription(embed.description);
      if (embed.fields)
        if (embed.fields.length > 0)
          embed.fields.forEach((f) => {
            Embed.addField(
              f.name,
              f.value,
              typeof f.inline === "undefined" ? true : f.inline
            );
          });
      if (
        typeof embed.footer === "object" &&
        embed.footer.icon &&
        embed.footer.icon !== "none"
      )
        Embed.setFooter(
          typeof paging !== "undefined"
            ? `${embed.footer.text} | Page ${paging.page}/${paging.max}`
            : embed.footer.text,
          embed.footer.icon
        );
      if (
        typeof embed.footer === "object" &&
        !embed.footer.icon &&
        embed.footer.text !== "none"
      )
        Embed.setFooter(
          typeof paging !== "undefined"
            ? `${embed.footer.text} | Page ${paging.page}/${paging.max}`
            : embed.footer.text
        );
      if (!embed.footer)
        if (typeof paging !== "undefined")
          Embed.setFooter(`Page ${paging.page}/${paging.max}`);
        else {
          if (
            typeof embed.footer === "object" &&
            !embed.footer.icon &&
            embed.footer.text !== "none"
          )
            Embed.setFooter(embed.footer.text);
          if (
            typeof embed.footer === "object" &&
            embed.footer.icon &&
            embed.footer.icon === "none" &&
            embed.footer.text !== "none"
          )
            Embed.setFooter(embed.footer.text);
        }
      if (embed.image && embed.image !== "none") Embed.setImage(embed.image);
      if (embed.thumbnail && embed.thumbnail !== "none")
        Embed.setThumbnail(embed.thumbnail);
      if (embed.timestamp && embed.timestamp !== "none")
        Embed.setTimestamp(embed.timestamp);
      if (embed.attachFiles) Embed.attachFiles(embed.attachFiles);
    }
    return Embed;
  }
}

module.exports = Response;
