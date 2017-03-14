"use strict";

/**
 * Controla as ações para as requisições da rota de início "/".
 * Retorna:
 *  objeto controller de início com todas ações
 */
module.exports = function() {
  
  var home = {
    
    /**
     * Responde solicitação com a renderização da view "home/index".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de página inicial renderizada
     */
    index: function(req, res) {
      return res.render("home/index");
    }
    
  };
  
  return home;
  
};