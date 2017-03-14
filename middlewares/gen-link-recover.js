"use strict";

/**
 * Gera link de recuperação de senha para o cadastro de usuário.
 * Parâmetro:
 *  ident: identificador (e-mail/celular)
 *  pass: senha do usuário para composição do token
 *  code: código de ativação
 * Retorna:
 *  link para acionar a rota de recuperação de senha
 */
module.exports = function(ident, pass, code) {
  
  var config = require("../config.json")               // Arquivo de configuração geral
    , genTokenRecover = require("./gen-token-recover") // Gera token para link de recuperação
    , env = process.env.NODE_ENV                       // Váriavel de sistema com nome do ambiente
    , domain = config.DOMAIN[env]                      // Domínio de acordo com o ambiente
  ;
  
  return "http://" + domain + "/reset/" + ident + '/' + genTokenRecover(pass, code);
  
};