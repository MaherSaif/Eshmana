window.log = function(){
  log.history = log.history || [];
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;  
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


// https://gist.github.com/236696
$.fn.reorder = function(callback) {

  // random array sort @see http://javascript.about.com/library/blsort2.htm
  function randOrd() { return(Math.round(Math.random())-0.5); }

  return($(this).each(function() {
    var $this = $(this);
    var $children = $this.children();
    var childCount = $children.length;

    if (childCount > 1) {
      $children.hide();

      var indices = new Array();
      for (i=0;i<childCount;i++) { indices[indices.length] = i; }
      indices = indices.sort(randOrd);
      $.each(indices,function(j,k) { 
        var $child = $children.eq(k);
        var $clone = $child.clone(true);
        $clone.show().appendTo($this);
        if (callback != undefined) {
          callback($child, $clone);
        }
        $child.remove();
      });
    }
  }));
}