$('body *').mouseenter(function(ev) {
  var tipo = $(ev.currentTarget).get(0).tagName;
  if (tipo !== 'UL'  && tipo !== 'LI' && tipo !== 'SPAN' && tipo !== 'DIV' && tipo !== 'P') {
    $('.pizarra').html(tipo);
    $('.pizarra').css('display', 'block');
  }
});

$('body *').mouseleave(function() {
  if (tipo !== 'UL'  && tipo !== 'LI' && tipo !== 'SPAN' && tipo !== 'DIV' && tipo !== 'P') {
    $('.pizarra').css('display', 'none');
  }
});