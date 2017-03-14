"use strict";

/**
 * Verifica se não existe uma conexão com o banco de dados já instanciada.
 * Retorna:
 *  a conexão com o banco, caso haja
 *  uma nova conexão, caso contrário
 */
module.exports = function() {
  
  var mongoose = require("mongoose")     // Drive moongose para comunição entre MongoDB e Node.js
    , config = require("../config.json") // Arquivo de configuração geral
    , env = process.env.NODE_ENV         // Váriavel de sistema com nome do ambiente
    , url = config.MONGODB[env]          // URL de conexão com o banco de dados
    , singleConnection                   // Garante apenas uma única conexão por toda aplicação
  ;

  if (!singleConnection) {
    singleConnection = mongoose.createConnection(url);
  }
  
  return singleConnection;

};