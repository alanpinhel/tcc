"use strict";

/**
 * Controla as ações para as requisições das rotas relacionadas ao usuário.
 * Retorna:
 *  objeto controller de usuário com todas ações
 */
module.exports = function(app) {
  
  const EMAIL_FROM = "noreply@dadivarbeta.com.br";
  
  var encrypt = require("../middlewares/encrypt")
    , isValidCell = require("../middlewares/is-valid-cell")
    , isValidEmail = require("../middlewares/is-valid-email")
    , sendSms = require("../middlewares/send-sms")
    , sendEmail = require("../middlewares/send-email")
    , userModel = app.models.user
  ;
  
  var userController = {
    
    /**
     * Responde solicitação com a renderização da view "signup/index".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de signup renderizada
     */
    renderSignup: function(req, res) {
      return res.render("user/signup");
    },
    
    /**
     * Realiza o cadastro de usuário, finalizando com envio de link para ativação
     * da conta através do indentificador informado (e-mail/celular).
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de sucesso renderizada, caso ocorra criação da conta
     *  view de erro renderizada, caso contrário
     */
    signup: function(req, res) {
      
      var isValidData = require("../middlewares/is-valid-data")
        , genTextSmsActive = require("../middlewares/gen-text-sms-active")
        , genTextEmailActive = require("../middlewares/gen-text-email-active")
      ;
      var user = {
        ident: req.body.user.ident.toLowerCase(),
        name: req.body.user.name,
        pass: encrypt(req.body.user.pass),
        code: Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
      };
      
      var query = {ident: user.ident};
      
      if (!isValidData(user.ident, user.name, user.pass)) {
        return res.render("error/index", {
          error: {
            message: "Desculpe, mas os dados informados não são válidos."
          }
        });
      }
      
      // O identificador informado já está sendo usado?
      userModel.findOne(query).exec(function(error, ident) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (ident) {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas o e-mail ou celular informado já está em uso."
            }
          });
        }
        else {
          // Sem erro e identificador disponível, cadastro será persistido na base de dados.
          userModel.create(user, function(error) {
            
            if (error) {
              return res.render("error/index", {
                error: {
                  title: "Ocorreu um erro:",
                  message: error.message
                }
              });
            }
            else {
              // O identificador informado é o que?
              if (isValidCell(user.ident)) {
                sendSms(genTextSmsActive(user.ident, user.code), user.ident);
                return res.render("success/index", {
                  success: {
                    title: user.name + ", obrigado por se cadastrar.",
                    message: "Em breve você receberá uma mensagem de texto em seu celular com o link para ativar sua conta."
                  }
                });
              }
              else {
                sendEmail(EMAIL_FROM, user.ident, "Confirmação de Conta :: Dadivar", genTextEmailActive(user.ident, user.code));
                return res.render("success/index", {
                  success: {
                    title: user.name + ", obrigado por se cadastrar.",
                    message: "Em breve você receberá um e-mail com o link para ativar sua conta."
                  }
                });
              }
            }
            
          });
        }
        
      });
      
    },
    
    /**
     * Responde solicitação com a renderização da view "active/index".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de ativação de conta de usuário renderizada
     */
    renderActive: function(req, res) {
      var ident = req.params.ident
        , code = req.params.code
      ;
      return res.render("user/active", {
        ident: ident,
        code: code
      });
    },
    
    /**
     * Ativa o cadastro de usuário, em seguida já pode realizar o acesso.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  rota de "/login" em caso de sucesso na ativação
     *  view de erro renderizada, caso contrário
     */
    active: function(req, res) {
      
      var ident = req.params.ident
        , code = req.params.code
        , query = {ident: ident, code: code}
      ;
      
      if (!isValidCell(ident) && !isValidEmail(ident)) {
        return res.render("error/index", {
          error: {
            message: "Desculpe, mas o e-mail ou celular não é válido."
          }
        });
      }
      
      // O cadastro a ser ativo realmente existe?
      userModel.findOne(query).select("_id").exec(function(error, user) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (user) {
          // Persiste na base de dados à atualização.
          user.update({active: true}, function() {
            return res.redirect("/login");
          });
        }
        else {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas o link de ativação não é válido."
            }
          });
        }
        
      });
      
    },
    
    /**
     * Responde solicitação com a renderização da view "login/index".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de login renderizada
     */
    renderLogin: function(req, res) {
      if (!req.session.user) {
        return res.render("user/login", {
          error: '',
          ident: '',
          invalid: ''
        });
      }
      return res.redirect("/dashboard");
    },
    
    /**
     * Realiza autenticação dos dados informados no formulário de login.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  rota de "/" em caso de sucesso na autenticação
     *  view renderizada com descrição do erro
     *  view de erro renderizada
     */
    login: function(req, res) {
      
      var isValidLogin = require("../middlewares/is-valid-login")
        , ident = req.body.user.ident.toLowerCase()
        , pass  = req.body.user.pass
      ;
      
      if (!isValidLogin(ident, pass)) {
        return res.render("error/index", {
          error: {
            message: "Desculpe, mas os dados informados não são válidos."
          }
        });
      }
      
      var query = {ident: ident, pass: encrypt(pass), active: true};
      
      // Identificador e senha informados representam um cadastro existente?
      userModel.findOne(query).select("ident name pass triceReg category").exec(function(error, user) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (user) {
          // Inicializa uma sessão para os dados informados.
          req.session.user = user;
          return res.redirect("/dashboard");
        }
        else {
          return res.render("user/login", {
            error: "E-mail, celular ou senha incorretos.",
            ident: ident,
            invalid: "invalid"
          });
        }
        
      });
      
    },

    /**
     * Responde solicitação com a renderização da view "user/recover".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de recuperação de senha renderizada
     */
    renderRecover: function(req, res) {
      // O usuário requisitante está logado?
      var ident = ((req.session.user) ? req.session.user.ident : '');
      return res.render("user/recover", {
        ident: ident
      });
    },
    
    /**
     * Recupera senha através do envio de link para refinição da mesma.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de sucesso renderizada, caso seja enviado link para recuperação de senha
     *  view de erro renderizada, caso contrário
     */
    recover: function(req, res) {
      
      var genTextSmsRecover = require("../middlewares/gen-text-sms-recover")
        , genTextEmailRecover = require("../middlewares/gen-text-email-recover")
        , ident = req.body.user.ident.toLowerCase()
        , query = {ident: ident, active: true}
      ;
      
      if (!isValidCell(ident) && !isValidEmail(ident)) {
        return res.render("error/index", {
          error: {
            message: "Desculpe, mas o e-mail ou celular não é válido."
          }
        });
      }
      
      // Existe cadastro ativo para o identificador informado?
      userModel.findOne(query).select("name pass code").exec(function(error, user) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (user) {
          // O identificador informado é o que?
          if (isValidCell(ident)) {
            sendSms(genTextSmsRecover(ident, user.pass, user.code), ident);
            return res.render("success/index", {
              success: {
                title: user.name + ", sua senha será recuperada.",
                message: "Em breve você receberá uma mensagem de texto em seu celular com o link para redefinir sua senha."
              }
            });
          }
          else {           
            sendEmail(EMAIL_FROM, ident, "Redefinição de Senha :: Dadivar", genTextEmailRecover(ident, user.pass, user.code));
            return res.render("success/index", {
              success: {
                title: user.name + ", sua senha será recuperada.",
                message: "Em breve você receberá um e-mail com o link para redefinir sua senha."
              }
            });
          }
        }
        else {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas a conta que deseja recuperar a senha, não existe ou não se encontra ativa."
            }
          });
        }
      
      });
      
    },
    
    /**
     * Responde solicitação com a renderização da view "user/reset".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de redefinição de senha renderizada
     */
    renderReset: function(req, res) {
      var ident = req.params.ident
        , token = req.params.token
      ;
      return res.render("user/reset", {
        ident: ident, 
        token: token
      });
    },
    
    /**
     * Realiza a redefinição de senha, caso tenha permissão e renderização da 
     * view "error/index", caso contrário.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  rota de "/login" em caso de sucesso na redefinição
     *  view de erro renderizada, caso contrário
     */
    reset: function(req, res) {
      var genTokenRecover = require("../middlewares/gen-token-recover")
        , ident = req.params.ident
        , token = req.params.token
        , pass = encrypt(req.body.user.pass)
        , query = {ident: ident, active: true}
      ;
      
      if (!isValidCell(ident) && !isValidEmail(ident)) {
        return res.render("error/index", {
          error: {
            message: "Desculpe, mas o e-mail ou celular não é válido."
          }
        });
      }
      
      // Existe cadastro ativo para o identificador informado?
      userModel.findOne(query).select("pass code").exec(function(error, user) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (user) {
          if (genTokenRecover(user.pass, user.code) != token) {
            return res.render("error/index", {
              error: {
                message: "Desculpe, mas o link de redefinição não é válido."
              }
            });
          }
          // Caso o token seja válido persiste na base de dados à atualização.
          user.update({pass: pass}, function() {
            req.session.destroy();
            return res.redirect("/login");
          });
        }
        else {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas a conta que deseja redefinir a senha, não existe ou não se encontra ativa."
            }
          });
        }
        
      });
    },
    
    /**
     * Responde solicitação com a renderização da view "user/change".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de alteração de informações renderizada
     */
    renderChange: function(req, res) {
      return res.render("user/change", {
        ident: req.session.user.ident, 
        name: req.session.user.name
      });
    },
    
    /**
     * Altera informações da conta de usuário de acordo com formulário.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  rota de "/" em caso de sucesso na alteração
     *  view de erro renderizada, caso contrário
     */
    change: function(req, res) {
      var ident = req.session.user.ident
        , name = req.body.user.name
        , query = {ident: ident, active: true}
      ;
      
      // Atualiza sessão com atualizações
      req.session.user.name = name;
      
      // O cadastro a ser alterado realmente existe?
      userModel.findOne(query).select("_id").exec(function(error, user) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (user) {
          // Persiste na base de dados à atualização.
          user.update({name: name}, function() {
            return res.redirect("/dashboard");
          });
        }
        else {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas a conta que deseja alterar, não existe ou não se encontra ativa."
            }
          });
        }
        
      });
    },
    
    /**
     * Responde solicitação com a exibição da área de usuário.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de área de usuário renderizada
     */
    dashboard: function(req, res) {
      return res.render("user/dashboard");
    },
    
    /**
     * Responde solicitação com a eliminação da sessão existente.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  rota de página inicial "/"
     */
    logout: function(req, res) {
      req.session.destroy();
      return res.redirect("/");
    }
    
  };
  
  return userController;

};