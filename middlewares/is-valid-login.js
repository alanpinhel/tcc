"use strict";

/**
 * Verifica se os dados para realização do acesso a conta são válidos.
 * Parâmetros:
 *  ident: identificador (celular/e-mail)
 *  pass: senha do usuário
 * Retorna:
 *  true, caso sejam válido
 *  false, caso contrário
 */
module.exports = function(ident, pass) {
  
  var isValidCell = require("./is-valid-cell")
    , isValidEmail = require("./is-valid-email")
    , isValidPass = require("./is-valid-pass")
  ;
  
  return ((isValidCell(ident) || isValidEmail(ident)) && isValidPass(pass));
  
};