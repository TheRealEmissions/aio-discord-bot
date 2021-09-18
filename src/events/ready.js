class Event {
  constructor(App) {
    this.App = App;
  }

  async run() {
    //console.log(this.App.Client.guilds.cache.array()[0].roles.cache.array());
  }
}

module.exports = Event;
