//Adapted from - http://codepen.io/grayghostvisuals/pen/ehbaK
var header             = document.querySelector('header'),
    header_height      = getComputedStyle(header).height.split('px')[0],
    title              = header.querySelector('#count'),
    title_height       = getComputedStyle(title).height.split('px')[0],
    fix_class          = 'is--fixed';

function stickyScroll(e) {
  if( window.pageYOffset > (header_height - title_height ) / 2 ) {
    title.classList.add(fix_class);
  }

  if( window.pageYOffset < (header_height - title_height ) / 2 ) {
    title.classList.remove(fix_class);
  }
}
window.addEventListener('scroll', stickyScroll, false);