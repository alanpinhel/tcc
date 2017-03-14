"use strict";

/**
 * Dada uma determinada string a mesma é retornada de maneira criptograda.
 * Parâmetro:
 *  token: string a ser criptografada
 * Retorna:
 *  token criptografado
 */
module.exports = function(token) {
  
  var crypto = require("crypto")     // Módulo para criptografia
    , md5 = crypto.createHash("md5") // Utiliza da criptografia MD5
  ;
  
  token = md5.update(token).digest("hex");
  
  return token;
  
};