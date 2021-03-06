/*
 * Magazine sample
*/

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

function makeFilePath(num) {
    let page = ( '0000' + num ).slice( -4 );
    return IMAGE_DIR + '/page' + page + '.jpg';
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

        duration: 1000,

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

    //display
    $('.magazine').css('overflow', 'visible');
    $('.pageNum').css({'display': ''});

    // Zoom.js
    $('.magazine-viewport').zoom({

        flipbook: $('.magazine'),

        max: function () {
            let flipBookOption = getflipBookOption(getDevice());

            return flipBookOption['zoom-magazine-Width'] / $('.magazine').width();

        },

        when: {
            swipeLeft: function () {
                $('.magazine').turn('next');
            },

            swipeRight: function () {
                $('.magazine').turn('previous');
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

            moveBar(false);

        },

        stop: function () {

            $('.magazine').turn('page', Math.max(1, $(this).slider('value')));

        }
    });

    resizeViewport();

    $('.magazine').addClass('animated');

}

// Zoom icon

$('.zoom-icon').bind('mouseover', function () {

    if ($(this).hasClass('zoom-icon-in'))
        $(this).addClass('zoom-icon-in-hover');

    if ($(this).hasClass('zoom-icon-out'))
        $(this).addClass('zoom-icon-out-hover');

}).bind('mouseout', function () {

    if ($(this).hasClass('zoom-icon-in'))
        $(this).removeClass('zoom-icon-in-hover');

    if ($(this).hasClass('zoom-icon-out'))
        $(this).removeClass('zoom-icon-out-hover');

}).bind('click', function () {

    if ($(this).hasClass('zoom-icon-in'))
        $('.magazine-viewport').zoom('zoomIn');
    else if ($(this).hasClass('zoom-icon-out'))
        $('.magazine-viewport').zoom('zoomOut');

});

$('#canvas').hide();


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

    img.mousedown(function (e) {
        e.preventDefault();
    });

    img.load(function () {

        // Set the size
        $(this).css({width: '100%', height: '100%'});

        // Add the image to the page after loaded

        $(this).appendTo(pageElement);

        // Remove the loader indicator

        pageElement.find('.loader').remove();
    });

    // Load the page

    img.attr('src', makeFilePath(page));


}

// Zoom in / Zoom out

function zoomTo(event) {

    setTimeout(function () {
        if ($('.magazine-viewport').data().regionClicked) {
            $('.magazine-viewport').data().regionClicked = false;
        } else {
            if ($('.magazine-viewport').zoom('value') == 1) {
                $('.magazine-viewport').zoom('zoomIn', event);
            } else {
                $('.magazine-viewport').zoom('zoomOut');
            }
        }
    }, 1);

}

// Process click on a region

function regionClick(event) {

    var region = $(event.target);

    if (region.hasClass('region')) {

        $('.magazine-viewport').data().regionClicked = true;

        setTimeout(function () {
            $('.magazine-viewport').data().regionClicked = false;
        }, 100);

        var regionType = $.trim(region.attr('class').replace('region', ''));

        return processRegion(region, regionType);

    }

}

// Process the data of every region

function processRegion(region, regionType) {

    data = decodeParams(region.attr('region-data'));

    switch (regionType) {
        case 'link' :

            window.open(data.url);

            break;
        case 'zoom' :

            var regionOffset = region.offset(),
                viewportOffset = $('.magazine-viewport').offset(),

                pos = {
                    x: regionOffset.left - viewportOffset.left,
                    y: regionOffset.top - viewportOffset.top
                };

            $('.magazine-viewport').zoom('zoomIn', pos);

            break;
        case 'to-page' :

            $('.magazine').turn('page', data.page);

            break;
    }

}

// Load large page

function loadLargePage(page, pageElement) {

    var img = $('<img />');

    img.load(function () {

        var prevImg = pageElement.find('img');
        $(this).css({width: '100%', height: '100%'});
        $(this).appendTo(pageElement);
        prevImg.remove();

    });

    // Loadnew page

    img.attr('src', makeFilePath(page));
}

