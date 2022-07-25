const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
// const cors = require("cors");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));

app.use(express.json());  /* bodyParser.json() is deprecated */
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */
app.use(express.static('./public/Angular10Crud'));

const db = require("./app/models");
db.sequelize.sync();

// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to bezkoder application." });
// });

app.get('/', (req, res) =>
    res.sendFile('./public/index.html', {root: './public/Angular10Crud/'}),
);

require("./app/routes/routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
