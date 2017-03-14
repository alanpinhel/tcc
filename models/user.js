"use strict";

/**
 * Modelo de objeto "user" para persistência em banco de dados.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 * Retorna:
 *  objeto modelo de "user" com todos atributos
 */
module.exports = function(app) {
  
  var db = require("../libs/db.js")()     // Arquivo de configuração para conexão com banco de dados
    , Schema = require("mongoose").Schema // Esquema para modelagem de objetos no padrão MongoDB
  ;
  
  var user = Schema({
    ident: {type: String, required: true, index: {unique: true}}, // Identificador (e-mail ou celular)
    name: {type: String, required: true},                         // Nome
    pass: {type: String, required: true},                         // Senha
    triceReg: {type: Date, default: Date.now},                    // Data de registro
    code: {type: Number},                                         // Código de ativação
    active: {type: Boolean, default: false},                      // Status da conta
    limit: {type: Number, default: 0},                            // Limite de solicitações de doação
    category: {type: String, default: "beneficiary"}              // Categoria para controle de permissão
  });
  
  return db.model("users", user);

};