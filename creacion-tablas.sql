CREATE TABLE producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR (60) NOT NULL,
    precio INT NOT NULL
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR (60) NOT NULL,
    contrasena VARCHAR (60) NOT NULL,
    nombre_apellido VARCHAR (60) NOT NULL,
    e_mail VARCHAR (60) NOT NULL,
    telefono VARCHAR (60) NOT NULL,
    direccion VARCHAR (60) NOT NULL,
    es_admin VARCHAR (1) DEFAULT 'F' NOT NULL
);


CREATE TABLE pedido(
    id INT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR (3) NOT NULL,
    forma_de_pago VARCHAR (1) NOT NULL,
    id_usuario INT NOT NULL,
    fecha_hora DATE NOT NULL
);

CREATE TABLE detalle_pedido(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad_platos INT NOT NULL
);