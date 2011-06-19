$.eshmana = $.eshmana || {};

$.extend($.eshmana, {
    timerId : '',
    shuffleItems : [],
    app : {},
    sideNoteClosed: false,
    liveChangeStarted: false,
    init: function() {
        var opts = {};
        if (document.location.pathname.indexOf("_design") == -1) {
          // we are in a vhost
          opts.db = "eshmana";
          opts.design = "Eshmana";
        };
        $.couch.app(function(app) {
            this.app = app;
            $('#terms').evently('words', app);
            $('#featured').evently('featured', app);
            
            $('#shuffle').click($.proxy(function () {
                $.eshmana.stopShuffling();
                var on = ($('#shuffle').hasClass('turn-on')) ? true : false;
                if (!on) {
                    this.app.db.view('Eshmana/definitions',
                    {
                        success : function(data) {
                            $.eshmana.startShuffling(data);
                        }
                    });
                }
                $.eshmana.barButtonToogle($('#shuffle'));
                return false;
            },this));
            
            $("#live").click($.proxy(function () {
                if (!$.eshmana.liveChangeStarted) {
                    $('#live-stream-items').evently('live', app);
                    $.eshmana.liveChangeStarted = true;
                }
                $.eshmana.stopShuffling();
                $.eshmana.barButtonToogle($('#live'));
                if (!$.eshmana.sideNoteClosed && $('#side-note').length <= 0) {
                    var sideNote = $.eshmana.sideNoteDiv();
                    $('#live-stream').prepend($(sideNote));
                    
                    $('#side-note .close a').click(function() {
                        $('#side-note').fadeOut('fast');
                        $.eshmana.sideNoteClosed = true;
                        return false;
                    });
                }
                return false;
            },this));
            
            //Simulate a click
            $('#shuffle').click();
        }, opts);
        
        $("#search").keyup($.eshmana.filterResults);
        $("#shuffle, #live").tooltip({opacity: 0.9, predelay: 300});
    },
    startShuffling: function(data) {
        if(this.timerId != null) {
            var thiss = this;
            this.shuffleItems = data.rows;
            this.appendShuffleItem();
            this.timerId = setInterval(function () {
                thiss.appendShuffleItem();
            }, 5000);
        }
    },
    stopShuffling: function() {
        clearInterval(this.timerId);
    },
    appendItemToStream: function(streamItem) {
        $('#shuffle-stream-items').prepend(streamItem);
        if ( $('#shuffle-stream-items .stream-item').length > 3 ) {
            $('#shuffle-stream-items .stream-item').last().remove();
        }
        $('#shuffle-stream .stream-item').first().slideDown();
    },
    appendShuffleItem: function() {
        var min = 0;
        var max = this.shuffleItems.length - 1;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var streamItem = this.streamItemDiv(this.shuffleItems[random].value);
        this.appendItemToStream(streamItem);
    },
    barButtonsTurnOff: function() {
        //SHUTDOWN EVERYTHINGGGGG!!
        $('#toolbar').children().each(function() {
            $(this).addClass('turn-off');
            $(this).removeClass('turn-on');
        });
    },
    barButtonToogle: function(item) {
        var onState = item.hasClass('turn-on');
        var item_id = item.attr('id');
        
        this.barButtonsTurnOff();
        
        if (!onState) {
            item.addClass('turn-on');
            item.removeClass('turn-off');
            this.streamTurnOn($('#'+item.attr('id')+'-stream'));
        }
    },
    streamTurnOn: function(stream) {
        $('#streams').children().each(function() {
            if ($(this).attr('id') == stream.attr('id')) {
                stream.show();
            } else {
                $(this).hide()
            }
        });
    },
    streamItemDiv: function(definition) {
        return '<div class="stream-item" style="display:none"> \
          <h2 class="stream-item-word">' + definition.word + '</h2> \
          <blockquote class="stream-item-meaning" cite=""><p>' + definition.meaning + '</p></blockquote> \
          <div class="stream-item-contributed-by"> \
            <a href="http://twitter.com/#!/' + definition['tweet-data'].from_user + '/status/' + definition['tweet-data'].id_str + '"><img src="' + definition['tweet-data'].profile_image_url + '" width="32" height="32" alt="@' + definition['tweet-data'].from_user + '" />ساهم بها <span dir="ltr">' + definition['tweet-data'].from_user + '</span></a> \
          </div> \
          <div class="stream-item-share"> \
            <iframe allowtransparency="true" frameborder="0" scrolling="no" \
                    src="http://platform.twitter.com/widgets/tweet_button.html?count=none&amp;text=' + definition.word + ':%20' + definition.meaning + '&amp;url=http://www.eshmana.com/word/' + definition._id + '&amp;related=eshmana" \
                    class="tweet-button"></iframe> \
            <a href="/word/' + definition._id + '" class="button"><i></i><span>رابط ثابت</span></a> \
          </div> \
        </div>';
    },
    sideNoteDiv: function() {
        return '<div id="side-note"> \
                    <i class="close"><a href="#">x</a></i> \
                    <p>‎مباشر يتيح لك متابعة وإضافة كلمات جديدة عبر تويتر‫.‬ لإضافة كلمة جديدة غرّد باستخدام النسق التالي‫:‬</p> \
                    <pre class="side-note-format"><code>الكلمة: معني الكلمة ‪#‬QatarWords</code></pre> \
                </div>';
    },
    filterResults: function() {
        var filter = $("#search").val(), count = 0;
        $(".letter-terms-item-link").each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).parent().addClass("hidden");
            } else {
                $(this).parent().removeClass("hidden");
                count++;
            }
        });

        $('.letter-terms').each(function() {
          var count_hidden_children = 0;
          $(this).children('.letter-terms-item').each(function() {
            if ($(this).hasClass('hidden')) {
              count_hidden_children++;
            }
          });
          if ( $(this).children('.letter-terms-item').length == count_hidden_children ) {
            $(this).prev().addClass('hidden');
          } else {
            $(this).prev().removeClass('hidden');
          }
        });
        $('#terms').jScrollPane();
    }
});

$(function () {
    $.eshmana.init();
});