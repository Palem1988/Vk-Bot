
function Feedback($){
  $.text("We are eagerly waiting for your feedback")
}

function Subscribe_coin($){
  $.text("please type in the name of the coin to subscribe")
}

function Unsubscribe_coin($){
  $.text("please type in the name of the coin to Unsubscribe")
}
var state;
exports.processState = function(state, $){
  switch(state){
    case 'Feedback': return Feedback($)
    case 'Subscribe coin': return Subscribe_coin($)
    case 'Unsubscribe coin': return Unsubscribe_coin($)
  }
}
