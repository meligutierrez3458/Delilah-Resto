const sequelize = require("sequelize");

const conexion = new sequelize( "mysql://root:@127.0.0.1:3306/delilah_resto_db"); 

conexion.query('SELECT * FROM producto',
{type: conexion.QueryTypes.SELECT}
).then(function(resultados){
    console.log(resultados);
});