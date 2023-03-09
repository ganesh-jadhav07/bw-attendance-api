const { UUIDV4 } = require("sequelize");
const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const { DataTypes } = Sequelize;
const Session = sequelize.define(
  "session",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,

      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING,
    },
    Host: {
      type: DataTypes.STRING,
    },
    Description: {
      type: DataTypes.STRING,
    },
    SessionCode: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4,
      unique: true,
    },
    Date: {
      type: DataTypes.DATEONLY,
    },
    StartTime: {
      type: DataTypes.DATE,
    },
    EndTime: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Session;
