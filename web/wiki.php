<?php


/**
 * Wikipedia からデータを取得するプログラム
 */

// Wikipedia API の URL
define('WIKIPEDIA_API_URL', 'http://ja.wikipedia.org/wiki/%E7%89%B9%E5%88%A5:%E3%83%87%E3%83%BC%E3%82%BF%E6%9B%B8%E3%81%8D%E5%87%BA%E3%81%97');

// 取得するタイトル
$search_title = 'BERKSHIRE HATHAWAY';

// ストリームコンテキストの生成
$stream_context = stream_context_create(array(
    'http' => array(
        'method' => 'GET',
        'header' => 'User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
    ),
));

// データの取得
$wiki_data = file_get_contents(WIKIPEDIA_API_URL. '/'. urlencode($search_title) , false, $stream_context);

$data = mb_convert_encoding($wiki_data,"utf-8","auto");
echo '<pre>';
echo $data;
echo '<pre>';