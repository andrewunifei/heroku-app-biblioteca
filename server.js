const express = require("express")
const cors = require("cors");
const path = __dirname + "/dist/";

const app = express()

app.use(express.static(path))
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

const db = require("./models");
db.sequelize.sync();

app.get('/', (req, res) => {
    res.sendFile(path + 'index.html')
});

const router = express.Router();
const auth = require("./controllers/auth.controller.js");
const associado = require("./controllers/associado.controller.js");
const publicacao = require("./controllers/publicacao.controller.js");
const exemplar = require("./controllers/exemplar.controller.js");
const reserva = require("./controllers/reserva.controller.js");
const emprestimo = require("./controllers/emprestimo.controller.js");

// Funcionário
//router.post("/", auth.login);

router.get("/", (req, res) => {
  res.send({
    codigo: "1",
    senha: "123",
    nome: "Admin",
    funcao: "gerente"
  })
});

router.post("/cadastrar_func", auth.cadastrar_func);

// Associado
router.post("/associado", associado.login);
router.post("/cadastrar-assoc", associado.cadastrar_assoc);

// Publicação
router.post("/cadastrar-pub", publicacao.cadastrar_pub);
router.post("/consultar-pub", publicacao.consultar_pub);

// Exemplar
router.post("/cadastrar-exemplar", exemplar.cadastrar_exemplar);

// Reserva
router.post("/cadastrar-reserva", reserva.cadastrar_reserva);

// Empréstimo
router.post("/cadastrar-emp", emprestimo.cadastrar_emprest);
router.post("/devolucao", emprestimo.devolucao);

// appRouter = require("./routes/routes.js");
app.use("/api", router);

const PORT = process.env.PORT  || 8080;
app.listen(PORT, () => {
    console.log("Servidor ouvindo na porta", PORT)
})