const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const { DataTypes } = Sequelize;
const Team = sequelize.define(
  "team",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Team;
