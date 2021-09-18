class Command {
  constructor(App) {
    this.App = App;
  }

  hasAccess(member, cmd, arg = false) {
    return new Promise(async (resolve, reject) => {
      if (
        await this.App.utils.Permissions.has(
          member,
          `USE_COMMAND_${cmd}${!!arg ? `_${arg}` : ``}`
        )
      )
        return resolve(true);
      const roles = await this.getAccessRoles(cmd, arg, {
        guild: member.guild,
      });
      if (member.roles.cache.array().some((x) => roles.includes(x.id)))
        return resolve(true);
      return resolve(false);
    });
  }

  getAccessRoles(cmd, arg = false, { guild = null }) {
    return new Promise((resolve, reject) => {
      const result = this.App.commands[`${cmd}${!!arg ? ` ${arg}` : ""}`];
      if (!result) return reject(`NO COMMAND`);
      const config = this.App.Config.commands[`${cmd}${!!arg ? ` ${arg}` : ""}`]
        .access;
      let roles = [...config.roles];
      if (config.inheritance && !!guild) {
        const role =
          guild.roles.cache.get(config.roles[config.roles.length - 1]) ||
          guild.roles.cache
            .array()
            .find((x) => x.name === config.roles[config.roles.length - 1]);
        if (!role) return resolve(roles);
        for (const r of guild.roles.cache.array()) {
          if (r.rawPosition > role.rawPosition && !roles.includes(r.name))
            roles.push(r.name);
          else continue;
        }
      }
      return resolve(roles);
    });
  }

  /**
   * @param {String} cmd
   * @param {String} arg
   */
  // @ts-ignore
  getCommand(cmd, arg = false) {
    return new Promise(async (resolve, reject) => {
      const result = this.App.commands[`${cmd}${!!arg ? ` ${arg}` : ""}`]
        ? this.App.commands[`${cmd}${arg ? ` ${arg}` : ""}`]
        : false;
      return resolve(result);
    });
  }
}

module.exports = Command;
