"use strict";

/**
 * Verifica se determinado valor é uma descrição válida.
 * Parâmetros:
 *  value: valor a ser submetido na validação
 * Retorna:
 *  true, caso seja válido
 *  false, caso contrário
 */
module.exports = function(value) {
  
  var eRDescription = new RegExp(/^[a-zA-Z0-9\sáÁãÃâÂàÀéÉêÊíÍóÓõÕôÔúÚçÇ!?%*\-ªº"'():;/\.\,]{10,500}$/); // Expressão regular
  
  return eRDescription.test(value);
  
};