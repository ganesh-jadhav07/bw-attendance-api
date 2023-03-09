const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const { DataTypes } = Sequelize;
const Student = sequelize.define(
  "student",
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
    Department: {
      type: DataTypes.STRING,
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

module.exports = Student;
