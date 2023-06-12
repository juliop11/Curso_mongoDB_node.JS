const express = require("express");
const router = express.Router();

const articuloControlador = require("../controladores/articulo")

//Rutas de prueba
router.get("/ruta-de-prueba", articuloControlador.prueba)
router.get("/curso", articuloControlador.curso)

//Ruta util
router.post("/crear", articuloControlador.crear)
// El simbolo de interrogacion " ? " quiere decir que es opcional y sin el simbolo que es obligatorio
router.get("/articulos/:ultimos?", articuloControlador.listar)
router.get("/articulo/:id", articuloControlador.uno)

module.exports = router;