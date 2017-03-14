"use strict";

/**
 * Realiza a chamada de URL para despacho de SMS.
 * Parâmetros:
 *  msg: corpo do sms
 *  number: número do celular de destino
 */
module.exports = function(msg, number) {
  
  var http = require("http"); // Funções do protocolo HTTP
  
  msg = msg.split(' ').join("%20");
  
  http.get({
    "method": "GET",
    "hostname": "54.173.24.177",
    "port": null,
    "path": "/painel/api.ashx?action=sendsms&lgn=14991940268&pwd=207604&msg="+ msg +"&numbers=" + number
  });
  
};