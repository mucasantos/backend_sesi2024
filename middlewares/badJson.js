const badJsonFormat = (err, req, res, next) => {

    console.log(err)
    if (err instanceof SyntaxError) {
        console.error('Erro de JSON malformado:', err.message);
        return res.status(400).json({ message: 'JSON malformado. Verifique a sintaxe.' });
    }
    next();
}

module.exports = badJsonFormat ;