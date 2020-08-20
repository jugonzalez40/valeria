const getUrlParameter = (sParam) => {
  let sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
};

const maskAmount = (amount) => {
  var formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  });

  return formatter.format(+amount);
};


$(() => {

  //INPUTS
  const ref = getUrlParameter('ref');
  const amount = getUrlParameter('amount');
  const id = getUrlParameter('id');
  let flowFinished = false;

  const entityResponse = (transaction) => {
    $('.ref-info span').text(transaction.reference);
    if (transaction.status === 'APPROVED') {
      $('#wompi-button').addClass('disabled');
      $('.toast-s').toast('show');
      flowFinished = true;
    } else {
      $('.toast-e').toast('show');
    }
  }

  $('.toast-e, .toast-s, .toast-a').toast({ autohide: false });

  if (id) {
    //FLOW ID by pse
    $.get(`https://production.wompi.co/v1/transactions/${id}`, (result) => {
      $('.card-body').hide();
      flowFinished = true;
      entityResponse(result.data);
    }).fail((result) => {
      $('.card-body').hide();
      flowFinished = true;
      entityResponse({
        status: 'ERROR',
        reference: 'null'
      });
    });
  } else if (!(amount && !isNaN(amount))) {
    //FLOW AMOUNT  INVALID
    console.error(' Not valid amount');
    $('#wompi-button').addClass('disabled');
    $('.toast-a').toast('show');
    flowFinished = true;
  } else {
    // FLOW AMOUNT VALID
    $('.ref-text').text(ref);
    $('.amount-text').text(maskAmount(amount));

    $('#wompi-button').click(() => {
      if (flowFinished) return;
      $('.toast-e, .toast-s, .toast-a').toast('hide');
      const wompiRef = (Math.random().toString(36).slice(2)).toUpperCase();
      const checkout = new WidgetCheckout({
        currency: 'COP',
        amountInCents: +(`${amount}00`),
        reference: wompiRef,
        publicKey: 'pub_prod_R4EkyzNaISXmlv3DbKpfE5w9unaCMrad',
        redirectUrl: `http://valenzuelaluna.com/`
      });
      checkout.open(result => entityResponse(result.transaction));
    });
  }
});

// change sandbox to production 
// change publicKey
// change redirect url 