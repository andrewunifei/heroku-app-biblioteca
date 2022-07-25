const express = require("express");
const path = __dirname + "/dist/";
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));

app.use(express.json());  /* bodyParser.json() is deprecated */
//app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */
app.use(express.static(path))

const db = require("./app/models");
db.sequelize.sync();

// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });

app.get('/', (req, res) =>
    res.sendFile(path + 'index.html'),
);

require("./app/routes/routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
