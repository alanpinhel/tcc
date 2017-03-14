"use strict";

/**
 * Gera link de ativação do cadastro de usuário.
 * Parâmetro:
 *  ident: identificador (e-mail/celular)
 *  code: código de ativação
 * Retorna:
 *  link para acionar a rota de ativação de conta de usuário
 */
module.exports = function(ident, code) {
  
  var config = require("../config.json") // Arquivo de configuração geral
    , env = process.env.NODE_ENV         // Váriavel de sistema com nome do ambiente
    , domain = config.DOMAIN[env]        // Domínio de acordo com o ambiente
  ;
  
  return "http://" + domain + "/active/" + ident + '/' + code;
  
};