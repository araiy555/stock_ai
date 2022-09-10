<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える
header('Access-Control-Allow-Origin: *');

try {
    $result = array();
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);
    $result[] = getDESC($pdo, $_GET['search']);
    $result[] = getASC($pdo, $_GET['search']);

    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLAS);
} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function getDESC($pdo)
{
    $sql = "SELECT ms.* , mt.*, t.*
FROM marketstock AS ms
INNER JOIN market_translation as mt ON mt.marketstock_id = ms.id
INNER JOIN trend as t ON t.marketstock_id = ms.id
WHERE t.soaring_rate < 99
ORDER BY soaring_rate DESC
LIMIT 20
";
    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}

function getASC($pdo)
{
    $sql = "SELECT ms.* , mt.*, t.*
FROM marketstock AS ms
INNER JOIN market_translation as mt ON mt.marketstock_id = ms.id
INNER JOIN trend as t ON t.marketstock_id = ms.id
WHERE t.soaring_rate < 0
ORDER BY soaring_rate ASC
LIMIT 20
";

    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}
