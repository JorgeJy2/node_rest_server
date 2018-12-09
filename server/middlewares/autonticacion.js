//===========================
// Verificar token
//==========================

const jwt = require('jsonwebtoken');


let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoced) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    mensagge: "token no valido"
                }
            });
        }
        req.usuario = decoced.usuario;
        next();
    });

};

let verificaTokenAdmi = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: 'No tienes permisos morro'
        });
    }
}



let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoced) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    mensagge: "token no valido"
                }
            });
        }
        req.usuario = decoced.usuario;
        next();
    });

}

module.exports = { verificaToken, verificaTokenAdmi, verificaTokenImg };