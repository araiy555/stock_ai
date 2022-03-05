let zoomSize = 1;
let defaultPositionLeft, defaultPositionTop;

function setZoomStatus(zoomSize) {
    let position;
    if (zoomSize == 1) {
        position = '0px 80px';
    } else if (zoomSize == 1.5) {
        position = '0px 64px';
    } else if (zoomSize == 2) {
        position = '0px 48px';
    } else if (zoomSize == 2.5) {
        position = '0px 32px';
    } else if (zoomSize == 3) {
        position = '0px 16px';
    } else {
        position = '0px 0px';
    }
    $("#zoomSTATUS").css('background-position', position);
}
function zoomIn() {
    if (zoomSize == 3.5) {
        return false;
    }
    zoomSize = zoomSize + 0.5;
    if (!(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0)) {
        $(".magazine").draggable({ disabled: false });
    }
    $(".magazine").css({transform: 'scale('+zoomSize+','+zoomSize+')'});

    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
        $(".magazine-viewport").css('overflow','auto');
        $(".magazine-viewport").addClass("tab-zoom");
    }

    setZoomStatus(zoomSize)
}
function zoomOut() {
    if (zoomSize == 1) {
        return false;
    }
    zoomSize = zoomSize - 0.5;
    $(".magazine").css({transform: 'scale('+zoomSize+','+zoomSize+')'});
    setZoomStatus(zoomSize)
    if (zoomSize == 1) {
        if (!(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0)) {
            $(".magazine").draggable({ disabled: true });
        }
        let param = {
            left: defaultPositionLeft,
            top: defaultPositionTop
        };
        $('.magazine').css(param);

        if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
            $(".magazine-viewport").css('overflow','hidden');
            $(".magazine-viewport").removeClass("tab-zoom");
            $(".magazine-viewport").scrollLeft(0);
            $(".magazine-viewport").scrollTop(0);
        }

    }
}
function makeFilePath(dir, num, type) {
    let page = ( '0000' + num ).slice( -4 );
    return dir + '/page' + page + type +'.jpg';
}

function moveBar(yes) {
    if (Modernizr && Modernizr.csstransforms) {
        $('#slider .ui-slider-handle').css({zIndex: yes ? -1 : 10000});
    }
}

function setPreview(view) {
    let src = makeFilePath(IMG_PREVIEW_URL, view, '_s');

    var previewWidth = 138,
        previewHeight = 200,
        previewSrc = src,
        preview = $(_thumbPreview.children(':first')),
        width = previewWidth;

    _thumbPreview.
    addClass('no-transition').
    css({width: width + 15,
        height: previewHeight + 15,
        top: -previewHeight - 30,
        left: ($($('#slider').children(':first')).width() - width - 15)/2
    });

    preview.css({
        width: width,
        height: previewHeight
    });
    preview.css({backgroundImage: 'url(' + previewSrc + ')'});
    setTimeout(function(){
        _thumbPreview.removeClass('no-transition');
    }, 0);



    preview.css({backgroundPosition:
            '0px '+(0*previewHeight)+'px'
    });
}

function addPage(page, book) {

    var id, pages = book.turn('pages');

    // Create a new element for this page
    var element = $('<div />', {});

    // Add the page to the flipbook
    if (book.turn('addPage', element, page)) {

        // Add the initial HTML
        // It will contain a loader indicator and a gradient
        element.html('<div class="gradient"></div><div class="loader"></div>');

        // Load the page
        loadPage(page, element);
    }

}

function loadPage(page, pageElement) {

    // Create an image element

    var img = $('<img />');

    img.mousedown(function(e) {
        e.preventDefault();
    });

    img.load(function() {

        // Set the size
        $(this).css({width: '100%', height: '100%'});

        // Add the image to the page after loaded

        $(this).appendTo(pageElement);

        // Remove the loader indicator

        pageElement.find('.loader').remove();
    });

    // Load the page

    let src = makeFilePath(IMAGE_DIR, page, '');
    img.attr('src', src);

    //loadRegions(page, pageElement);

}

// Load regions

function loadRegions(page, element) {

    $.getJSON('pages/'+page+'-regions.json').
    done(function(data) {

        $.each(data, function(key, region) {
            addRegion(region, element);
        });
    });
}

