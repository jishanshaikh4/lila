lichess.load.then(() => {
  $('.event .countdown').each(function() {
    let $el = $(this);
    let seconds = parseInt($(this).data('seconds')) - 1;
    let target = new Date().getTime() + seconds * 1000;

    let second = 1000, minute = second * 60, hour = minute * 60,
        day = hour * 24;

    let redraw = function() {
      let distance = target - new Date().getTime();

      if (distance > 0) {
        $el.find('.days').text(Math.floor(distance / day)),
            $el.find('.hours').text(Math.floor((distance % day) / hour)),
            $el.find('.minutes').text(Math.floor((distance % hour) / minute)),
            $el.find('.seconds').text(Math.floor((distance % minute) / second));
      } else {
        clearInterval(interval);
        lichess.reload();
      }
    };
    var interval = setInterval(redraw, second);

    redraw();
  });
});
