"use strict";

/**
 * Gera texto para envio de SMS de redefinição de senha.
 * Parâmetros:
 *  ident: identificador (e-mail/celular)
 *  pass: senha do usuário para composição do token
 *  code: código de ativação
 * Retorna:
 *  texto com link para redefinição de senha
 */
module.exports = function(ident, pass, code) {
  
  var genLinkRecover = require("./gen-link-recover")
    , link = genLinkRecover(ident, pass, code)
  ;
  
  return "Para redefinir sua senha acesse: " + link;
  
};