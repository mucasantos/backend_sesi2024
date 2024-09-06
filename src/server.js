const express = require('express');
const usuarioRoutes = require('../routes/usuarioRoutes');  // Importa as rotas de usuários
const livroMusicaRoutes = require('../routes/livroMusicaRoutes');


const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Usar as rotas de usuários
app.use('/usuarios', usuarioRoutes);

// Servidor rodando na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
