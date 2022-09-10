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


} catch (PDOException $e) {
    $isConnect = false;
    echo "MySQL への接続に失敗しました。<br>(" . $e->getMessage() . ")";
}

function getChart($dbh)
{
    $sql = "SELECT id,symbol FROM marketstock WHERE stock_exchange_country = 'USA'";

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