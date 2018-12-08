const express = require('express');
const { verificaToken } = require('../middlewares/autonticacion');
let app = express();
let Producto = require('../models/producto');

//=========================
//Obtener todos los productos
//

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde) //limit 
        .exec((err, productos) => {
            if (err) {
                res.status(500).json({ ok: false, err });
            }
            res.json({ ok: true, productos });
        });

});

app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec(
            (err, productBD) => {
                if (err) {
                    res.status(500).json({ ok: false, err });
                }
                if (!productBD) {
                    res.status(400).json({ ok: false, productBD });
                }
                res.json({ ok: true, productBD });
            });
});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;


    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productBD) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }
            if (!productBD) {
                return res.status(400).json({ ok: false, productBD });
            }
            res.json({ ok: true, productBD });
        });
});

app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let productonew = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    productonew.save((err, productBD) => {
        if (err) {
            res.status(500).json({ ok: false, err });
        }
        if (!productBD) {
            res.status(500).json({ ok: false, productBD });
        }
        res.json({ ok: true, productBD });
    });
});



app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productBD) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (!productBD) {
            return res.status(500).json({ ok: false, message: 'El id no existe' });
        }

        productBD.nombre = body.nombre,
            productBD.precioUni = body.precioUni,
            productBD.descripcion = body.descripcion,
            productBD.disponible = body.disponible,
            productBD.categoria = body.categoria,

            productBD.save((err, productoGuardado) => {
                if (err) {
                    return res.status(500).json({ ok: false, err });
                }
                res.json({ ok: true, productoGuardado });
            });
    });

    // let productoUpdate = {
    //     nombre: body.nombre,
    //     precioUni: body.precioUni,
    //     descripcion: body.descripcion,
    //     disponible: body.disponible,
    //     categoria: body.categoria,
    //     usuario: req.usuario._id
    // };
    // Producto.findOneAndUpdate(id, productoUpdate, (err, productBD) => {
    //     if (err) {
    //         res.status(500).json({ ok: false, err });
    //     }
    //     if (!productBD) {
    //         res.status(500).json({ ok: false, productBD });
    //     }
    //     res.json({ ok: true, productBD });
    // });

    //No cambia el dato
});

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let prodductoDelete = {
        disponible: false
    }

    Producto.findById(id, (err, productBD) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }
        if (!productBD) {
            return res.status(500).json({ ok: false, message: 'El id no existe' });
        }

        productBD.disponible = false;
        productBD.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({ ok: false, err });
            }
            res.json({ ok: true, productoBorrado });
        });
    });


});

module.exports = app;