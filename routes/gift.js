/**
 * Define a ação de acordo com a rota e tipo de requisição HTTP.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 */
module.exports = function(app) {
  
  var auth = require("../middlewares/auth") // Filtro de autenticação
    , gift = app.controllers.gift           // Objeto controller de presente
  ;
  
  /**
   * Ações para rota de publicação de presente "/gift".
   */
  app.route("/gift")
    .get(auth, gift.renderCreate) // Renderiza view "gift/create"
    .post(auth, gift.create);     // Publica presente de acordo com o formulário preenchido
    
  
  /**
   * Ações para rota de presentes publicados "/published".
   */
  app.route("/published")
    .get(auth, gift.renderPublished); // Renderiza view "gift/published"
  
  /**
   * Ações para rota de edição de presentes publicados "/gift/:id/edit"
   */
  app.route("/gift/:id/edit")
    .get(auth, gift.renderEdit) // Renderiza view "gift/edit"
    .put(auth, gift.edit);      // Efetua alterações no presente
  
  /**
   * Ações para rota de exibição de todos presentes publicados "/gifts"
   */
  app.route("/gifts")
    .get(gift.renderShow);
  
  /**
   * Ações para rota de exclusão de foto "/gift/:gift/photo/:photo"
   */
  app.route("/gift/:gift/photo/:photo")
    .get(auth, gift.deletePhoto); // Exclui foto física e no banco de dados
  
  /**
   * Ações para rota de visualização de detalhes de presente "/gift/:id"
   */
  app.route("/gift/:id")
    .get(auth, gift.details); // Renderiza view "gift/details"
  
};