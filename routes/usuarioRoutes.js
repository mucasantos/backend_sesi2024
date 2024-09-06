const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para cadastrar usuário
router.post('/cadastrar', usuarioController.cadastrarUsuario);

// Rota para login
router.post('/login', usuarioController.loginUsuario);

module.exports = router;
