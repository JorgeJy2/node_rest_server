const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;


    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
            extensionRecibida: tipo
        });
    }

    if (Object.keys(req.files).length == 0) {
        return res.status(400).json({ ok: false, err: "No se se ha subido un archivo" });
    }
    let archivo = req.files.archivo;
    let nombreArchivoCortado = archivo.name.split('.');
    //Extensiones permitidad
    let extensionesValidad = ['png', 'jpg', 'gif', 'jpeg'];
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];

    if (extensionesValidad.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Las extensiones permitidas son ' + extensionesValidad.join(', '),
            extensionRecibida: extension
        });
    }
    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({ ok: false, message: err });

        if (tipo == "usuarios")
        //Aquí actualizo la imagen
            imagenUsuario(id, res, nombreArchivo);
        if (tipo == "productos")
            imagenProducto(id, res, nombreArchivo);
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({ ok: false, message: "El usuario no existe" });
        }


        //verificar ruta
        borraArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioBD) => {

            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            if (!usuarioBD) {
                return res.status(400).json({ ok: false, message: "El usuario no existe" });
            }

            res.json({
                ok: true,
                usuarioBD,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({ ok: false, err });
        }

        if (!productoBD) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({ ok: false, message: "El producto no existe" });
        }


        //verificar ruta
        borraArchivo(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;

        productoBD.save((err, productoBD) => {

            if (err) {
                return res.status(500).json({ ok: false, err });
            }

            if (!productoBD) {
                return res.status(400).json({ ok: false, message: "El usuario no existe" });
            }

            res.json({
                ok: true,
                productoBD,
                img: nombreArchivo
            });
        });

    });
}

function borraArchivo(nombreImagen, tipoimagen) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipoimagen}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;