function disableControls(page) {
    if (page==1)
        $('.previous-button').hide();
    else
        $('.previous-button').show();

    if (page==$('.magazine').turn('pages'))
        $('.next-button').hide();
    else
        $('.next-button').show();
}

// Zoom in / Zoom out

function zoomTo(event) {
    // console.log(event);
}

// Process click on a region

function regionClick(event) {

    var region = $(event.target);

    if (region.hasClass('region')) {

        $('.magazine-viewport').data().regionClicked = true;

        setTimeout(function() {
            $('.magazine-viewport').data().regionClicked = false;
        }, 100);

        var regionType = $.trim(region.attr('class').replace('region', ''));

        return processRegion(region, regionType);

    }

}

// Set the width and height for the viewport

function resizeViewport() {

    var width = $(window).width(),
        height = $(window).height(),
        options = $('.magazine').turn('options');
    $('.magazine').removeClass('animated');

    $('.magazine-viewport').css({
        width: width,
        height: height
    }).
    zoom('resize');


    if ($('.magazine').turn('zoom')==1) {
        var bound = calculateBound({
            width: options.width,
            height: options.height,
            boundWidth: Math.min(options.width, width),
            boundHeight: Math.min(options.height, height)
        });

        if (bound.width%2!==0)
            bound.width-=1;


        if (bound.width!=$('.magazine').width() || bound.height!=$('.magazine').height()) {

            $('.magazine').turn('size', bound.width, bound.height);

            if ($('.magazine').turn('page')==1)
                $('.magazine').turn('peel', 'br');

            $('.next-button').css({height: bound.height, backgroundPosition: '-38px '+(bound.height/2-32/2)+'px'});
            $('.previous-button').css({height: bound.height, backgroundPosition: '-4px '+(bound.height/2-32/2)+'px'});
        }

        $('.magazine').css({top: -bound.height/2, left: -bound.width/2});
    }

    var magazineOffset = $('.magazine').offset(),
        boundH = height - magazineOffset.top - $('.magazine').height(),
        marginTop = (boundH - $('.thumbnails > div').height()) / 2 - 100;

    if (marginTop<0) {
        $('.thumbnails').css({height:1});
    } else {
        $('.thumbnails').css({height: boundH});
        $('.thumbnails > div').css({marginTop: marginTop});
    }

    if (magazineOffset.top<$('.made').height())
        $('.made').hide();
    else
        $('.made').show();

    $('.magazine').addClass('animated');

}

// Calculate the width and height of a square within another square

function calculateBound(d) {

    var bound = {width: d.width, height: d.height};

    if (bound.width>d.boundWidth || bound.height>d.boundHeight) {

        var rel = bound.width/bound.height;

        if (d.boundWidth/rel>d.boundHeight && d.boundHeight*rel<=d.boundWidth) {

            bound.width = Math.round(d.boundHeight*rel);
            bound.height = d.boundHeight;

        } else {

            bound.width = d.boundWidth;
            bound.height = Math.round(d.boundWidth/rel);

        }
    }

    return bound;
}

// Number of views in a flipbook

function numberOfViews(book) {
    let num = book.turn('pages') / 2 + 1;
    return book.turn('pages');
}

// Current view in a flipbook

function getViewNumber(book, page) {
    let target_page = book.turn('page');
    if (target_page !== 1 && target_page % 2 === 1) {
        target_page--;
    }
    return parseInt((page || target_page), 10);
}

function getDevice() {
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        return 'sp';
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        return 'tab';
    } else {
        return 'other';
    }
}

