"use strict";

/**
 * Verifica se determinado valor é um título válido.
 * Parâmetros:
 *  value: valor a ser submetido na validação
 * Retorna:
 *  true, caso seja válido
 *  false, caso contrário
 */
module.exports = function(value) {
  
  var eRTitle = new RegExp(/^[a-zA-Z0-9\sáÁãÃâÂàÀéÉêÊíÍóÓõÕôÔúÚçÇ!?():;\-\.\,]{3,100}$/); // Expressão regular
  
  return eRTitle.test(value);
  
};