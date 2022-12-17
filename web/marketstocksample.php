<?php


$queryString = http_build_query([
    'access_key' => 'a54e1687262eda9a5362a63844d0e752'
]);

$ch = curl_init(sprintf('%s?%s', 'http://api.marketstack.com/v1/eod', $queryString));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$json = curl_exec($ch);
curl_close($ch);

$apiResult = json_decode($json, true);
var_dump($apiResult);

