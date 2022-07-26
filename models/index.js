const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
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
