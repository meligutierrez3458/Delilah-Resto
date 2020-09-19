const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const CLAVE_CIFRADO_SERVER = "MICLAVEPROYECTO3";
const btoa = require("btoa");
const { query } = require("express");
const e = require("express");

const conexion = new sequelize( "mysql://root:@127.0.0.1:3306/delilah_resto_db"); 

server.listen(3000, () => {
    console.log("server ok");
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
    return resultado;
  } catch (e) {
    console.log(e);
  }
};

//Endpoint para ver todos los productos, ejecutado por un usuario con Token 
server.get("/producto", esUnTokenValido, async (req, res) => {
  const resultados = await mostrarProductos();
  res.json(resultados);
});

//Crea un productos
async function crearProducto(descripcion, precio) {
  try {
    const resultado = await conexion.query(
      "INSERT INTO producto VALUES (NULL, ?, ?)",
      {
        replacements: [ descripcion, precio],
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

//Endpoint para crear un producto, ejecutado solamente por el admin
server.post("/producto", esUnTokenValidoAdmin, async (req, res) => {
  const resultados = await crearProducto(req.body.descripcion, req.body.precio );
  res.json("EL producto ha sido creado correctamente");
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

//Endpoint para borrar un producto, ejecutado solamente por el admin
server.delete("/producto", esUnTokenValidoAdmin, async (req, res) => {
  const resultados = await borrarProducto(req.body.producto.id);
  res.json("Se borro el producto correctamente");
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

//Endpoint para actualizar el precio de un producto, ejecutado solamente por el admin
server.put("/producto", esUnTokenValidoAdmin, async (req, res) => {
  const resultados = await actualizarProducto(req.body.id, req.body.precio);
  res.json("Precio del producto actualizado correctamente");
});

//Validar usuario en la base de datos y crea token
function esUnUsuarioValido(nombre, contrasena) {
  const usuario = buscarUsuario(nombre, contrasena);
  console.log(usuario);
  if (usuario === "true") {
    const token = jwt.sign({ nombre, contrasena }, CLAVE_CIFRADO_SERVER);
    console.log("ESTE ES EL TOKEN --> " + token);
    return token;
  } else {
    return false;
  }
}


async function buscarUsuario(nombre, contrasena) {
  try {
    const resultado = await conexion.query(
      "SELECT * FROM usuario WHERE usuario = :nombre AND contrasena = :contrasena",
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { nombre: nombre, contrasena: contrasena },
      }
    );
    console.log(resultado);
    if (resultado.length > 0){
      console.log("true");
      var admin = resultado[0].es_admin;
      const token = jwt.sign({ nombre, contrasena, admin }, CLAVE_CIFRADO_SERVER);
      console.log("ESTE ES EL TOKEN --> " + token);
      return token;
    }else{
      console.log("false");
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};

async function getUsuario(nombre, contrasena) {
  try {
    const resultado = await conexion.query(
      "SELECT * FROM usuario WHERE usuario = :nombre AND contrasena = :contrasena",
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { nombre: nombre, contrasena: contrasena },
      }
    );
    return resultado;
  } catch (e) {
    console.log(e);
  }
};

//Endpoint para mostrar los datos del usuario autenticado 
server.get("/datosUsuario", esUnTokenValido, (req, res, err) => {
  const tokenDelRequest = jwt.verify(
    req.headers.authorization.split(" ")[1], 
    CLAVE_CIFRADO_SERVER
  );

  console.log(tokenDelRequest);

  const token = getUsuario(tokenDelRequest.nombre, tokenDelRequest.contrasena);
  token.then(function(resultado){
    console.log(resultado);
    if (resultado) {
      res.status(200).json({ resultado });
    } else {
      res.status(401).send("Usuario Invalido");
    }
  });
  
});

//Endpoint para autenticarse
server.post("/login", (req, res, err) => {
  const usuario = req.body.usuario;
  const contrasena = req.body.contrasena;
  const token = buscarUsuario(usuario, contrasena);
  token.then(function(resultado){
    console.log(resultado);
    if (resultado) {
      res.status(200).json({ resultado });
    } else {
      res.status(401).send("Usuario Invalido");
    }
  });
  
});

// Crear usuario
async function crearUsuario(usuario, contrasena, nombre_apellido, e_mail, telefono, direccion) {
  try {
    const resultado = await conexion.query(
      "INSERT INTO usuario VALUES (NULL, ?, ?, ?, ?, ?, ?, 'F')",
      {
        replacements: [usuario, contrasena, nombre_apellido, e_mail, telefono, direccion],
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

//Endpoint para crear un usuario
server.post("/usuario", async (req, res) => {
  const resultados = await crearUsuario(req.body.usuario, req.body.contrasena, req.body.nombre_apellido, req.body.e_mail, req.body.telefono, req.body.direccion);
  res.json("Usuario creado correctamente");
});

//Validar TOKEN
function esUnTokenValido(req, res, next) {
  try {
    const usuario = jwt.verify(
      req.headers.authorization.split(" ")[1], 
      CLAVE_CIFRADO_SERVER
    );
    req.usuarioValidado = usuario;
    next();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

//Validar TOKEN Admin
function esUnTokenValidoAdmin(req, res, next) {
  try {
    if(typeof req.headers.authorization === "undefined"){
      res.status(400).json({ error: "Usuario no autorizado" }); 

    }else{
      const usuario = jwt.verify(
        req.headers.authorization.split(" ")[1], 
        CLAVE_CIFRADO_SERVER
      );
      console.log(usuario);
      if (usuario.admin == "T"){
        req.usuarioValidado = usuario;
        next();
      }else{
        res.status(400).json({ error: e.message });
      }
   }
    
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

//Crear pedido
async function crearPedidoCompleto(forma_de_pago, id_usuario, lista_producto) {
  try {
    const pedido = await crearPedido(forma_de_pago, id_usuario);
    lista_producto.forEach(function(element){
      console.log(element);
      const detalle = crearDetallePedido(pedido[0], element[0], element[1]);
      detalle.then(function(resultado){
        console.log(resultado);
        if (resultado) {
          console.log("Exitoso");
        } else {
          console.log("Falló");
        }
      });
    });

  }catch (e) {
    console.log(e);
  }
};

async function crearPedido(forma_de_pago, id_usuario) {
  try {
    var fecha = new Date();
    const resultado = await conexion.query(
      "INSERT INTO pedido VALUES (NULL, 'NUE', ?, ?, ?)",
      {
        replacements: [forma_de_pago, id_usuario, fecha],
      }
    );
    console.log(resultado);
    return resultado;
  } catch (e) {
    console.log(e);
  }
};

async function crearDetallePedido(id_pedido, id_producto, cantidad_platos) {
  try {
    const resultado = await conexion.query(
      "INSERT INTO detalle_pedido VALUES (NULL, ?, ?, ?)",
      {
        replacements: [id_pedido, id_producto, cantidad_platos],
      }
    );
    console.log("crearDetallePedido");
    console.log(resultado);
    return resultado;
  } catch (e) {
    console.log(e);
  }
};

//Endpoint para crear pedido
server.post("/crearPedido", esUnTokenValido, async (req, res) => {
  const resultados = await crearPedidoCompleto(req.body.forma_de_pago, req.body.id_usuario, req.body.productos );
  res.json("El pedido fué creado exitosamente");
});

//Mostrar todos los Pedidos
async function mostrarPedidos() {
  try {
    const resultado = await conexion.query(
      "SELECT pe.estado, pe.fecha_hora, pe.id, pr.descripcion, pe.forma_de_pago, pr.precio, us.nombre_apellido, us.direccion "+
      "FROM pedido pe, detalle_pedido dp, producto pr, usuario us "+
      "WHERE pe.id = dp.id_pedido "+
      "AND pr.id = dp.id_producto "+
      "AND pe.id_usuario = us.id "+
      "ORDER BY pe.id",
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    console.log(resultado);
    return resultado;
  } catch (e) {
    console.log(e);
  }
};

//Mostrar todos los pedidos de un usuario
async function mostrarPedidosUsuario(nombre) {
  try {
    const resultado = await conexion.query(
      "SELECT pe.estado, pe.fecha_hora, pe.id, pr.descripcion, pe.forma_de_pago, pr.precio, us.nombre_apellido, us.direccion "+
      "FROM pedido pe, detalle_pedido dp, producto pr, usuario us "+
      "WHERE pe.id = dp.id_pedido "+
      "AND pr.id = dp.id_producto "+
      "AND pe.id_usuario = us.id "+
      "AND us.usuario = :nombre "+ 
      "ORDER BY pe.id",
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { nombre: nombre },
      }
    );
    console.log(resultado);
    return resultado;
  } catch (e) {
    console.log(e);
  }
};

//Endpoint para mostrar todos los pedidos (admin), o todos los pedidos al usuario autenticado
server.get("/pedido", esUnTokenValido, async (req, res) => {
  try {
    const usuario = jwt.verify(
      req.headers.authorization.split(" ")[1], 
      CLAVE_CIFRADO_SERVER
    );
    if (usuario.admin == "T"){
      const resultados = await mostrarPedidos();
      res.json(resultados);
    }else{
      console.log(usuario);
      const resultados = await mostrarPedidosUsuario(usuario.nombre);
      res.json(resultados);
    }
    
  } catch (e) {
    console.log(e.message);
  }
  
});

//Actualizar estado de pedido
async function actualizarEstadoPedido(id, nuevoEstado) {
  try {
    const resultado = await conexion.query(
      "UPDATE pedido SET estado = :nuevoEstado WHERE id = :id",
      {
        replacements: { id: id, nuevoEstado: nuevoEstado },
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

//Endpoint para actualizar el estado del pedido, ejecutado solamente por el admin. 
//Posibles estados: NUE (Nuevo), CON (Confirmado), PRE (En preparacion), EC (En camini), ENV (Enviado), CAN(Cancelado)
server.put("/pedido", esUnTokenValidoAdmin, async (req, res) => {
  const resultados = await actualizarEstadoPedido(req.body.id, req.body.estado);
  res.json("Estado actualizado correctamente");
});

//Borrar un pedido
async function borrarDetallePedido(id_pedido) {
  try {
    const resultado = await conexion.query(
      "DELETE FROM detalle_pedido WHERE id_pedido = :id_pedido",
      {
        replacements: {id_pedido: id_pedido},
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

async function borrarPedido(id) {
  try {
    const resultado = await conexion.query(
      "DELETE FROM pedido WHERE id = :id",
      {
        replacements: {id: id},
      }
    );
    console.log(resultado);
  } catch (e) {
    console.log(e);
  }
};

//Endpoint para borrar un pedido, ejecutado solamente por el admin
server.delete("/pedido", esUnTokenValidoAdmin, async (req, res) => {
  await borrarDetallePedido(req.body.id);
  await borrarPedido(req.body.id);
  res.json("El pedido se eliminó correctamente");
});