function loadApp() {

    $('#canvas').fadeIn(1000);

    //flipBookOption

    let flipBookOption = getflipBookOption(getDevice());

    var flipbook = $('.magazine');

    // Check if the CSS was already loaded

    if (flipbook.width() == 0 || flipbook.height() == 0) {
        setTimeout(loadApp, 10);
        return;
    }

    // Create the flipbook

    flipbook.turn({

        display: flipBookOption.display,

        // Magazine width

        width: flipBookOption.width,

        // Magazine height

        height: flipBookOption.height,

        // Duration in millisecond

        duration: 1000,

        //ページ開き 右 ltr 左 rtl デフォルト ltr
        direction: "ltr",

        // Enables gradients

        gradients: true,

        // Auto center this flipbook

        autoCenter: true,

        // Elevation from the edge of the flipbook when turning a page

        elevation: 50,

        // The number of pages

        pages: IMAGE_COUNT,

        // Events

        when: {
            turning: function (event, page, view) {

                var book = $(this),
                    currentPage = book.turn('page'),
                    pages = book.turn('pages');

                // Update the current URI

                Hash.go('page/' + page).update();

                // Show and hide navigation buttons

                disableControls(page);

            },

            turned: function (event, page, view) {

                disableControls(page);

                $(this).turn('center');

                $('#slider').slider('value', getViewNumber($(this), page));

                if (page == 1) {
                    $(this).turn('peel', 'br');
                }

                $(".pageNum input").val(page);

            },

            missing: function (event, pages) {

                // Add pages that aren't in the magazine

                for (var i = 0; i < pages.length; i++)
                    addPage(pages[i], $(this));

            }
        }

    });

    // Zoom.js

    $('.magazine-viewport').zoom({
        flipbook: $('.magazine'),

        max: function () {
            return largeMagazineWidth() / $('.magazine').width();

        },

        when: {
            swipeLeft: function () {
                if (zoomSize == 1) {
                    $('.magazine').turn('next');
                }
            },

            swipeRight: function () {
                if (zoomSize == 1) {
                    $('.magazine').turn('previous');
                }
            },

            resize: function (event, scale, page, pageElement) {

                if (scale == 1)
                    loadSmallPage(page, pageElement);
                else
                    loadLargePage(page, pageElement);

            },

            zoomIn: function () {

                $('#slider-bar').hide();
                $('.made').hide();
                $('.magazine').removeClass('animated').addClass('zoom-in');
                $('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');

                if (!window.escTip && !$.isTouch) {
                    escTip = true;

                    $('<div />', {'class': 'exit-message'}).html('<div>Press ESC to exit</div>').appendTo($('body')).delay(2000).animate({opacity: 0}, 500, function () {
                        $(this).remove();
                    });
                }
            },

            zoomOut: function () {

                $('#slider-bar').fadeIn();
                $('.exit-message').hide();
                $('.made').fadeIn();
                $('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');

                setTimeout(function () {
                    $('.magazine').addClass('animated').removeClass('zoom-in');
                    resizeViewport();
                }, 0);

            }
        }
    });

    // Zoom event

    if ($.isTouch)
        $('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
    else
        $('.magazine-viewport').bind('zoom.tap', zoomTo);


    // Using arrow keys to turn the page

    $(document).keydown(function (e) {

        var previous = 37, next = 39, esc = 27;

        switch (e.keyCode) {
            case previous:

                // left arrow
                $('.magazine').turn('previous');
                e.preventDefault();

                break;
            case next:

                //right arrow
                $('.magazine').turn('next');
                e.preventDefault();

                break;
            case esc:

                $('.magazine-viewport').zoom('zoomOut');
                e.preventDefault();

                break;
        }
    });

    // URIs - Format #/page/1

    Hash.on('^page\/([0-9]*)$', {
        yep: function (path, parts) {
            var page = parts[1];

            if (page !== undefined) {
                if ($('.magazine').turn('is'))
                    $('.magazine').turn('page', page);
            }

        },
        nop: function (path) {

            if ($('.magazine').turn('is'))
                $('.magazine').turn('page', 1);
        }
    });


    $(window).resize(function () {
        resizeViewport();
    }).bind('orientationchange', function () {
        resizeViewport();
    });

    // Regions

    if ($.isTouch) {
        $('.magazine').bind('touchstart', regionClick);
    } else {
        $('.magazine').click(regionClick);
    }

    // Events for the next button

    $('.next-button').bind($.mouseEvents.over, function () {

        $(this).addClass('next-button-hover');

    }).bind($.mouseEvents.out, function () {

        $(this).removeClass('next-button-hover');

    }).bind($.mouseEvents.down, function () {

        $(this).addClass('next-button-down');

    }).bind($.mouseEvents.up, function () {

        $(this).removeClass('next-button-down');

    }).click(function () {

        $('.magazine').turn('next');

    });

    // Events for the next button

    $('.previous-button').bind($.mouseEvents.over, function () {

        $(this).addClass('previous-button-hover');

    }).bind($.mouseEvents.out, function () {

        $(this).removeClass('previous-button-hover');

    }).bind($.mouseEvents.down, function () {

        $(this).addClass('previous-button-down');

    }).bind($.mouseEvents.up, function () {

        $(this).removeClass('previous-button-down');

    }).click(function () {

        $('.magazine').turn('previous');

    });


    // Slider

    $("#slider").slider({
        min: 1,
        max: numberOfViews(flipbook),

        start: function (event, ui) {

            if (!window._thumbPreview) {
                _thumbPreview = $('<div />', {'class': 'thumbnail'}).html('<div></div>');
                setPreview(ui.value);
                _thumbPreview.appendTo($(ui.handle));
            } else
                setPreview(ui.value);

            moveBar(false);

        },

        slide: function (event, ui) {

            setPreview(ui.value);

        },

        stop: function (event, ui) {
            if (window._thumbPreview)
                _thumbPreview.removeClass('show');

            $('.magazine').turn('page', ui.value);

        }
    });

    resizeViewport();

    $('.magazine').addClass('animated');

    defaultPositionLeft = $('.magazine').css('left');
    defaultPositionTop = $('.magazine').css('top');
}

function disableControls(page) {
    if (page==1)
        $('.previous-button').hide();
    else
        $('.previous-button').show();

    if (page==$('.magazine').turn('pages'))
        $('.next-button').hide();
    else
        $('.next-button').show();
}

$(function(){
    $(document).on("click", ".thumb p", function() {
        let pageNum = $(this).attr('class').replace('page', '');
        $('.magazine').turn('page', pageNum);
    });
    $(document).on("click", "#menu .button", function() {
        let status = $("#menuButtonStatus").val();
        if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
            if (status === "0") {
                $(this).css('background-image', 'url(' + LIB_URL + '/img/close.png)');
                $("#menuButtonStatus").val('1');
                $("#menu").css('top', '60px');
            } else {
                $(this).css('background-image', 'url(' + LIB_URL + '/img/menu.png)');
                $("#menuButtonStatus").val('0');
                $("#menu").css('top', '-100vh');
            }
        }else {
            if (status === "0") {
                $(this).css('background-image', 'url(' + LIB_URL + '/img/close.png)');
                $("#menuButtonStatus").val('1');
                $("#menu").css('left', '0px');
            } else {
                $(this).css('background-image', 'url(' + LIB_URL + '/img/menu.png)');
                $("#menuButtonStatus").val('0');
                $("#menu").css('left', '-142px');
            }
        }
    });
    $(document).on("click", ".prevBlock", function () {
        $('.magazine').turn("previous");
    });
    $(document).on("click", ".nextBlock", function () {
        $('.magazine').turn("next");
    });
    $(document).on("click", "#zoomIN", function () {
        zoomIn();
    });
    $(document).on("click", "#zoomOUT", function () {
        zoomOut();
    });
    $(document).on("blur", ".pageNum input", function (event) {
        let pageNum = 1;
        if (!$(this).val().match(/^\d+$/)) {
            pageNum = $('.magazine').turn('page')
            $(".pageNum input").val(pageNum);
        } else {
            pageNum = $(this).val() - 0;
            $('.magazine').turn('page', pageNum);
        }
    });
    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
        $(document).on("click", ".thumb p", function() {
            $("#menu").css('top', '-100vh');
            $("#menu .button").css('background-image', 'url(' + LIB_URL + '/img/menu.png)');
        });
        $(document).ready(function(){
            $(".pageNum input").attr('disabled',true);
        });
    }
});

$(window).keydown(function(event){
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    if (event.keyCode === 27 && zoomSize !== 1) {
        zoomSize = 1;
        $(".magazine").css({transform: 'scale('+zoomSize+','+zoomSize+')'});
        setZoomStatus(zoomSize)
        if (!(navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0)) {
            $(".magazine").draggable({ disabled: true });
        }
        let param = {
            left: defaultPositionLeft,
            top: defaultPositionTop
        };
        $('.magazine').css(param);
    }
});
