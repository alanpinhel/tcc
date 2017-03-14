"use strict";

/**
 * Gera texto para envio de e-mail de ativação de conta.
 * Parâmetros:
 *  ident: identificador (e-mail/celular)
 *  code: código de ativação
 * Retorna:
 *  texto com link para ativação da conta
 */
module.exports = function(ident, code) {
  
  var genLinkActive = require("./gen-link-active")
    , link = genLinkActive(ident, code)
  ;
  
  return "<html style='font-family:Verdana;font-size:16px;color:#000;'>" +
    
    "<h3>Bem-vindo(a) ao Dadivar.</h3>" +
    "<p>Para ativar sua conta clique no botão abaixo.</p>" +
    "<a href='" + link + "' style='padding:10px 20px;margin:10px 0;background-color:#16a085;text-decoration:none;color:#FFF'>CLIQUE AQUI</a>" +
    "<br><br>" +
    "<p>Se encontrar problemas ao ativar utilizando o botão, copie o link abaixo e acesse diretamente.</p>" +
    "<u style='font-size:12px;'>" + link + "</u>" +
    "<br><br>" +
    "<p style='font-size:10px'>Se você não criou conta no Dadivar, desconsidere esse e-mail.</p>" +
    
  "</html>";
  
};