window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

var html5beeva = {
  indexedDB : {
    db : null
  }
};

html5beeva.indexedDB.open = function() {
  // Creamos un base de datos
  var request = indexedDB.open("todos", 5);

  // Creamos el almacén de objetos
  request.onupgradeneeded = function(e) {
    html5beeva.indexedDB.db = e.target.result;
    var db = html5beeva.indexedDB.db;
    
    if(!db.objectStoreNames.contains('todo')){
      var store = db.createObjectStore('todo', {
        keyPath: "id",
        autoIncrement: true
      });
      store.createIndex("text", "text", {unique : false});
      store.createIndex("timeStamp", "timeStamp", {unique : true});
    }
  };

  request.onsuccess = function(e) {
    html5beeva.indexedDB.db = e.target.result;
    var db = html5beeva.indexedDB.db;
    // Solo podremos crear almacenes de objetos e índices en la transacción setVersion
    if(typeof db.setVersion === 'function') {
      var versionReq = db.setVersion(3);

      // Creamos el almacén de objetos
      versionReq.onsuccess = function(e) {
        html5beeva.indexedDB.db = e.target.source;
        var db = html5beeva.indexedDB.db;
        
        if(!db.objectStoreNames.contains('todo')){
          db.createObjectStore('todo', { 
            keyPath: "id",
            autoIncrement: true
          });
        }
      }
    }

    html5beeva.indexedDB.getAllTodoItems();
  };

  request.onfailure = html5beeva.indexedDB.onerror;
};

html5beeva.indexedDB.addTodo = function(todoText) {
  var db = html5beeva.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  var request = store.add({
    "text": todoText,
    "timeStamp" : new Date().getTime()
  });

  request.onsuccess = function(e) {
    html5beeva.indexedDB.getAllTodoItems();
  };

  request.onerror = function(e) {
    console.log(e.value);
  };
};

html5beeva.indexedDB.getAllTodoItems = function() {
  var db = html5beeva.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  // Recuperamos todo el almacén desde el principio
  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = store.openCursor(keyRange);

  $('tbody').html('');
  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if(!!result == false)
      return;

    renderTodo(result.value);
    result.continue();
  };

  cursorRequest.onerror = html5beeva.indexedDB.onerror;
};

function renderTodo(row) {
  $('tbody').append('<tr><td>' + row.text + '</td><td>' + new Date(row.timeStamp) + '</td></tr>');
}

$('#nueva').bind('click', function addTodo() {
  html5beeva.indexedDB.addTodo($('#todo').val());
  $('#todo').val('');
});

$('#eliminar').bind('click', function addTodo() {
  html5beeva.indexedDB.deleteTodos();
});

html5beeva.indexedDB.deleteTodos = function() {
  var db = html5beeva.indexedDB.db;
  var trans = db.transaction(["todo"], "readwrite");
  var store = trans.objectStore("todo");

  var request = store.clear("todo");

  request.onsuccess = function(e) {
    html5beeva.indexedDB.getAllTodoItems();
  };

  request.onerror = function(e) {
    console.log(e);
  };
};

html5beeva.indexedDB.open();