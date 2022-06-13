$(function () {
  let issuer = window.location.host; // lichess.org
  let user = $(document.body).data('user');
  let secret = $('input[name=secret]').val();
  new QRCode(document.getElementById('qrcode'), {
    text: 'otpauth://totp/' + issuer + ':' + user + '?secret=' + secret + '&issuer=' + issuer,
  });
});
