<?php


$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える
header('Access-Control-Allow-Origin: *');

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);
    $result = getIpo($pdo);
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLAS);
} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function getIpo($pdo)
{

    $sql = "SELECT distinct ms.*, mt.overview, msi.calendar_start, msi.calendar_end
FROM marketstock AS ms
LEFT JOIN market_translation AS mt ON mt.marketstock_id = ms.id
INNER JOIN marketstockindex AS msi ON msi.marketstock_id = ms.id
WHERE calendar_start != '0000-00-00'
ORDER BY calendar_start DESC
";

    $result = $pdo->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}

