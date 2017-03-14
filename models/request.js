"use strict";

/**
 * Modelo de objeto "request" para persistência em banco de dados.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 * Retorna:
 *  objeto modelo de "request" com todos atributos
 */
module.exports = function(app) {
  
  var db = require("../libs/db.js")()     // Arquivo de configuração para conexão com banco de dados
    , Schema = require("mongoose").Schema // Esquema para modelagem de objetos no padrão MongoDB
  ;
  
  var request = Schema({
    triceReg: {type: Date, default: Date.now},  // Data de registro
    status: {type: String, default: "pending"}, // Status em que o pedido se encontra
    amount: {type: Number, required: true},     // Quantidade de presente
    gift: {                                     // Presente solicitado
      title: {type: String},
      photo: {type: String},
      owner: {                                  // Usuário que publicou presente
        ident: {type: String},
        name: {type: String}
      },
    },
    requester: {                                // Usuário que está solicitando o presente
      ident: {type: String},
      name: {type: String}
    }
  });
  
  return db.model("requests", request);
  
};