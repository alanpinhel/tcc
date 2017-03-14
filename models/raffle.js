"use strict";

/**
 * Modelo de objeto "raffle" para persistência em banco de dados.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 * Retorna:
 *  objeto modelo de "raffle" com todos atributos
 */
module.exports = function(app) {
  
  var db = require("../libs/db.js")()     // Arquivo de configuração para conexão com banco de dados
    , Schema = require("mongoose").Schema // Esquema para modelagem de objetos no padrão MongoDB
  ;
  
  var raffle = Schema({
    triceReg: {type: Date, default: Date.now},   // Data de registro
    active: {type: Boolean, default: true},      // Sorteio ainda está ativo?
    earner: {                                    // Ganhador
      ident: {type: String},
      name: {type: String}
    },
    subscribers: [{                              // Inscritos
      ident: {type: String},
      name: {type: String}
    }],
    giftId: {type: String}                       // Presente a ser sorteado
  });
  
  return db.model("raffles", raffle);
  
};