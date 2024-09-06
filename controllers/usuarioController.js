const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');  // Conexão com o banco de dados

const secretKey = 'minhaChaveSecreta';  // Chave secreta para o JWT

// Função para cadastrar novos usuários
exports.cadastrarUsuario = (req, res) => {
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

        // Criptografar a senha
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
};

// Função para login de usuários
exports.loginUsuario = (req, res) => {
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

        // Comparar a senha enviada com a armazenada no banco de dados
        bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ msg: 'Erro ao comparar senhas', error: err });
            }

            if (!isMatch) {
                return res.status(400).json({ msg: 'Senha incorreta' });
            }

            // Gerar token JWT
            const token = jwt.sign({ userId: usuario.id, email: usuario.email }, secretKey, { expiresIn: '1h' });

            res.status(200).json({ msg: 'Login bem-sucedido', token });
        });
    });
};


