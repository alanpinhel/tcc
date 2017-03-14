"use strict";

/**
 * Modelo de objeto "gift" para persistência em banco de dados.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 * Retorna:
 *  objeto modelo de "gift" com todos atributos
 */
module.exports = function(app) {
  
  var db = require("../libs/db.js")()     // Arquivo de configuração para conexão com banco de dados
    , Schema = require("mongoose").Schema // Esquema para modelagem de objetos no padrão MongoDB
  ;
  
  var photo = Schema({
    path: {type: String, required: true} // Caminho físico da imagem
  });
  
  var gift = Schema({
    triceReg: {type: Date, default: Date.now},   // Data de registro
    title: {type: String, required: true},       // Título do presente
    description: {type: String, required: true}, // Descrição do presente
    amount: {type: Number, required: true},      // Quantidade de presente
    raffle: {type: Boolean, default: false},     // Sorteio (varia de acordo com o usuário)
    status: {type: String, default: "enabled"},  // Status em que o presente se encontra
    photos: [photo],                             // Galeria de fotos para o presente
    owner: {                                     // Usuário que está publicando presente
      ident: {type: String},
      name: {type: String}
    },
    type: {type: String, required: true}         // Tipo que o presente se encaixa
  });
  
  return db.model("gifts", gift);
  
};