const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");


const prueba = (req, res) => {

    return res.status(200).json({
        mensaje: "Soy una accion de prueba en nuestro controlador de articulos"
    });
}

const curso = (req, res) => {

    console.log("Se ha ejecutado el endpoint de prueba");

    return res.status(200).json({
        Nombre: "Julio",
        Apellido: "Pérez",
        Edad: 35,
        Altura: 184
    })
};

const crear = (req, res) => {
    //Recoger parametros por post a guardar
    let parametros = req.body;

    //Validar datos
    try {
        validarArticulo(parametros);

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    //Crear el objeto a guardar
    const articulo = new Articulo(parametros);

    //Asignar valores a objeto basado en el modelo (manual o automatico)
    //articulo.titulo = parametros.titulo;

    //Guardar el articulo en la base de datos
    articulo.save()
        .then((articuloGuardado) => {

            return res.status(200).json({
                status: "success",
                articulo: articuloGuardado,
                mensaje: "Articulo creado con exito"
            });
        })
        //Devolver resultado
        .catch((error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el articulo" + error.mensaje
            });

        });
}

const listar = (req, res) => {

    let consulta = Articulo.find()

    if (req.params.ultimos) {
        consulta.limit(3)
    }
    consulta.sort({ fecha: -1 })

        .then((articulos) => {
            return res.status(200).json({
                status: "success",
                contador: articulos.length,
                articulos
            });
        })
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos" + error.mensaje
            });

        });
}

const mostrarUno = (req, res) => {
    //Recoger una id por la url
    let id = req.params.id;
    //Buscar el articulo
    Articulo.findById(id)
        //Devolver resultado
        .then((articulo) => {
            return res.status(200).json({
                status: "success",
                articulo
            });
        })
        //Si no existe devolver error
        .catch((error) => {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo " + error.mensaje
            });
        });
}


const borrar = (req, res) => {

    let articuloId = req.params.id;

    Articulo.findOneAndDelete({ _id: articuloId })

        .then((articuloBorrado) => {
            return res.status(200).json({
                status: "succes",
                articulo: articuloBorrado,
                mensaje: "Articulo borrado"
            });
        })
        .catch((error) => {
            if (error || !articuloBorrado) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "Error al borrar el articulo"
                })
            }
        })
}


const editar = (req, res) => {
    //Recoger id articulo a editar
    let articuloId = req.params.id;

    //Recoger datos del body
    let parametros = req.body

    //Validar datos
    try {
        validarArticulo(parametros);

    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }
    //Buscar y actualizar articulo
    Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true })
        //Devolver respuesta
        .then((articuloActualizado) => {
            return res.status(200).json({
                status: "succes",
                articulo: articuloActualizado
            });
        })
        .catch((error) => {
            if (error || !articuloActualizado) {
                return res.status(500).json({
                    status: "error",
                    mensaje: "Error al actualizar el articulo"
                })
            }
        })
}

const subir = (req, res) => {

    //Configurar multer

    //Recoger el fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            mensaje: "Peticion invalida"
        })
    }
    //Nombre del archivo
    let archivo = req.file.originalname;

    //Extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    //Comprobar extension correcta
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

        //Borrar archivo de carpeta imagenes y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            });
        })
    } else {
        //Recoger id articulo a editar
        let articuloId = req.params.id;

        //Buscar y actualizar articulo
        Articulo.findOneAndUpdate({ _id: articuloId }, { imagen: req.file.filename }, { new: true })

            //Devolver respuesta
            .then((articuloActualizado) => {
                return res.status(200).json({
                    status: "succes",
                    articulo: articuloActualizado,
                    fichero: req.file
                });
            })
            .catch((error) => {
                if (error || !articuloActualizado) {
                    return res.status(500).json({
                        status: "error",
                        mensaje: "Error al actualizar el articulo"
                    })
                }
            })
    }
}
//Poniendo la url de la imagen nos la muestra
const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        }
        else {
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe"
            })
        }
    })
}
module.exports = { prueba, curso, crear, listar, mostrarUno, borrar, editar, subir, imagen }