const validator = require("validator");
const Articulo = require("../modelos/Articulo")

const prueba = (rep, res) => {

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

        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
            validator.isLength(parametros.titulo, { min: 5, max: undefined });

        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if (!validar_titulo || !validar_contenido) {
            throw new Error("No se ha validado la informacion!!")
        }

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
    //Devolver resultado
    articulo.save()
        .then((articuloGuardado) => {

            return res.status(200).json({
                status: "success",
                articulo: articuloGuardado,
                mensaje: "Articulo creado con exito"
            });
        })
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

const uno = (rep, res) => {
    //Recoger una id por la url
    let id = rep.params.id;

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


module.exports = { prueba, curso, crear, listar, uno }