"use strict";

/**
 * Gera texto para envio de SMS de ativação de conta.
 * Parâmetros:
 *  ident: identificador (e-mail/celular)
 *  code: código de ativação
 * Retorna:
 *  texto com link para ativação da conta
 */
module.exports = function(ident, code) {
  
  var genLinkActive = require("./gen-link-active")
    , link = genLinkActive(ident, code)
  ;
  
  return "Bem-vindo(a) ao Dadivar, para ativar sua conta acesse: " + link;
  
};