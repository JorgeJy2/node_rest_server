const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);


    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((error, usuarios) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            Usuario.count({ estado: true }, (error, conteo) => {
                res.json({
                    ok: true,
                    cuantos: conteo,
                    usuarios
                });
            });

        })
});

app.post('/usuario', (req, res) => {
    let body = req.body;

    // let usuario = new Usuario({
    //     nombre: body.nombre,
    //     email: body.email,
    //     password: body.password,
    //     role: body.role
    // });

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioBD.password = null;

        res.json({
            ok: true,
            usuario: usuarioBD

        })
    });



});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);
    // delete body.password;
    // delete body.google;


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, usuarioBD) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });

});


app.delete('/usuario/:id', function(req, res) {
    // let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (error, usuarioBorrarod) => {
    //     if (error) {
    //         return res.status(400).json({
    //             ok: false,
    //             error
    //         });

    //     }

    //     if (!usuarioBorrarod) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 menssage: 'Usuario no encontrado'
    //             }
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuarioBorrarod
    //     })
    // });


    let id = req.params.id;
    let cambioEstado = {
        estado: false
    };
    Usuario.findByIdAndUpdate(id, cambioEstado, { new: true }, (error, usuarioBD) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });

});


module.exports = app;