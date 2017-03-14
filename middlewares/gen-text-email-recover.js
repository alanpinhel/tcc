"use strict";

/**
 * Gera texto para envio de e-mail de redefinição de senha.
 * Parâmetros:
 *  ident: identificador (e-mail/celular)
 *  pass: senha do usuário para composição do token
 *  code: código de ativação
 * Retorna:
 *  texto com link para redefinição de senha
 */
module.exports = function(ident, pass, code) {
  
  var genLinkRecover = require("./gen-link-recover")
    , link = genLinkRecover(ident, pass, code)
  ;
  
  return "<html style='font-family:Verdana;font-size:16px;color:#000;'>" +
    
    "<h3>Você solicitou a recuperação de senha da sua conta Dadivar.</h3>" +
    "<p>Para redefini-la clique no botão abaixo.</p>" +
    "<a href='" + link + "' style='padding:10px 20px;margin:10px 0;background-color:#16a085;text-decoration:none;color:#FFF'>CLIQUE AQUI</a>" +
    "<br><br>" +
    "<p>Se encontrar problemas ao redefinir utilizando o botão, copie o link abaixo e acesse diretamente.</p>" +
    "<u style='font-size:12px;'>" + link + "</u>" +
    "<br><br>" +
    "<p style='font-size:10px'>Se você não quer redefinir sua senha da conta Dadivar, desconsidere esse e-mail.</p>" +
    
  "</html>";

};