"use strict";

/**
 * Verifica se determinado valor é um celular válido.
 * Parâmetros:
 *  value: valor a ser submetido na validação
 * Retorna:
 *  true, caso seja válido
 *  false, caso contrário
 */
module.exports = function(value) {
  
  var eRCell = new RegExp(/^([1-9]{1,1}[0-9]{1,1}[0-9]{9,9})$/); // Expressão regular
  
  return eRCell.test(value);
  
};