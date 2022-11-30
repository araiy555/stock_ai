<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える
header('Access-Control-Allow-Origin: *');

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);
    $result = get($pdo, $_GET['market'], $_GET['limit']);
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLAS);
} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function get($pdo, $market, $limit)
{
        $offset = $limit - 100;
        $sql = "SELECT DISTINCT ms.* , mt.*
FROM marketstock AS ms
LEFT JOIN market_translation as mt ON mt.marketstock_id = ms.id

WHERE ms.stock_exchange_country = '$market'
LIMIT $limit offset $offset";

    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}


