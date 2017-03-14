"use strict";

/**
 * Verifica se determinado valor é um e-mail válido.
 * Parâmetros:
 *  value: valor a ser submetido na validação
 * Retorna:
 *  true, caso seja válido
 *  false, caso contrário
 */
module.exports = function(value) {
  
  var eREmail = new RegExp(/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/); // Expressão regular
  
  return eREmail.test(value);
  
};