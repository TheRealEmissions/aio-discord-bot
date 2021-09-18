class Addons {
  constructor(App) {
    this.App = App;
  }

  has(addon) {
    if (!this.App.addons) return false;
    return Object.keys(this.App.addons).includes(addon);
  }

  get() {
    if (!this.App.addons) return [];
    return Object.keys(this.App.addons);
  }
}

module.exports = Addons;
