const express = require('express');
const router = express.Router();
const livroMusicaController = require('../controllers/livroMusicaController');
const verifyJWT = require('../middlewares/verifyJWT'); // Middleware para verificar o JWT

// Rota para salvar um livro (protegida com JWT)
router.post('/livros', verifyJWT, livroMusicaController.salvarLivro);

// Rota para salvar uma música (protegida com JWT)
router.post('/musicas', verifyJWT, livroMusicaController.salvarMusica);

// Rota para listar livros e músicas no feed
router.get('/feed', verifyJWT, livroMusicaController.betterFeed);

module.exports = router;
