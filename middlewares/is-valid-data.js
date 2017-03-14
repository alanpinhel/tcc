"use strict";

/**
 * Verifica se todos os dados são válidos.
 * Parâmetros:
 *  ident: identificador (celular/e-mail)
 *  name: nome do usuário
 *  pass: senha do usuário
 * Retorna:
 *  true, caso sejam válido
 *  false, caso contrário
 */
module.exports = function(ident, name, pass) {
  
  var isValidCell = require("./is-valid-cell")
    , isValidEmail = require("./is-valid-email")
    , isValidName = require("./is-valid-name")
    , isValidPass = require("./is-valid-pass")
  ;
  
  return ((isValidCell(ident) || isValidEmail(ident)) && isValidName(name) && isValidPass(pass));
  
};