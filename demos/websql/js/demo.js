var webdb = {
  db : null
};

// Función para crear la base de datos
webdb.open = function(options) {
  if (typeof openDatabase == "undefined") return;

  // Opciones por defecto
  var options = options || {};
  options.name = options.name || 'noname';
  options.mb = options.mb || 5;
  options.description = options.description || 'no description';
  options.version = options.version || '1.0';

  // Definimos el tamaño en MB
  var dbSize = options.mb * 1024 * 1024;

  // Cargamos la base de datos
  webdb.db = openDatabase(options.name, options.version, options.description, dbSize);
}

// ExecuteSql
webdb.executeSql = function(sql, data, onSuccess, onError){
  if (!webdb.db) return;
  webdb.db.transaction(function(tx){tx.executeSql(sql, data,onSuccess,onError);});
}

// Ejemplo
var opt = {
  name: "ejemplo_beeva",
  mb: 10,
  description: "Base de datos de ejemplo HTML5",
  version: "1.0"
};

// Abrimos la base de datos
webdb.open(opt);

// Creamos la tabla
webdb.executeSql('CREATE TABLE IF NOT EXISTS tablon (ID INTEGER PRIMARY KEY ASC, mensaje TEXT, added_on DATETIME)', [],
      function(tx, result){
        $('.informacion').html("Tabla creada o ya existente");
        consultarMensajes();
      },
      function(tx, e){
        $('.informacion').html("Se ha producido un error: " + e.message);
      });

function insertarMensaje(mensaje) {
  // Insertamos un nuevo elemento
  webdb.executeSql('INSERT INTO tablon (mensaje, added_on) VALUES (?,?)', [mensaje, new Date()],
      function(tx, result){
        $('.informacion').html("Elemento introducido");
        $('#mensaje').val('');
        consultarMensajes();
      },
      function(tx, e){
        $('.informacion').html("Se ha producido un error: " + e.message);
      });
}

function consultarMensajes() {
  // Consultamos los mensajes
  webdb.executeSql('SELECT mensaje, added_on FROM tablon', [],
      function(tx, result){
        var numMensajes = result.rows.length;
        $('tbody').html('');
        for (var i=0; i<numMensajes; i++) {
          var mensaje = result.rows.item(i).mensaje;
          var fecha = result.rows.item(i).added_on;
          $('tbody').append('<tr><td>' + mensaje + '</td><td>' + fecha + '</td></tr>');
        }

      },
      function(tx, e){
        $('.informacion').html("Se ha producido un error: " + e.message);
      });
}

function eliminarMensajes() {
  webdb.executeSql('DELETE FROM tablon', [],
      function(tx, result){
        $('.informacion').html("Se han elimnado todos los mensajes");
        consultarMensajes();
      },
      function(tx, e){
        $('.informacion').html("Se ha producido un error: " + e.message);
      });
}

$('#nuevo').bind('click', function() {
  insertarMensaje($('#mensaje').val());
});

$('#consulta').bind('click', function() {
  consultarMensajes();
});

$('#eliminar').bind('click', function() {
  eliminarMensajes();
});