function() {
    $('#terms').jScrollPane();
    //$('.letter-terms').reorder();
    $('#letters a').each(function() {
      var letterText = $(this).text();
      var destinationElement = $('h3[rel="' + letterText + '"]').first();
      if (destinationElement.length == 0) {
          $(this).addClass('disabled');
      }
    });
    
    $('#letters ul li a').click(function() {
        //clear textbox
        $("#search").val('');
        $.eshmana.filterResults();
        var api = $('#terms').data('jsp');
        var letterText = $(this).text();
        var destinationElement = $('h3[rel="' + letterText + '"]').first();
        if (destinationElement.length != 0) {
          api.scrollToElement(destinationElement, true);
        }
        return false;
    });
}