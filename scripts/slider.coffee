---
---

slider = new SimpleSlider document.getElementById('slider'),
  autoPlay: true,
  transitionDelay: 10,
  transitionDuration: 1,
  transitionProperty: 'opacity',
  startValue: 0,
  visibleValue: 1,
  endValue: 0

$('.slide-button').on 'click', (e) ->
  value = $(e.currentTarget).data 'value'
  slider.change value
  $('.slide-button').removeClass 'active'
  $(e.currentTarget).addClass 'active'