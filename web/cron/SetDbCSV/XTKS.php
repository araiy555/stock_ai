<?php

$server = "mysql153.phy.lolipop.lan";              // 実際の接続値に置き換える
$user = "LAA1326943";                           // 実際の接続値に置き換える
$pass = "q1w2e3r4";                           // 実際の接続値に置き換える
$database = "LAA1326943-stocktown";                      // 実際の接続値に置き換える

$row = 1;
$test = [];

error_reporting(E_ALL);
ini_set('display_errors', true);

try {
    /// DB接続を試みる
    $pdo = new PDO("mysql:host=" . $server . "; dbname=" . $database, $user, $pass);
    $getStock = getChart($pdo);

    foreach ($getStock as $key => $val) {
        $test = array();
        $symbol = preg_replace('/XTKS/', 'T', $val['symbol']);
        if (($handle = fopen("../../csv/XTKS/" . $symbol . ".csv", 'r')) == true) {

            // 1行ずつfgetcsv()関数を使って読み込む
            while (($data = fgetcsv($handle))) {

                foreach ($data as $value) {
                    if (!preg_match('/Date|High|Low|Open|Close|Volum|Adj Close/', $value)) {
                        $test[$row][] = $value;
                    }
                }

                $row++;
            }
            $first = array_key_first($test);

            $data = json_encode($test);
            $getChart = getStock($pdo, $val['id']);
            if ($getChart[0] < 1) {
                setChart($pdo, $val['id'], $data, $test[$first][0]);
            } else {
                setChartUpdate($pdo, $val['id'], $data, $test[$first][0]);
            }
            fclose($handle);
        }
    }
} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function setChartUpdate($pdo, $id, $data, $listing_date)
{
    $sql = "
UPDATE marketstockchart SET 
      data = '$data',
      listing_date = '$listing_date',
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
    $sql = "SELECT id,symbol FROM marketstock WHERE stock_exchange_country = 'japan'";

    $result = $dbh->query($sql);

    $aryItem = $result->fetchAll();
    return $aryItem;
}

function setChart($dbh, $id, $val, $listing_date)
{
    $sql = "
INSERT INTO marketstockchart (
      marketstock_id,
      data,
      update_at
      listing_date
    ) values (
       '$id',
       '$val',
       '$listing_date',
        current_timestamp
    )";
    return $dbh->query($sql);
}