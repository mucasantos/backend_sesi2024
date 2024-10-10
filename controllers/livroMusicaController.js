const db = require('../config/db'); // Conexão com o banco de dados

// Função para salvar um livro
exports.salvarLivro = (req, res) => {
  const { titulo, autor, genero } = req.body;
  const usuarioId = req.user.userId; // O ID do usuário autenticado, extraído do token

  if (!titulo || !autor || !genero) {
    return res.status(400).json({ msg: 'Preencha todos os campos do livro' });
  }

  const insertLivroQuery =
    'INSERT INTO livros (titulo, autor, genero, usuario_id) VALUES (?, ?, ?, ?)';
  db.query(insertLivroQuery, [titulo, autor, genero, usuarioId], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: 'Erro ao salvar o livro', error: err });
    }
    res.status(201).json({ msg: 'Livro salvo com sucesso', livroId: result.insertId });
  });
};

// Função para salvar uma música
exports.salvarMusica = (req, res) => {
  const { titulo, artista, genero } = req.body;
  const usuarioId = req.user.userId; // O ID do usuário autenticado, extraído do token

  if (!titulo || !artista || !genero) {
    return res.status(400).json({ msg: 'Preencha todos os campos da música' });
  }

  const insertMusicaQuery =
    'INSERT INTO musicas (titulo, artista, genero, usuario_id) VALUES (?, ?, ?, ?)';
  db.query(insertMusicaQuery, [titulo, artista, genero, usuarioId], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: 'Erro ao salvar a música', error: err });
    }
    res.status(201).json({ msg: 'Música salva com sucesso', musicaId: result.insertId });
  });
};

// Função para listar livros e músicas cadastrados pelo usuário
exports.feed = (req, res) => {
  const usuarioId = req.user.userId; // ID do usuário extraído do middleware JWT

  console.log(usuarioId);

  //devolve os livros e musica
  //const listarLivrosQuery = 'SELECT * FROM livros';
  //const listarMusicasQuery = 'SELECT * FROM musicas';

  //alem de devolver, popula com as info do dono
  const listarLivrosQuery = `
    SELECT livros.*, usuarios.nome, usuarios.email 
    FROM livros 
    JOIN usuarios ON livros.usuario_id = usuarios.id
`;

  const listarMusicasQuery = `
    SELECT musicas.*, usuarios.nome, usuarios.email 
    FROM musicas 
    JOIN usuarios ON musicas.usuario_id = usuarios.id
`;

  // Executar ambas as consultas em paralelo
  db.query(listarLivrosQuery, [usuarioId], (err, livros) => {
    if (err) {
      return res.status(500).json({ msg: 'Erro ao listar livros', error: err });
    }

    db.query(listarMusicasQuery, [usuarioId], (err, musicas) => {
      if (err) {
        return res.status(500).json({ msg: 'Erro ao listar músicas', error: err });
      }

      // Retornar os livros e músicas juntos
      res.status(200).json({ livros, musicas });
    });
  });
}; // Função para listar todos os livros e músicas com chave "owner" para nome e email dos donos
exports.betterFeed = (req, res) => {
  const listarLivrosQuery = `
        SELECT livros.id AS livro_id, livros.titulo, livros.autor, livros.genero, livros.resumo, 
               usuarios.id AS usuario_id, usuarios.nome, usuarios.email 
        FROM livros 
        JOIN usuarios ON livros.usuario_id = usuarios.id
    `;

  const listarMusicasQuery = `
        SELECT musicas.id AS musica_id, musicas.titulo, musicas.artista, musicas.genero, musicas.resumo, 
               usuarios.id AS usuario_id, usuarios.nome, usuarios.email 
        FROM musicas 
        JOIN usuarios ON musicas.usuario_id = usuarios.id
    `;

  // Executar ambas as consultas em paralelo
  db.query(listarLivrosQuery, (err, livros) => {
    if (err) {
      return res.status(500).json({ msg: 'Erro ao listar livros', error: err });
    }

    db.query(listarMusicasQuery, (err, musicas) => {
      if (err) {
        return res.status(500).json({ msg: 'Erro ao listar músicas', error: err });
      }

      // Reestruturar os resultados para incluir os dados do usuário na chave "owner"
      const livrosFormatados = livros.map((livro) => ({
        id: livro.livro_id,
        titulo: livro.titulo,
        autor: livro.autor,
        genero: livro.genero,
        resumo: livro.resumo,
        owner: {
          id: livro.usuario_id,
          nome: livro.nome,
          email: livro.email
        }
      }));

      const musicasFormatadas = musicas.map((musica) => ({
        id: musica.musica_id,
        titulo: musica.titulo,
        artista: musica.artista,
        genero: musica.genero,
        resumo: musica.resumo,
        owner: {
          id: musica.usuario_id,
          nome: musica.nome,
          email: musica.email
        }
      }));

      // Retornar os livros e músicas formatados
      res.status(200).json({ livros: livrosFormatados, musicas: musicasFormatadas });
    });
  });
};
