"use strict";

/**
 * Controla as ações para as requisições das rotas relacionadas a solicitação.
 * Retorna:
 *  objeto controller de solicitação com todas ações
 */
module.exports = function(app) {
  
  var userModel = app.models.user
    , giftModel = app.models.gift
    , requestModel = app.models.request;
  
  var requestController = {
    
    /**
     * Responde solicitação com a renderização da view "request/create".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de create request renderizada
     */
    renderCreate: function(req, res) {
      
      giftModel.findById({_id: req.params.gift}).exec(function(error, gift) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (gift) {
          return res.render("request/create", {
            gift: gift
          });
        }
        else {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas o presente que deseja solicitar não existe."
            }
          });
        }
        
      });
      
    },
    
    /**
     * Realiza a solicitação de um presente.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  chamada da rota de solicitações realizadas renderizada, caso ocorra sucesso
     *  view de erro renderizada, caso contrário
     */
    create: function(req, res) {
      var request = {
        amount: req.body.request.amount,
        gift: {
          title: null,
          photo: null,
          owner: {
            ident: null,
            name: null
          }
        },
        requester: {
          ident: req.session.user.ident,
          name: req.session.user.name
        }
      };
      
      userModel.findOne({ident: req.session.user.ident}).exec(function(error, user) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (user) {
          if (user.limit == 3) {
            return res.render("error/index", {
              error: {
                message: "Desculpe, mas você atingiu o limite mensal de solicitações."
              }
            });
          }
        }
        
        giftModel.findById({_id: req.params.gift}).exec(function(error, gift) {
          
          if (error) {
            return res.render("error/index", {
              error: {
                title: "Ocorreu um erro:",
                message: error.message
              }
            });
          }
          else if (gift) {
            if (request.amount > gift.amount || request.amount <= 0) {
              return res.render("error/index", {
                error: {
                  message: "Desculpe, mas a quantidade é inválida."
                }
              });
            }
            if (request.requester.ident == gift.owner.ident) {
              return res.render("error/index", {
                error: {
                  message: "Desculpe, mas você não pode solicitar algo que você mesmo publicou."
                }
              });
            }
            
            request.gift.title = gift.title;
            request.gift.photo = gift.photos[0].path;
            request.gift.owner.name = gift.owner.name;
            request.gift.owner.ident = gift.owner.ident;
            
            requestModel.create(request, function(error) {
              if (error) {
                return res.render("error/index", {
                  error: {
                    title: "Ocorreu um erro:",
                    message: error.message
                  }
                });
              }
              else {
                user.limit++;
                user.save();
                gift.amount -= request.amount;
                gift.save();
                return res.redirect("/requested");
              }
            });
            
          }
          else {
            return res.render("error/index", {
              error: {
                message: "Desculpe, mas o presente que deseja solicitar não existe."
              }
            });
          }
          
        });
      
      });
    },
    
    /**
     * Exibe todos presentes disponíveis para solicitação.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de solicitações  disponíveis renderizada
     */
    renderShow: function(req, res) {
      
      var query = {
        requester: {
          ident: req.session.user.ident,
          name: req.session.user.name
        }
      };
      
      requestModel.find(query).exec(function(error, requests) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (requests) {
          // Remove "public/" do caminho físico da imagem
          for (var i = 0, len = requests.length; i < len; i++) {
            var photo = requests[i].gift.photo;
            requests[i].gift.photo = photo.replace("public/", '');
          }
          return res.render("request/show", {
            requests: requests
          });
        }
      });
      
    },
    
    /**
     * Altera status da solitação para concluído.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de presentes disponíveis renderizada, caso de sucesso
     *  view de erro renderizada, caso contrário
     */
    completed: function(req, res) {
      
      var id = req.params._id
        , query = {_id: id}
      ;
      
      requestModel.update(query, {status: "completed"}, function(error) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        return res.redirect("/requested");
        
      });
      
    }
    
  };
  
  return requestController;
  
};