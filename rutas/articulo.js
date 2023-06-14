const express = require("express");
const multer = require("multer");
const articuloControlador = require("../controladores/articulo");

const router = express.Router();
//Configurar multar
const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb)  {
        cb(null, './imagenes/articulos/');
    },

    filename: function(req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname)
    }
})

const subidas = multer({ storage: almacenamiento });

//Rutas de prueba
router.get("/ruta-de-prueba", articuloControlador.prueba)
router.get("/curso", articuloControlador.curso)

//Ruta util
router.post("/crear", articuloControlador.crear)
// El simbolo de interrogacion " ? " quiere decir que es opcional y sin el simbolo que es obligatorio
router.get("/articulos/:ultimos?", articuloControlador.listar)
router.get("/articulo/:id", articuloControlador.mostrarUno)
router.delete("/articulo/:id", articuloControlador.borrar)
router.put("/articulo/:id", articuloControlador.editar)
router.post("/subir-imagen/:id", [subidas.single("file0")], articuloControlador.subir)
router.get("/imagen/:fichero", articuloControlador.imagen)


module.exports = router;