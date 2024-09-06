const mysql = require('mysql2');

// Configuração da conexão MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lipetoni',
    database: 'sistema'
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
