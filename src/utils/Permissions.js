/**
 * Permissions:
 *
 * USE_COMMAND_<COMMAND>
 *
 */
class Permissions {
  constructor(App) {
    this.App = App;
    this.users = this.App.Config.permissions.users;
    this.roles = this.App.Config.permissions.roles;
  }

  /**
   * Types:
   * any - has any of the permissions listed in the array
   * all - has all permissions listed in the array
   */
  getRoles(permissions, { type = "any" }) {
    return new Promise((resolve, reject) => {
      if (typeof permissions === "string") permissions = [permissions];
      let arr = [];
      if (type === "any") {
        for (const p of permissions) {
          let roles = Object.keys(this.roles)
            .map((x) => {
              let y = this.roles[x];
              if (y.includes(p)) return x;
              else return null;
            })
            .filter((x) => x !== null);
          for (const r of roles) {
            if (!arr.includes(r)) arr.push(r);
            else continue;
          }
        }
      }
      if (type === "all") {
        for (const r of Object.keys(this.roles)) {
          let perms = this.roles[r];
          if (perms.every((x) => permissions.includes(x))) arr.push(r);
          else continue;
        }
      }
      if (type !== "any" && type !== "all") return reject(`invalid type`);
      return resolve(arr);
    });
  }

  /**
   * @param {(GuildMember|String)} member
   * @param {(Array<String>|String)} permissions
   * Does not check if user has * automatically
   */
  all(member, permissions) {
    return new Promise((resolve, reject) => {
      if (typeof permissions === "string") permissions = [permissions];
      let arr = [];
      for (const p of permissions) {
        if (Object.keys(this.users).includes(member.user.id)) {
          if (this.users[member.user.id].includes(p)) {
            arr.push({
              permission: p,
              status: true,
            });
            continue;
          }
        }
        for (const r of member.roles.cache.array()) {
          let role = this.roles[r.id] || this.roles[r.name];
          if (!role) continue;
          if (role.includes(p)) {
            arr.push({
              permission: p,
              status: true,
            });
            continue;
          }
        }
        arr.push({
          permission: p,
          status: false,
        });
      }
      return resolve(arr);
    });
  }

  /**
   * @param {(GuildMember|String)} member
   * @param {Array<String>} permissions
   */
  hasAny(member, permissions) {
    return new Promise((resolve, reject) => {
      let status = false;
      if (this.users[member.user.id].includes("*")) return resolve(true);
      for (const p of permissions) {
        if (status === true) break;
        if (Object.keys(this.users).includes(member.user.id)) {
          if (this.users[member.user.id].includes(p)) {
            status = true;
            break;
          }
        }
        for (const r of member.roles.cache.array()) {
          let role = this.roles[r.id] || this.roles[r.name];
          if (!role) continue;
          if (!role.includes(p)) continue;
          status = true;
          break;
        }
      }
      return resolve(status);
    });
  }

  /**
   * @param {(GuildMember|String)} member - GuildMember Resolvable or ID of GuildMember
   * @param {String} permission - Permission to look for
   */
  has(member, permission) {
    return new Promise(async (resolve, reject) => {
      let status = false;
      if (this.users[member.user.id].includes("*")) return resolve(true);
      if (Object.keys(this.users).includes(member.user.id)) {
        if (this.users[member.user.id].includes(permission)) status = true;
      }
      for (const r of member.roles.cache.array()) {
        let role = this.roles[r.id] || this.roles[r.name];
        if (!role) continue;
        if (!role.includes(permission)) continue;
        status = true;
        break;
      }
      return resolve(status);
    });
  }

  /**
   * @param {(GuildMember)} member - GuildMember Resolvable or ID of GuildMember
   */
  get(member) {
    return new Promise((resolve, reject) => {
      let arr = [];
      if (Object.keys(this.users).includes(member.user.id)) {
        for (const perm of this.users[member.user.id]) {
          if (arr.includes(perm)) continue;
          else arr.push(perm);
          continue;
        }
      }
      for (const r of member.roles.cache.array()) {
        let role = this.roles[r.id] || this.roles[r.name];
        if (!role) continue;
        for (const perm of role) {
          if (arr.includes(perm)) continue;
          else arr.push(perm);
          continue;
        }
        continue;
      }
      return resolve(arr);
    });
  }

  /**
   * @param {(Role|String)} role
   */
  getRole(role) {
    return new Promise((resolve, reject) => {
      let arr = [];
      if (
        Object.keys(this.roles).includes(
          role instanceof this.App.modules.Discord.Role ? role.id : role
        )
      ) {
        for (const perm of this.roles[
          role instanceof this.App.modules.Discord.Role ? role.id : role
        ]) {
          if (arr.includes(perm)) continue;
          else arr.push(perm);
          continue;
        }
      }
      return resolve(arr);
    });
  }
}

module.exports = Permissions;
