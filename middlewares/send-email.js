"use strict";

/**
 * Realiza envio de e-mail.
 * Parâmetro:
 *  from: remetente
 *  to: destinatário
 *  subject: assunto
 *  msg: mensagem presente no corpo
 */
module.exports = function(from, to, subject, msg) {
  
  var options = {
    auth: {
      api_key: "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"
    }
  };
  
  var nodemailer = require("nodemailer")                         // Módulo de despacho
    , sgTransport = require("nodemailer-sendgrid-transport")     // SendGrid, API de transporte
    , mailer = nodemailer.createTransport(sgTransport(options))  // Cria o transporte
    , email = {from: from, to: to, subject: subject, html: msg}  // Define parâmetros essencias para envio
  ;
  
  mailer.sendMail(email);
  
};