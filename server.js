const express = require("express");
const cors = require("cors");
//const path = require("path");

// Import Database Model
const sequelize = require("./config/db");

const Student = require("./models/Student");
const Admin = require("./models/Admin");
const Session = require("./models/Session");
const Attendance = require("./models/Attendance");
const Team = require("./models/Team");

const app = express();

app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/session", require("./api/session"));
app.use("/student", require("./api/student"));
app.use("/admin", require("./api/admin"));
app.use("/attendance", require("./api/attendance"));

// Serve static assets in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on port http://localhost:${PORT}`)
);

// Relationship

// 1:M
Student.hasMany(Attendance, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
});

Attendance.belongsTo(Student, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
});

// 1:M
Session.hasMany(Attendance, {
  foreignKey: "sessionId",
  onDelete: "CASCADE",
});

Attendance.belongsTo(Session, {
  foreignKey: "sessionId",
  onDelete: "CASCADE",
});

// 1: M
Team.hasMany(Student, {
  foreignKey: "teamId",
  onDelete: "CASCADE",
});

Student.belongsTo(Team, {
  foreignKey: "teamId",
  onDelete: "CASCADE",
});

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     //working with the tables
//     console.log("Table and Model Updated Successfully");
//   })
//   .catch((err) =>
//     console.log(
//       "Database is Under Maintainance or max_connection limit is reached"
//     )
//   );
