<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える
header('Access-Control-Allow-Origin: *');

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);
    $result = get($pdo, $_GET['search']);

    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLAS);
} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function get($pdo, $val)
{
    $sql = "SELECT DISTINCT ms.* , msi.* , mt.*, msinfo.*
FROM marketstock AS ms
INNER JOIN marketstockindex as msi ON msi.marketstock_id = ms.id
INNER JOIN marketstockinfo as msinfo ON msinfo.marketstock_id = ms.id
INNER JOIN market_translation as mt ON mt.marketstock_id = ms.id

WHERE mt.company LIKE '%$val%' OR mt.overview LIKE '%$val%'";

    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}

