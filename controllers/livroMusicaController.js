const db = require('../config/db');

// Função para salvar um livro
exports.salvarLivro = (req, res) => {
    const { titulo, autor, genero, resumo } = req.body;

    // Validação de campos obrigatórios
    if (!titulo || !autor || !genero) {
        return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios do livro' });
    }

    // Inserção do livro no banco de dados
    const insertLivroQuery = 'INSERT INTO livros (titulo, autor, genero, resumo) VALUES (?, ?, ?, ?)';
    db.query(insertLivroQuery, [titulo, autor, genero, resumo || null], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: 'Erro ao salvar o livro', error: err });
        }
        res.status(201).json({ msg: 'Livro salvo com sucesso', livroId: result.insertId });
    });
};

// Função para salvar uma música
exports.salvarMusica = (req, res) => {
    const { titulo, artista, genero, resumo } = req.body;

    // Validação de campos obrigatórios
    if (!titulo || !artista || !genero) {
        return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios da música' });
    }

    // Inserção da música no banco de dados
    const insertMusicaQuery = 'INSERT INTO musicas (titulo, artista, genero, resumo) VALUES (?, ?, ?, ?)';
    db.query(insertMusicaQuery, [titulo, artista, genero, resumo || null], (err, result) => {
        if (err) {
            return res.status(500).json({ msg: 'Erro ao salvar a música', error: err });
        }
        res.status(201).json({ msg: 'Música salva com sucesso', musicaId: result.insertId });
    });
};
