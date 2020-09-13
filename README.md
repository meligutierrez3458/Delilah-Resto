# Delilah-Resto
Proyecto Dalilah Restó, Api para manejo del restaurante

# Pre-requisitos
MySQL
NODE.JS
Postman

# Instalación
Base de Datos:
  - Ejecutar el archivo creacion-tablas.sql
  - Ejecutar el archivo inserts.sql

NODE:
- Ubicarse en el path del archivo server.js
- Abrir la terminal de Node y ejecutar el comando "node server.js"


# Ejecutando las pruebas
Ver carpeta postman
Importar pruebas a Postman.

Ejemplo para endpoint http://localhost:3000/pedido
   - Ejecutar endpoint login 
       - Method: POST
       - Path: http://localhost:3000/login
       - Body/raw/JSON: {"usuario": "admin", "contrasena":"admin"}
   - Copiar el token generado en el resultado del endpoint
   - Ejecutar endpoint pedido
       - Method: GET
       - Path: http://localhost:3000/pedido
       - En "Headers" agregar la entrada "Authorization" y en el valor agragar Bearer mas el token generado en el endpoint del login-
       Por ejemplo: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21icmUiOiJxdWVlbl9mcmVkZGllIiwiY29udHJhc2VuYSI6InRlc3QiLCJhZG1pbiI6IkYiLCJpYXQiOjE2MDAwMzQ3MzV9.W2bR2IaKw68VNjbLpGmvl3YAozCbAUY6mNid9Jv9Q7k



# Construido con
MYSQL
NODE.js

# Versionado
Github repo: https://github.com/meligutierrez3458/Delilah-Resto.git

# Autores
Melixa Gutierrez Ramirez
