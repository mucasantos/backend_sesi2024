const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// Porta em que o servidor vai rodar
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