// Load small page

function loadSmallPage(page, pageElement) {

    var img = pageElement.find('img');

    img.css({width: '100%', height: '100%'});

    img.unbind('load');
    // Loadnew page

    img.attr('src', makeFilePath(page));
}

function disableControls(page) {
    if (page == 1)
        $('.previous-button').hide();
    else
        $('.previous-button').show();

    if (page == $('.magazine').turn('pages'))
        $('.next-button').hide();
    else
        $('.next-button').show();
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
    }).zoom('resize');


    if ($('.magazine').turn('zoom') == 1) {
        var bound = calculateBound({
            width: options.width,
            height: options.height,
            boundWidth: Math.min(options.width, width),
            boundHeight: Math.min(options.height, height)
        });

        if (bound.width % 2 !== 0)
            bound.width -= 1;


        if (bound.width != $('.magazine').width() || bound.height != $('.magazine').height()) {

            $('.magazine').turn('size', bound.width, bound.height);

            if ($('.magazine').turn('page') == 1)
                $('.magazine').turn('peel', 'br');

            $('.next-button').css({
                height: bound.height,
                backgroundPosition: '-38px ' + (bound.height / 2 - 32 / 2) + 'px'
            });
            $('.previous-button').css({
                height: bound.height,
                backgroundPosition: '-4px ' + (bound.height / 2 - 32 / 2) + 'px'
            });
        }

        $('.magazine').css({top: -bound.height / 2, left: -bound.width / 2});
    }

    var magazineOffset = $('.magazine').offset(),
        boundH = height - magazineOffset.top - $('.magazine').height(),
        marginTop = (boundH - $('.thumbnails > div').height()) / 2;

    if (marginTop < 0) {
        $('.thumbnails').css({height: 1});
    } else {
        $('.thumbnails').css({height: boundH});
        $('.thumbnails > div').css({marginTop: marginTop});
    }

    if (magazineOffset.top < $('.made').height())
        $('.made').hide();
    else
        $('.made').show();

    $('.magazine').addClass('animated');

}


// Number of views in a flipbook

function numberOfViews(book) {
    return book.turn('pages');
}

// Current view in a flipbook

function getViewNumber(book, page) {
    return parseInt(book.turn('page'));
}

function moveBar(yes) {
    if (Modernizr && Modernizr.csstransforms) {
        $('#slider .ui-slider-handle').css({zIndex: yes ? -1 : 10000});
    }
}

// decode URL Parameters

function decodeParams(data) {

    var parts = data.split('&'), d, obj = {};

    for (var i = 0; i < parts.length; i++) {
        d = parts[i].split('=');
        obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
    }

    return obj;
}

// Calculate the width and height of a square within another square

function calculateBound(d) {

    var bound = {width: d.width, height: d.height};

    if (bound.width > d.boundWidth || bound.height > d.boundHeight) {

        var rel = bound.width / bound.height;

        if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {

            bound.width = Math.round(d.boundHeight * rel);
            bound.height = d.boundHeight;

        } else {

            bound.width = d.boundWidth;
            bound.height = Math.round(d.boundWidth / rel);

        }
    }

    return bound;
}

$(function () {
    $(document).on("click", ".thumb p", function () {
        let pageNum = $(this).attr('class').replace('page', '');
        $('.magazine').turn('page', pageNum);
    });

    $(document).on("click", "#menu .button", function () {
        let status = $("#menuButtonStatus").val();
        if (status === "0") {
            $(this).css('background-image', 'url(' + LIB_URL + 'img/close.png)');
            $("#menuButtonStatus").val('1');
            $("#menu").css('left', '0px');
        } else {
            $(this).css('background-image', 'url(' + LIB_URL + 'img/menu.png)');
            $("#menuButtonStatus").val('0');
            $("#menu").css('left', '-120px');
        }
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
});

