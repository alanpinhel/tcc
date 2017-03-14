"use strict";

/**
 * Controla as ações para as requisições das rotas relacionadas ao presente.
 * Retorna:
 *  objeto controller de presente com todas ações
 */
module.exports = function(app) {
  
  var replaceWordImproper = require("../middlewares/replace-word-improper")
    , isValidTitle = require("../middlewares/is-valid-title")
    , isValidDescription = require("../middlewares/is-valid-description")
    , resizeImage = require("../middlewares/resize-image")
    , deleteFile = require("../middlewares/delete-file")
    , giftModel = app.models.gift
    , userModel = app.models.user
    , raffleModel = app.models.raffle
  ;
  
  var giftController = {
    
    /**
     * Responde solicitação com a renderização da view "gift/create".
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de create gift renderizada
     */
    renderCreate: function(req, res) {
      return res.render("gift/create");
    },
    
    /**
     * Realiza a publicação de presente.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  chamada da rota de presentes publicados renderizada, caso ocorra sucesso
     *  view de erro renderizada, caso contrário
     */
    create: function(req, res) {
      
      var gift = {
        title: req.body.gift.title,
        description: req.body.gift.description,
        amount: req.body.gift.amount,
        raffle: false,
        photos: [],
        owner: {
          ident: req.session.user.ident,
          name: req.session.user.name
        },
        type: req.body.gift.type
      };
      
      if (!isValidTitle(gift.title) || !isValidDescription(gift.description)) {
        return res.render("error/index", {
          error: {
            message: "Desculpe, mas os dados informados não são válidos."
          }
        });
      }
      
      gift.title = replaceWordImproper(gift.title);
      gift.description = replaceWordImproper(gift.description);
      
      // Armazena caminho físico para cada foto pertencente ao presente
      for (var i = 0, len = req.files.length; i < len; i++) {
        gift.photos.push({
          path: req.files[i].path
        });
        // Redimensiona imagens para otimização de página
        resizeImage(req.files[i].path, 512, 512, 60);
      }
      
      giftModel.create(gift, function(error, gift) {
        
        if (error) {
          for (var i = 0, len = req.files.length; i < len; i++) deleteFile(req.files[i].path);
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else {
          
          // Se o usuário for patrocinador, o presente será cadastrado na modalidade sorteio
          if (req.session.user.category == "sponsor") {
            var raffle = {
              giftId: gift._id,
              earner: {
                ident: "Não defindo",
                name: "Não definido"
              }
            };
            
            raffleModel.create(raffle, function(error) {
              
              if (error) {
                return res.render("error/index", {
                  error: {
                    title: "Ocorreu um erro:",
                    message: error.message
                  }
                });
              }
              else {
                giftModel.update({_id: gift._id}, {raffle: true}, function(error) {
                  
                  if (error) {
                    return res.render("error/index", {
                      error: {
                        title: "Ocorreu um erro:",
                        message: error.message
                      }
                    });
                  }
                  else {
                    return res.redirect("/published");
                  }
                  
                });
              }
              
            });
          }
          else {
            return res.redirect("/published");
          }
          
        }
        
      });
      
    },
    
    /**
     * Exibe os presentes publicados para o usuário logado.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de presentes publicados renderizada, caso ocorra sucesso
     */
    renderPublished: function(req, res) {
      
      var query = {
        owner: {
          ident: req.session.user.ident,
          name: req.session.user.name
        }
      };
      
      giftModel.find(query).select("_id title description photos raffle").exec(function(error, gifts) {
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (gifts) {
          // Remove "public/" do caminho físico da imagem
          for (var i = 0, len = gifts.length; i < len; i++) {
            var path = gifts[i].photos[0].path;
            gifts[i].photos[0].path = path.replace("public/", '');
          }
          return res.render("gift/published", {
            gifts: gifts
          });
        }
        else {
          return res.render("gift/published", {
            gifts: ''
          });
        }
        
      });
      
    },
    
    /**
     * Exibe informações do presente a ser modificado.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de edição de presente, caso o usuário tenha permissão
     *  view de erro renderizada, caso contrário
     */
    renderEdit: function(req, res) {
      
      var id = req.params.id
        , query = {_id: id}
      ;
      
      giftModel.findById(query).exec(function(error, gift) {
        
        if (error) {
          for (var i = 0, len = req.files.length; i < len; i++) deleteFile(req.files[i].path);
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (gift) {
          if (gift.status != "enabled" || gift.owner.ident != req.session.user.ident) {
            return res.render("error/index", {
              error: {
                message: "Desculpe, mas você não tem permissão para alterar o presente."
              }
            });
          }
          // Remove "public/" do caminho físico da imagem
          for (var i = 0, len = gift.photos.length; i < len; i++) {
            var path = gift.photos[i].path;
            gift.photos[i].path = path.replace("public", '');
          }
          return res.render("gift/edit", {
            gift: gift
          });
        }
        else {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas o presente que deseja modificar não existe."
            }
          });
        }
      
      });
      
    },
    
    /**
     * Persiste modificações no presente ao banco de dados.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  chamada da rota de presentes publicados renderizada, caso ocorra sucesso
     *  view de erro renderizada, caso contrário
     */
    edit: function(req, res) {
      
      var title = req.body.gift.title
        , description = req.body.gift.description
        , amount = req.body.gift.amount
        , type = req.body.gift.type
        , id = req.params.id
        , query = {_id: id}
      ;
      
      if (!isValidTitle(title) || !isValidDescription(description)) {
        return res.render("error/index", {
          error: {
            message: "Desculpe, mas os dados informados não são válidos."
          }
        });
      }
      
      title = replaceWordImproper(title);
      description = replaceWordImproper(description);
      
      giftModel.findById(query).exec(function(error, gift) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (gift) {
          if (gift.status != "enabled" || gift.owner.ident != req.session.user.ident) {
            return res.render("error/index", {
              error: {
                message: "Desculpe, mas você não tem permissão para alterar o presente."
              }
            });
          }
          // Armazena caminho físico para cada foto pertencente ao presente
          for (var i = 0, len = req.files.length; i < len; i++) {
            gift.photos.push({
              path: req.files[i].path
            });
            // Redimensiona imagens para otimização de página
            resizeImage(req.files[i].path, 512, 512, 60);
          }
          
          giftModel.update(query, {
            title: title,
            description: description,
            amount: amount,
            photos: gift.photos,
            type: type
          }, function(error) {
            if (error) {
              return res.render("error/index", {
                error: {
                  title: "Ocorreu um erro:",
                  message: error.message
                }
              });
            }
            return res.redirect("/published");
          });
        }
        else {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas o presente que deseja modificar não existe."
            }
          });
        }
        
      });
      
    },
    
    /**
     * Exibe todos presentes disponíveis para solicitação.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de presentes disponíveis renderizada
     */
    renderShow: function(req, res) {
      
      var query = {amount: {$gt: 0}, status: "enabled"};
      
      giftModel.find(query).exec(function(error, gifts) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (gifts) {
          // Remove "public/" do caminho físico da imagem
          for (var i = 0, len = gifts.length; i < len; i++) {
            var path = gifts[i].photos[0].path;
            gifts[i].photos[0].path = path.replace("public/", '');
          }
          return res.render("gift/show", {
            gifts: gifts
          });
        }
        else {
          return res.render("gift/show", {
            gifts: ''
          });
        }
        
      });
      
    },
    
    /**
     * Deleta uma foto de um respectivo presente.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  chamada de rota de edição de presente
     */
    deletePhoto: function(req, res) {
      
      var gift = req.params.gift
        , photo = req.params.photo
        , query = {_id: gift}
      ;
      
      giftModel.findById(query).exec(function(error, gift) {
      
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (gift) {
          if (gift.status != "enabled" || gift.owner.ident != req.session.user.ident) {
            return res.render("error/index", {
              error: {
                message: "Desculpe, mas você não tem permissão para alterar o presente."
              }
            });
          }
          if (gift.photos.length > 1) {
            deleteFile(gift.photos.id(photo).path);
            gift.photos.id(photo).remove();
            gift.save();
          }
          return res.redirect("/gift/" + gift._id + "/edit");
        }
        else {
          return res.render("error/index", {
            error: {
              message: "Desculpe, mas a foto que deseja excluir não existe."
            }
          });
        }
      
      });
      
    },
    
    /**
     * Exibe detalhes de um respectivo presente.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de visualização de detalhes de um presente renderizada, caso ocorra sucesso
     *  view de erro renderizada, caso contrário
     */
    details: function(req, res) {
      
      var id = req.params.id
        , query = {_id: id}
      ;
      
      var type = {
        "1": "Acessórios",
        "2": "Roupas",
        "3": "Beleza",
        "4": "Calçados",
        "5": "Bolsas",
        "6": "Brinquedos",
        "7": "Móveis",
        "8": "Decoração",
        "9": "Eletrodomésticos",
        "10": "Informática",
        "11": "Eletrônico",
        "12": "Animais",
        "13": "Outros"
      };
      
      giftModel.findById(query).exec(function(error, gift) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (gift) {
          if (gift.status != "enabled") {
            return res.render("error/index", {
              error: {
                message: "Desculpe, mas você não pode solicitar o presente."
              }
            });
          }
          // Remove "public/" do caminho físico da imagem
          for (var i = 0, len = gift.photos.length; i < len; i++) {
            var path = gift.photos[i].path;
            gift.photos[i].path = path.replace("public", '');
          }
          
          userModel.findOne({ident: gift.owner.ident}).exec(function(error, user) {
            if (error) {
              return res.render("error/index", {
                error: {
                  title: "Ocorreu um erro:",
                  message: error.message
                }
              });
            }
            else if (user) {
              if (gift.raffle) {
                raffleModel.findOne({giftId: gift._id}).exec(function(error, raffle) {
                  if (error) {
                    return res.render("error/index", {
                      error: {
                        title: "Ocorreu um erro:",
                        message: error.message
                      }
                    });
                  }
                  else if (raffle) {
                    gift.type = type[gift.type];
                    return res.render("gift/details", {
                      gift: gift,
                      raffle: raffle
                    });
                  }
                });
              }
              else {
                gift.type = type[gift.type];
                return res.render("gift/details", {
                  gift: gift
                });
              }
            }
            else {
              return res.render("error/index", {
                error: {
                  message: "Desculpe, mas o presente não possui dono."
                }
              });
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
      
    }
    
  };
  
  return giftController;
  
};