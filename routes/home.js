/**
 * Define a ação de acordo com a rota e tipo de requisição HTTP.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 */
module.exports = function(app) {
  
  var home = app.controllers.home; // Objeto controller da página inícial
  
  /**
   * Ações para rota de página inicial "/".
   */
  app.route('/')
    .get(home.index); // Chama ação "index" do "HomeController"  
  
};