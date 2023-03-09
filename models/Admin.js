const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const { DataTypes } = Sequelize;
const Admin = sequelize.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING,
    },
    Email: {
      type: DataTypes.STRING,
      unique: true,
    },
    Contact: {
      type: DataTypes.STRING,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Admin;
