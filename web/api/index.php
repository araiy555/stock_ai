<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える
header('Access-Control-Allow-Origin: *');

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);
    $result = get($pdo);
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLAS);
} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function get($pdo)
{

    $sql = "SELECT ms.*, msc.*,msi.closing_price, msi.open_price, msi.high_price, msi.low_price
FROM marketstock AS ms
INNER JOIN marketstockchart as msc ON msc.marketstock_id = ms.id
INNER JOIN marketstockinfo as msi ON msi.marketstock_id = ms.id
WHERE ms.symbol = 'N225.INDX' OR ms.symbol = 'DJI.INDX' OR ms.symbol = 'IXIC.INDX' OR ms.symbol = 'HSI.INDX' OR ms.symbol = 'KS11.INDX' ;
";

    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}

