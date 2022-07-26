const express = require("express")
const path = __dirname + "/dist/";

const app = express()

app.use(express.static(path))

const db = require("./models");
db.sequelize.sync();

app.get('/', (req, res) => {
    res.sendFile(path + 'index.html')
});

require("./routes/routes")(app);

const PORT = process.env.PORT  || 8080;
app.listen(PORT, () => {
    console.log("Servidor ouvindo na porta", PORT)
})