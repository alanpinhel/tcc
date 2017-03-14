/**
 * Define a ação de acordo com a rota e tipo de requisição HTTP.
 * Parâmetro:
 *  app: objeto com todos módulos encapsulados
 */
module.exports = function(app) {
    
    var auth = require("../middlewares/auth") // Filtro de autenticação
      , user = app.controllers.user           // Objeto controller de usuário
    ;
    
    /**
     * Ações para rota de cadastro de usuário "/signup".
     */
    app.route("/signup")
      .get(user.renderSignup) // Renderiza view "user/signup"
      .post(user.signup);     // Cria usuário de acordo com formulário preenchido
    
    /**
     * Ações para rota de ativação de cadastro de usuário "/active".
     */
    app.route("/active/:ident/:code")
      .get(user.renderActive) // Renderiza view "user/active"
      .put(user.active);      // Realiza ativação da conta de usuário
    
    /**
     * Ações para rota de acessar conta de usuário "/login".
     */
    app.route("/login")
      .get(user.renderLogin) // Renderiza view "user/login"
      .post(user.login);     // Verifica a existência de dados do formulário para com banco de dados
    
    /**
     * Ações para rota de recuperar senha "/recover".
     */
    app.route("/recover")
      .get(user.renderRecover) // Renderiza view "user/recover"
      .post(user.recover);     // Envia link de recuperação de senha para e-mail ou celular informado
    
    /**
     * Ações para rota de redefinição de senha "/reset".
     */
    app.route("/reset/:ident/:token")
      .get(user.renderReset) // Renderiza view "user/reset"
      .put(user.reset);      // Altera senha da conta de usuário para nova senha informada no formulário
      
    /**
     * Ações para rota de alteração de informações "/change".
     */
    app.route("/change")
      .get(auth, user.renderChange) // Renderiza view "user/change"
      .put(auth, user.change);      // Altera informações da conta de usuário da sessão
      
    /**
     * Ações para rota de "/dashboard".
     */
    app.route("/dashboard")
      .get(auth, user.dashboard); // Mostra área de usuário

    /**
     * Ações para rota de "/logout".
     */
    app.route("/logout")
      .get(auth, user.logout); // Destrói a sessão atual
  
};