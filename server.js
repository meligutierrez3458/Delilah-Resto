const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");

const conexion = new sequelize( "mysql://root:@127.0.0.1:3306/delilah_resto_db"); 

server.listen(3000, () => {
    console.log("server ok");
    mostrarProductos();
  });

  server.use(bodyParser.json());

//Devuelve todos los productos
async function mostrarProductos() {
  try {
    const resultado = await conexion.query(
      "SELECT * FROM producto ORDER BY descripcion",
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

server.get("/producto", async (req, res) => {
  const resultados = await mostrarProductos();
  res.json(resultados);
});

//Crea un productos
async function crearProducto(producto) {
  try {
    const resultado = await conexion.query(
      "INSERT INTO producto VALUES (?, ?, ?)",
      {
        replacements: [producto.id, producto.descripcion, producto.precio],
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

server.post("/producto", async (req, res) => {
  const resultados = await crearProducto(req.body.producto);
  res.json(resultados);
});

//Borrar un producto
async function borrarProducto(id) {
  try {
    const resultado = await conexion.query(
      "DELETE FROM producto WHERE id = :id",
      {
        replacements: {id: id},
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

server.delete("/producto", async (req, res) => {
  const resultados = await borrarProducto(req.body.producto.id);
  res.json(resultados);
});

//Actualizar un producto
async function actualizarProducto(id, nuevoPrecio) {
  try {
    const resultado = await conexion.query(
      "UPDATE producto SET precio = :nuevoPrecio WHERE id = :id",
      {
        replacements: { id: id, nuevoPrecio: nuevoPrecio },
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

server.put("/producto", async (req, res) => {
  const resultados = await actualizarProducto(req.body.producto.id, req.body.producto.precio);
  res.json(resultados);
});