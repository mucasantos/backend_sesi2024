const jwt = require('jsonwebtoken');
const secretKey = 'minhaChaveSecreta';

module.exports = (req, res, next) => {

    const authData = req.headers['authorization'];
    if (!authData) {
        return res.status(401).json({ msg: 'Acesso negado. Nenhum token fornecido.' });
    }
    
    const token = authData.split(' ')[1]    

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado. Nenhum token fornecido.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: 'Token inválido ou expirado' ,error: err});
        }

        // Adiciona as informações do usuário (extraídas do token) à requisição
        req.user = decoded;

        console.log(decoded);
        
        next();
    });
};
