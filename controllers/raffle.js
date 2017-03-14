"use strict";

module.exports = function(app) {
  
  var raffleModel = app.models.raffle
    , giftModel = app.models.gift;
  
  var raffleController = {
    
    subscribe: function(req, res) {
      
      raffleModel.findById({_id: req.params._id}).exec(function(error, raffle) {
        
          if (error) {
            return res.render("error/index", {
              error: {
                title: "Ocorreu um erro:",
                message: error.message
              }
            });
          }
          else if (raffle) {
            for (var i = 0, len = raffle.subscribers.length; i < len; i++) {
              if (raffle.subscribers[i].ident == req.session.user.ident) {
                return res.render("error/index", {
                  error: {
                    message: "Desculpe, mas você já está inscrito nesse sorteio."
                  }
                });
              }
            }
            
            var subscribe = {
              ident: req.session.user.ident,
              name: req.session.user.name
            };
            raffle.subscribers.push(subscribe);
            raffle.save();
            
            return res.redirect("/subscribed");
          }
          else {
            return res.render("error/index", {
              error: {
                message: "Desculpe, mas o sorteio que deseja se inscrever não existe."
              }
            });
          }
          
      });
      
    },
    
    /**
     * Exibe todos presentes à concorrer.
     * Parâmetros:
     *  req: solicitação HTTP que disparou o evento
     *  res: envio de resposta HTTP desejada
     * Retorna:
     *  view de presentes presentes à concorrer renderizada, caso ocorra sucesso
     *  view de erro renderizada, caso contrário
     */
    show: function(req, res) {
      
      raffleModel.find().exec(function(error, raffles) {
        
        if (error) {
          return res.render("error/index", {
            error: {
              title: "Ocorreu um erro:",
              message: error.message
            }
          });
        }
        else if (raffles) {
          giftModel.find().exec(function(error, gifts) {
            
            if (error) {
              return res.render("error/index", {
                error: {
                  title: "Ocorreu um erro:",
                  message: error.message
                }
              });
            }
            else if (gifts) {
              var rafflesShow = [];
              
              for (var i = 0, lenI = raffles.length; i < lenI; i++) {
                for (var j = 0, lenJ = raffles[i].subscribers.length; j < lenJ; j++) {
                  if (raffles[i].subscribers[j].ident == req.session.user.ident) {
                    for (var k = 0, lenK = gifts.length; k < lenK; k++) {
                      if (raffles[i].giftId == gifts[k]._id) {
                        var photo = gifts[k].photos[0].path;
                        var raffleShow = {
                          active: raffles[i].active,
                          earner: {
                            ident: raffles[i].earner.ident,
                            name: raffles[i].earner.name
                          },
                          gift: {
                            _id: gifts[k]._id,
                            title: gifts[k].title,
                            amount: gifts[k].amount,
                            photo: photo.replace("public/", ''),
                            owner: {
                              ident: gifts[k].owner.ident,
                              name: gifts[k].owner.name
                            }
                          }
                        };
                        rafflesShow.push(raffleShow);
                        break;
                      }
                    }
                  }
                }
              }
              if (rafflesShow) {
                return res.render("raffle/show", {
                  raffles: rafflesShow
                });
              }
              else {
                return res.render("raffle/show", {
                  raffles: ''
                });
              }
              
            }
            else {
              return res.render("raffle/show", {
                raffles: ''
              });
            }
            
          });
        }
        else {
          return res.render("raffle/show", {
            raffles: ''
          });
        }
        
      });
      
    }
    
  };
  
  return raffleController;
  
};