/**
 * Define a ação de acordo com a rota e tipo de requisição HTTP.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 */
module.exports = function(app) {
  
  var auth = require("../middlewares/auth") // Filtro de autenticação
    , request = app.controllers.request;    // Objeto controller de solicitação
  
  /**
   * Ações para rota de solicitação "/request".
   */
  app.route("/request/:gift")
    .get(auth, request.renderCreate) // Renderiza view "request/create"
    .post(auth, request.create);     // Cria solicitação de acordo com formulário preenchido
  
  /**
   * Ações para rota de solicitações realizadas "/requested".
   */
  app.route("/requested")
    .get(auth, request.renderShow); // Renderiza view "request/show"
  
  /**
   * Ações para rota de conclusão de solicitação "/requested/:_id/completed".
   */
  app.route("/requested/:_id/completed")
    .get(auth, request.completed);  // Altera status e retorna para rota de "/requested"
  
};