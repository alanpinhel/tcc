"use strict";

/**
 * Renderiza view para página não encontrada.
 * Parâmetros:
 *  req: solicitação HTTP que disparou o evento
 *  res: envio de resposta HTTP desejada
 *  next: próxima ação
 * Retorna:
 *  view de página não encontrada renderizada
 */
exports.notFound = function(req, res, next) {
  res.status(404);
  return res.render("error/not-found");
};

/**
 * Renderiza view para erros.
 * Parâmetros:
 *  error: erro retornado
 *  req: solicitação HTTP que disparou o evento
 *  res: envio de resposta HTTP desejada
 *  next: próxima ação
 * Retorna:
 *  view de erro genérico renderizada
 */
exports.serverError = function(error, req, res, next) {
  res.status(500);
  return res.render("error/index", {
    error: {
      title: "Ocorreu um erro:",
      message: error.message
    }
  });
};