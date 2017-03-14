"use strict";

/**
 * Finaliza um sorteio selecionando um ganhador e desativando publicação.
 * Parâmetro:
 *  raffleModel: objeto de modelo para sorteio
 */
module.exports = function(raffleModel, giftModel) {
  
  var fifteenDays = 1296000;
  var today = Date.now();
  var dayRaffle;
  
  raffleModel.find({active: true}, function(error, raffles) {
    
    for (var i = 0, len = raffles.length; i < len; i++) {
      dayRaffle = raffles[i].triceReg.getTime() + fifteenDays;
      if (dayRaffle <= today) {
        var giftId = raffles[i].giftId;
        var amountSubscribers = raffles[i].subscribers.length;
        var numberRaffle = Math.floor(Math.random() * (amountSubscribers));
        raffles[i].active = false;
        raffles[i].earner = raffles[i].subscribers[numberRaffle];
        raffles[i].save();
        giftModel.update({_id: giftId}, {status: "disabled"}, function() {});
      }
    }
    
  });
  
};