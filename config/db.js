const mysql = require('mysql2');
require('dotenv').config();

// Configuração da conexão MySQL
const db = mysql.createConnection({
  host: process.env.DBLINK,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  port: 3306
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

module.exports = db;
