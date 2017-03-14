"use strict";

/**
 * Gera token para ser utilizado no link de recuperação de senha.
 * Parâmetros:
 *  code: código de cadastro do usuário
 *  pass: senha do usuário para composição do token
 * Retorna:
 *  token secreto para validação do link de recuperação
 */
module.exports = function(pass, code) {
  
  var config = require("../config.json") // Arquivo de configuração geral
    , encrypt = require("./encrypt")     // Criptografa
    , key = config.KEY
    , token
  ;
  token = encrypt(pass + code + key);
  return token.substring(9, 25);
  
};