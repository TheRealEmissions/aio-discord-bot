class database {
  constructor(App) {
    this.App = App;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.App.modules.Mongoose.connect(this.App.auth.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.App.modules.Mongoose.connection.on(
        "error",
        this.App.utils.Logger.error.bind(
          this.App.utils.Logger.error,
          `Connection error:`
        )
      );
      this.App.modules.Mongoose.connection.once("open", () => {
        this.App.utils.Logger.db(`Connected to the database`);
        return resolve();
      });
    });
  }

  get priority() {
    return true;
  }
}

module.exports = database;
