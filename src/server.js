const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Importar jsonwebtoken para gerar tokens

const app = express();

const secretKey = 'minhaChaveSecreta';  // Chave secreta para assinar o JWT

// Middleware para interpretar JSON
app.use(express.json());

// Configuração do banco de dados MySQL
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

// Rota para cadastrar novos usuários
app.post('/usuarios', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ msg: 'Preencha todos os campos' });
    }

    const checkEmailQuery = 'SELECT email FROM usuarios WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: 'Erro ao verificar email', error: err });
        }
        if (results.length > 0) {
            return res.status(400).json({ msg: 'Email já cadastrado' });
        }

        bcrypt.hash(senha, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ msg: 'Erro ao criptografar a senha', error: err });
            }

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

// Rota de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ msg: 'Preencha todos os campos' });
    }

    const checkUserQuery = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ msg: 'Erro ao verificar usuário', error: err });
        }

        if (results.length === 0) {
            return res.status(400).json({ msg: 'Usuário não encontrado' });
        }

        const usuario = results[0];

        // Comparar a senha enviada com a senha armazenada no banco
        bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ msg: 'Erro ao comparar senhas', error: err });
            }

            if (!isMatch) {
                return res.status(400).json({ msg: 'Senha incorreta' });
            }

            // Se a senha estiver correta, gerar um token JWT
            const token = jwt.sign({ userId: usuario.id, email: usuario.email }, secretKey, { expiresIn: '1h' });

            res.status(200).json({ msg: 'Login bem-sucedido', token });
        });
    });
});

// Servidor rodando na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
