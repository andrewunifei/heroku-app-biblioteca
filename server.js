const express = require("express")

const app = express()

app.get('/', (req, res) => {
    res.send("Olá mundo!")
});

const PORT = process.env.PORT  || 8080;
app.listen(PORT, () => {
    console.log("Servidor ouvindo na porta", PORT)
})