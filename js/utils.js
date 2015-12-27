// Trying using an object as an interface for modules
// Inspired from - http://eloquentjavascript.net/10_modules.html

(function(exports) {

  //Adapted from - http://stackoverflow.com/questions/10787782/full-height-of-a-html-element-div-including-border-padding-and-margin
  exports.height = function(selector) {
    var elmHeight, elmMargin, elm = document.querySelector(selector);
    if(document.all) {// IE
      elmHeight = elm.currentStyle.height;
      elmMargin = parseInt(elm.currentStyle.marginTop, 10) + parseInt(elm.currentStyle.marginBottom, 10);
    } else {// Mozilla
      elmHeight = document.defaultView.getComputedStyle(elm, '').getPropertyValue('height');
      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
    }
    return parseInt(elmHeight) + parseInt(elmMargin);
  }

  // Below from - http://stackoverflow.com/questions/3898130/how-to-check-if-a-user-has-scrolled-to-the-bottom
  exports.getDocHeight = function() {
    var D = document;
    return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
    );
  }
})(this.utils = {})