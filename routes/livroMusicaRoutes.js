const express = require('express');
const router = express.Router();
const livroMusicaController = require('../controllers/livroMusicaController');

// Rota para salvar um livro
router.post('/livros', livroMusicaController.salvarLivro);

// Rota para salvar uma música
router.post('/musicas', livroMusicaController.salvarMusica);

module.exports = router;
