// const config = require("config");
const Sequelize = require("sequelize");
const db =
  "mysql://uqvcnpwudhzmlb8c:HerP414kkuYxNMB84AHK@beabtkoetf4xrek3ldre-mysql.services.clever-cloud.com:3306/beabtkoetf4xrek3ldre";

const sequelize = new Sequelize(db, {
  define: {
    freezeTableName: true,
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: function (field, next) {
      // for reading from database
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    },
  },
  timezone: "+05:30",
});

module.exports = sequelize;
