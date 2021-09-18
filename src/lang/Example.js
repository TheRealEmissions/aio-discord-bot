class Example {
  constructor(App) {
    this.App = App;
  }

  example(User) {
    return Object({
      content: "no",
      embed: {
        title: "test",
        description: "test",
        fields: [
          {
            name: "test field",
            value: "no",
            inline: true,
          },
        ],
        thumbnail: User.avatarURL(),
        image: User.avatarURL(),
        color: 0xffff00,
        footer: {
          text: "test",
          image: User.avatarURL(),
        },
      },
    });
  }
}

module.exports = Example;
