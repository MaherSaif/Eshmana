$.eshmana = $.eshmana || {};

$.extend($.eshmana, {
    timerId : '',
    shuffleItems : [],
    app : {},
    sideNoteClosed: false,
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
                $('#side-note').hide();
                $('#live-stream').hide();
                $('#stream').show();
                var on = ($('#shuffle').hasClass('turn-on')) ? true : false;
                if (!on) {
                    this.app.db.view('Eshmana/definitions', {
                        success : function(data) {
                            $.eshmana.startShuffling(data);
                        }
                    });
                }
                $.eshmana.barButtonToggle('#shuffle');
                return false;
            },this));
            $("#live").click($.proxy(function () {
                $.eshmana.stopShuffling();
                if (!$.eshmana.sideNoteClosed) {
                    $('#side-note').show();
                }
                $('#live-stream').evently('live', app);
                var on = ($('#live').hasClass('turn-on')) ? true : false;
                if (!on) {
                    $('#live-stream').show();
                    $('#stream').hide().empty();
                } else {
                    $('#live-stream').hide();
                    $('#stream').show();
                }
                $.eshmana.barButtonToggle('#live');
                return false;
            },this));
            $('#shuffle').click();
        }, opts);
        $('.close a').click($.proxy(function() {
            $('#side-note').fadeOut('fast');
            $.eshmana.sideNoteClosed = true;
            return false;
        },this));
        $("#search").keyup($.eshmana.filterResults);
        $("#shuffle, #live").tooltip({opacity: 0.9, predelay: 300});
    },
    startShuffling: function(data) {
        var thiss = this;
        this.shuffleItems = data.rows;
        if(this.timerId != null) {
            this.appendShuffleItem();
            this.timerId = setInterval(function () {
                thiss.appendShuffleItem();
            }, 4000);
        }
    },
    stopShuffling: function() {
        clearInterval(this.timerId);
    },
    appendShuffleItem: function() {
        var min = 0;
        var max = this.shuffleItems.length - 1;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var streamItem = this.streamItemDiv(this.shuffleItems[random].value);
        $('#stream').prepend(streamItem);
        $('#stream .stream-item').first().slideDown();
        if ( $('#stream .stream-item').length > 3 ) {
            $('#stream .stream-item').last().remove();
        }
    },
    barButtonsTurnOFf: function() {
        $('#toolbar').children().each(function() {
            $(this).addClass('turn-off');
            $(this).removeClass('turn-on');
        });
    },
    barButtonToggle: function(item) {
        var item = $(item);
        var state = (item.hasClass('turn-on')) ? true : false;
        this.barButtonsTurnOFf();
        if (!state) {
            item.addClass('turn-on');
        }
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