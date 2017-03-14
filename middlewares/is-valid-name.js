"use strict";

/**
 * Verifica se determinado valor é um nome válido.
 * Parâmetros:
 *  value: valor a ser submetido na validação
 * Retorna:
 *  true, caso seja válido
 *  false, caso contrário
 */
module.exports = function(value) {
  
  var eRName = new RegExp(/^[a-zA-Z\sáÁãÃâÂàÀéÉêÊíÍóÓõÕôÔúÚçÇ]{3,}$/); // Expressão regular
  
  return eRName.test(value);
  
};