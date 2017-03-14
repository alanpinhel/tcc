/**
 * Define a ação de acordo com a rota e tipo de requisição HTTP.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 */
module.exports = function(app) {
  
  var auth = require("../middlewares/auth") // Filtro de autenticação
    , raffle = app.controllers.raffle       // Objeto controller de sorteio
  ;
  
  /**
   * Ações para rota de sorteio realizados "/raffle/:_id".
   */
  app.route("/raffle/:_id")
    .get(auth, raffle.subscribe); // Inscreve usuário ao sorteio "/subscribers"
    
  app.route("/subscribed")
    .get(auth, raffle.show);      // Renderiza presentes a concorrer
  
};