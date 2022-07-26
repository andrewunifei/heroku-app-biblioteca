const express = require("express")
const cors = require("cors");
const path = __dirname + "/dist/";

const app = express()

app.use(express.static(path))
app.use(cors());

const db = require("./models");
db.sequelize.sync();

app.get('/', (req, res) => {
    res.sendFile(path + 'index.html')
});

app.post('/api', (req, res) => {
    res.send("Olá api")
});

require("./routes/routes")(app);

const PORT = process.env.PORT  || 8080;
app.listen(PORT, () => {
    console.log("Servidor ouvindo na porta", PORT)
})