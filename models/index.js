const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.funcionario = require("./auth.model.js")(sequelize, Sequelize);
db.associado = require("./associado.model.js")(sequelize, Sequelize);
db.publicacao = require("./publicacao.model.js")(sequelize, Sequelize);
db.exemplar = require("./exemplar.model.js")(sequelize, Sequelize);
db.reserva = require("./reserva.model.js")(sequelize, Sequelize);
db.emprestimo = require("./emprestimo.model.js")(sequelize, Sequelize);

module.exports = db;
