<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える

$row = 1;
$test = [];

error_reporting(E_ALL);
ini_set('display_errors', TRUE);

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);
    $getStock = getChart($pdo);

    foreach ($getStock as $key => $val) {
        if (($handle = fopen("../../csv/XNAS/" . $val['symbol'] . ".csv",'r')) == true) {

            // 1行ずつfgetcsv()関数を使って読み込む
            while (($data = fgetcsv($handle))) {
                foreach ($data as $value) {
                    $test[$row][] = $value;
                }
                $row++;
            }

            $data = json_encode($test);
            $getChart = getStock($pdo, $val['id']);
            if ($getChart[0] < 1) {
                setChart($pdo, $val['id'], $data);
            } else {
                setChartUpdate($pdo, $val['id'], $data);
            }
            fclose($handle);
        }
    }
} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function setChartUpdate($pdo, $id, $data)
{
    $sql = "
UPDATE marketstockchart SET 
      data = '$data',
      update_at = current_timestamp  
WHERE marketstock_id = '$id'
";
    return $pdo->query($sql);
}

function getStock($dbh, $id)
{

    $sql = "SELECT count(1) FROM marketstockchart WHERE marketstock_id = '$id'";

    $result = $dbh->query($sql);

    $aryItem = $result->fetch();
    return $aryItem;
}

function getChart($dbh)
{
    $sql = "SELECT id,symbol FROM marketstock WHERE mic = 'XNAS'";

    $result = $dbh->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}

function setChart($dbh, $id, $val)
{
    $sql = "
INSERT INTO marketstockchart (
      marketstock_id,
      data,
      update_at
    ) values (
       '$id',
       '$val',
        current_timestamp
    )";
    return $dbh->query($sql);
}