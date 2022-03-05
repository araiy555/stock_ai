<?php
require_once('comic.php');
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <title>Using turn.js and the new zoom feature</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="<?php echo LIB_URL; ?>css/magazine.css">
    <script type="text/javascript" src="<?php echo LIB_URL; ?>jquery.min.1.7.js"></script>
    <script type="text/javascript" src="<?php echo LIB_URL; ?>modernizr.2.5.3.min.js"></script>
    <script type="text/javascript" src="<?php echo LIB_URL; ?>jquery-ui-1.8.20.custom.min.js"></script>
    <script type="text/javascript" src="<?php echo LIB_URL; ?>jquery.ui.draggable.js"></script>
    <script type="text/javascript" src="<?php echo LIB_URL; ?>jquery.ui.touch-punch.min.js"></script>
    <script type="text/javascript" src="<?php echo LIB_URL; ?>hash.js"></script>
    <script type="text/javascript" src="<?php echo LIB_URL; ?>zoom.js"></script>
    <script type="text/javascript" src="<?php echo LIB_URL; ?>js/magazine.js"></script>

    <script type="text/javascript">
        const LIB_URL = '<?php echo LIB_URL; ?>';
        const IMAGE_DIR = '<?php echo IMG_URL; ?>';
        const IMAGE_COUNT = '<?php echo $image_count; ?>';
        const IMG_PREVIEW_URL = '<?php echo IMG_THUMBNAIL_URL; ?>';

        function getflipBookOption(device) {
            let setFlipBookOption = [];
            switch (device) {
                case 'sp':
                    setFlipBookOption['display'] = 'single';
                    setFlipBookOption['width'] = 900;
                    setFlipBookOption['height'] = 1300;
                    setFlipBookOption['button-hover'] = 1300;
                    break;
                case 'tab':
                    setFlipBookOption['display'] = 'single';
                    setFlipBookOption['width'] = 900;
                    setFlipBookOption['height'] = 1300;
                    setFlipBookOption['button-hover'] = 800;
                    break;
                default:
                    setFlipBookOption['display'] = 'single';
                    setFlipBookOption['width'] = 513;
                    setFlipBookOption['height'] = 750;
                    setFlipBookOption['button-hover'] = 750;
            }
            $('.previous-button').css({'height': setFlipBookOption['button-hover']});
            $('.next-button').css({'height': setFlipBookOption['button-hover']});

            return setFlipBookOption;
        }

        // Load the HTML4 version if there's not CSS transform

        yepnope({
            test: Modernizr.csstransforms,
            yep: [LIB_URL + 'turn.min.js'],
            nope: [LIB_URL + 'turn.html4.min.js', LIB_URL + 'css/jquery.ui.html4.css'],
            both: [LIB_URL + 'zoom.min.js', LIB_URL + 'css/jquery.ui.css', LIB_URL + 'css/magazine.css'],
            complete: loadApp
        });
    </script>
	<script>
	if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
		$(document).ready(function(){
			var style = '<link rel="stylesheet" href="<?php echo LIB_URL; ?>/css/magazine_tab.css?<?php echo $timestamp; ?>">';
			$('head').append(style);
		});
	}
	</script>
</head>
<body>
<div id="menu">
    <div class="button"><input type="hidden" id="menuButtonStatus" value="0"></div>
	<div class="thumb_wrapper">
		<div class="thumb">
			<?php foreach ($thumbnails as $class => $thumbnail): ?>
			<p class="<?php echo $class;?>" style="background-image: url(<?php echo $thumbnail;?>)"></p>
			<?php endforeach; ?>
		</div>
	</div>
</div>
<div id="canvas">
    <div class="magazine-viewport">
        <div class="container">
            <div class="magazine">
                <!-- Next button -->
                <div ignore="1" class="next-button"></div>
                <!-- Previous button -->
                <div ignore="1" class="previous-button"></div>
            </div>
        </div>
    </div>
</div>
<div class="bottom" style="text-align: center">
	<div class="bottom_inner">
		<div class="pageNum"><input type="tel" maxlength="3"> / <?php echo $image_count;?></div>
		<div id="slider-bar" class="turnjs-slider">
			<div id="slider"></div>
		</div>
		<div class="movePage">
			<div class="prevBlock"></div>
			<div class="nextBlock"></div>
		</div>
		<ul class="zoom">
			<li id="zoomIN"></li>
			<li id="zoomOUT"></li>
		</ul>
	</div>
</div>
</body>
</html>