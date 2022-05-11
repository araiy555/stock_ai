<?php
$rss = simplexml_load_file( 'https://trends.google.co.jp/trends/trendingsearches/daily/rss?geo=JP' );
var_dump($rss->channel->item);

$list = '<ul>';

foreach ( $rss->channel->item as $item ) {

    $list .= '<li><a href="';
    $list .=  $item->link;
    $list .= '">';
    $list .=  $item->title;
    $list .=  '</a></li>';
}


$list .= '</ul>';

echo $list;