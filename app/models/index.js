const url = require("url");
const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
let sequelize;

if (env === 'production') {
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}
else{
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });
}

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
