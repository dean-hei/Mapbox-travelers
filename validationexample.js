const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  hashedPassword: {
    type: DataTypes.STRING(64),
    is: /^[0-9a-f]{64}$/i
  },
  email: {
      type: DataTypes.STRING,
      validation: {
          isEmail: true
      }
  }
});

(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();