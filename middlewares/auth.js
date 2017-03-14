"use strict";

/**
 * Verifica se usuário está autenticado.
 * Parâmetros:
 *  req: solicitação HTTP que disparou o evento
 *  res: envio de resposta HTTP desejada
 *  next: próxima ação
 * Retorna:
 *  próxima ação, caso esteja autenticado
 *  redireciona para tela de autenticação, caso contrário
 */
module.exports = function(req, res, next) {
  
  if (!req.session.user) {
    return res.redirect("/login");
  }
  
  return next();

};