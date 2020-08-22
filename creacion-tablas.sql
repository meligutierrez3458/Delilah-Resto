CREATE TABLE producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR (60) NOT NULL,
    precio INT NOT NULL
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR (60) NOT NULL,
    contrasena VARCHAR (60) NOT NULL,
    nombre-apellido VARCHAR (60) NOT NULL,
    e-mail VARCHAR (60) NOT NULL,
    telefono VARCHAR (60) NOT NULL,
    direccion VARCHAR (60) NOT NULL
);

CREATE TABLE estado(
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR (60) NOT NULL
);

CREATE TABLE forma_pago(
    id INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR (60) NOT NULL
);