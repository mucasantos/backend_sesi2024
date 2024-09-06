const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');  // Importar o bcrypt

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',     // Endereço do servidor MySQL
    user: 'root',          // Usuário do MySQL
    password: 'lipetoni',  // Senha do MySQL (caso tenha)
    database: 'sistema'    // Nome do banco de dados
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

// Rota para cadastrar novos usuários
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;

    // Verificar se todos os campos foram preenchidos
    if (!nome || !email || !senha) {
        return res.status(400).json({ msg: 'Preencha todos os campos' });
    }

    // Verificar se o email já está cadastrado
    const checkEmailQuery = 'SELECT email FROM usuarios WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: 'Erro ao verificar email', error: err });
        }
        if (results.length > 0) {
            return res.status(400).json({ msg: 'Email já cadastrado' });
        }

        // Criptografar a senha antes de salvar no banco de dados
        bcrypt.hash(senha, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ msg: 'Erro ao criptografar a senha', error: err });
            }

            // Inserir o novo usuário no banco de dados com a senha criptografada
            const insertUserQuery = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
            db.query(insertUserQuery, [nome, email, hash], (err, result) => {
                if (err) {
                    return res.status(500).json({ msg: 'Erro ao cadastrar o usuário', error: err });
                }
                res.status(201).json({ msg: 'Usuário cadastrado com sucesso', userId: result.insertId });
            });
        });
    });
});

// Servidor rodando na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
