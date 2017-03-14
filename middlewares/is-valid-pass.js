"use strict";

/**
 * Verifica se determinado valor é uma senha válida.
 * Parâmetros:
 *  value: valor a ser submetido na validação
 * Retorna:
 *  true, caso seja válido
 *  false, caso contrário
 */
module.exports = function(value) {
  
  var count = 0            // Quadrados não preenchidos
    , total = value.length // Total de caracteres
  ;
  
  for (var i=0; i < total; i++) {
    if (value.charAt(i) === 'w') {
      count++;
    }
  }
  
  return (count < 7);
  
};