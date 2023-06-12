const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

//Inicializar app
console.log("App de node arrancada");

//Coonectar a la base de datos
conexion();

//Crear servidor Node
const app = express();
const puerto = 3900;
//Configurar cors
app.use(cors());

//Convertir body a objeto js
app.use(express.json()); //recibir datos con content-type app/json
app.use(express.urlencoded({extended:true})); //recibir datos por form-urlencoded

//Rutas
const rutas_articulo = require("./rutas/articulo");

//Cargo las rutas
app.use("/api", rutas_articulo)


//Rutas prueba hardcodeadas
app.get("/probando", (req, res) => {

    console.log("Se ha ejecutado el endpoint de prueba");

    return res.status(200).json({
        Nombre: "Julio",
        Apellido: "Pérez",
        Edad: 35,
        Altura: 184
    })
});

// Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
})
